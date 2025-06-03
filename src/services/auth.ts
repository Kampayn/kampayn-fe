import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type {
  GoogleParams,
  LoginParams,
  LoginResponse,
  RefreshTokenResponse,
  RegisterParams,
  RegisterResponse,
} from '@/types/auth'
import type { Result, ApiError } from '@/types/common'

interface AuthService {
  login: (params: LoginParams) => Promise<Result<LoginResponse, string>>
  register: (params: RegisterParams) => Promise<Result<RegisterResponse, string>>
  google: (params: GoogleParams) => Promise<Result<LoginResponse, string>>
  refreshToken: (refreshToken: string) => Promise<Result<RefreshTokenResponse, string>>
}

const authService: AuthService = {
  login: async (params: LoginParams): Promise<Result<LoginResponse, string>> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', params)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Login gagal'
      return { success: false, error: errorMessage }
    }
  },
  register: async (params: RegisterParams): Promise<Result<RegisterResponse, string>> => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', params)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Registrasi gagal'
      return { success: false, error: errorMessage }
    }
  },
  google: async (params: GoogleParams): Promise<Result<LoginResponse, string>> => {
    try {
      const response = await api.post<LoginResponse>('/auth/google', params)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Login dengan Google gagal'
      return { success: false, error: errorMessage }
    }
  },
  refreshToken: async (refreshToken: string): Promise<Result<RefreshTokenResponse, string>> => {
    try {
      const response = await api.post<RefreshTokenResponse>('/auth/refresh-token', { refreshToken })
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Refresh token gagal'
      return { success: false, error: errorMessage }
    }
  },
}

export default authService
