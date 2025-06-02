import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type { CreateParams, CreateResponse } from '@/types/campaign'
import type { Result, ApiError } from '@/types/common'

interface CampaignService {
  post: (params: CreateParams) => Promise<Result<CreateResponse, string>>
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
}

export default campaignService
