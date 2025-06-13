import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type { InfluencerResponse, UserResponse, UserRoleParams } from '@/types/user'
import type { Result, ApiError } from '@/types/common'

interface UserService {
  completeProfile: (params: UserRoleParams) => Promise<Result<UserResponse, string>>
  getInfluencerData: (username: string) => Promise<Result<InfluencerResponse, string>>
  fetchProfile: () => Promise<Result<UserResponse, string>>
  fetchOtherProfile: (uid: string) => Promise<Result<UserResponse, string>>
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
  getInfluencerData: async (username: string): Promise<Result<InfluencerResponse, string>> => {
    try {
      const response = await api.get<InfluencerResponse>(`/influencer/${username}`)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal mengambil data influencer'
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
  fetchOtherProfile: async (uid: string): Promise<Result<UserResponse, string>> => {
    try {
      const response = await api.get<UserResponse>(`/users/${uid}`)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal mengambil profil'
      return { success: false, error: errorMessage }
    }
  },
}

export default userService
