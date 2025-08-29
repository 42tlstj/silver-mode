/**
 * 05_Prototype: Interactive Prototype Flow
 * 목적: 핵심 사용자 플로우의 인터랙티브 프로토타입
 */

import React, { useState } from 'react';
import { Button } from '../design-system/Button';
import { Card } from '../design-system/Card';
import { cn } from '../ui/utils';
import { ArrowLeft, ArrowRight, RotateCcw, Play } from 'lucide-react';

interface PrototypeFlowProps {
  flowType: 'onboarding' | 'appointment' | 'medication';
  animationSpeed?: 'normal' | 'slow' | 'none';
}

export function PrototypeFlow({ flowType, animationSpeed = 'slow' }: PrototypeFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const animationDuration = {
    none: 0,
    normal: 300,
    slow: 600
  };

  const flows = {
    onboarding: [
      { id: 1, title: '환영합니다', description: '실버케어 앱에 오신 것을 환영합니다' },
      { id: 2, title: '질환 선택', description: '주요 관리 질환을 선택해주세요' },
      { id: 3, title: '설정 완료', description: '맞춤형 서비스가 준비되었습니다' }
    ],
    appointment: [
      { id: 1, title: '병원 검색', description: '예약할 병원을 검색합니다' },
      { id: 2, title: '병원 선택', description: '원하는 병원을 선택합니다' },
      { id: 3, title: '날짜 선택', description: '예약 날짜를 선택합니다' },
      { id: 4, title: '시간 선택', description: '예약 시간을 선택합니다' },
      { id: 5, title: '예약 완료', description: '예약이 성공적으로 완료되었습니다' }
    ],
    medication: [
      { id: 1, title: '복약 목록', description: '오늘의 복약 목록을 확인합니다' },
      { id: 2, title: '알림 설정', description: '복약 알림을 설정합니다' },
      { id: 3, title: '복용 확인', description: '약 복용을 완료 처리합니다' }
    ]
  };

  const currentFlow = flows[flowType];
  const totalSteps = currentFlow.length;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
  };

  const autoPlay = () => {
    setIsPlaying(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < totalSteps) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, animationDuration[animationSpeed] + 1000);
  };

  return (
    <div className="p-8 space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">
          {flowType === 'onboarding' && '온보딩 플로우'}
          {flowType === 'appointment' && '예약 플로우'}
          {flowType === 'medication' && '복약 관리 플로우'}
        </h2>
        <p className="text-lg text-gray-600">
          사용자 경험을 위한 인터랙티브 프로토타입
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>진행률</span>
          <span>{currentStep + 1} / {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step Display */}
      <Card 
        variant="elevated" 
        size="large"
        className="text-center space-y-6"
      >
        <div className="space-y-4">
          <div className={cn(
            'w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold transition-all',
            `duration-${animationDuration[animationSpeed]}`
          )}>
            {currentFlow[currentStep].id}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">
              {currentFlow[currentStep].title}
            </h3>
            <p className="text-lg text-gray-600">
              {currentFlow[currentStep].description}
            </p>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-3">
          {currentFlow.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all',
                index === currentStep 
                  ? 'bg-primary scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              )}
            />
          ))}
        </div>
      </Card>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="secondary"
          size="medium"
          onClick={prevStep}
          disabled={currentStep === 0 || isPlaying}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          이전
        </Button>

        <Button
          variant="primary"
          size="medium"
          onClick={autoPlay}
          disabled={isPlaying || currentStep === totalSteps - 1}
        >
          <Play className="w-5 h-5 mr-2" />
          자동 재생
        </Button>

        <Button
          variant="secondary"
          size="medium"
          onClick={nextStep}
          disabled={currentStep === totalSteps - 1 || isPlaying}
        >
          다음
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <Button
          variant="ghost"
          size="medium"
          onClick={reset}
          disabled={isPlaying}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          처음부터
        </Button>
      </div>

      {/* Animation Speed Control */}
      <Card variant="outlined" size="medium">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">애니메이션 속도 (실버모드 최적화)</h4>
          <div className="flex space-x-4">
            {(['none', 'normal', 'slow'] as const).map((speed) => (
              <label key={speed} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="animationSpeed"
                  value={speed}
                  checked={animationSpeed === speed}
                  onChange={() => {}}
                  className="w-4 h-4"
                />
                <span className="text-base">
                  {speed === 'none' && '없음'}
                  {speed === 'normal' && '일반 (300ms)'}
                  {speed === 'slow' && '느림 (600ms) 권장'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </Card>

      {/* SEQ Debug Questions */}
      <Card variant="outlined" size="medium" className="bg-yellow-50 border-yellow-200">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-yellow-800">🐛 디버깅용 SEQ 질문</h4>
          <div className="space-y-2 text-sm text-yellow-700">
            <p><strong>Q1:</strong> 현재 단계가 사용자에게 명확하게 전달되고 있나요?</p>
            <p><strong>Q2:</strong> 다음 액션이 무엇인지 직관적으로 알 수 있나요?</p>
            <p><strong>Q3:</strong> 고령자가 실수 없이 진행할 수 있는 구조인가요?</p>
            <p><strong>Q4:</strong> 뒤로 가기나 취소가 필요한 경우 쉽게 할 수 있나요?</p>
          </div>
        </div>
      </Card>
    </div>
  );
}