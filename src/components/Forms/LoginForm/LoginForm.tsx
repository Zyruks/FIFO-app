import { FormEvent, useState } from 'react';
import { auth } from '@api';
import { cn, ErrorMessages, FormFieldState, RegexPatterns, useAuth, validatePattern } from '@common';
import { Button, ButtonVariant, TextInput } from '@components';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface LoginFormProps {
  /**
   * Additional classes for LoginForm.
   */
  className?: string;
}

export const LoginForm = ({ className }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { loginAsGuest } = useAuth();
  const [emailFieldState, setEmailFieldState] = useState<FormFieldState>(FormFieldState.default);
  const [passwordFieldState, setPasswordFieldState] = useState<FormFieldState>(FormFieldState.default);

  const classes = {
    container: cn(
      'mx-auto bg-neutral-50 dark:bg-neutral-950',
      'border border-neutral-300 dark:border-neutral-700',
      'shadow-lg dark:shadow-neutral-800/30',
      'w-full max-w-lg rounded-lg',
      'space-y-6 p-12',
      'animate-fade-up animate-duration-300',
      className,
    ),
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    let isValid = true;

    // Validate Email
    if (!validatePattern(email, RegexPatterns.email)) {
      setEmailFieldState(FormFieldState.error);
      isValid = false;
    } else {
      setEmailFieldState(FormFieldState.success);
    }

    // Validate Password
    if (!validatePattern(password, RegexPatterns.password)) {
      setPasswordFieldState(FormFieldState.error);
      isValid = false;
    } else {
      setPasswordFieldState(FormFieldState.success);
    }

    if (!isValid) return;

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error('Login failed:', error);
        setFormError(ErrorMessages[error.code] || ErrorMessages.DEFAULT_LOGIN_ERROR);
      } else {
        setFormError(ErrorMessages.UNEXPECTED_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === 'email') {
      setEmail(value);
      setEmailFieldState(FormFieldState.default);
    } else if (id === 'password') {
      setPassword(value);
      setPasswordFieldState(FormFieldState.default);
    }
  };

  const handleEmailBlur = () => {
    if (email === '') {
      setEmailFieldState(FormFieldState.error);
    } else if (!validatePattern(email, RegexPatterns.email)) {
      setEmailFieldState(FormFieldState.error);
    } else {
      setEmailFieldState(FormFieldState.success);
    }
  };

  const handlePasswordBlur = () => {
    if (password === '') {
      setPasswordFieldState(FormFieldState.error);
    } else if (!validatePattern(password, RegexPatterns.password)) {
      setPasswordFieldState(FormFieldState.error);
    } else {
      setPasswordFieldState(FormFieldState.success);
    }
  };

  const getEmailAssistiveText = () => {
    if (emailFieldState === FormFieldState.error) {
      if (email === '') return 'Email is required.';
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const getPasswordAssistiveText = () => {
    if (passwordFieldState === FormFieldState.error) {
      if (password === '') return 'Password is required.';
      return 'Password must be at least 6 characters long and include at least one number and one symbol.';
    }
    return '';
  };

  const isSubmitDisabled =
    !email ||
    !password ||
    emailFieldState === FormFieldState.error ||
    passwordFieldState === FormFieldState.error ||
    isLoading;

  return (
    <form onSubmit={handleSubmit} className={classes.container}>
      <h3 className="text-center text-2xl font-bold dark:text-neutral-50">Welcome</h3>

      <TextInput
        label="Email"
        id="email"
        type="email"
        value={email}
        onChange={handleInputChange}
        onBlur={handleEmailBlur}
        assistiveText={getEmailAssistiveText()}
        fieldState={emailFieldState}
      />

      <TextInput
        label="Password"
        id="password"
        type="password"
        value={password}
        onChange={handleInputChange}
        onBlur={handlePasswordBlur}
        assistiveText={getPasswordAssistiveText()}
        fieldState={passwordFieldState}
      />

      <Button isFullWidth type="submit" isDisabled={isSubmitDisabled}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>

      {formError && <p className="animate-shake text-center text-sm text-red-500 animate-duration-200">{formError}</p>}

      <hr className="dark:border-neutral-600" />

      <Button isInverted isFullWidth type="button" variant={ButtonVariant.secondary} onClick={handleGuestLogin}>
        Login as Guest
      </Button>
    </form>
  );
};
