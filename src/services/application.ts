import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type { Result, ApiError } from '@/types/common'
import type { ApplicationResponse } from '@/types/application'

interface ApplicationService {
  post: (campaign_id: string) => Promise<Result<ApplicationResponse, string>>
}

const applicationService: ApplicationService = {
  post: async (campaign_id: string): Promise<Result<ApplicationResponse, string>> => {
    try {
      const response = await api.post<ApplicationResponse>('/applications', { campaign_id })
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal membuat application'
      return { success: false, error: errorMessage }
    }
  },
}

export default applicationService
