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
} from 'lucide-vue-next'

import type { Campaign } from '@/types/campaign'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Menggunakan defineProps untuk mendefinisikan props komponen
const props = defineProps<{
  campaign: Campaign
}>()

// Menggunakan defineEmits untuk mendefinisikan event yang akan di-emit
const emit = defineEmits<{
  (e: 'apply', campaignId: string): void
  (e: 'save', campaignId: string): void
}>()

// 2. State Management (Reaktivitas)
const isSaved = ref(false)

// 3. Helper Functions (Tetap sama, karena ini JavaScript murni)
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getCampaignTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    brand_awareness: 'Brand Awareness',
    product_launch: 'Product Launch',
    promo_sale: 'Promo & Sale',
  }
  return types[type] || type
}

const getPlatformIcon = (platform: string) => {
  const icons: Record<string, string> = {
    instagram: '📷',
    tiktok: '🎵',
    youtube: '📺',
  }
  return icons[platform] || '📱'
}

const getPaymentMethodLabel = (method: string) => {
  const methods: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    secure_payment: 'Secure Payment',
  }
  return methods[method] || method
}

// 4. Event Handlers
const handleSave = () => {
  isSaved.value = !isSaved.value
  emit('save', props.campaign.id)
}
</script>

<template>
  <Card class="w-full border border-gray-200 transition-shadow duration-200 hover:shadow-lg">
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
              <span class="text-sm text-gray-900">
                {{ getCampaignTypeLabel(campaign.campaign_type) }}
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
                    {{ formatDate(campaign.start_date) }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <CalendarX :size="16" class="text-gray-500" />
                <div>
                  <p class="text-xs text-gray-500">End Date</p>
                  <p class="font-semibold text-gray-900">
                    {{ formatDate(campaign.end_date) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            @click="$router.push({ name: 'detail', params: { id: campaign.id } })"
            size="lg"
            class="w-full"
          >
            Apply for Campaign
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
