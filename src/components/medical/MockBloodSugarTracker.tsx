import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/MockAuthProvider'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Activity, TrendingUp, TrendingDown, Plus } from 'lucide-react'

interface BloodSugarRecord {
  id: string
  userId: string
  value: number
  measuredAt: string
  type: 'fasting' | 'after_meal'
  createdAt: string
}

// 모의 데이터 저장소
let mockBloodSugarRecords: BloodSugarRecord[] = [
  {
    id: 'bs1',
    userId: 'user1',
    value: 115,
    measuredAt: '2025-08-29T07:00:00Z',
    type: 'fasting',
    createdAt: '2025-08-29T07:05:00Z'
  },
  {
    id: 'bs2',
    userId: 'user1',
    value: 145,
    measuredAt: '2025-08-29T14:00:00Z',
    type: 'after_meal',
    createdAt: '2025-08-29T14:05:00Z'
  },
  {
    id: 'bs3',
    userId: 'user1',
    value: 108,
    measuredAt: '2025-08-29T19:00:00Z',
    type: 'fasting',
    createdAt: '2025-08-29T19:05:00Z'
  }
]

export function MockBloodSugarTracker() {
  const { user } = useAuth()
  const [records, setRecords] = useState<BloodSugarRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [newRecord, setNewRecord] = useState({
    value: '',
    type: 'fasting' as 'fasting' | 'after_meal',
    measuredAt: ''
  })

  useEffect(() => {
    fetchRecords()
  }, [user])

  useEffect(() => {
    // 현재 시간을 기본값으로 설정
    const now = new Date()
    const timeString = now.toTimeString().slice(0, 5)
    setNewRecord(prev => ({ ...prev, measuredAt: timeString }))
  }, [showNewForm])

  async function fetchRecords() {
    if (!user) return
    
    try {
      setIsLoading(true)
      
      // 모의 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const userRecords = mockBloodSugarRecords
        .filter(record => record.userId === user.id)
        .sort((a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime())
      
      setRecords(userRecords)
      
    } catch (error) {
      console.error('혈당 기록 조회 중 오류:', error)
      setError('혈당 기록을 불러올 수 없습니다')
    } finally {
      setIsLoading(false)
    }
  }

  async function createRecord() {
    if (!user) return
    
    try {
      setIsLoading(true)
      setError('')
      
      // 입력 검증
      if (!newRecord.value || !newRecord.measuredAt) {
        throw new Error('혈당 수치와 측정 시간을 입력해주세요')
      }
      
      const value = parseFloat(newRecord.value)
      if (isNaN(value) || value <= 0 || value > 600) {
        throw new Error('올바른 혈당 수치를 입력해주세요 (1-600)')
      }
      
      // 모의 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const today = new Date().toISOString().split('T')[0]
      const measuredAt = `${today}T${newRecord.measuredAt}:00.000Z`
      
      const record: BloodSugarRecord = {
        id: `bs${Date.now()}`,
        userId: user.id,
        value,
        measuredAt,
        type: newRecord.type,
        createdAt: new Date().toISOString()
      }
      
      mockBloodSugarRecords.push(record)
      await fetchRecords()
      
      setShowNewForm(false)
      setNewRecord({
        value: '',
        type: 'fasting',
        measuredAt: ''
      })
      
    } catch (error) {
      console.error('혈당 기록 중 오류:', error)
      setError(error instanceof Error ? error.message : '혈당 기록 실패')
    } finally {
      setIsLoading(false)
    }
  }

  function getBloodSugarStatus(value: number, type: 'fasting' | 'after_meal') {
    if (type === 'fasting') {
      if (value < 70) return { status: 'low', color: 'text-blue-600', bg: 'bg-blue-100' }
      if (value <= 100) return { status: 'normal', color: 'text-green-600', bg: 'bg-green-100' }
      if (value <= 125) return { status: 'prediabetes', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      return { status: 'high', color: 'text-red-600', bg: 'bg-red-100' }
    } else {
      if (value < 70) return { status: 'low', color: 'text-blue-600', bg: 'bg-blue-100' }
      if (value <= 140) return { status: 'normal', color: 'text-green-600', bg: 'bg-green-100' }
      if (value <= 199) return { status: 'prediabetes', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      return { status: 'high', color: 'text-red-600', bg: 'bg-red-100' }
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'low': return '낮음'
      case 'normal': return '정상'
      case 'prediabetes': return '주의'
      case 'high': return '높음'
      default: return '알 수 없음'
    }
  }

  function formatDateTime(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getRecentTrend() {
    if (records.length < 2) return null
    
    const recent = records[0].value
    const previous = records[1].value
    
    if (recent > previous) return 'up'
    if (recent < previous) return 'down'
    return 'stable'
  }

  const recentTrend = getRecentTrend()
  const latestRecord = records[0]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">혈당 관리</h2>
        <Button 
          onClick={() => setShowNewForm(!showNewForm)}
          className="h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          혈당 기록
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {latestRecord && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-blue-600" />
                  <span className="text-2xl font-bold">{latestRecord.value} mg/dL</span>
                  {recentTrend === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
                  {recentTrend === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
                </div>
                <p className="text-gray-600 mt-1">
                  최근 측정 ({formatDateTime(latestRecord.measuredAt)})
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full ${getBloodSugarStatus(latestRecord.value, latestRecord.type).bg}`}>
                <span className={`font-medium ${getBloodSugarStatus(latestRecord.value, latestRecord.type).color}`}>
                  {getStatusText(getBloodSugarStatus(latestRecord.value, latestRecord.type).status)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>혈당 기록하기</CardTitle>
            <CardDescription>측정한 혈당 수치를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block font-medium mb-2">혈당 수치 (mg/dL)</label>
              <Input
                type="number"
                value={newRecord.value}
                onChange={(e) => setNewRecord(prev => ({ ...prev, value: e.target.value }))}
                placeholder="120"
                min="1"
                max="600"
                className="h-12"
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2">측정 유형</label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={newRecord.type === 'fasting' ? 'default' : 'outline'}
                  onClick={() => setNewRecord(prev => ({ ...prev, type: 'fasting' }))}
                  className="h-12"
                >
                  공복 혈당
                </Button>
                <Button
                  variant={newRecord.type === 'after_meal' ? 'default' : 'outline'}
                  onClick={() => setNewRecord(prev => ({ ...prev, type: 'after_meal' }))}
                  className="h-12"
                >
                  식후 혈당
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block font-medium mb-2">측정 시간</label>
              <Input
                type="time"
                value={newRecord.measuredAt}
                onChange={(e) => setNewRecord(prev => ({ ...prev, measuredAt: e.target.value }))}
                className="h-12"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={createRecord}
                disabled={isLoading || !newRecord.value}
                className="flex-1 h-12"
              >
                {isLoading ? '기록 중...' : '혈당 기록'}
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
        <h3 className="text-xl font-semibold">혈당 기록 히스토리</h3>
        
        {records.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Activity className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600">아직 혈당 기록이 없습니다</p>
              <p className="text-sm text-gray-500 mt-2">혈당 기록 버튼을 눌러 첫 기록을 시작하세요</p>
            </CardContent>
          </Card>
        ) : (
          records.map((record) => {
            const status = getBloodSugarStatus(record.value, record.type)
            return (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{record.value} mg/dL</span>
                        <span className="text-sm text-gray-600">
                          ({record.type === 'fasting' ? '공복' : '식후'})
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(record.measuredAt)}
                      </p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full ${status.bg}`}>
                      <span className={`text-sm font-medium ${status.color}`}>
                        {getStatusText(status.status)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}