import React from 'react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function AccessibleButton({ 
  variant = 'default', 
  size = 'lg', 
  children, 
  className,
  ariaLabel,
  ...props 
}: AccessibleButtonProps) {
  const sizeClasses = {
    sm: 'h-12 px-4 text-lg',
    md: 'h-14 px-6 text-lg',
    lg: 'h-16 px-8 text-xl',
    xl: 'h-20 px-10 text-2xl'
  };

  return (
    <Button
      variant={variant}
      className={cn(
        'touch-target font-semibold tracking-wide',
        sizeClasses[size],
        className
      )}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Button>
  );
}