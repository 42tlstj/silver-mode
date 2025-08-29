import React, { useState } from 'react';
import { AccessibleButton } from '../AccessibleButton';
import { AccessibleCard } from '../AccessibleCard';
import { useTheme } from '../ThemeProvider';
import { ChevronRight, Heart, Stethoscope, Eye, Brain } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const { setDisease, getDiseaseLabel } = useTheme();
  const [selectedDisease, setSelectedDisease] = useState<string>('');

  const diseases = [
    { id: 'general', label: '일반 건강관리', icon: Heart, description: '일반적인 건강 관리와 예약' },
    { id: 'parkinson', label: '파킨슨병', icon: Stethoscope, description: '떨림과 운동 장애 관리' },
    { id: 'diabetes', label: '당뇨병', icon: Heart, description: '혈당 관리와 식단 조절' },
    { id: 'cataract', label: '백내장', icon: Eye, description: '시력 관리와 안과 진료' },
    { id: 'dementia', label: '치매', icon: Brain, description: '인지 기능 관리와 돌봄' }
  ];

  const handleDiseaseSelect = (diseaseId: string) => {
    setSelectedDisease(diseaseId);
    setDisease(diseaseId as any);
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1 && selectedDisease) {
      onComplete();
    }
  };

  return (
    <div className="h-screen w-full max-w-sm mx-auto bg-background flex flex-col">
      {/* 헤더 */}
      <div className="px-6 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">실버케어</h1>
        <p className="text-xl text-muted-foreground">은평구 어르신을 위한<br />건강관리 앱</p>
      </div>

      {/* 진행 표시 */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-4 h-4 rounded-full ${step >= 0 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-4 h-4 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
        <p className="text-center text-lg mt-4 text-muted-foreground">
          {step + 1} / 2
        </p>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 px-6">
        {step === 0 && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">안녕하세요!</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              실버케어는 어르신들이<br />
              쉽고 편리하게 건강을<br />
              관리할 수 있도록<br />
              도와드립니다.
            </p>
            <div className="space-y-4 mt-8">
              <div className="flex items-center space-x-4 p-4 bg-accent rounded-xl">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-lg">병원 예약</p>
                  <p className="text-base text-muted-foreground">간편한 예약 관리</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-accent rounded-xl">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-lg">복약 관리</p>
                  <p className="text-base text-muted-foreground">약 복용 알림</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">주요 관리 질환을<br />선택해주세요</h2>
              <p className="text-lg text-muted-foreground">
                맞춤형 서비스를<br />제공해드립니다
              </p>
            </div>
            
            <div className="space-y-4">
              {diseases.map((disease) => {
                const Icon = disease.icon;
                return (
                  <AccessibleCard
                    key={disease.id}
                    interactive
                    className={`${
                      selectedDisease === disease.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                    onClick={() => handleDiseaseSelect(disease.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        selectedDisease === disease.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-accent text-accent-foreground'
                      }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-xl">{disease.label}</h3>
                        <p className="text-base text-muted-foreground mt-1">
                          {disease.description}
                        </p>
                      </div>
                      {selectedDisease === disease.id && (
                        <ChevronRight className="w-6 h-6 text-primary" />
                      )}
                    </div>
                  </AccessibleCard>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="p-6 pb-8">
        <AccessibleButton
          size="xl"
          className="w-full"
          onClick={handleNext}
          disabled={step === 1 && !selectedDisease}
        >
          {step === 0 ? '시작하기' : '완료하기'}
        </AccessibleButton>
      </div>
    </div>
  );
}