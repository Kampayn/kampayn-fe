import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CreateParams } from '@/types/campaign'
import campaignService from '@/services/campaign'
import { toast } from 'vue-sonner'

export const useCampaignStore = defineStore('campaign', () => {
  const campaign = ref(null)
  const isLoading = ref(false)

  const create = async (params: CreateParams): Promise<boolean> => {
    isLoading.value = true

    try {
      const result = await campaignService.post(params)
      if (!result.success) {
        toast.error(result.error)
        return false
      }

      toast.success(result.data.message)
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat membuat campaign')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { campaign, isLoading, create }
})
