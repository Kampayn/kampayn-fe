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
    accessToken: string
    refreshToken: string
  }
}

export interface RegisterParams {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  statusCode: number
  error?: string
  message: string
  data?: {
    user: User
  }
}

export interface GoogleParams {
  idToken: string
}

export interface RefreshTokenResponse {
  message: string
  data: {
    accessToken: string
    refreshToken: string
  }
}