import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/MockAuthProvider'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Pill, Clock, Plus, Check, AlertCircle } from 'lucide-react'

interface Medication {
  id: string
  userId: string
  name: string
  dosage: string
  times: string[]
  startDate: string
  endDate: string
  instructions: string
}

interface TodayMedication extends Medication {
  nextDose?: string
  isOverdue?: boolean
}

interface MedicationLog {
  id: string
  userId: string
  medicationId: string
  takenAt: string
  notes: string
}

// 모의 데이터 저장소
let mockMedications: Medication[] = [
  {
    id: 'med1',
    userId: 'user1',
    name: '혈압약',
    dosage: '1정',
    times: ['08:00', '20:00'],
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    instructions: '식후 30분에 복용'
  },
  {
    id: 'med2',
    userId: 'user1',
    name: '당뇨약',
    dosage: '1정',
    times: ['07:30', '12:30', '19:30'],
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    instructions: '식전 30분에 복용'
  }
]

let mockMedicationLogs: MedicationLog[] = []

export function MockMedicationTracker() {
  const { user } = useAuth()
  const [todayMedications, setTodayMedications] = useState<TodayMedication[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    times: [''],
    startDate: '',
    endDate: '',
    instructions: ''
  })

  useEffect(() => {
    fetchTodayMedications()
  }, [user])

  async function fetchTodayMedications() {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      // 모의 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const today = new Date().toISOString().split('T')[0]
      const userMedications = mockMedications.filter(med => {
        if (med.userId !== user.id) return false
        const startDate = new Date(med.startDate).toISOString().split('T')[0]
        const endDate = new Date(med.endDate).toISOString().split('T')[0]
        return today >= startDate && today <= endDate
      })
      
      const processedMedications = userMedications.map((med) => ({
        ...med,
        nextDose: getNextDose(med.times),
        isOverdue: isOverdue(med.times)
      }))
      
      setTodayMedications(processedMedications)
      
    } catch (error) {
      console.error('복약 정보 조회 중 오류:', error)
      setError('복약 정보를 불러올 수 없습니다')
    } finally {
      setIsLoading(false)
    }
  }

  function getNextDose(times: string[]): string {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    for (const time of times.sort()) {
      const [hours, minutes] = time.split(':').map(Number)
      const doseTime = hours * 60 + minutes
      
      if (doseTime > currentTime) {
        return time
      }
    }
    
    return times[0] // 다음날 첫 복용
  }

  function isOverdue(times: string[]): boolean {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    return times.some(time => {
      const [hours, minutes] = time.split(':').map(Number)
      const doseTime = hours * 60 + minutes
      return doseTime < currentTime
    })
  }

  async function createMedication() {
    if (!user) return
    
    try {
      setIsLoading(true)
      setError('')
      
      // 입력 검증
      if (!newMedication.name || !newMedication.dosage || 
          !newMedication.startDate || !newMedication.endDate) {
        throw new Error('필수 필드를 모두 입력해주세요')
      }
      
      const validTimes = newMedication.times.filter(time => time.trim() !== '')
      if (validTimes.length === 0) {
        throw new Error('최소 하나의 복용 시간을 입력해주세요')
      }
      
      // 모의 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const medication: Medication = {
        id: `med${Date.now()}`,
        userId: user.id,
        name: newMedication.name,
        dosage: newMedication.dosage,
        times: validTimes,
        startDate: newMedication.startDate,
        endDate: newMedication.endDate,
        instructions: newMedication.instructions
      }
      
      mockMedications.push(medication)
      await fetchTodayMedications()
      
      setShowNewForm(false)
      setNewMedication({
        name: '',
        dosage: '',
        times: [''],
        startDate: '',
        endDate: '',
        instructions: ''
      })
      
    } catch (error) {
      console.error('복약 등록 중 오류:', error)
      setError(error instanceof Error ? error.message : '복약 등록 실패')
    } finally {
      setIsLoading(false)
    }
  }

  async function markAsTaken(medicationId: string) {
    if (!user) return
    
    try {
      // 모의 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const log: MedicationLog = {
        id: `log${Date.now()}`,
        userId: user.id,
        medicationId,
        takenAt: new Date().toISOString(),
        notes: '복용 완료'
      }
      
      mockMedicationLogs.push(log)
      await fetchTodayMedications()
      
    } catch (error) {
      console.error('복약 기록 중 오류:', error)
    }
  }

  function addTimeSlot() {
    setNewMedication(prev => ({
      ...prev,
      times: [...prev.times, '']
    }))
  }

  function updateTimeSlot(index: number, value: string) {
    setNewMedication(prev => ({
      ...prev,
      times: prev.times.map((time, i) => i === index ? value : time)
    }))
  }

  function removeTimeSlot(index: number) {
    setNewMedication(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">복약 관리</h2>
        <Button 
          onClick={() => setShowNewForm(!showNewForm)}
          className="h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          약물 추가
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>새 약물 등록</CardTitle>
            <CardDescription>복용할 약물 정보를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block font-medium mb-2">약물명</label>
              <Input
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                placeholder="혈압약"
                className="h-12"
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2">용량</label>
              <Input
                value={newMedication.dosage}
                onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="1정"
                className="h-12"
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2">복용 시간</label>
              {newMedication.times.map((time, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => updateTimeSlot(index, e.target.value)}
                    className="h-12"
                  />
                  {newMedication.times.length > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => removeTimeSlot(index)}
                      className="h-12 px-3"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addTimeSlot}
                className="w-full h-12"
              >
                시간 추가
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">시작일</label>
                <Input
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, startDate: e.target.value }))}
                  className="h-12"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">종료일</label>
                <Input
                  type="date"
                  value={newMedication.endDate}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, endDate: e.target.value }))}
                  className="h-12"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-medium mb-2">복용 방법</label>
              <Input
                value={newMedication.instructions}
                onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="식후 30분에 복용"
                className="h-12"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={createMedication}
                disabled={isLoading}
                className="flex-1 h-12"
              >
                {isLoading ? '등록 중...' : '약물 등록'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowNewForm(false)}
                className="flex-1 h-12"
              >
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">오늘의 복약 일정</h3>
        
        {todayMedications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Pill className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600">오늘 복용할 약물이 없습니다</p>
              <p className="text-sm text-gray-500 mt-2">약물 추가 버튼을 눌러 복약 일정을 만들어보세요</p>
            </CardContent>
          </Card>
        ) : (
          todayMedications.map((medication) => (
            <Card key={medication.id} className={`border-l-4 ${medication.isOverdue ? 'border-l-red-500' : 'border-l-green-500'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Pill className={`w-5 h-5 ${medication.isOverdue ? 'text-red-600' : 'text-green-600'}`} />
                      <span className="font-semibold text-lg">{medication.name}</span>
                      <span className="text-gray-600">({medication.dosage})</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>복용 시간: {medication.times.join(', ')}</span>
                    </div>
                    
                    {medication.nextDose && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <span>다음 복용: {medication.nextDose}</span>
                      </div>
                    )}
                    
                    {medication.instructions && (
                      <p className="text-sm text-gray-600">{medication.instructions}</p>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => markAsTaken(medication.id)}
                    className="h-12 px-6"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    복용 완료
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}