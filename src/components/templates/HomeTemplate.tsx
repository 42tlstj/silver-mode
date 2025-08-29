/**
 * 03_Templates: Home Template
 * 목적: 홈 화면의 레이아웃과 패턴을 정의
 */

import React from 'react';
import { Card } from '../design-system/Card';
import { Button } from '../design-system/Button';
import { TTSButton } from '../design-system/AccessibilityControls';
import { cn } from '../ui/utils';
import { 
  Calendar, 
  Pill, 
  Camera, 
  Phone, 
  Settings, 
  Bell,
  User,
  Activity
} from 'lucide-react';

interface HomeTemplateProps {
  userName: string;
  userAge: number;
  diseaseType: 'parkinson' | 'diabetes' | 'cataract' | 'dementia' | 'general';
  upcomingAppointment?: {
    date: string;
    time: string;
    doctor: string;
    hospital: string;
  };
  todayMedications?: Array<{
    name: string;
    time: string;
    taken: boolean;
  }>;
  recentActivities?: Array<{
    type: 'appointment' | 'medication' | 'measurement';
    title: string;
    time: string;
    status: 'completed' | 'pending' | 'missed';
  }>;
  onNavigate: (screen: string) => void;
}

export function HomeTemplate({
  userName,
  userAge,
  diseaseType,
  upcomingAppointment,
  todayMedications = [],
  recentActivities = [],
  onNavigate
}: HomeTemplateProps) {
  const diseaseThemes = {
    parkinson: { primary: 'green', bg: 'green-50', accent: 'green' },
    diabetes: { primary: 'red', bg: 'red-50', accent: 'red' },
    cataract: { primary: 'gray', bg: 'white', accent: 'black' },
    dementia: { primary: 'purple', bg: 'purple-50', accent: 'purple' },
    general: { primary: 'blue', bg: 'blue-50', accent: 'blue' }
  };

  const theme = diseaseThemes[diseaseType];
  const completedMeds = todayMedications.filter(med => med.taken).length;
  const totalMeds = todayMedications.length;

  return (
    <div className="h-screen w-full max-w-sm mx-auto bg-background flex flex-col">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 py-3 bg-gray-100 text-sm">
        <span>9:41</span>
        <span>📶 📶 📶 🔋</span>
      </div>

      {/* Header */}
      <div className={cn(
        'px-6 py-6 text-white',
        `bg-${theme.primary}-600`
      )}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">안녕하세요!</h1>
            <p className="text-lg opacity-90">{userName}님 (만 {userAge}세)</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </button>
            <button 
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
              onClick={() => onNavigate('settings')}
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-lg">
                {diseaseType === 'parkinson' && '파킨슨병'}
                {diseaseType === 'diabetes' && '당뇨병'}
                {diseaseType === 'cataract' && '백내장'}
                {diseaseType === 'dementia' && '치매'}
                {diseaseType === 'general' && '일반 건강'}
                {' '}관리 모드
              </p>
              <p className="text-sm opacity-80">맞춤형 서비스가 제공됩니다</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Cards */}
      <div className="px-6 py-6 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Primary Action: Hospital Appointment */}
          <Card 
            variant="interactive"
            size="large"
            title="병원 예약"
            icon={<Calendar className="w-8 h-8 text-primary" />}
            onClick={() => onNavigate('appointment')}
            priority="high"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">새 예약을 잡거나 기존 예약을 확인하세요</span>
              <TTSButton text="병원 예약 메뉴로 이동합니다" />
            </div>
          </Card>

          {/* Secondary Action: Medication */}
          <Card 
            variant="interactive"
            size="large"
            title="복약 관리"
            icon={<Pill className="w-8 h-8 text-primary" />}
            onClick={() => onNavigate('medication')}
            priority="high"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">
                오늘 {completedMeds}/{totalMeds} 복용 완료
              </span>
              <TTSButton text="복약 관리 메뉴로 이동합니다" />
            </div>
          </Card>

          {/* Tertiary Action: Prescription Upload */}
          <Card 
            variant="interactive"
            size="large"
            title="처방전 관리"
            icon={<Camera className="w-8 h-8 text-primary" />}
            onClick={() => onNavigate('prescription')}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">처방전을 촬영하고 관리하세요</span>
              <TTSButton text="처방전 관리 메뉴로 이동합니다" />
            </div>
          </Card>
        </div>
      </div>

      {/* Today's Widget */}
      <div className="px-6 space-y-4">
        <h2 className="text-xl font-bold">오늘의 상황</h2>
        
        {/* Upcoming Appointment Widget */}
        {upcomingAppointment && (
          <Card variant="elevated" size="medium">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">다음 예약</h3>
                <TTSButton text={`다음 예약은 ${upcomingAppointment.date} ${upcomingAppointment.time} ${upcomingAppointment.hospital} ${upcomingAppointment.doctor} 입니다`} />
              </div>
              <div className="space-y-2">
                <p className="text-base">
                  <strong>{upcomingAppointment.date}</strong> {upcomingAppointment.time}
                </p>
                <p className="text-base text-gray-600">
                  {upcomingAppointment.hospital} - {upcomingAppointment.doctor}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button size="medium" className="flex-1">예약 보기</Button>
                <Button size="medium" variant="secondary" className="w-14">
                  <Phone className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Today's Medications */}
        {todayMedications.length > 0 && (
          <Card variant="elevated" size="medium">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">오늘의 복약</h3>
                <TTSButton text={`오늘 ${totalMeds}개 중 ${completedMeds}개 복용 완료`} />
              </div>
              <div className="space-y-3">
                {todayMedications.slice(0, 2).map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${med.taken ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div>
                        <p className="font-medium text-base">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.time}</p>
                      </div>
                    </div>
                    {!med.taken && (
                      <Button size="small" variant="secondary">
                        복용 완료
                      </Button>
                    )}
                  </div>
                ))}
                {todayMedications.length > 2 && (
                  <Button variant="ghost" size="medium" className="w-full">
                    모든 복약 보기 ({todayMedications.length - 2}개 더)
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Emergency Contact - Always Visible */}
      <div className="px-6 py-4 mt-auto">
        <Card 
          variant="interactive"
          className="border-red-300 bg-red-50"
          onClick={() => alert('응급 상황 연락처')}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-800">응급 상황</h3>
              <p className="text-base text-red-600">119 또는 보호자에게 연락</p>
            </div>
            <TTSButton text="응급상황 연락처" variant="primary" />
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t-2 border-gray-200 p-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1">
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              `bg-${theme.primary}-600`
            )}>
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium">홈</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1"
            onClick={() => onNavigate('medication')}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Pill className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-sm text-gray-600">복약</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1"
            onClick={() => onNavigate('prescription')}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-sm text-gray-600">처방전</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1"
            onClick={() => onNavigate('settings')}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-sm text-gray-600">설정</span>
          </button>
        </div>
      </div>
    </div>
  );
}