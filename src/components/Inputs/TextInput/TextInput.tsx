import React, { ChangeEvent, FocusEvent, InputHTMLAttributes, useState } from 'react';
import { cn, FormFieldState, Input } from '@common';

interface TextInputProps extends Input, Omit<InputHTMLAttributes<HTMLInputElement>, 'required'> {
  /**
   * Specify an optional className to be added to the
   * InputContainer.
   */
  inputContainerClassName?: string;
}

/**
 * A Text Input enable the user to interact with and input
 * short content and data.
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      isDisabled = false,
      isFullWidth = false,
      isReadOnly = false,
      isRounded = false,
      isLoading = false,
      isRequired = false,
      fieldState = FormFieldState.default,
      label,
      assistiveText,
      autoComplete = 'off',
      className,
      inputContainerClassName,
      dataTestId,
      value = '',
      name,
      onChange,
      onBlur,
      onFocus,
      ...restOfProps
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const classes = {
      container: cn({ 'w-full': isFullWidth }, className),
      inputContainer: cn(
        'relative flex items-center overflow-hidden',
        'group',
        'border',
        'h-10',
        'text-neutral-950 dark:text-neutral-50',
        'bg-neutral-50 dark:bg-neutral-950',
        'transition-colors duration-300',
        {
          'bg-neutral-300 text-neutral-700 opacity-80': isLoading,
          'rounded p-2': !isRounded,
          'rounded-full px-4 py-2': isRounded,
          'w-full': isFullWidth,
          ['border-transparent bg-neutral-500 dark:bg-neutral-900']: isDisabled,
          'border-neutral-300 dark:border-neutral-700': fieldState === FormFieldState.default,
          'border-rose-600 dark:border-rose-600': fieldState === FormFieldState.error && !isDisabled,
          'border-green-500 dark:border-green-500': fieldState === FormFieldState.success && !isDisabled,
          'border-primary-300 dark:border-primary-800': fieldState === FormFieldState.default && isFocused,
        },
        inputContainerClassName,
      ),
      input: cn(
        'w-full',
        'bg-transparent outline-none',
        'placeholder:text-neutral-500',
        'dark:placeholder:text-neutral-400',
        'text-base',
        'disabled:cursor-not-allowed disabled:placeholder:text-neutral-600',
      ),
      assistiveText: cn('mt-2 text-xs font-medium', {
        'text-neutral-600 dark:text-neutral-200': fieldState === FormFieldState.default,
        'text-rose-500 dark:text-rose-400': fieldState === FormFieldState.error,
        'text-green-600 dark:text-green-400': fieldState === FormFieldState.success,
      }),
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
      if (onChange) onChange(event);
    };

    const handleInputBlur = (event: FocusEvent<HTMLInputElement>): void => {
      setIsFocused(false);
      if (onBlur) onBlur(event);
    };

    const handleInputFocus = (event: FocusEvent<HTMLInputElement>): void => {
      setIsFocused(true);
      if (onFocus) onFocus(event);
    };

    return (
      <div className={classes.container}>
        {label && (
          <label
            className="mb-2 block text-sm font-semibold leading-4 text-neutral-950 dark:text-neutral-300"
            htmlFor={id}
          >
            {label}
            {isRequired && <span className="ml-1 text-rose-500 dark:text-rose-400">*</span>}
          </label>
        )}
        <div className={classes.inputContainer}>
          <input
            id={id}
            data-testid={dataTestId}
            ref={ref}
            name={name}
            className={classes.input}
            disabled={isDisabled}
            value={value}
            readOnly={isReadOnly}
            required={isRequired}
            autoComplete={autoComplete}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            {...restOfProps}
          />
        </div>
        {assistiveText && <span className={classes.assistiveText}>{assistiveText}</span>}
      </div>
    );
  },
);
