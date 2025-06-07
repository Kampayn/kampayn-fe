<script setup lang="ts">
import { ref } from 'vue'
import {
  Users,
  Bookmark,
  Landmark,
  ShieldCheck,
  FileText,
  Calendar1,
  CalendarX,
  Loader2,
} from 'lucide-vue-next'
import dayjs from 'dayjs'

import { getCampaignTypeLabel, getPaymentMethodLabel, getPlatformIcon } from '@/utils/enumHelper'
import type { Campaign } from '@/types/campaign'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Props { 
  campaign: Campaign
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const emit = defineEmits<{
  (e: 'apply', campaign_id: string): void
}>()

const isSaved = ref(false)

const handleSave = () => {
  isSaved.value = !isSaved.value
}

const handleApply = () => {
  emit('apply', props.campaign.id)
}
</script>

<template>
  <Card class="w-full transition-shadow duration-200 hover:shadow-lg">
    <CardContent class="px-6">
      <div class="flex flex-col gap-6 lg:flex-row">
        <!-- Left Section - Main Info -->
        <div class="flex-1 space-y-4">
          <!-- Header -->
          <div class="flex gap-3 flex-row items-start justify-between">
            <div class="flex flex-col gap-0.5">
              <h3 class="line-clamp-2 text-xl font-semibold text-gray-900">
                {{ campaign.campaign_name }}
              </h3>
              <span class="text-sm text-muted-foreground">
                {{ getCampaignTypeLabel(campaign.campaign_type) }} • Created on
                {{ dayjs(campaign.createdAt).format('D MMM YYYY') }}
              </span>
            </div>

            <!-- Action Buttons -->
            <Button variant="ghost" size="sm" class="p-2" @click="handleSave">
              <Bookmark :size="16" :class="{ 'fill-current': isSaved }" />
            </Button>
          </div>

          <!-- Key Message -->
          <div class="space-y-2">
            <p class="line-clamp-2 leading-relaxed text-gray-700">
              {{ campaign.product_story }}
            </p>
          </div>

          <!-- Platforms -->
          <div class="flex flex-wrap gap-2">
            <Badge
              v-for="platform in campaign.platforms"
              :key="platform"
              variant="outline"
              class="text-sm"
            >
              {{ getPlatformIcon(platform) }}
              {{ platform.charAt(0).toUpperCase() + platform.slice(1) }}
            </Badge>
          </div>

          <!-- Budget -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold">
              Rp. {{ parseInt(campaign.budget) / campaign.influencers_needed }}
            </span>
            •
            <div class="flex items-center gap-1">
              <Landmark v-if="campaign.payment_method === 'bank_transfer'" />
              <ShieldCheck v-else />
              {{ getPaymentMethodLabel(campaign.payment_method) }}
            </div>
          </div>
        </div>

        <!-- Right Section - Stats & Actions -->
        <div class="space-y-4 lg:w-80">
          <!-- User Info -->
          <div class="rounded-lg bg-green-50 p-4">
            <div class="flex items-center gap-3">
              <Avatar class="h-12 w-12">
                <AvatarImage :src="campaign.brandUser?.brandProfile.photo_url || ''" />
                <AvatarFallback
                  class="bg-gradient-to-r from-blue-500 to-purple-600 text-lg text-white"
                >
                  {{ campaign.brandUser?.brandProfile.company.charAt(0) }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1">
                <p class="font-semibold">
                  {{ campaign.brandUser?.brandProfile.company }}
                </p>
                <p class="text-sm">
                  {{ campaign.brandUser?.brandProfile.category }}
                </p>
              </div>
            </div>
          </div>

          <!-- Campaign Details -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Users :size="16" class="text-gray-500" />
                <div>
                  <p class="text-xs text-gray-500">Influencers Needed</p>
                  <p class="font-semibold text-gray-900">0 / {{ campaign.influencers_needed }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <FileText :size="16" class="text-gray-500" />
                <div>
                  <p class="text-xs text-gray-500">Content Type</p>
                  <p
                    v-for="type in campaign.content_types"
                    :key="type"
                    class="text-sm font-semibold text-gray-900"
                  >
                    {{ type.charAt(0).toUpperCase() + type.slice(1) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Calendar1 :size="16" class="text-gray-500" />
                <div>
                  <p class="text-xs text-gray-500">Start Date</p>
                  <p class="font-semibold text-gray-900">
                    {{ dayjs(campaign.start_date).format('D MMM YYYY') }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <CalendarX :size="16" class="text-gray-500" />
                <div>
                  <p class="text-xs text-gray-500">End Date</p>
                  <p class="font-semibold text-gray-900">
                    {{ dayjs(campaign.end_date).format('D MMM YYYY') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button @click="handleApply" size="lg" class="w-full" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Applying...' : 'Apply for Campaign' }}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
