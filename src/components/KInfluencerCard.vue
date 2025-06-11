<!-- src/components/InfluencerCard.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Copy,
  RotateCcw,
  Instagram,
} from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { InfluencerCard } from '@/types/recommendation'
import type { Campaign } from '@/types/campaign'
import { toast } from 'vue-sonner'

interface Props {
  influencer: InfluencerCard
  campaign: Campaign
}

const props = defineProps<Props>()

const { copy, copied } = useClipboard()

const isFlipped = ref(false)
const showInstagramButton = ref(false)

const collaborationMessage = `Hi Kak @${props.influencer.username}! Tertarik kolaborasi dalam kampanye ${props.campaign.campaign_name}? Cek detailnya di platform Kampaiyn ya! \n https://kampayn.web.id/${props.campaign.id}`

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

function handleBookingClick() {
  isFlipped.value = true
}

function handleBackClick() {
  isFlipped.value = false
}

function copyMessage() {
  copy(collaborationMessage)
}

function openInstagram() {
  window.open(`https://ig.me/m/${props.influencer.username}`, '_blank')
}

watch(copied, (value) => {
  if (value) {
    toast.success('Success copied text')
    // Show Instagram button after 1 second
    setTimeout(() => {
      showInstagramButton.value = true
    }, 1000)
  }
})
</script>

<template>
  <div class="relative h-[248px] perspective-1000">
    <!-- Card Container with 3D Transform -->
    <div
      class="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d"
      :class="{ 'rotate-y-180': isFlipped }"
    >
      <!-- Front Side -->
      <div
        class="absolute inset-0 backface-hidden flex flex-col rounded-lg border bg-white p-4 shadow-sm"
      >
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

        <div
          v-if="influencer.is_verified"
          class="mt-1 flex items-center text-sm text-muted-foreground"
        >
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

        <Button class="mt-4 w-full" @click="handleBookingClick"> Booking Influencer </Button>
      </div>

      <!-- Back Side -->
      <div
        class="absolute inset-0 backface-hidden rotate-y-180 flex flex-col rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50 p-4 shadow-sm"
      >
        <div class="flex items-center justify-between mb-1">
          <h3 class="text-lg font-semibold text-gray-800">Collaboration Message</h3>
          <Button variant="ghost" size="sm" @click="handleBackClick">
            <RotateCcw class="size-3" />
          </Button>
        </div>

        <div class="flex-1 flex flex-col justify-center overflow-hidden">
          <div
            class="bg-white rounded-lg px-2 py-1 max-h-[124px] border border-gray-200 mb-4 overflow-y-auto"
          >
            <p class="text-sm text-gray-700 leading-relaxed">
              {{ collaborationMessage }}
            </p>
          </div>

          <Button
            v-if="!showInstagramButton"
            @click="copyMessage"
            class="w-full"
            :class="{ 'bg-green-600 hover:bg-green-700': copied }"
          >
            <Copy class="size-4 mr-1" />
            {{ copied ? 'Copied!' : 'Copy Message' }}
          </Button>

          <Button v-else @click="openInstagram" class="w-full" variant="outline">
            <Instagram class="size-4 mr-1" />
            Open Instagram
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
