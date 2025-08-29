import React, { useState } from 'react';
import { AccessibleButton } from '../AccessibleButton';
import { AccessibleCard } from '../AccessibleCard';
import { ArrowLeft, Camera, FileText, Upload, Eye, Trash2, Plus } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PrescriptionScreenProps {
  onNavigate: (screen: string) => void;
}

export function PrescriptionScreen({ onNavigate }: PrescriptionScreenProps) {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: '1',
      date: '2025년 8월 20일',
      hospital: '은평구보건소',
      doctor: '김내과 원장님',
      image: '/prescription1.jpg',
      medications: ['혈압약 (암로디핀) 5mg', '종합비타민 1정'],
      status: '처리 완료'
    },
    {
      id: '2',
      date: '2025년 8월 15일',
      hospital: '서울연세병원',
      doctor: '이당뇨 교수님',
      image: '/prescription2.jpg',
      medications: ['당뇨약 (메트포르민) 500mg', '혈압약 (암로디핀) 5mg'],
      status: '분석 중'
    }
  ]);

  const [showUpload, setShowUpload] = useState(false);

  const handleImageUpload = () => {
    // 실제 구현에서는 카메라나 갤러리에서 이미지를 선택
    const newPrescription = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      hospital: '업로드된 처방전',
      doctor: '분석 중...',
      image: '/new-prescription.jpg',
      medications: [],
      status: '분석 중'
    };
    setPrescriptions(prev => [newPrescription, ...prev]);
    setShowUpload(false);
  };

  const deletePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
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
          <h1 className="text-2xl font-bold">처방전 관리</h1>
        </div>
      </div>

      {/* 업로드 가이드 */}
      <div className="p-6 bg-blue-50 border-b border-blue-200">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-900">처방전을 촬영해보세요</h2>
            <p className="text-base text-blue-700 mt-2">
              AI가 자동으로 약물 정보를<br />분석하여 복약 알림을 설정해드립니다
            </p>
          </div>
          <AccessibleButton 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowUpload(true)}
          >
            <Camera className="w-6 h-6 mr-3" />
            처방전 촬영하기
          </AccessibleButton>
        </div>
      </div>

      {/* 처방전 목록 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">저장된 처방전</h3>
          <span className="text-base text-muted-foreground">{prescriptions.length}개</span>
        </div>

        {prescriptions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">저장된 처방전이 없습니다</p>
            <p className="text-base text-muted-foreground mt-2">
              첫 번째 처방전을 추가해보세요
            </p>
          </div>
        ) : (
          prescriptions.map((prescription) => (
            <AccessibleCard key={prescription.id}>
              <div className="space-y-4">
                {/* 처방전 헤더 */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold text-xl">{prescription.hospital}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        prescription.status === '처리 완료'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                    <p className="text-lg text-muted-foreground">{prescription.doctor}</p>
                    <p className="text-base text-muted-foreground">{prescription.date}</p>
                  </div>
                  <button 
                    onClick={() => deletePrescription(prescription.id)}
                    className="w-10 h-10 text-destructive hover:bg-destructive/10 rounded-full flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* 처방전 이미지 */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Camera className="w-5 h-5 text-primary" />
                    <span className="font-medium text-lg">처방전 이미지</span>
                  </div>
                  <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-500" />
                  </div>
                </div>

                {/* 분석된 약물 정보 */}
                {prescription.medications.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-lg mb-3 flex items-center">
                      <FileText className="w-5 h-5 text-primary mr-2" />
                      처방 약물
                    </h5>
                    <div className="space-y-2">
                      {prescription.medications.map((medication, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <span className="text-lg">{medication}</span>
                          <AccessibleButton size="sm" variant="secondary">
                            복약 추가
                          </AccessibleButton>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex space-x-3">
                  <AccessibleButton size="md" variant="secondary" className="flex-1">
                    <Eye className="w-5 h-5 mr-2" />
                    자세히 보기
                  </AccessibleButton>
                  {prescription.status === '처리 완료' && (
                    <AccessibleButton size="md" className="flex-1">
                      복약 설정
                    </AccessibleButton>
                  )}
                </div>
              </div>
            </AccessibleCard>
          ))
        )}
      </div>

      {/* 업로드 모달 */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4 text-center">처방전 추가</h3>
            <div className="space-y-4">
              <AccessibleButton 
                size="lg"
                className="w-full"
                onClick={handleImageUpload}
              >
                <Camera className="w-6 h-6 mr-3" />
                카메라로 촬영
              </AccessibleButton>
              <AccessibleButton 
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={handleImageUpload}
              >
                <Upload className="w-6 h-6 mr-3" />
                갤러리에서 선택
              </AccessibleButton>
              <AccessibleButton 
                size="md"
                variant="ghost"
                className="w-full"
                onClick={() => setShowUpload(false)}
              >
                취소
              </AccessibleButton>
            </div>
          </div>
        </div>
      )}

      {/* 촬영 팁 */}
      <div className="p-6 bg-muted/30 border-t border-border">
        <h4 className="font-semibold text-lg mb-3">📸 촬영 팁</h4>
        <div className="space-y-2 text-base text-muted-foreground">
          <p>• 처방전 전체가 화면에 들어오도록 촬영</p>
          <p>• 충분한 밝기에서 촬영</p>
          <p>• 글씨가 선명하게 보이도록 조정</p>
        </div>
      </div>
    </div>
  );
}