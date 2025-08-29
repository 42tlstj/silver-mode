/**
 * 02_Components: Button Component with Variants
 * 목적: 접근성을 고려한 버튼 컴포넌트 시스템
 */

import React from 'react';
import { cn } from '../ui/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'medium' | 'large' | 'xl' | 'parkinson';
  state?: 'default' | 'hover' | 'pressed' | 'disabled';
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'large', 
  state = 'default',
  children, 
  className,
  ariaLabel,
  leftIcon,
  rightIcon,
  disabled,
  ...props 
}: ButtonProps) {
  const isDisabled = disabled || state === 'disabled';

  // Base styles - 접근성 기준 적용
  const baseStyles = cn(
    'inline-flex items-center justify-center gap-3',
    'font-semibold transition-all duration-300',
    'focus:outline-none focus:ring-4 focus:ring-offset-2',
    'active:scale-95',
    isDisabled && 'cursor-not-allowed opacity-50'
  );

  // Variant styles
  const variantStyles = {
    primary: cn(
      'bg-primary text-white',
      'hover:bg-primary/90 focus:ring-primary/50',
      'active:bg-primary/80'
    ),
    secondary: cn(
      'bg-secondary-100 text-secondary-900 border-2 border-secondary-200',
      'hover:bg-secondary-200 focus:ring-secondary/50',
      'active:bg-secondary-300'
    ),
    ghost: cn(
      'bg-transparent text-primary border-2 border-primary',
      'hover:bg-primary/5 focus:ring-primary/50',
      'active:bg-primary/10'
    ),
    danger: cn(
      'bg-danger text-white',
      'hover:bg-danger/90 focus:ring-danger/50',
      'active:bg-danger/80'
    )
  };

  // Size styles - 터치 타겟 최소 48px
  const sizeStyles = {
    medium: cn(
      'h-12 px-6 text-lg',
      'min-w-[120px]'
    ),
    large: cn(
      'h-14 px-8 text-xl',
      'min-w-[140px]'
    ),
    xl: cn(
      'h-16 px-10 text-2xl',
      'min-w-[160px]'
    ),
    parkinson: cn(
      'h-20 px-12 text-2xl',
      'min-w-[180px]'
    )
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      aria-label={ariaLabel}
      disabled={isDisabled}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span className="flex-1 text-center">{children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}

// Component Variants for Figma
export function ButtonShowcase() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Button Component Variants</h2>
      
      {/* Primary Buttons */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Primary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="medium">Medium</Button>
          <Button variant="primary" size="large">Large</Button>
          <Button variant="primary" size="xl">Extra Large</Button>
          <Button variant="primary" size="parkinson">Parkinson</Button>
        </div>
      </div>

      {/* Secondary Buttons */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Secondary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary" size="medium">Medium</Button>
          <Button variant="secondary" size="large">Large</Button>
          <Button variant="secondary" size="xl">Extra Large</Button>
          <Button variant="secondary" size="parkinson">Parkinson</Button>
        </div>
      </div>

      {/* Ghost Buttons */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Ghost Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="ghost" size="medium">Medium</Button>
          <Button variant="ghost" size="large">Large</Button>
          <Button variant="ghost" size="xl">Extra Large</Button>
          <Button variant="ghost" size="parkinson">Parkinson</Button>
        </div>
      </div>

      {/* Disabled States */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Disabled States</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="large" disabled>Primary Disabled</Button>
          <Button variant="secondary" size="large" disabled>Secondary Disabled</Button>
          <Button variant="ghost" size="large" disabled>Ghost Disabled</Button>
          <Button variant="danger" size="large" disabled>Danger Disabled</Button>
        </div>
      </div>
    </div>
  );
}