import { ReactNode } from 'react';
import { cn } from '@common';
import { Header } from '@components';

interface BaseLayoutProps {
  /**
   * Additional classes for the layout.
   */
  className?: string;

  /**
   * The content of the layout.
   */
  children: ReactNode;
}

export const BaseLayout = ({ className, children }: BaseLayoutProps) => {
  const classes = cn('grid min-h-dvh grid-rows-[auto,1fr]', className);

  return (
    <div className={classes}>
      <Header />

      {/* Main Content */}
      {children}
    </div>
  );
};
