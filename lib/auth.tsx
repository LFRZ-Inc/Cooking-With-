'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_IN') {
        toast.success('Welcome back!')
      } else if (event === 'SIGNED_OUT') {
        toast.success('Signed out successfully!')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signUp = async (email: string, password: string, name: string, role: string = 'viewer') => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user && !data.session) {
        toast.success('Please check your email to confirm your account!')
      } else {
        toast.success('Account created successfully!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast.success('Signed in successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 