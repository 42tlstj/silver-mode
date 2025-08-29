/**
 * 02_Components: Card Component with Variants
 * 목적: 정보 표시와 상호작용을 위한 카드 컴포넌트
 */

import React from 'react';
import { cn } from '../ui/utils';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  size?: 'small' | 'medium' | 'large' | 'xl';
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export function Card({
  variant = 'default',
  size = 'medium',
  title,
  subtitle,
  children,
  onClick,
  className,
  icon,
  actionButton,
  priority = 'medium'
}: CardProps) {
  const isInteractive = variant === 'interactive' || !!onClick;

  // Base styles
  const baseStyles = cn(
    'rounded-xl transition-all duration-300',
    'focus:outline-none focus:ring-4 focus:ring-offset-2',
    isInteractive && 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
  );

  // Variant styles
  const variantStyles = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg border border-gray-100',
    outlined: 'bg-transparent border-2 border-gray-300',
    interactive: 'bg-white border-2 border-primary/20 hover:border-primary/40 hover:shadow-md focus:ring-primary/20'
  };

  // Size styles
  const sizeStyles = {
    small: 'p-4 space-y-3',
    medium: 'p-6 space-y-4',
    large: 'p-8 space-y-6',
    xl: 'p-10 space-y-8'
  };

  // Priority styles for visual hierarchy
  const priorityStyles = {
    low: '',
    medium: '',
    high: 'ring-2 ring-orange-200 bg-orange-50',
    urgent: 'ring-2 ring-red-200 bg-red-50'
  };

  const cardContent = (
    <div className={cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      priorityStyles[priority],
      className
    )}>
      {/* Header */}
      {(title || subtitle || icon) && (
        <div className="flex items-start space-x-4">
          {icon && (
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-xl font-bold text-gray-900 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actionButton && (
            <div className="flex-shrink-0">
              {actionButton}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {children && (
        <div className="text-lg text-gray-700">
          {children}
        </div>
      )}
    </div>
  );

  if (isInteractive) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left focus:outline-none"
        tabIndex={0}
      >
        {cardContent}
      </button>
    );
  }

  return cardContent;
}

// Component Variants for Figma
export function CardShowcase() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Card Component Variants</h2>
      
      {/* Basic Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Basic Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="default" size="medium" title="기본 카드">
            이것은 기본 카드입니다.
          </Card>
          <Card variant="elevated" size="medium" title="그림자 카드">
            이것은 그림자가 있는 카드입니다.
          </Card>
          <Card variant="outlined" size="medium" title="테두리 카드">
            이것은 테두리만 있는 카드입니다.
          </Card>
          <Card variant="interactive" size="medium" title="상호작용 카드">
            클릭할 수 있는 카드입니다.
          </Card>
        </div>
      </div>

      {/* Information Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Information Cards</h3>
        <div className="space-y-4">
          <Card 
            variant="elevated" 
            size="large" 
            title="다음 예약"
            subtitle="2025년 8월 25일 오후 2:30"
            icon={<span className="text-2xl">📅</span>}
            actionButton={<button className="text-primary font-semibold">변경</button>}
          >
            <div className="space-y-2">
              <p><strong>병원:</strong> 은평구보건소</p>
              <p><strong>의사:</strong> 김내과 원장님</p>
              <p><strong>진료과:</strong> 내과</p>
            </div>
          </Card>

          <Card 
            variant="elevated" 
            size="large" 
            title="오늘의 복약"
            subtitle="3개 중 1개 복용 완료"
            icon={<span className="text-2xl">💊</span>}
            priority="high"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span>혈압약 (오전 8시)</span>
                <span className="text-green-600 font-semibold">✓ 완료</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>당뇨약 (오후 1시)</span>
                <span className="text-orange-600 font-semibold">대기</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Interactive Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Interactive Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            variant="interactive" 
            size="large" 
            title="병원 예약"
            icon={<span className="text-2xl">🏥</span>}
            onClick={() => alert('병원 예약 클릭')}
          >
            새로운 예약을 잡아보세요
          </Card>
          <Card 
            variant="interactive" 
            size="large" 
            title="복약 관리"
            icon={<span className="text-2xl">💊</span>}
            onClick={() => alert('복약 관리 클릭')}
          >
            약 복용을 관리하세요
          </Card>
          <Card 
            variant="interactive" 
            size="large" 
            title="처방전 업로드"
            icon={<span className="text-2xl">📄</span>}
            onClick={() => alert('처방전 업로드 클릭')}
          >
            처방전을 촬영해보세요
          </Card>
          <Card 
            variant="interactive" 
            size="large" 
            title="응급 연락"
            icon={<span className="text-2xl">🚨</span>}
            priority="urgent"
            onClick={() => alert('응급 연락 클릭')}
          >
            응급상황 시 연락하세요
          </Card>
        </div>
      </div>
    </div>
  );
}