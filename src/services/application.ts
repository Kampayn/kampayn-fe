import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type { Result, ApiError } from '@/types/common'
import type { CreateApplicationResponse, DeleteApplicationResponse, GetApplicationResponse } from '@/types/application'

interface ApplicationService {
  post: (campaign_id: string) => Promise<Result<CreateApplicationResponse, string>>
  get: () => Promise<Result<GetApplicationResponse, string>>
  delete: (id: string) => Promise<Result<DeleteApplicationResponse, string>>
}

const applicationService: ApplicationService = {
  post: async (campaign_id: string): Promise<Result<CreateApplicationResponse, string>> => {
    try {
      const response = await api.post<CreateApplicationResponse>('/applications', { campaign_id })
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal membuat application'
      return { success: false, error: errorMessage }
    }
  },
  get: async (): Promise<Result<GetApplicationResponse, string>> => {
    try {
      const response = await api.get<GetApplicationResponse>('/my/applications')
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal mendapatkan application'
      return { success: false, error: errorMessage }
    }
  },
  delete: async (id: string): Promise<Result<DeleteApplicationResponse, string>> => {
    try {
      const response = await api.delete<DeleteApplicationResponse>(`/applications/${id}`)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal menghapus application'
      return { success: false, error: errorMessage }
    }
  }
}

export default applicationService
