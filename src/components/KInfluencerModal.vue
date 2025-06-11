<!-- src/components/InfluencerModal.vue -->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import KInfluencerCard from '@/components/KInfluencerCard.vue'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCampaignStore } from '@/stores/campaign'
import { useRecommendationStore } from '@/stores/recommendation'

const recommendationStore = useRecommendationStore()
const { combinedInfluencer, isLoading } = storeToRefs(recommendationStore)

const campaignStore = useCampaignStore()
const { currentCampaign } = storeToRefs(campaignStore)

const category = computed(() => {
  switch (currentCampaign.value?.brandUser?.brandProfile.category) {
    case 'food':
      return 'Food'
    case 'beauty':
      return 'Beauty'
    case 'lifestyle':
      return 'Lifestyle'
    default:
      return 'Food'
  }
})

const influencerTier = computed(() => {
  switch (currentCampaign.value?.influencer_tiers[0]) {
    case 'micro':
      return 'Mikro'
    case 'macro':
      return 'Makro'
    case 'nano':
      return 'Nano'
    default:
      return 'Mikro'
  }
})

onMounted(async () => {
  await recommendationStore.get({
    business_information: category.value,
    sort_by: 'Engagement%20Rate',
    top_n: 12,
    tier: influencerTier.value,
  })
})
</script>

<template>
  <DialogContent class="max-h-[90vh] w-[1000px] sm:max-w-none overflow-y-auto">
    <DialogHeader>
      <DialogTitle class="text-2xl font-bold">Best For You</DialogTitle>
      <div class="text-sm text-muted-foreground">
        <template v-if="isLoading">
          <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </template>
        <template v-else> {{ combinedInfluencer?.length }} Influencers • Tier: {{ influencerTier }} </template>
      </div>
    </DialogHeader>

    <!-- Loading State -->
    <div v-if="isLoading" class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="n in 12" :key="n" class="border rounded-lg p-4 space-y-3 animate-pulse">
        <!-- Avatar skeleton -->
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <!-- Stats skeleton -->
        <div class="space-y-2">
          <div class="h-3 bg-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>

        <!-- Button skeleton -->
        <div class="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>

    <!-- Content State -->
    <div v-else class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <KInfluencerCard
        v-for="(influencer, index) in combinedInfluencer"
        :key="index"
        :influencer="influencer"
      />
    </div>
  </DialogContent>
</template>
