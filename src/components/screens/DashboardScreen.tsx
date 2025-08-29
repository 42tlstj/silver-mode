import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../ThemeProvider';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AppointmentManager } from '../medical/AppointmentManager';
import { MedicationTracker } from '../medical/MedicationTracker';
import { BloodSugarTracker } from '../medical/BloodSugarTracker';
import { 
  Calendar, 
  Pill, 
  Activity, 
  Settings, 
  User,
  LogOut,
  Home
} from 'lucide-react';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const { user, signOut } = useAuth();
  const { disease, getDiseaseLabel } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '개요', icon: Home },
    { id: 'appointments', label: '예약 관리', icon: Calendar },
    { id: 'medications', label: '복약 관리', icon: Pill },
    ...(disease === 'diabetes' ? [{ id: 'bloodsugar', label: '혈당 관리', icon: Activity }] : [])
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appointments':
        return <AppointmentManager />;
      case 'medications':
        return <MedicationTracker />;
      case 'bloodsugar':
        return <BloodSugarTracker />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('appointments')}>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">병원 예약</CardTitle>
            <Calendar className="h-6 w-6 text-blue-600 ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3개</div>
            <p className="text-xs text-muted-foreground">예약된 진료</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('medications')}>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">복약 관리</CardTitle>
            <Pill className="h-6 w-6 text-green-600 ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5개</div>
            <p className="text-xs text-muted-foreground">복용 중인 약물</p>
          </CardContent>
        </Card>

        {disease === 'diabetes' && (
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('bloodsugar')}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">혈당 관리</CardTitle>
              <Activity className="h-6 w-6 text-red-600 ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120</div>
              <p className="text-xs text-muted-foreground">최근 혈당 (mg/dL)</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>오늘 일정</CardTitle>
          <CardDescription>오늘 해야 할 의료 관련 활동들</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">내과 진료</p>
              <p className="text-sm text-gray-600">오후 2:30 - 은평구보건소</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
            <Pill className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">혈압약 복용</p>
              <p className="text-sm text-gray-600">오후 8:00</p>
            </div>
          </div>

          {disease === 'diabetes' && (
            <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg">
              <Activity className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium">혈당 측정</p>
                <p className="text-sm text-gray-600">식후 2시간</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 네비게이션 */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{user?.name || '사용자'}님</h1>
                <p className="text-sm text-gray-600">{getDiseaseLabel(disease)} 관리 모드</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              설정
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
        
        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}