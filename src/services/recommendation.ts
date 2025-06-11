import { AxiosError } from 'axios'

import { apiML } from '@/lib/axios'
import type { Result, ApiError } from '@/types/common'
import type { GetRecommendationParams, GetRecommendationResponse } from '@/types/recommendation'


interface RecommendationService {
    get: (params: GetRecommendationParams) => Promise<Result<GetRecommendationResponse, string>>
}

const recommendationService: RecommendationService = {
    get: async (params: GetRecommendationParams): Promise<Result<GetRecommendationResponse, string>> => {
        try {
          const response = await apiML.get<GetRecommendationResponse>('/recommend', { params })
          return { success: true, data: response.data }
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>
          const errorMessage = axiosError.response?.data?.message || 'Gagal mendapatkan rekomendasi'
          return { success: false, error: errorMessage }
        }
      },
}

export default recommendationService
