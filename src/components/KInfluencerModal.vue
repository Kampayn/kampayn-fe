<!-- src/components/InfluencerModal.vue -->
<script setup lang="ts">
import KInfluencerCard from '@/components/KInfluencerCard.vue'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRecommendationStore } from '@/stores/recommendation'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const recommendationStore = useRecommendationStore()
const { combinedInfluencer, isLoading } = storeToRefs(recommendationStore)

onMounted(async () => {
  await recommendationStore.get({
    business_information: 'Food',
    sort_by: 'Engagement%20Rate',
    top_n: 12,
    tier: 'Makro',
  })
})
</script>

<template>
  <DialogContent class="max-h-[90vh] w-[1000px] sm:max-w-none overflow-y-auto">
    <DialogHeader>
      <DialogTitle class="text-2xl font-bold">Best For You</DialogTitle>
      <div class="text-sm text-muted-foreground">
        {{ combinedInfluencer?.length }} Influencers • Tier: Makro
      </div>
    </DialogHeader>
    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <KInfluencerCard
        v-for="(influencer, index) in combinedInfluencer"
        :key="index"
        :influencer="influencer"
      />
    </div>
  </DialogContent>
</template>
