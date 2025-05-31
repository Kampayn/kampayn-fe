import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type { ApiError, LoginParams, LoginResponse } from '@/types/auth'

interface AuthService {
  login: (
    params: LoginParams,
  ) => Promise<{ data: LoginResponse | null; error: AxiosError<ApiError> | null }>
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
}

export default authService
