import React, { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { MockAuthProvider as AuthProvider, useAuth } from './components/auth/MockAuthProvider';
import { LoginScreen } from './components/auth/LoginScreen';

// Screens
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { MockDashboardScreen as DashboardScreen } from './components/screens/MockDashboardScreen';
import { AppointmentScreen } from './components/screens/AppointmentScreen';
import { MedicationScreen } from './components/screens/MedicationScreen';
import { PrescriptionScreen } from './components/screens/PrescriptionScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

// Figma System Showcases
import { ButtonShowcase } from './components/design-system/Button';
import { InputShowcase } from './components/design-system/Input';
import { CardShowcase } from './components/design-system/Card';
import { AccessibilityControlsShowcase } from './components/design-system/AccessibilityControls';
import { DiseaseSpecificShowcase } from './components/design-system/DiseaseSpecificComponents';
import { HomeTemplate } from './components/templates/HomeTemplate';
import { PrototypeFlow } from './components/figma-system/PrototypeFlow';
import { HandoffSpecs } from './components/figma-system/HandoffSpecs';

type Screen = 
  | 'onboarding' | 'home' | 'dashboard' | 'appointment' | 'medication' | 'prescription' | 'settings'
  | 'cover' | 'tokens' | 'components' | 'templates' | 'screens' | 'prototype' | 'handoff';

type FigmaPage = 
  | 'cover' | 'tokens' | 'components' | 'templates' | 'screens' | 'prototype' | 'handoff';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<Screen>('cover');

  const handleNavigate = (screen: Screen) => {
    setCurrentView(screen);
  };

  const handleOnboardingComplete = () => {
    setCurrentView('home');
  };

  // Figma 페이지 구조
  const figmaPages: Array<{id: FigmaPage, title: string, description: string}> = [
    { id: 'cover', title: '00_Cover', description: '프로젝트 개요 및 목차' },
    { id: 'tokens', title: '01_Tokens', description: '디자인 토큰 (색상, 타이포, 간격, 그림자)' },
    { id: 'components', title: '02_Components', description: '재사용 컴포넌트 (버튼, 입력, 카드, 접근성)' },
    { id: 'templates', title: '03_Templates', description: '레이아웃 템플릿 및 패턴' },
    { id: 'screens', title: '04_Screens', description: '6개 핵심 화면 (고해상도)' },
    { id: 'prototype', title: '05_Prototype', description: '인터랙티브 프로토타입 플로우' },
    { id: 'handoff', title: '06_Handoff', description: '개발 핸드오프 가이드' }
  ];

  const screenPages = [
    { id: 'onboarding', title: '온보딩/실버모드 설정' },
    { id: 'home', title: '홈 화면 (실버모드)' },
    { id: 'dashboard', title: '대시보드 (백엔드 연동)' },
    { id: 'appointment', title: '예약 플로우' },
    { id: 'medication', title: '복약 위젯 화면' },
    { id: 'prescription', title: '처방전 업로드/확인' },
    { id: 'settings', title: '설정 화면' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 사용자는 로그인 화면 표시
  if (!user && !['cover', 'tokens', 'components', 'templates', 'screens', 'prototype', 'handoff'].includes(currentView)) {
    return <LoginScreen />;
  }

  return (
    <div className="w-full min-h-screen bg-background">
        {/* Figma Cover Page */}
        {currentView === 'cover' && (
          <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold text-primary">은평구 고령층 실버모드 앱</h1>
              <p className="text-xl text-gray-600">
                질환별 맞춤형 모바일 UI 디자인 시스템<br />
                390×844px / 접근성 우선 / 질환별 테마
              </p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">📋 프로젝트 체크리스트</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">✅</span>
                      <span>본문 텍스트 ≥18px</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">✅</span>
                      <span>버튼 터치타겟 ≥48×48px</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">✅</span>
                      <span>텍스트 대비 ≥4.5:1</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">✅</span>
                      <span>질환별 UI 변형 (4종)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">✅</span>
                      <span>6개 핵심 화면</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">✅</span>
                      <span>인터랙티브 프로토타입</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">✅</span>
                      <span>개발 핸드오프 스펙</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">✅</span>
                      <span>컴포넌트 Variants</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {figmaPages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => setCurrentView(page.id)}
                  className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                >
                  <h3 className="text-xl font-bold mb-2">{page.title}</h3>
                  <p className="text-gray-600">{page.description}</p>
                </div>
              ))}
            </div>

            {/* 테스트 시나리오 */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-yellow-900 mb-4">🧪 테스트 시나리오</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">📝 과제 1: 첫 예약 잡기</h3>
                  <p className="text-gray-700">
                    새로운 사용자가 앱을 설치하고 첫 번째 병원 예약을 완료하는 과정
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    측정: 완료율, 소요시간, 오류횟수, 도움요청
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">💊 과제 2: 복약 알림 설정</h3>
                  <p className="text-gray-700">
                    처방전을 촬영하고 복약 알림을 설정하여 정시에 복용하는 과정
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    측정: 설정 정확도, 알림 인지율, 복용 준수율
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">⚙️ 과제 3: 접근성 설정 변경</h3>
                  <p className="text-gray-700">
                    글자 크기 변경, 고대비 모드 활성화, TTS 기능 사용하는 과정
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    측정: 설정 성공율, 개선된 사용성, SUS 점수
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-blue-900 mb-2">📊 측정 항목</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>정량적:</strong> 성공률, 완료시간, 오류횟수, 터치횟수
                  </div>
                  <div>
                    <strong>정성적:</strong> SUS 점수, 만족도, 이해도, 재사용 의향
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Design Tokens Page */}
        {currentView === 'tokens' && (
          <div className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">01_Tokens: 디자인 토큰</h1>
              <p className="text-lg text-gray-600">
                접근성과 질환별 맞춤 디자인을 위한 토큰 시스템
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <p className="text-lg">
                💡 실제 Figma에서는 이 영역에 다음 토큰들이 체계적으로 정리됩니다:
              </p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li>• <strong>Colors:</strong> Primary, Secondary, Semantic, Disease-specific</li>
                <li>• <strong>Typography:</strong> H1(32px), H2(24px), Body(18px), Body-Large(22px)</li>
                <li>• <strong>Spacing:</strong> 8pt Grid (4, 8, 16, 24, 32, 40, 48px)</li>
                <li>• <strong>Radii:</strong> 4, 8, 12, 20px</li>
                <li>• <strong>Elevation:</strong> Shadow tokens</li>
                <li>• <strong>Animation:</strong> Duration tokens (실버모드: 450-600ms)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Components Page */}
        {currentView === 'components' && (
          <div className="space-y-12">
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">02_Components: 컴포넌트 시스템</h1>
              <p className="text-lg text-gray-600">
                Variants로 구성된 재사용 가능한 컴포넌트들
              </p>
            </div>
            <ButtonShowcase />
            <InputShowcase />
            <CardShowcase />
            <AccessibilityControlsShowcase />
            <DiseaseSpecificShowcase />
          </div>
        )}

        {/* Templates Page */}
        {currentView === 'templates' && (
          <div className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">03_Templates: 레이아웃 템플릿</h1>
              <p className="text-lg text-gray-600">
                홈, 리스트, 상세, 폼 등 주요 패턴과 레이아웃
              </p>
            </div>
            <div className="max-w-sm mx-auto">
              <HomeTemplate
                userName="홍길동"
                userAge={72}
                diseaseType="diabetes"
                upcomingAppointment={{
                  date: "2025년 8월 25일",
                  time: "오후 2:30",
                  doctor: "김내과 원장님",
                  hospital: "은평구보건소"
                }}
                todayMedications={[
                  { name: "혈압약", time: "오전 8:00", taken: true },
                  { name: "당뇨약", time: "오후 1:00", taken: false }
                ]}
                onNavigate={handleNavigate}
              />
            </div>
          </div>
        )}

        {/* Screens Page */}
        {currentView === 'screens' && (
          <div className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">04_Screens: 핵심 화면들</h1>
              <p className="text-lg text-gray-600">
                6개 핵심 화면 (고해상도, 인터랙션 주석 포함)
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {screenPages.map((screen) => (
                <button
                  key={screen.id}
                  onClick={() => setCurrentView(screen.id as Screen)}
                  className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-lg transition-all text-left"
                >
                  <h3 className="font-bold text-lg mb-2">{screen.title}</h3>
                  <p className="text-sm text-gray-600">화면 보기 →</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Prototype Page */}
        {currentView === 'prototype' && (
          <div className="space-y-8">
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">05_Prototype: 인터랙티브 프로토타입</h1>
              <p className="text-lg text-gray-600">
                핵심 플로우 시연 (실버모드 애니메이션 적용)
              </p>
            </div>
            <div className="space-y-12">
              <PrototypeFlow flowType="onboarding" animationSpeed="slow" />
              <PrototypeFlow flowType="appointment" animationSpeed="slow" />
              <PrototypeFlow flowType="medication" animationSpeed="slow" />
            </div>
          </div>
        )}

        {/* Handoff Page */}
        {currentView === 'handoff' && (
          <div className="space-y-8">
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">06_Handoff: 개발 핸드오프</h1>
              <p className="text-lg text-gray-600">
                개발자를 위한 상세 스펙과 에셋 가이드
              </p>
            </div>
            <HandoffSpecs />
          </div>
        )}

        {/* 대시보드 (풀스크린) */}
        {currentView === 'dashboard' && (
          <DashboardScreen onNavigate={handleNavigate} />
        )}

        {/* 실제 앱 화면들 (모바일 프레임) */}
        {['onboarding', 'home', 'appointment', 'medication', 'prescription', 'settings'].includes(currentView) && (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* 모바일 프레임 - 390x844 */}
            <div className="w-[390px] h-[844px] bg-background border-2 border-gray-300 rounded-[2rem] overflow-hidden shadow-2xl">
              {currentView === 'onboarding' && (
                <OnboardingScreen onComplete={handleOnboardingComplete} />
              )}
              {currentView === 'home' && (
                <HomeScreen onNavigate={handleNavigate} />
              )}
              {currentView === 'appointment' && (
                <AppointmentScreen onNavigate={handleNavigate} />
              )}
              {currentView === 'medication' && (
                <MedicationScreen onNavigate={handleNavigate} />
              )}
              {currentView === 'prescription' && (
                <PrescriptionScreen onNavigate={handleNavigate} />
              )}
              {currentView === 'settings' && (
                <SettingsScreen onNavigate={handleNavigate} />
              )}
            </div>
          </div>
        )}

        {/* 네비게이션 패널 */}
        <div className="fixed bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border max-w-xs">
          <h3 className="font-bold text-sm mb-2">🎨 Figma 페이지 네비게이션</h3>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {figmaPages.map((page) => (
              <button
                key={page.id}
                onClick={() => setCurrentView(page.id)}
                className={`px-2 py-1 rounded ${
                  currentView === page.id ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {page.title.split('_')[1] || page.title}
              </button>
            ))}
          </div>
          
          {(currentView === 'screens' || user) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h4 className="font-bold text-xs mb-2">📱 화면 네비게이션</h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {screenPages.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => setCurrentView(screen.id as Screen)}
                    className={`px-2 py-1 rounded ${
                      currentView === screen.id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {screen.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}