import React, { useState } from 'react';
import { AccessibleButton } from '../AccessibleButton';
import { AccessibleCard } from '../AccessibleCard';
import { useTheme } from '../ThemeProvider';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Palette, 
  Type, 
  Shield, 
  HelpCircle, 
  Phone,
  ChevronRight,
  Volume2,
  Vibrate
} from 'lucide-react';
import { Switch } from '../ui/switch';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const { disease, setDisease, getDiseaseLabel } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: true,
    largeText: false,
    highContrast: false
  });

  const diseases = [
    { id: 'general', label: '일반 건강관리', color: '#2563eb' },
    { id: 'parkinson', label: '파킨슨병', color: '#16a34a' },
    { id: 'diabetes', label: '당뇨병', color: '#dc2626' },
    { id: 'cataract', label: '백내장', color: '#0f172a' },
    { id: 'dementia', label: '치매', color: '#7c3aed' }
  ];

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-screen w-full max-w-sm mx-auto bg-background flex flex-col">
      {/* 헤더 */}
      <div className="bg-primary text-primary-foreground px-6 py-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onNavigate('home')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">설정</h1>
        </div>
      </div>

      {/* 프로필 */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">홍길동님</h2>
            <p className="text-lg text-muted-foreground">만 72세</p>
            <p className="text-base text-muted-foreground">{getDiseaseLabel(disease)} 관리 중</p>
          </div>
          <ChevronRight className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>

      {/* 설정 목록 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 질환 테마 설정 */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Palette className="w-6 h-6 text-primary mr-3" />
            질환별 테마
          </h3>
          <AccessibleCard>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                현재 설정: <span className="font-semibold text-foreground">{getDiseaseLabel(disease)}</span>
              </p>
              <div className="space-y-3">
                {diseases.map((diseaseOption) => (
                  <AccessibleButton
                    key={diseaseOption.id}
                    variant={disease === diseaseOption.id ? 'default' : 'secondary'}
                    size="md"
                    className="w-full justify-start"
                    onClick={() => setDisease(diseaseOption.id as any)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: diseaseOption.color }}
                    />
                    {diseaseOption.label}
                  </AccessibleButton>
                ))}
              </div>
            </div>
          </AccessibleCard>
        </div>

        {/* 알림 설정 */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Bell className="w-6 h-6 text-primary mr-3" />
            알림 설정
          </h3>
          <AccessibleCard>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-lg">푸시 알림</p>
                    <p className="text-base text-muted-foreground">복약 및 예약 알림</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSetting('notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-lg">소리 알림</p>
                    <p className="text-base text-muted-foreground">알림음 재생</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.sound}
                  onCheckedChange={(checked) => updateSetting('sound', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Vibrate className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-lg">진동 알림</p>
                    <p className="text-base text-muted-foreground">진동으로 알림</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.vibration}
                  onCheckedChange={(checked) => updateSetting('vibration', checked)}
                />
              </div>
            </div>
          </AccessibleCard>
        </div>

        {/* 접근성 설정 */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Type className="w-6 h-6 text-primary mr-3" />
            접근성 설정
          </h3>
          <AccessibleCard>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Type className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-lg">큰 글씨</p>
                    <p className="text-base text-muted-foreground">글자 크기 확대</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.largeText}
                  onCheckedChange={(checked) => updateSetting('largeText', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Palette className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-lg">고대비 모드</p>
                    <p className="text-base text-muted-foreground">색상 대비 강화</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
              </div>
            </div>
          </AccessibleCard>
        </div>

        {/* 기타 설정 */}
        <div>
          <h3 className="text-xl font-bold mb-4">기타</h3>
          <div className="space-y-3">
            <AccessibleCard interactive>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary" />
                  <p className="font-semibold text-lg">개인정보 보호</p>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground" />
              </div>
            </AccessibleCard>
            
            <AccessibleCard interactive>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-6 h-6 text-primary" />
                  <p className="font-semibold text-lg">도움말</p>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground" />
              </div>
            </AccessibleCard>
            
            <AccessibleCard interactive>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-lg">고객센터</p>
                    <p className="text-base text-muted-foreground">02-1234-5678</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground" />
              </div>
            </AccessibleCard>
          </div>
        </div>

        {/* 앱 정보 */}
        <div className="text-center text-muted-foreground space-y-2 pt-6 border-t border-border">
          <p className="text-lg font-semibold">실버케어</p>
          <p className="text-base">버전 1.0.0</p>
          <p className="text-sm">© 2025 은평구청</p>
        </div>
      </div>
    </div>
  );
}