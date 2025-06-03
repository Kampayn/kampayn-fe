import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type { UserResponse, UserRoleParams } from '@/types/user'
import type { Result, ApiError } from '@/types/common'

interface UserService {
  completeProfile: (params: UserRoleParams) => Promise<Result<UserResponse, string>>
  fetchProfile: () => Promise<Result<UserResponse, string>>
}

const userService: UserService = {
  completeProfile: async (params: UserRoleParams): Promise<Result<UserResponse, string>> => {
    try {
      const response = await api.post<UserResponse>('/users/complete-profile', params)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal melengkapi profil'
      return { success: false, error: errorMessage }
    }
  },

  fetchProfile: async (): Promise<Result<UserResponse, string>> => {
    try {
      const response = await api.get<UserResponse>('/users/me')
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal mengambil profil'
      return { success: false, error: errorMessage }
    }
  },
}

export default userService
