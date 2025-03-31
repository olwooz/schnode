'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

export function ThemeToggle() {
  const themeContext = useTheme();

  if (!themeContext) {
    return null;
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={toggleTheme}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className='rounded-full'
    >
      {theme === 'light' ? (
        <Moon className='h-4 w-4' />
      ) : (
        <Sun className='h-4 w-4' />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
