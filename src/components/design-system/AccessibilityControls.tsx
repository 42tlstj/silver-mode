/**
 * 02_Components: Accessibility Controls
 * 목적: 접근성과 사용자 맞춤 설정을 위한 컴포넌트들
 */

import React, { useState } from 'react';
import { Button } from './Button';
import { cn } from '../ui/utils';
import { Type, Volume2, Eye, Settings, Play } from 'lucide-react';

// Font Size Slider Component
interface FontSizeSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function FontSizeSlider({ value, onChange, className }: FontSizeSliderProps) {
  const fontSizes = [
    { value: 18, label: '작게' },
    { value: 20, label: '보통' },
    { value: 22, label: '크게' },
    { value: 24, label: '더 크게' },
    { value: 28, label: '가장 크게' }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center space-x-3">
        <Type className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">글자 크기</h3>
      </div>
      
      <div className="space-y-4">
        {fontSizes.map((size) => (
          <label key={size.value} className="flex items-center space-x-4 cursor-pointer">
            <input
              type="radio"
              name="fontSize"
              value={size.value}
              checked={value === size.value}
              onChange={() => onChange(size.value)}
              className="w-6 h-6 text-primary focus:ring-primary/20"
            />
            <span style={{ fontSize: `${size.value}px` }} className="font-medium">
              {size.label} ({size.value}px)
            </span>
            <span style={{ fontSize: `${size.value}px` }}>
              이것은 샘플 텍스트입니다
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

// Motion Speed Toggle Component
interface MotionSpeedToggleProps {
  value: 'normal' | 'slow' | 'none';
  onChange: (value: 'normal' | 'slow' | 'none') => void;
  className?: string;
}

export function MotionSpeedToggle({ value, onChange, className }: MotionSpeedToggleProps) {
  const options = [
    { value: 'normal' as const, label: '일반', description: '기본 애니메이션 속도' },
    { value: 'slow' as const, label: '느림', description: '느린 애니메이션 (권장)' },
    { value: 'none' as const, label: '없음', description: '애니메이션 비활성화' }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center space-x-3">
        <Settings className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">화면 전환 속도</h3>
      </div>
      
      <div className="space-y-3">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-4 cursor-pointer p-4 rounded-lg border-2 hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="motionSpeed"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-6 h-6 text-primary focus:ring-primary/20"
            />
            <div className="flex-1">
              <div className="text-lg font-medium">{option.label}</div>
              <div className="text-base text-gray-600">{option.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// TTS (Text-to-Speech) Button Component
interface TTSButtonProps {
  text: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function TTSButton({ text, variant = 'secondary', size = 'medium', className }: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8; // 느린 속도
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const sizeStyles = {
    small: 'w-10 h-10',
    medium: 'w-12 h-12',
    large: 'w-14 h-14'
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={isPlaying}
      className={cn(
        'flex items-center justify-center rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-4 focus:ring-offset-2',
        variant === 'primary' 
          ? 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/20'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray/20',
        sizeStyles[size],
        isPlaying && 'animate-pulse',
        className
      )}
      aria-label={`텍스트 읽기: ${text.slice(0, 50)}...`}
      title="텍스트를 소리로 읽어줍니다"
    >
      {isPlaying ? (
        <Play className="w-5 h-5 animate-pulse" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
}

// High Contrast Toggle Component
interface HighContrastToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

export function HighContrastToggle({ enabled, onChange, className }: HighContrastToggleProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center space-x-3">
        <Eye className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">고대비 모드</h3>
      </div>
      
      <label className="flex items-center space-x-4 cursor-pointer p-4 rounded-lg border-2 hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          className="w-6 h-6 text-primary focus:ring-primary/20"
        />
        <div className="flex-1">
          <div className="text-lg font-medium">고대비 모드 활성화</div>
          <div className="text-base text-gray-600">
            텍스트와 배경의 대비를 강화하여 시인성을 높입니다
          </div>
        </div>
      </label>
    </div>
  );
}

// Accessibility Controls Showcase
export function AccessibilityControlsShowcase() {
  const [fontSize, setFontSize] = useState(20);
  const [motionSpeed, setMotionSpeed] = useState<'normal' | 'slow' | 'none'>('slow');
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="p-8 space-y-12 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">접근성 컨트롤 컴포넌트</h2>
      
      <FontSizeSlider 
        value={fontSize} 
        onChange={setFontSize} 
      />
      
      <MotionSpeedToggle 
        value={motionSpeed} 
        onChange={setMotionSpeed} 
      />
      
      <HighContrastToggle 
        enabled={highContrast} 
        onChange={setHighContrast} 
      />
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">TTS 버튼 예시</h3>
        <div className="flex items-center space-x-4">
          <TTSButton 
            text="이것은 텍스트를 음성으로 읽어주는 기능입니다. 고령층 사용자를 위해 천천히 읽어드립니다."
            size="small"
          />
          <TTSButton 
            text="이것은 텍스트를 음성으로 읽어주는 기능입니다."
            size="medium"
          />
          <TTSButton 
            text="이것은 텍스트를 음성으로 읽어주는 기능입니다."
            size="large"
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
}