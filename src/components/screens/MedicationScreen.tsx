import React, { useState } from 'react';
import { AccessibleButton } from '../AccessibleButton';
import { AccessibleCard } from '../AccessibleCard';
import { ArrowLeft, Pill, Clock, Bell, Check, Plus, Calendar } from 'lucide-react';

interface MedicationScreenProps {
  onNavigate: (screen: string) => void;
}

export function MedicationScreen({ onNavigate }: MedicationScreenProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [medications, setMedications] = useState([
    {
      id: '1',
      name: '혈압약 (암로디핀)',
      dosage: '5mg',
      times: ['오전 8:00'],
      taken: [true],
      color: '#ef4444',
      notes: '식후 30분에 복용'
    },
    {
      id: '2',
      name: '당뇨약 (메트포르민)',
      dosage: '500mg',
      times: ['오전 8:00', '오후 1:00', '오후 7:00'],
      taken: [true, false, false],
      color: '#3b82f6',
      notes: '식사와 함께 복용'
    },
    {
      id: '3',
      name: '종합비타민',
      dosage: '1정',
      times: ['오후 7:00'],
      taken: [false],
      color: '#22c55e',
      notes: '저녁 식후 복용'
    }
  ]);

  const toggleMedication = (medId: string, timeIndex: number) => {
    setMedications(prev => prev.map(med => 
      med.id === medId 
        ? {
            ...med,
            taken: med.taken.map((taken, idx) => 
              idx === timeIndex ? !taken : taken
            )
          }
        : med
    ));
  };

  const getTotalMedications = () => {
    return medications.reduce((total, med) => total + med.times.length, 0);
  };

  const getTakenMedications = () => {
    return medications.reduce((total, med) => 
      total + med.taken.filter(taken => taken).length, 0
    );
  };

  const getCompletionRate = () => {
    const total = getTotalMedications();
    const taken = getTakenMedications();
    return total > 0 ? Math.round((taken / total) * 100) : 0;
  };

  return (
    <div className="h-screen w-full max-w-sm mx-auto bg-background flex flex-col">
      {/* 헤더 */}
      <div className="bg-primary text-primary-foreground px-6 py-6">
        <div className="flex items-center space-x-4 mb-4">
          <button 
            onClick={() => onNavigate('home')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">복약 관리</h1>
        </div>

        {/* 오늘의 복약 현황 */}
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-lg font-semibold">오늘의 복약 현황</p>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span className="text-sm">알림 ON</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>복용 완료</span>
                <span>{getTakenMedications()}/{getTotalMedications()}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionRate()}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{getCompletionRate()}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 날짜 선택 */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold text-lg">오늘</p>
              <p className="text-base text-muted-foreground">
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </p>
            </div>
          </div>
          <AccessibleButton size="sm" variant="secondary">
            날짜 변경
          </AccessibleButton>
        </div>
      </div>

      {/* 복약 목록 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {medications.map((medication) => (
          <AccessibleCard key={medication.id}>
            <div className="space-y-4">
              {/* 약물 정보 */}
              <div className="flex items-start space-x-4">
                <div 
                  className="w-4 h-16 rounded-full flex-shrink-0"
                  style={{ backgroundColor: medication.color }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-xl">{medication.name}</h3>
                  <p className="text-lg text-muted-foreground">{medication.dosage}</p>
                  {medication.notes && (
                    <p className="text-base text-muted-foreground mt-1 bg-muted/50 p-2 rounded">
                      💡 {medication.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* 복용 시간 */}
              <div className="space-y-3">
                {medication.times.map((time, timeIndex) => (
                  <div 
                    key={timeIndex}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      medication.taken[timeIndex]
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold text-lg">{time}</p>
                        <p className="text-sm text-muted-foreground">
                          {medication.taken[timeIndex] ? '복용 완료' : '복용 예정'}
                        </p>
                      </div>
                    </div>
                    <AccessibleButton
                      size="sm"
                      variant={medication.taken[timeIndex] ? 'default' : 'secondary'}
                      onClick={() => toggleMedication(medication.id, timeIndex)}
                      className={medication.taken[timeIndex] ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {medication.taken[timeIndex] ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Pill className="w-5 h-5" />
                      )}
                    </AccessibleButton>
                  </div>
                ))}
              </div>
            </div>
          </AccessibleCard>
        ))}

        {/* 새 약물 추가 */}
        <AccessibleCard 
          interactive
          className="border-dashed border-2 border-primary/30 bg-primary/5 text-center py-8"
        >
          <Plus className="w-12 h-12 text-primary mx-auto mb-3" />
          <p className="font-bold text-lg text-primary">새 약물 추가</p>
          <p className="text-base text-muted-foreground mt-1">처방받은 약을 등록해보세요</p>
        </AccessibleCard>
      </div>

      {/* 하단 액션 */}
      <div className="p-6 bg-muted/30 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <AccessibleButton size="md" variant="secondary">
            <Bell className="w-5 h-5 mr-2" />
            알림 설정
          </AccessibleButton>
          <AccessibleButton size="md" variant="secondary">
            <Calendar className="w-5 h-5 mr-2" />
            복약 기록
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
}