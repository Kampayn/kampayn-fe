import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import taskService from '@/services/task'
import type { CreateTaskParams } from '@/types/task'

export const useTaskStore = defineStore('task', () => {
  const isLoading = ref(false)

  const createOrUpdateTask = async (params: CreateTaskParams): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await taskService.post(params)
      if (!result.success) {
        toast.error(result.error)
        return false
      }

      toast.success(result.data.message)
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat membuat atau memperbarui task')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, createOrUpdateTask }
})
