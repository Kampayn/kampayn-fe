import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Campaign, CreateParams } from '@/types/campaign'
import campaignService from '@/services/campaign'
import { toast } from 'vue-sonner'

export const useCampaignStore = defineStore('campaign', () => {
  const campaigns = ref<Campaign[]>([])
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

  const get = async (): Promise<void> => {
    isLoading.value = true
    try {
      const result = await campaignService.get()
      if (!result.success) {
        toast.error(result.error)
        return
      }
      campaigns.value = result.data.data.campaigns
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengambil campaign')
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  return { campaigns, isLoading, create, get }
})
