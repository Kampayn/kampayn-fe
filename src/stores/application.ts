import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import applicationService from '@/services/application'
import type { Application } from '@/types/application'

export const useApplicationStore = defineStore('application', () => {
  const applications = ref<Application[]>([])
  const isLoading = ref(false)

  const apply = async (campaign_id: string): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await applicationService.post(campaign_id)
      if (!result.success) {
        toast.error(result.error)
        return false
      }
      toast.success(result.data.message)
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengajukan campaign')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const get = async (): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await applicationService.get()
      if (!result.success) {
        toast.error(result.error)
        return false
      }

      console.log(result.data.data.application)

      toast.success(result.data.message)
      applications.value = result.data.data.application
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengambil application')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const cancel = async (id: string): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await applicationService.delete(id)
      if (!result.success) {
        toast.error(result.error)
        return false
      }

      toast.success(result.data.message)
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat membatalkan application')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { applications, isLoading, apply, get, cancel }
})
