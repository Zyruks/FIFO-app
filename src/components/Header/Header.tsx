import { cn, Theme, useAuth, useTheme } from '@common';
import { Button, ButtonSize, ButtonVariant } from '@components';

interface HeaderProps {
  /**
   * Additional class name.
   */
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    const nextTheme = theme === Theme.light ? Theme.dark : Theme.light;
    setTheme(nextTheme);
  };

  const { logout, currentUser, isGuest } = useAuth();

  const classes = {
    header: cn(
      'px-4 py-2',
      'flex items-center justify-between',
      'text-neutral-950 dark:text-neutral-200',
      'border-b dark:border-neutral-900 dark:bg-neutral-950',
      'transition-colors duration-300 ease-in-out',
      className,
    ),
    container: cn('flex items-center justify-between', 'container mx-auto px-4'),
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <h1 className="text-lg font-bold">FIFO App</h1>
        {/* TODO: Add Icons */}

        <div className="flex items-center gap-4">
          <Button
            onClick={handleToggle}
            size={ButtonSize.sm}
            className="rounded bg-blue-500 px-3 py-2 text-white shadow hover:bg-blue-600 dark:bg-yellow-500 dark:hover:bg-yellow-600"
          >
            {theme === Theme.dark ? 'Light Mode' : 'Dark Mode'}
          </Button>

          {(currentUser || isGuest) && (
            <Button isInverted variant={ButtonVariant.neutral} size={ButtonSize.sm} onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
