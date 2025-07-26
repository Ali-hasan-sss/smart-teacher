export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  image: string
  email: string
  phoneNumber: string
  birthdate: string
  gradeId: number
  password: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  birthdate: string
  image?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message: string }>
  logout: () => void
}
