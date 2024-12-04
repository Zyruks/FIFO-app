import { cn } from '@common';

export enum NotificationVariant {
  success = 'success',
  warning = 'warning',
  error = 'error',
}

const Variant: Record<NotificationVariant, string> = {
  [NotificationVariant.success]: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  [NotificationVariant.warning]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  [NotificationVariant.error]: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
};

interface NotificationProps {
  /**
   * Additional classes for Notification.
   */
  className?: string;

  /**
   * variant of notification.
   */
  variant: NotificationVariant;

  /**
   * Message to display.
   */
  message: string | null;
}

export const Notification = ({ variant, message, className }: NotificationProps) => {
  if (!message) return null;

  const classes = cn('animate-fade-up rounded-lg px-4 py-2', Variant[variant], className);

  return <div className={classes}>{message}</div>;
};
