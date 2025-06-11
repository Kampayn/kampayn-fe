import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type { Result, ApiError } from '@/types/common'
import type {
  CreateTaskParams,
  CreateTaskResponse,
  UpdateTaskParams,
  UpdateTaskResponse,
} from '@/types/task'

interface TaskService {
  post: (params: CreateTaskParams) => Promise<Result<CreateTaskResponse, string>>
  patch: (params: UpdateTaskParams) => Promise<Result<UpdateTaskResponse, string>>
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
  patch: async (params: UpdateTaskParams): Promise<Result<UpdateTaskResponse, string>> => {
    try {
      const response = await api.patch<UpdateTaskResponse>(`/tasks/${params.id}`, {
        status: params.status,
      })
      return { success: true, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || 'Gagal membuat atau mengubah task'
      return { success: false, error: errorMessage }
    }
  },
}

export default taskService
