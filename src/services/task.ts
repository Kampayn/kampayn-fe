import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type { Result, ApiError } from '@/types/common'
import type { CreateTaskParams, CreateTaskResponse } from '@/types/task'

interface TaskService {
  post: (params: CreateTaskParams) => Promise<Result<CreateTaskResponse, string>>
}

const taskService: TaskService = {
  post: async (params: CreateTaskParams): Promise<Result<CreateTaskResponse, string>> => {
    try {
      const response = await api.post<CreateTaskResponse>('/tasks/submit', params)
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal membuat atau mengubah task'
      return { success: false, error: errorMessage }
    }
  },
}

export default taskService
