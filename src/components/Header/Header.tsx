import { cn, Theme, useAuth, useTheme } from '@common';
import { Button, ButtonSize, ButtonVariant, Icon, IconCatalog, IconStyle } from '@components';

interface HeaderProps {
  /**
   * Additional class name.
   */
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
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

  const handleToggle = () => {
    const nextTheme = theme === Theme.light ? Theme.dark : Theme.light;
    setTheme(nextTheme);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <h1 className="text-lg font-bold">FIFO App</h1>

        <div className="flex animate-fade items-center gap-4">
          <button onClick={handleToggle}>
            <Icon icon={theme === Theme.dark ? IconCatalog.sun : IconCatalog.moon} className="size-5" />
          </button>

          {(currentUser || isGuest) && (
            <Button isInverted variant={ButtonVariant.neutral} size={ButtonSize.sm} onClick={handleLogout}>
              <div className="flex items-center gap-2">
                <span>Logout</span>
                <Icon icon={IconCatalog.logout} className="size-4" iconStyle={IconStyle.bold} />
              </div>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
