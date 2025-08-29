import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

// 테스트 데이터 초기화 함수
async function initializeTestData() {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 테스트 사용자 생성
  const testUsers = [
    {
      email: 'test@silvermode.com',
      password: 'password123',
      name: '홍길동',
      age: 72,
      diseases: ['diabetes', 'hypertension']
    },
    {
      email: 'park@silvermode.com', 
      password: 'password123',
      name: '박영희',
      age: 68,
      diseases: ['parkinson']
    }
  ]

  for (const user of testUsers) {
    try {
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(user.email)
      
      if (!existingUser.user) {
        const { data: authData, error } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          user_metadata: { name: user.name, age: user.age, diseases: user.diseases },
          email_confirm: true
        })
        
        if (!error && authData.user) {
          await kv.set(`user:${authData.user.id}`, {
            id: authData.user.id,
            email: user.email,
            name: user.name,
            age: user.age,
            diseases: user.diseases,
            createdAt: new Date().toISOString()
          })
          
          console.log(`테스트 사용자 생성됨: ${user.email}`)
        }
      }
    } catch (error) {
      console.log(`테스트 사용자 생성 중 오류 (${user.email}): ${error}`)
    }
  }
}

// 서버 시작 시 테스트 데이터 초기화
initializeTestData().catch(console.error)

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// 사용자 회원가입
app.post('/make-server-6dba5bdd/signup', async (c) => {
  try {
    const { email, password, name, age, diseases } = await c.req.json()
    
    const { data: authData, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, age, diseases },
      // 이메일 서버가 설정되지 않았으므로 자동으로 이메일을 확인합니다.
      email_confirm: true
    })
    
    if (error) {
      console.log(`회원가입 중 인증 오류: ${error}`)
      return c.json({ error: error.message }, 400)
    }
    
    // 사용자 프로필 정보 저장
    await kv.set(`user:${authData.user.id}`, {
      id: authData.user.id,
      email,
      name,
      age,
      diseases: diseases || [],
      createdAt: new Date().toISOString()
    })
    
    return c.json({ user: authData.user })
  } catch (error) {
    console.log(`회원가입 처리 중 오류: ${error}`)
    return c.json({ error: '회원가입 실패' }, 500)
  }
})

// 사용자 프로필 조회
app.get('/make-server-6dba5bdd/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: '인증되지 않은 사용자' }, 401)
    }
    
    const profile = await kv.get(`user:${user.id}`)
    if (!profile) {
      return c.json({ error: '프로필을 찾을 수 없음' }, 404)
    }
    
    return c.json({ profile })
  } catch (error) {
    console.log(`프로필 조회 중 오류: ${error}`)
    return c.json({ error: '프로필 조회 실패' }, 500)
  }
})

// 병원 예약 생성
app.post('/make-server-6dba5bdd/appointments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: '인증되지 않은 사용자' }, 401)
    }
    
    const { hospitalName, department, date, time, doctorName } = await c.req.json()
    
    const appointmentId = `appointment:${user.id}:${Date.now()}`
    const appointment = {
      id: appointmentId,
      userId: user.id,
      hospitalName,
      department,
      date,
      time,
      doctorName,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    }
    
    await kv.set(appointmentId, appointment)
    
    // 사용자별 예약 목록에 추가
    const userAppointments = await kv.get(`user_appointments:${user.id}`) || []
    userAppointments.push(appointmentId)
    await kv.set(`user_appointments:${user.id}`, userAppointments)
    
    return c.json({ appointment })
  } catch (error) {
    console.log(`예약 생성 중 오류: ${error}`)
    return c.json({ error: '예약 생성 실패' }, 500)
  }
})

// 사용자 예약 목록 조회
app.get('/make-server-6dba5bdd/appointments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: '인증되지 않은 사용자' }, 401)
    }
    
    const appointmentIds = await kv.get(`user_appointments:${user.id}`) || []
    const appointments = await kv.mget(appointmentIds)
    
    return c.json({ appointments: appointments.filter(a => a !== null) })
  } catch (error) {
    console.log(`예약 목록 조회 중 오류: ${error}`)
    return c.json({ error: '예약 목록 조회 실패' }, 500)
  }
})

// 복약 기록 생성
app.post('/make-server-6dba5bdd/medications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: '인증되지 않은 사용자' }, 401)
    }
    
    const { name, dosage, times, startDate, endDate, instructions } = await c.req.json()
    
    const medicationId = `medication:${user.id}:${Date.now()}`
    const medication = {
      id: medicationId,
      userId: user.id,
      name,
      dosage,
      times, // ['08:00', '14:00', '20:00']
      startDate,
      endDate,
      instructions,
      createdAt: new Date().toISOString()
    }
    
    await kv.set(medicationId, medication)
    
    // 사용자별 복약 목록에 추가
    const userMedications = await kv.get(`user_medications:${user.id}`) || []
    userMedications.push(medicationId)
    await kv.set(`user_medications:${user.id}`, userMedications)
    
    return c.json({ medication })
  } catch (error) {
    console.log(`복약 기록 생성 중 오류: ${error}`)
    return c.json({ error: '복약 기록 생성 실패' }, 500)
  }
})

