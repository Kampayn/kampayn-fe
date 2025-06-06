import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Campaign, CreateParams } from '@/types/campaign'
import campaignService from '@/services/campaign'
import { toast } from 'vue-sonner'

export const useCampaignStore = defineStore('campaign', () => {
  const campaigns = ref<Campaign[]>([])
  const currentCampaign = ref<Campaign | null>(null)
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

  const get = async (isBrand: boolean): Promise<void> => {
    isLoading.value = true
    try {
      let result

      if (isBrand) {
        result = await campaignService.getMy()
      } else {
        result = await campaignService.getAll({ status: 'active' })
      }

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

  const getById = async (
    id: string,
    forRole: 'brand' | 'influencer' = 'brand',
  ): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await campaignService.getById(id, forRole)
      if (!result.success) {
        toast.error(result.error)
        return false
      }

      console.log('response campaign', result.data.data.campaign)
      currentCampaign.value = result.data.data.campaign

      toast.success(result.data.message)
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengambil detail campaign')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const update = async (id: string, params: CreateParams): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await campaignService.put(id, params)
      if (!result.success) {
        toast.error(result.error)
        return false
      }
      toast.success(result.data.message)
      // // Update campaign in the list if it exists
      // const index = campaigns.value.findIndex(c => c.id === id)
      // if (index !== -1) {
      //   // Refresh the campaigns list
      //   await get(true)
      // }
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengupdate campaign')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const deleteCampaign = async (id: string): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await campaignService.delete(id)
      if (!result.success) {
        toast.error(result.error)
        return false
      }
      toast.success(result.data.message)
      // Remove campaign from the list
      campaigns.value = campaigns.value.filter((c) => c.id !== id)
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus campaign')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    campaigns,
    currentCampaign,
    isLoading,
    create,
    get,
    getById,
    update,
    deleteCampaign,
  }
})
