import React, { createContext, useContext, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  age: number
  diseases: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string, age: number, diseases: string[]) => Promise<void>
  signOut: () => Promise<void>
  accessToken: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 모의 사용자 데이터
const mockUsers = [
  {
    id: 'user1',
    email: 'test@silvermode.com',
    password: 'password123',
    name: '홍길동',
    age: 72,
    diseases: ['diabetes', 'hypertension']
  },
  {
    id: 'user2',
    email: 'park@silvermode.com',
    password: 'password123',
    name: '박영희',
    age: 68,
    diseases: ['parkinson']
  }
]

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  async function signIn(email: string, password: string) {
    try {
      setIsLoading(true)
      
      // 모의 로그인 검증
      const mockUser = mockUsers.find(u => u.email === email && u.password === password)
      
      if (!mockUser) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
      }
      
      // 1초 지연으로 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userData = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        age: mockUser.age,
        diseases: mockUser.diseases
      }
      
      setUser(userData)
      setAccessToken('mock-access-token')
      
    } catch (error) {
      console.error('로그인 중 오류:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function signUp(email: string, password: string, name: string, age: number, diseases: string[]) {
    try {
      setIsLoading(true)
      
      // 이메일 중복 확인
      const existingUser = mockUsers.find(u => u.email === email)
      if (existingUser) {
        throw new Error('이미 사용 중인 이메일입니다')
      }
      
      // 1초 지연으로 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 새 사용자 생성
      const newUser = {
        id: `user${Date.now()}`,
        email,
        password,
        name,
        age,
        diseases
      }
      
      mockUsers.push(newUser)
      
      // 자동 로그인
      await signIn(email, password)
      
    } catch (error) {
      console.error('회원가입 중 오류:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function signOut() {
    try {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser(null)
      setAccessToken(null)
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    accessToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}