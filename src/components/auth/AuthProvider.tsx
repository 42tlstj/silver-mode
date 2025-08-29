import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from '../../utils/supabase/info'

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

const supabaseUrl = `https://${projectId}.supabase.co`
const supabase = createClient(supabaseUrl, publicAnonKey)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (session?.access_token) {
        setAccessToken(session.access_token)
        await fetchUserProfile(session.access_token)
      }
    } catch (error) {
      console.error('세션 확인 중 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchUserProfile(token: string) {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6dba5bdd/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const { profile } = await response.json()
        setUser(profile)
      }
    } catch (error) {
      console.error('프로필 조회 중 오류:', error)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setIsLoading(true)
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      if (session?.access_token) {
        setAccessToken(session.access_token)
        await fetchUserProfile(session.access_token)
      }
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
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6dba5bdd/signup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, age, diseases })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '회원가입 실패')
      }
      
      // 회원가입 후 자동 로그인
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
      await supabase.auth.signOut()
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