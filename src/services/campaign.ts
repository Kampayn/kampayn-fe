import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type { CreateParams, CreateResponse, GetParams, GetResponse } from '@/types/campaign'
import type { Result, ApiError } from '@/types/common'

interface CampaignService {
  post: (params: CreateParams) => Promise<Result<CreateResponse, string>>
  getAll: (params?: GetParams) => Promise<Result<GetResponse, string>>
  getMy: (params?: GetParams) => Promise<Result<GetResponse, string>>
  // getById: (id: string) => Promise<Result<GetResponse, string>>
}

const campaignService: CampaignService = {
  post: async (params: CreateParams): Promise<Result<CreateResponse, string>> => {
    try {
      const response = await api.post<CreateResponse>('/campaigns', params)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal membuat campaign'
      return { success: false, error: errorMessage }
    }
  },
  getAll: async (params?: GetParams): Promise<Result<GetResponse, string>> => {
    try {
      const response = await api.get<GetResponse>('/campaigns', { params })
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal mengambil campaign'
      return { success: false, error: errorMessage }
    }
  },
  getMy: async (params?: GetParams): Promise<Result<GetResponse, string>> => {
    try {
      const response = await api.get<GetResponse>('/campaigns/my', { params })
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal mengambil campaign'
      return { success: false, error: errorMessage }
    }
  },
}

export default campaignService
