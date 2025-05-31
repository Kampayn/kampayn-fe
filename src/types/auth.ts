import type { User } from '@/types/user'

export interface LoginParams {
  email: string
  password: string
  idToken: string
}

export interface LoginResponse {
  statusCode: number
  error?: string
  message: string
  data?: {
    user: User
    access_token: string
    refresh_token: string
  }
}

export interface AuthResponse {
  Success: boolean
  Message: string
  Errors: null | string[]
  Data: {
    user: User
    access_token: string
    refresh_token: string
  }
}

export interface ProfileResponse {
  Success: boolean
  Message: string
  Errors: null | string[]
  Data: User
}

export interface ApiError {
  message: string
  statusCode?: number
}
