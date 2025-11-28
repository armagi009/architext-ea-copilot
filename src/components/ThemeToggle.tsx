import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
interface ThemeToggleProps {
  className?: string;
}
export function ThemeToggle({ className = "absolute top-4 right-4" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className={className}
    >
      {isDark ? '☀️' : '🌙'}
    </Button>
  );
}