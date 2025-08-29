/**
 * 02_Components: Input Component with Variants
 * 목적: 접근성을 고려한 입력 필드 컴포넌트
 */

import React from 'react';
import { cn } from '../ui/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: 'default' | 'focus' | 'error' | 'disabled';
  size?: 'medium' | 'large' | 'xl';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  helperText,
  errorText,
  state = 'default',
  size = 'large',
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: InputProps) {
  const isError = state === 'error' || !!errorText;
  const isDisabled = disabled || state === 'disabled';

  const inputId = React.useId();

  // Size styles
  const sizeStyles = {
    medium: 'h-12 px-4 text-lg',
    large: 'h-14 px-6 text-xl', 
    xl: 'h-16 px-8 text-2xl'
  };

  // Input styles
  const inputStyles = cn(
    'w-full rounded-lg border-2 transition-all duration-200',
    'bg-white text-foreground',
    'focus:outline-none focus:ring-4 focus:ring-offset-1',
    'placeholder:text-gray-500',
    sizeStyles[size],
    
    // State styles
    isError 
      ? 'border-danger focus:border-danger focus:ring-danger/20'
      : 'border-gray-300 focus:border-primary focus:ring-primary/20',
    
    isDisabled && 'bg-gray-100 cursor-not-allowed opacity-50',
    
    leftIcon && 'pl-12',
    rightIcon && 'pr-12',
    
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-lg font-semibold text-gray-900"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          className={inputStyles}
          disabled={isDisabled}
          aria-invalid={isError}
          aria-describedby={
            helperText || errorText 
              ? `${inputId}-description` 
              : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(helperText || errorText) && (
        <p 
          id={`${inputId}-description`}
          className={cn(
            'text-base',
            isError ? 'text-danger' : 'text-gray-600'
          )}
        >
          {errorText || helperText}
        </p>
      )}
    </div>
  );
}

// Component Variants for Figma
export function InputShowcase() {
  return (
    <div className="p-8 space-y-8 max-w-md">
      <h2 className="text-2xl font-bold mb-6">Input Component Variants</h2>
      
      {/* Default States */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Default States</h3>
        <Input 
          label="이름"
          placeholder="이름을 입력하세요"
          size="medium"
        />
        <Input 
          label="전화번호"
          placeholder="전화번호를 입력하세요"
          size="large"
        />
        <Input 
          label="주소"
          placeholder="주소를 입력하세요"
          size="xl"
        />
      </div>

      {/* With Helper Text */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">With Helper Text</h3>
        <Input 
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          helperText="8자 이상 입력해주세요"
          size="large"
        />
      </div>

      {/* Error State */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Error State</h3>
        <Input 
          label="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
          errorText="올바른 이메일 형식이 아닙니다"
          size="large"
          state="error"
        />
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Disabled State</h3>
        <Input 
          label="비활성화된 입력"
          placeholder="입력할 수 없습니다"
          size="large"
          disabled
        />
      </div>
    </div>
  );
}