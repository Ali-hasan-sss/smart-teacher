"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType, RegisterRequest } from "@/types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email && password) {
        const mockUser: User = {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email,
          phoneNumber: "+1234567890",
          birthdate: "1990-01-01",
        }

        const mockToken = "mock-jwt-token"

        localStorage.setItem("accessToken", mockToken)
        localStorage.setItem("user", JSON.stringify(mockUser))

        setToken(mockToken)
        setUser(mockUser)

        return { success: true, message: "Login successful" }
      }

      return { success: false, message: "Invalid credentials" }
    } catch (error) {
      return { success: false, message: "Network error" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterRequest): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (userData.email && userData.password) {
        return { success: true, message: "Registration successful" }
      }

      return { success: false, message: "Registration failed" }
    } catch (error) {
      return { success: false, message: "Network error" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
