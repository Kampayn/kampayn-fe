<!-- src/components/InfluencerCard.vue -->
<script setup lang="ts">
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-vue-next'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { InfluencerCard } from '@/types/recommendation'

interface Props {
  influencer: InfluencerCard
}

defineProps<Props>()

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    // Remove .0 if it exists (e.g., 1.0M -> 1M)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}
</script>

<template>
  <div class="flex flex-col rounded-lg border bg-white p-4 shadow-sm">
    <div class="flex items-center gap-3">
      <Avatar class="h-16 w-16">
        <AvatarFallback class="bg-green-100 font-medium text-green-500">
          {{ influencer.username.substring(0, 2).toUpperCase() }}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 class="text-lg font-medium">{{ influencer.username }}</h3>
        <p class="text-sm text-muted-foreground">
          {{ formatNumber(influencer.followers) }} Followers
        </p>
      </div>
    </div>

    <div class="mt-4 flex items-center">
      <TrendingUp class="size-4 text-primary" />
      <span class="ml-1 text-sm font-medium"
        >{{ influencer.engagement_rate.toFixed(2) }}% Engagement Rates</span
      >
    </div>

    <div v-if="influencer.is_verified" class="mt-1 flex items-center text-sm text-muted-foreground">
      <CheckCircle class="mr-1 size-3 text-primary" />
      <span>Kampayn Verified</span>
    </div>
    <div v-else class="mt-1 flex items-center text-sm text-muted-foreground">
      <AlertCircle class="mr-1 size-3" />
      <span>Not yet joining Kampayn</span>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <Badge v-for="category in influencer.categories" :key="category" variant="outline">
        {{ category }}
      </Badge>
    </div>

    <Button class="mt-4 w-full"> Booking Influencer </Button>
  </div>
</template>
