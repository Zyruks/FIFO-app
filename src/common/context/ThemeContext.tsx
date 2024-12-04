import { createContext, ReactNode, useCallback, useContext, useEffect } from 'react';
import { Theme } from '../constants';
import { useLocalStorage } from '@common';

type ThemeContextType = {
  /**
   * The current theme.
   */
  theme: Theme;

  /**
   * Sets the current theme.
   */
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', Theme.system);

  const applyTheme = useCallback((currentTheme: Theme) => {
    const root = document.documentElement;
    const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const effectiveTheme = currentTheme === Theme.system ? (isSystemDark ? Theme.dark : Theme.light) : currentTheme;

    root.classList.remove(Theme.dark, Theme.light);
    root.classList.add(effectiveTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
