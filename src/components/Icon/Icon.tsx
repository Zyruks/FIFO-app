import { IconCatalog, Icons } from './iconCatalog';
import { cn } from '@common';

export enum IconStyle {
  thin = 'thin',
  light = 'light',
  regular = 'regular',
  bold = 'bold',
  solid = 'solid',
}

const IconStyles: Record<IconStyle, number> = {
  [IconStyle.thin]: 1,
  [IconStyle.light]: 1.2,
  [IconStyle.regular]: 1.5,
  [IconStyle.bold]: 1.8,
  [IconStyle.solid]: 0,
};

export interface IconProps {
  /**
   * Specify an optional className to be added to the
   * component.
   */
  className?: string;

  /**
   * The icon to display.
   */
  icon: IconCatalog;

  /**
   * The style of the icon.
   */
  iconStyle?: IconStyle;

  /**
   * The callback function to be called when the icon is
   * clicked.
   */
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

/**
 * The Icons catalog.
 */
export const Icon = ({ icon, iconStyle = IconStyle.light, className, onClick }: IconProps) => {
  const iconPaths = Icons[icon];
  const iconPath = iconStyle === IconStyle.solid ? iconPaths.solid : iconPaths.outline;
  const strokeWidth = IconStyles[iconStyle];

  const classes = cn(
    {
      'fill-current stroke-none': iconStyle === IconStyle.solid,
      'fill-none stroke-current': iconStyle !== IconStyle.solid,
    },
    className,
  );

  if (iconStyle === IconStyle.solid && iconPath === undefined)
    console.error(`Solid icon path is undefined for icon "${icon}".`);

  return (
    <svg
      data-testid="Icon"
      className={classes}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={strokeWidth}
      focusable="false"
      aria-hidden="true"
      onClick={onClick}
    >
      <path fillRule="evenodd" clipRule="evenodd" strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
    </svg>
  );
};
