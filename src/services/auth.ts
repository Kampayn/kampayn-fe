import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type {
  ApiError,
  GoogleParams,
  GoogleResponse,
  LoginParams,
  LoginResponse,
  RegisterParams,
  RegisterResponse,
} from '@/types/auth'

interface AuthService {
  login: (
    params: LoginParams,
  ) => Promise<{ data: LoginResponse | null; error: AxiosError<ApiError> | null }>
  register: (
    params: RegisterParams,
  ) => Promise<{ data: RegisterResponse | null; error: AxiosError<ApiError> | null }>
  google: (
    params: GoogleParams,
  ) => Promise<{ data: GoogleResponse | null; error: AxiosError<ApiError> | null }>
}

const authService: AuthService = {
  login: async (params: LoginParams) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', params)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: error as AxiosError<ApiError> }
    }
  },
  register: async (params: RegisterParams) => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', params)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: error as AxiosError<ApiError> }
    }
  },
  google: async (params: GoogleParams) => {
    try {
      const response = await api.post<GoogleResponse>('/auth/google', params)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: error as AxiosError<ApiError> }
    }
  },
}

export default authService
