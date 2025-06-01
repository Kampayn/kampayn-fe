import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import type { ApiError, UserResponse, UserRoleParams } from '@/types/user'

interface UserService {
  completeProfile: (
    params: UserRoleParams,
  ) => Promise<{ data: UserResponse | null; error: AxiosError<ApiError> | null }>
}

const userService: UserService = {
  completeProfile: async (params: UserRoleParams) => {
    try {
      const response = await api.post<UserResponse>('/users/complete-profile', params)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: error as AxiosError<ApiError> }
    }
  },
}

export default userService