// 복약 완료 기록
app.post('/make-server-6dba5bdd/medication-logs', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: '인증되지 않은 사용자' }, 401)
    }
    
    const { medicationId, takenAt, notes } = await c.req.json()
    
    const logId = `medication_log:${user.id}:${Date.now()}`
    const log = {
      id: logId,
      userId: user.id,
      medicationId,
      takenAt: takenAt || new Date().toISOString(),
      notes
    }
    
    await kv.set(logId, log)
    
    return c.json({ log })
  } catch (error) {
    console.log(`복약 완료 기록 중 오류: ${error}`)
    return c.json({ error: '복약 완료 기록 실패' }, 500)
  }
})

// 오늘의 복약 일정 조회
app.get('/make-server-6dba5bdd/today-medications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: '인증되지 않은 사용자' }, 401)
    }
    
    const today = new Date().toISOString().split('T')[0]
    const medicationIds = await kv.get(`user_medications:${user.id}`) || []
    const medications = await kv.mget(medicationIds)
    
    // 오늘 복용해야 하는 약물 필터링
    const todayMedications = medications.filter(med => {
      if (!med) return false
      const startDate = new Date(med.startDate).toISOString().split('T')[0]
      const endDate = new Date(med.endDate).toISOString().split('T')[0]
      return today >= startDate && today <= endDate
    })
    
    return c.json({ medications: todayMedications })
  } catch (error) {
    console.log(`오늘 복약 일정 조회 중 오류: ${error}`)
    return c.json({ error: '복약 일정 조회 실패' }, 500)
  }
})

// 혈당 기록 (당뇨 환자용)
app.post('/make-server-6dba5bdd/blood-sugar', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: '인증되지 않은 사용자' }, 401)
    }
    
    const { value, measuredAt, type } = await c.req.json() // type: 'fasting', 'after_meal'
    
    const recordId = `blood_sugar:${user.id}:${Date.now()}`
    const record = {
      id: recordId,
      userId: user.id,
      value,
      measuredAt: measuredAt || new Date().toISOString(),
      type,
      createdAt: new Date().toISOString()
    }
    
    await kv.set(recordId, record)
    
    // 사용자별 혈당 기록 목록에 추가
    const userRecords = await kv.get(`user_blood_sugar:${user.id}`) || []
    userRecords.push(recordId)
    await kv.set(`user_blood_sugar:${user.id}`, userRecords)
    
    return c.json({ record })
  } catch (error) {
    console.log(`혈당 기록 중 오류: ${error}`)
    return c.json({ error: '혈당 기록 실패' }, 500)
  }
})

// 혈당 기록 조회
app.get('/make-server-6dba5bdd/blood-sugar', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: '인증되지 않은 사용자' }, 401)
    }
    
    const recordIds = await kv.get(`user_blood_sugar:${user.id}`) || []
    const records = await kv.mget(recordIds)
    
    return c.json({ records: records.filter(r => r !== null) })
  } catch (error) {
    console.log(`혈당 기록 조회 중 오류: ${error}`)
    return c.json({ error: '혈당 기록 조회 실패' }, 500)
  }
})

// 응급 연락처 관리
app.post('/make-server-6dba5bdd/emergency-contacts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: '인증되지 않은 사용자' }, 401)
    }
    
    const { name, phone, relationship } = await c.req.json()
    
    const contacts = await kv.get(`emergency_contacts:${user.id}`) || []
    contacts.push({ name, phone, relationship, addedAt: new Date().toISOString() })
    
    await kv.set(`emergency_contacts:${user.id}`, contacts)
    
    return c.json({ contacts })
  } catch (error) {
    console.log(`응급 연락처 추가 중 오류: ${error}`)
    return c.json({ error: '응급 연락처 추가 실패' }, 500)
  }
})

app.get('/make-server-6dba5bdd/emergency-contacts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: '인증되지 않은 사용자' }, 401)
    }
    
    const contacts = await kv.get(`emergency_contacts:${user.id}`) || []
    
    return c.json({ contacts })
  } catch (error) {
    console.log(`응급 연락처 조회 중 오류: ${error}`)
    return c.json({ error: '응급 연락처 조회 실패' }, 500)
  }
})

// 건강 정보 수정
app.put('/make-server-6dba5bdd/health-info', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: '인증되지 않은 사용자' }, 401)
    }
    
    const { diseases, allergies, notes } = await c.req.json()
    
    const profile = await kv.get(`user:${user.id}`)
    if (!profile) {
      return c.json({ error: '프로필을 찾을 수 없음' }, 404)
    }
    
    const updatedProfile = {
      ...profile,
      diseases,
      allergies,
      notes,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`user:${user.id}`, updatedProfile)
    
    return c.json({ profile: updatedProfile })
  } catch (error) {
    console.log(`건강 정보 수정 중 오류: ${error}`)
    return c.json({ error: '건강 정보 수정 실패' }, 500)
  }
})

Deno.serve(app.fetch)