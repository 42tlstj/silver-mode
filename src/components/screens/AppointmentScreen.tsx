import React, { useState } from 'react';
import { AccessibleButton } from '../AccessibleButton';
import { AccessibleCard } from '../AccessibleCard';
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone } from 'lucide-react';

interface AppointmentScreenProps {
  onNavigate: (screen: string) => void;
}

export function AppointmentScreen({ onNavigate }: AppointmentScreenProps) {
  const [step, setStep] = useState('list'); // list, book, confirm
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const hospitals = [
    {
      id: '1',
      name: '은평구보건소',
      department: '내과',
      doctor: '김내과 원장님',
      address: '서울 은평구 은평로 195',
      phone: '02-380-8000',
      distance: '500m'
    },
    {
      id: '2',
      name: '서울연세병원',
      department: '내분비내과',
      doctor: '이당뇨 교수님',
      address: '서울 은평구 통일로 1021',
      phone: '02-570-0114',
      distance: '1.2km'
    },
    {
      id: '3',
      name: '은평성모병원',
      department: '신경과',
      doctor: '박파킨슨 원장님',
      address: '서울 은평구 진관1로 12',
      phone: '02-940-7000',
      distance: '2.1km'
    }
  ];

  const appointments = [
    {
      id: '1',
      date: '2025년 8월 25일 (월)',
      time: '오후 2:30',
      hospital: '은평구보건소',
      doctor: '김내과 원장님',
      status: '예약 확정'
    },
    {
      id: '2',
      date: '2025년 9월 3일 (화)',
      time: '오전 10:00',
      hospital: '서울연세병원',
      doctor: '이당뇨 교수님',
      status: '예약 대기'
    }
  ];

  const availableDates = [
    '2025년 8월 26일 (화)',
    '2025년 8월 27일 (수)',
    '2025년 8월 28일 (목)',
    '2025년 8월 29일 (금)',
    '2025년 8월 30일 (토)'
  ];

  const availableTimes = [
    '오전 9:00', '오전 9:30', '오전 10:00', '오전 10:30',
    '오전 11:00', '오전 11:30', '오후 2:00', '오후 2:30',
    '오후 3:00', '오후 3:30', '오후 4:00', '오후 4:30'
  ];

  const handleBookAppointment = () => {
    if (selectedHospital && selectedDate && selectedTime) {
      setStep('confirm');
    }
  };

  const handleConfirmBooking = () => {
    // 예약 확정 로직
    alert('예약이 완료되었습니다!');
    setStep('list');
  };

  return (
    <div className="h-screen w-full max-w-sm mx-auto bg-background flex flex-col">
      {/* 헤더 */}
      <div className="bg-primary text-primary-foreground px-6 py-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => step === 'list' ? onNavigate('home') : setStep('list')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">
            {step === 'list' ? '병원 예약' : step === 'book' ? '예약하기' : '예약 확인'}
          </h1>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {step === 'list' && (
          <div className="p-6 space-y-6">
            {/* 현재 예약 */}
            <div>
              <h2 className="text-xl font-bold mb-4">현재 예약</h2>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AccessibleCard key={appointment.id}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-6 h-6 text-primary" />
                          <div>
                            <p className="font-semibold text-lg">{appointment.date}</p>
                            <p className="text-base text-muted-foreground">{appointment.time}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === '예약 확정' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="w-6 h-6 text-primary" />
                        <div>
                          <p className="font-semibold text-lg">{appointment.doctor}</p>
                          <p className="text-base text-muted-foreground">{appointment.hospital}</p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <AccessibleButton size="sm" variant="secondary" className="flex-1">
                          변경
                        </AccessibleButton>
                        <AccessibleButton size="sm" variant="destructive" className="flex-1">
                          취소
                        </AccessibleButton>
                      </div>
                    </div>
                  </AccessibleCard>
                ))}
              </div>
            </div>

            {/* 새 예약 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">새 예약</h2>
                <AccessibleButton 
                  size="md"
                  onClick={() => setStep('book')}
                >
                  예약하기
                </AccessibleButton>
              </div>
              
              <div className="space-y-4">
                {hospitals.map((hospital) => (
                  <AccessibleCard 
                    key={hospital.id}
                    interactive
                    onClick={() => {
                      setSelectedHospital(hospital.id);
                      setStep('book');
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-xl">{hospital.name}</h3>
                          <p className="text-lg text-muted-foreground">{hospital.department}</p>
                        </div>
                        <span className="text-base text-primary font-medium">{hospital.distance}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-primary" />
                        <p className="text-lg">{hospital.doctor}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <p className="text-base text-muted-foreground">{hospital.address}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <p className="text-base text-muted-foreground">{hospital.phone}</p>
                      </div>
                    </div>
                  </AccessibleCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'book' && (
          <div className="p-6 space-y-6">
            {/* 선택된 병원 */}
            {selectedHospital && (
              <AccessibleCard title="선택된 병원">
                {(() => {
                  const hospital = hospitals.find(h => h.id === selectedHospital);
                  return hospital ? (
                    <div className="space-y-2">
                      <p className="font-bold text-xl">{hospital.name}</p>
                      <p className="text-lg">{hospital.doctor} - {hospital.department}</p>
                    </div>
                  ) : null;
                })()}
              </AccessibleCard>
            )}

            {/* 날짜 선택 */}
            <div>
              <h3 className="text-xl font-bold mb-4">날짜 선택</h3>
              <div className="grid grid-cols-1 gap-3">
                {availableDates.map((date) => (
                  <AccessibleButton
                    key={date}
                    variant={selectedDate === date ? 'default' : 'secondary'}
                    size="md"
                    className="w-full justify-start"
                    onClick={() => setSelectedDate(date)}
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    {date}
                  </AccessibleButton>
                ))}
              </div>
            </div>

            {/* 시간 선택 */}
            {selectedDate && (
              <div>
                <h3 className="text-xl font-bold mb-4">시간 선택</h3>
                <div className="grid grid-cols-2 gap-3">
                  {availableTimes.map((time) => (
                    <AccessibleButton
                      key={time}
                      variant={selectedTime === time ? 'default' : 'secondary'}
                      size="md"
                      onClick={() => setSelectedTime(time)}
                    >
                      <Clock className="w-5 h-5 mr-2" />
                      {time}
                    </AccessibleButton>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'confirm' && (
          <div className="p-6 space-y-6">
            <AccessibleCard title="예약 정보 확인">
              {(() => {
                const hospital = hospitals.find(h => h.id === selectedHospital);
                return (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-bold text-xl">{hospital?.name}</p>
                        <p className="text-lg text-muted-foreground">{hospital?.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-primary" />
                      <p className="text-lg">{hospital?.doctor}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-primary" />
                      <p className="text-lg">{selectedDate}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-6 h-6 text-primary" />
                      <p className="text-lg">{selectedTime}</p>
                    </div>
                  </div>
                );
              })()}
            </AccessibleCard>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <h4 className="font-bold text-lg text-yellow-800 mb-2">주의사항</h4>
              <ul className="text-base text-yellow-700 space-y-1">
                <li>• 예약 변경은 1일 전까지 가능합니다</li>
                <li>• 진료비는 현장에서 결제됩니다</li>
                <li>• 건강보험증을 지참해주세요</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      {step === 'book' && (
        <div className="p-6">
          <AccessibleButton
            size="xl"
            className="w-full"
            onClick={handleBookAppointment}
            disabled={!selectedHospital || !selectedDate || !selectedTime}
          >
            예약하기
          </AccessibleButton>
        </div>
      )}

      {step === 'confirm' && (
        <div className="p-6 space-y-3">
          <AccessibleButton
            size="xl"
            className="w-full"
            onClick={handleConfirmBooking}
          >
            예약 확정
          </AccessibleButton>
          <AccessibleButton
            size="lg"
            variant="secondary"
            className="w-full"
            onClick={() => setStep('book')}
          >
            수정하기
          </AccessibleButton>
        </div>
      )}
    </div>
  );
}