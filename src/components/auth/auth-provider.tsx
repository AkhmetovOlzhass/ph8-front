"use client"

import { useState, useEffect, type ReactNode } from "react"
import { AuthContext, type User, authAPI } from "@/lib/auth"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token")
    const refreshToken = localStorage.getItem("refresh_token")
  
    async function init() {
      if (!accessToken && refreshToken) {
    
        try {
          const newTokens = await authAPI.refresh(refreshToken)
          
          localStorage.setItem("access_token", newTokens.accessToken)
          localStorage.setItem("refresh_token", newTokens.refreshToken)
  
          const profile = await authAPI.getProfile(newTokens.accessToken)
          setUser(profile)
        } catch {
          logout()
        } finally {
          setLoading(false)
        }
      } else if (accessToken) {
        try {
          const profile = await authAPI.getProfile(accessToken)
          setUser(profile)
        } catch (err) {
          if (refreshToken) {
            try {
              const newTokens = await authAPI.refresh(refreshToken)
              localStorage.setItem("access_token", newTokens.accessToken)
              localStorage.setItem("refresh_token", newTokens.refreshToken)
  
              const profile = await authAPI.getProfile(newTokens.accessToken)
              setUser(profile)
            } catch {
              logout()
            }
          } else {
            logout()
          }
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
  
    init()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const tokens = await authAPI.login(email, password)
      localStorage.setItem("access_token", tokens.accessToken)
      localStorage.setItem("refresh_token", tokens.refreshToken)

      const profile = await authAPI.getProfile(tokens.accessToken)
      setUser(profile)
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      await authAPI.register(email, password, name)
      const tokens = await authAPI.login(email, password)
      localStorage.setItem("access_token", tokens.accessToken)
      localStorage.setItem("refresh_token", tokens.refreshToken)

      const profile = await authAPI.getProfile(tokens.accessToken)
      
      setUser(profile)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}
