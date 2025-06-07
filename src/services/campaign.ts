import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type {
  CampaignResponse,
  CreateParams,
  CreateResponse,
  GetCampaignApplicationsResponse,
  GetParams,
  GetResponse,
} from '@/types/campaign'
import type { Result, ApiError } from '@/types/common'

interface CampaignService {
  post: (params: CreateParams) => Promise<Result<CreateResponse, string>>
  getAll: (params?: GetParams) => Promise<Result<GetResponse, string>>
  getMy: (params?: GetParams) => Promise<Result<GetResponse, string>>
  getById: (
    id: string,
    for_role: 'brand' | 'influencer',
  ) => Promise<Result<CampaignResponse, string>>
  getApplications: (id: string) => Promise<Result<GetCampaignApplicationsResponse, string>>
  put: (id: string, params: CreateParams) => Promise<Result<CreateResponse, string>>
  delete: (id: string) => Promise<Result<CreateResponse, string>>
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
  getById: async (
    id: string,
    for_role: 'brand' | 'influencer',
  ): Promise<Result<CampaignResponse, string>> => {
    try {
      const response = await api.get<CampaignResponse>(`/campaigns/${id}?for_role=${for_role}`)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal mengambil campaign'
      return { success: false, error: errorMessage }
    }
  },
  getApplications: async (id: string): Promise<Result<GetCampaignApplicationsResponse, string>> => {
    try {
      const response = await api.get<GetCampaignApplicationsResponse>(`/campaigns/${id}/applications`)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal mengambil campaign'
      return { success: false, error: errorMessage }
    }
  },
  put: async (id: string, params: CreateParams): Promise<Result<CreateResponse, string>> => {
    try {
      const response = await api.put<CreateResponse>(`/campaigns/${id}`, params)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal mengubah campaign'
      return { success: false, error: errorMessage }
    }
  },
  delete: async (id: string): Promise<Result<CreateResponse, string>> => {
    try {
      const response = await api.delete<CreateResponse>(`/campaigns/${id}`)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal menghapus campaign'
      return { success: false, error: errorMessage }
    }
  },
}

export default campaignService
