import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Calendar, Clock, MapPin, User, Plus, CheckCircle } from 'lucide-react'
import { projectId } from '../../utils/supabase/info'

interface Appointment {
  id: string
  hospitalName: string
  department: string
  date: string
  time: string
  doctorName: string
  status: string
  createdAt: string
}

export function AppointmentManager() {
  const { accessToken } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [error, setError] = useState('')
  const [newAppointment, setNewAppointment] = useState({
    hospitalName: '',
    department: '',
    date: '',
    time: '',
    doctorName: ''
  })

  useEffect(() => {
    fetchAppointments()
  }, [accessToken])

  async function fetchAppointments() {
    if (!accessToken) return
    
    try {
      setIsLoading(true)
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6dba5bdd/appointments`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const { appointments } = await response.json()
        setAppointments(appointments || [])
      } else {
        throw new Error('예약 목록을 불러올 수 없습니다')
      }
    } catch (error) {
      console.error('예약 목록 조회 중 오류:', error)
      setError(error instanceof Error ? error.message : '예약 목록 조회 실패')
    } finally {
      setIsLoading(false)
    }
  }

  async function createAppointment() {
    if (!accessToken) return
    
    try {
      setIsLoading(true)
      setError('')
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6dba5bdd/appointments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAppointment)
      })
      
      if (response.ok) {
        await fetchAppointments()
        setShowNewForm(false)
        setNewAppointment({
          hospitalName: '',
          department: '',
          date: '',
          time: '',
          doctorName: ''
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || '예약 생성 실패')
      }
    } catch (error) {
      console.error('예약 생성 중 오류:', error)
      setError(error instanceof Error ? error.message : '예약 생성 실패')
    } finally {
      setIsLoading(false)
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">병원 예약 관리</h2>
        <Button 
          onClick={() => setShowNewForm(!showNewForm)}
          className="h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          새 예약
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
            <CardTitle>새 예약 만들기</CardTitle>
            <CardDescription>병원 예약 정보를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block font-medium mb-2">병원명</label>
              <Input
                value={newAppointment.hospitalName}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, hospitalName: e.target.value }))}
                placeholder="서울대학교병원"
                className="h-12"
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2">진료과</label>
              <Input
                value={newAppointment.department}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, department: e.target.value }))}
                placeholder="내과"
                className="h-12"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">예약 날짜</label>
                <Input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                  className="h-12"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">예약 시간</label>
                <Input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                  className="h-12"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-medium mb-2">담당의</label>
              <Input
                value={newAppointment.doctorName}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, doctorName: e.target.value }))}
                placeholder="김의사"
                className="h-12"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={createAppointment}
                disabled={isLoading}
                className="flex-1 h-12"
              >
                {isLoading ? '예약 중...' : '예약 확정'}
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
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600">예약된 병원 진료가 없습니다</p>
              <p className="text-sm text-gray-500 mt-2">새 예약 버튼을 눌러 예약을 만들어보세요</p>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">{appointment.hospitalName}</span>
                      <span className="text-gray-600">/ {appointment.department}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span>{appointment.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      <span>{appointment.doctorName} 의사</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">예약됨</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}