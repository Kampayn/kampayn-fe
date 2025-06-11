import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import recommendationService from '@/services/recommendation'
import type { GetRecommendationParams, Recommendations } from '@/types/recommendation'

export const useRecommendationStore = defineStore('recommendation', () => {
  const recommendations = ref<Recommendations | null>(null)
  const isLoading = ref(false)

  const combinedInfluencer = computed(() => {
    if (!recommendations.value) {
      return []
    }

    return recommendations.value.recommendations.map((influencer) => ({
      username: influencer.Username,
      followers: influencer.Followers,
      engagement_rate: influencer['Engagement Rate'],
      is_verified: false,
      categories: [influencer.Category],
      tier: influencer.Tier,
    }))
  })

  const get = async (params: GetRecommendationParams): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await recommendationService.get(params)
      if (!result.success) {
        toast.error(result.error)
        return false
      }

      console.log(result.data.recommendations)

      toast.success('Rekomendasi berhasil diambil')
      recommendations.value = result.data.recommendations
      return true
    } catch (error) {
      toast.error('Gagal mendapatkan rekomendasi')
      console.warn(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { recommendations, combinedInfluencer, isLoading, get }
})
