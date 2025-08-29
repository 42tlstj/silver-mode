import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Pill, Clock, Plus, Check, AlertCircle } from 'lucide-react'
import { projectId } from '../../utils/supabase/info'

interface Medication {
  id: string
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

export function MedicationTracker() {
  const { accessToken } = useAuth()
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
  }, [accessToken])

  async function fetchTodayMedications() {
    if (!accessToken) return
    
    try {
      setIsLoading(true)
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6dba5bdd/today-medications`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const { medications } = await response.json()
        const processedMedications = (medications || []).map((med: Medication) => ({
          ...med,
          nextDose: getNextDose(med.times),
          isOverdue: isOverdue(med.times)
        }))
        setTodayMedications(processedMedications)
      } else {
        throw new Error('복약 정보를 불러올 수 없습니다')
      }
    } catch (error) {
      console.error('복약 정보 조회 중 오류:', error)
      setError(error instanceof Error ? error.message : '복약 정보 조회 실패')
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
    if (!accessToken) return
    
    try {
      setIsLoading(true)
      setError('')
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6dba5bdd/medications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newMedication,
          times: newMedication.times.filter(time => time.trim() !== '')
        })
      })
      
      if (response.ok) {
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
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || '복약 등록 실패')
      }
    } catch (error) {
      console.error('복약 등록 중 오류:', error)
      setError(error instanceof Error ? error.message : '복약 등록 실패')
    } finally {
      setIsLoading(false)
    }
  }

  async function markAsTaken(medicationId: string) {
    if (!accessToken) return
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6dba5bdd/medication-logs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          medicationId,
          takenAt: new Date().toISOString(),
          notes: '복용 완료'
        })
      })
      
      if (response.ok) {
        // UI 업데이트는 실제로는 복약 시간 체크와 함께 더 복잡하게 구현해야 함
        await fetchTodayMedications()
      }
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