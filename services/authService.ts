import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from "@/types/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-api-domain.com"

class AuthService {
  private async makeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>("/api/Client/Account/Login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.makeRequest<RegisterResponse>("/api/Client/Account/Register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem("accessToken", token)
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("accessToken")
  }

  removeToken(): void {
    localStorage.removeItem("accessToken")
  }

  // User data management
  setUser(user: any): void {
    localStorage.setItem("user", JSON.stringify(user))
  }

  getUser(): any | null {
    if (typeof window === "undefined") return null
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  }

  removeUser(): void {
    localStorage.removeItem("user")
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
