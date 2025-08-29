import React, { useState } from 'react';
import { AccessibleButton } from '../AccessibleButton';
import { AccessibleCard } from '../AccessibleCard';
import { useTheme } from '../ThemeProvider';
import { useAuth } from '../auth/MockAuthProvider';
import { AppointmentManager } from '../medical/AppointmentManager';
import { MedicationTracker } from '../medical/MedicationTracker';
import { BloodSugarTracker } from '../medical/BloodSugarTracker';
import { 
  Calendar, 
  Pill, 
  FileText, 
  Settings, 
  Bell, 
  User,
  Phone,
  MapPin,
  Activity,
  LogOut
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { disease, getDiseaseLabel } = useTheme();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const upcomingAppointment = {
    date: '2025년 8월 25일',
    time: '오후 2:30',
    doctor: '김내과 원장님',
    hospital: '은평구보건소'
  };

  const todayMedication = [
    { name: '혈압약', time: '오전 8:00', taken: true },
    { name: '당뇨약', time: '오후 1:00', taken: false },
    { name: '비타민', time: '오후 7:00', taken: false }
  ];

  return (
    <div className="h-screen w-full max-w-sm mx-auto bg-background flex flex-col">
      {/* 상단 헤더 */}
      <div className="bg-primary text-primary-foreground px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">안녕하세요!</h1>
            <p className="text-lg opacity-90">홍길동님</p>
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
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-lg">{getDiseaseLabel(disease)}</p>
              <p className="text-sm opacity-80">맞춤 관리 모드</p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* 다음 예약 */}
        <AccessibleCard 
          title="다음 예약"
          className="bg-accent/30"
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-lg">{upcomingAppointment.date}</p>
                <p className="text-base text-muted-foreground">{upcomingAppointment.time}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-primary" />
              <p className="text-lg">{upcomingAppointment.doctor}</p>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-primary" />
              <p className="text-lg">{upcomingAppointment.hospital}</p>
            </div>
            <div className="flex space-x-3 mt-4">
              <AccessibleButton 
                size="md" 
                className="flex-1"
                onClick={() => onNavigate('appointment')}
              >
                예약 보기
              </AccessibleButton>
              <AccessibleButton 
                size="md" 
                variant="secondary"
                className="w-14"
              >
                <Phone className="w-5 h-5" />
              </AccessibleButton>
            </div>
          </div>
        </AccessibleCard>

        {/* 오늘의 복약 */}
        <AccessibleCard title="오늘의 복약">
          <div className="space-y-4">
            {todayMedication.map((med, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${med.taken ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <p className="font-semibold text-lg">{med.name}</p>
                    <p className="text-base text-muted-foreground">{med.time}</p>
                  </div>
                </div>
                {!med.taken && (
                  <AccessibleButton size="sm" variant="secondary">
                    복용 완료
                  </AccessibleButton>
                )}
              </div>
            ))}
            <AccessibleButton 
              size="md" 
              variant="secondary" 
              className="w-full mt-4"
              onClick={() => onNavigate('medication')}
            >
              전체 복약 관리
            </AccessibleButton>
          </div>
        </AccessibleCard>

        {/* 주요 기능 */}
        <div className="grid grid-cols-2 gap-4">
          <AccessibleCard 
            interactive
            className="text-center py-6"
            onClick={() => onNavigate('appointment')}
          >
            <Calendar className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="font-bold text-lg">병원 예약</p>
          </AccessibleCard>
          
          <AccessibleCard 
            interactive
            className="text-center py-6"
            onClick={() => onNavigate('prescription')}
          >
            <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="font-bold text-lg">처방전</p>
          </AccessibleCard>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="bg-card border-t-2 border-border p-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">홈</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1"
            onClick={() => onNavigate('medication')}
          >
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Pill className="w-6 h-6 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">복약</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1"
            onClick={() => onNavigate('prescription')}
          >
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">처방전</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1"
            onClick={() => onNavigate('settings')}
          >
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">설정</span>
          </button>
        </div>
      </div>
    </div>
  );
}