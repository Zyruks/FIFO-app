import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@common';

export enum ButtonSize {
  xs = 'xs',
  sm = 'sm',
  base = 'base',
  lg = 'lg',
}

export enum HtmlType {
  button = 'button',
  reset = 'reset',
  submit = 'submit',
}

export enum ButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
  destructive = 'destructive',
  neutral = 'neutral',
}

const Sizes: Record<ButtonSize, string> = {
  [ButtonSize.xs]: 'py-1 px-2 text-xs font-semibold h-6',
  [ButtonSize.sm]: 'py-1.5 px-3 text-sm font-semibold h-8',
  [ButtonSize.base]: 'py-2 px-4 text-sm font-semibold h-10',
  [ButtonSize.lg]: 'py-3 px-5 text-base font-semibold h-12',
};

const Variants: Record<ButtonVariant, string> = {
  [ButtonVariant.primary]: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-800 text-neutral-50',
  [ButtonVariant.secondary]: 'bg-lime-500 hover:bg-lime-600 text-neutral-50',
  [ButtonVariant.destructive]: 'bg-rose-600 hover:bg-rose-700 text-white',
  [ButtonVariant.neutral]:
    'bg-neutral-900 hover:bg-neutral-700 text-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-800',
};

const InvertVariants: Record<ButtonVariant, string> = {
  [ButtonVariant.primary]:
    'bg-blue-50 text-blue-600 hover:bg-blue-200 border-blue-900  dark:bg-transparent dark:hover:bg-blue-400 dark:text-blue-100 border-blue-500 dark:hover:text-blue-900',
  [ButtonVariant.secondary]:
    'bg-lime-50 text-lime-600 hover:bg-lime-200 border-lime-900  dark:bg-transparent dark:hover:bg-lime-400 dark:text-lime-100 border-lime-500 dark:hover:text-lime-900',
  [ButtonVariant.neutral]:
    'bg-neutral-50 text-neutral-600 hover:bg-neutral-200 border-neutral-900  dark:bg-transparent dark:hover:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700/80 ',
  [ButtonVariant.destructive]:
    'bg-rose-50 text-rose-600 hover:bg-rose-200 border-rose-900  dark:bg-transparent dark:hover:bg-rose-400 dark:text-rose-100 border-rose-500 dark:hover:text-rose-900',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Changes the size of the button, giving it more or less
   * padding.
   */
  size?: ButtonSize;

  /**
   * The shape of the component. It determines the
   * importance in the hierarchy, for example, the contained
   * button commands the most attention.
   */
  variant?: ButtonVariant;

  /**
   * Disables the button, disallowing user interaction.
   */
  isDisabled?: boolean;

  /**
   * Inverts the button colors.
   */
  isInverted?: boolean;

  /**
   * Whether the button should be a square or not.
   */
  isSquare?: boolean;

  /**
   * Extends the button to 100% width.
   */
  isFullWidth?: boolean;

  /**
   * HTML type attribute of the button.
   */
  htmlType?: HtmlType;
}

export const Button = ({
  size = ButtonSize.base,
  children,
  isDisabled = false,
  isSquare = false,
  isFullWidth = false,
  variant = ButtonVariant.primary,
  htmlType = HtmlType.button,
  isInverted = false,
  className,
  onClick,
  ...restOfProps
}: ButtonProps) => {
  const classes = {
    button: cn(
      'relative',
      'flex items-center justify-center overflow-hidden',
      'whitespace-nowrap text-center',
      'border border-transparent',
      Sizes[size],
      isInverted ? InvertVariants[variant] : Variants[variant],
      {
        'rounded-lg': !isSquare,
        'w-full': isFullWidth,
      },
      'transition-colors duration-300 ease-in-out',

      // disabled styles
      'disabled:cursor-not-allowed disabled:bg-neutral-300',
      'dark:disabled:bg-neutral-500 dark:disabled:text-neutral-300',
      className,
    ),
  };

  return (
    <button className={classes.button} type={htmlType} disabled={isDisabled} onClick={onClick} {...restOfProps}>
      {children}
    </button>
  );
};
