<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Calculator,
} from 'lucide-vue-next'
import { useCampaignStore } from '@/stores/campaign'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'

import KFooter from '@/components/KFooter.vue'
import KHeader from '@/components/KHeader.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useUserStore } from '@/stores/user'
import KAssigment from '@/components/KAssigment.vue'
import KApplyCard from '@/components/KApplyCard.vue'
import KAnalysis from '@/components/KAnalysisResult.vue'
import type { ReviewRow } from '@/types/review'
import KReviewTask from '@/components/KReviewTask.vue'

const router = useRouter()
const route = useRoute()
const campaignId = route.params.id as string

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const campaignStore = useCampaignStore()
// const { isLoading, currentCampaign } = storeToRefs(campaignStore)

// Types

interface CampaignInfo {
  title: string
  brand: string
  type: string
  platform: string
  influencerTier: string
  totalInfluencers: string
  timeline: string
  tags: string[]
}

// Campaign data
const campaignInfo: CampaignInfo = {
  title: 'New Arrival! Limited Stock, Jangan Sampai Ketinggalan',
  brand: 'Rinrain Store',
  type: 'Product Launch',
  platform: 'Instagram',
  influencerTier: 'Nano, Mikro',
  totalInfluencers: '50 Influencer',
  timeline: '20 - 30 June 2024',
  tags: ['Food', 'Healthy'],
}

const briefSections = [
  {
    title: 'Product Story',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    title: 'Key Message',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    ],
  },
  {
    title: "Do's & Dont's",
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    ],
  },
]

// Review data
const rows = ref<ReviewRow[]>([
  {
    id: 1,
    influencer: 'Keysha Moe',
    preview: 'Link GDrive',
    status: 'Pending Review',
    statusType: 'pending',
  },
  {
    id: 2,
    influencer: 'Keysha Moe',
    preview: 'Link GDrive',
    status: 'Approved',
    statusType: 'approved',
  },
  {
    id: 3,
    influencer: 'Keysha Moe',
    preview: 'Link GDrive',
    status: 'Approved',
    statusType: 'approved',
  },
])

// Form data
const totalProfit = ref('')
const totalCustomer = ref('')
const totalCost = ref('')
const isCalculated = ref(false)

// Validation
const isFormValid = computed(() => {
  return totalProfit.value && totalCustomer.value && totalCost.value
})

// ROI Calculation
const roiValue = computed(() => {
  const profit = parseFloat(totalProfit.value) || 0
  const cost = parseFloat(totalCost.value) || 0
  if (cost === 0) return 0
  return (profit / cost) * 100
})

// CAC Calculation
const cacValue = computed(() => {
  const cost = parseFloat(totalCost.value) || 0
  const customers = parseInt(totalCustomer.value) || 0
  if (customers === 0) return 0
  return cost / customers
})

// Methods
const handleCalculate = () => {
  if (isFormValid.value) {
    isCalculated.value = true
  }
}

// Watch for form changes to reset calculation
watch([totalProfit, totalCustomer, totalCost], () => {
  if (isCalculated.value) {
    isCalculated.value = false
  }
})

watch(user, async (value) => {
  const isSuccess = await campaignStore.getById(campaignId, value.role)
  if (!isSuccess) {
    toast.error('Campaign tidak ditemukan')
    router.push('/dashboard')
  }
})

// Load campaign data on mount
onMounted(async () => {
  const isSuccess = await campaignStore.getById(campaignId, user.value.role)
  if (!isSuccess) {
    toast.error('Campaign tidak ditemukan')
    router.push('/dashboard')
  }
})
</script>

<template>
  <KHeader variant="outline" />

  <main class="flex-1 container mx-auto px-4 py-8 mt-[72px] max-w-7xl">
    <!-- Header & Back Button -->
    <div class="mb-8 flex items-start md:items-center gap-4">
      <RouterLink
        to="/dashboard"
        class="mt-1 text-gray-600 hover:text-gray-900 transition-colors flex items-center"
      >
        <ArrowLeft class="h-5 w-5" />
        <span class="sr-only">Back to campaigns</span>
      </RouterLink>
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
        {{ campaignInfo.title }}
      </h1>
    </div>

    <!-- Campaign Info Section -->
    <div class="grid gap-8 lg:grid-cols-2">
      <!-- Campaign Image Placeholder -->
      <div
        class="lg:order-2 aspect-video w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center"
      >
        <div class="text-center text-gray-500">
          <div class="text-4xl mb-2">🖼️</div>
          <p class="text-sm">Campaign Image</p>
        </div>
      </div>

      <!-- Campaign Details -->
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold mb-4">Campaign Details</h2>
          <div class="space-y-3">
            <div class="space-x-3">
              <span class="font-medium text-gray-700">Tipe Kampanye :</span>
              <span class="text-gray-900">{{ campaignInfo.type }}</span>
            </div>
            <div class="space-x-3">
              <span class="font-medium text-gray-700">Platform :</span>
              <span class="text-gray-900">{{ campaignInfo.platform }}</span>
            </div>
            <div class="space-x-3">
              <span class="font-medium text-gray-700">Influencer Tier :</span>
              <span class="text-gray-900">{{ campaignInfo.influencerTier }}</span>
            </div>
            <div class="space-x-3">
              <span class="font-medium text-gray-700">Total Needed :</span>
              <span class="text-gray-900">{{ campaignInfo.totalInfluencers }}</span>
            </div>
            <div class="space-x-3">
              <span class="font-medium text-gray-700">Timeline :</span>
              <span class="text-gray-900">{{ campaignInfo.timeline }}</span>
            </div>
            <div class="space-x-3">
              <span class="font-medium text-gray-700">Anggaran :</span>
              <span class="text-gray-900">Rp. 1.000.000,00</span>
            </div>
            <div class="flex space-x-3">
              <span class="font-medium text-gray-700">Kategori :</span>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="tag in campaignInfo.tags"
                  :key="tag"
                  variant="secondary"
                  class="bg-green-50 text-green-800 hover:bg-green-100"
                >
                  {{ tag }}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Separator class="my-8" />

    <!-- Brief Section -->
    <Card class="mb-8 grid-cols-3">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span>📋</span>
          Campaign Brief
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div v-for="(section, index) in briefSections" :key="index">
          <h3 class="font-semibold text-gray-900 mb-3">{{ section.title }}</h3>

          <!-- Handle different content types -->
          <div v-if="Array.isArray(section.content)" class="space-y-2">
            <ul
              v-if="section.title === 'Key Message'"
              class="list-disc list-inside text-gray-700 space-y-1"
            >
              <li v-for="(item, idx) in section.content" :key="idx">{{ item }}</li>
            </ul>
            <div v-else class="space-y-3">
              <p
                v-for="(item, idx) in section.content"
                :key="idx"
                class="text-gray-700 leading-relaxed"
              >
                {{ item }}
              </p>
            </div>
          </div>
          <p v-else class="text-gray-700 leading-relaxed">{{ section.content }}</p>

          <Separator v-if="index < briefSections.length - 1" class="mt-6" />
        </div>
      </CardContent>
    </Card>

    <!-- Review Task Section -->
    <KReviewTask v-if="user.role === 'brand'" :rows="rows"/>

    <!-- Campaign Analysis Form -->
    <Card class="mb-8" v-if="false">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Calculator class="h-5 w-5" />
          Campaign Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Total Profit -->
          <div class="space-y-2">
            <label for="total-profit" class="text-sm font-medium text-gray-700">
              Total Profit
            </label>
            <div class="flex">
              <div
                class="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0 border-gray-300"
              >
                <span class="text-gray-500 text-sm">Rp</span>
              </div>
              <Input
                id="total-profit"
                v-model="totalProfit"
                placeholder="0"
                class="rounded-l-none"
                type="number"
              />
            </div>
          </div>

          <!-- Total Customer -->
          <div class="space-y-2">
            <label for="total-customer" class="text-sm font-medium text-gray-700">
              Total Customer
            </label>
            <Input id="total-customer" v-model="totalCustomer" placeholder="0" type="number" />
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <Button
            @click="handleCalculate"
            :disabled="!isFormValid"
            class="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Calculator class="h-4 w-4 mr-2" />
            Calculate Analysis
          </Button>
        </div>
      </CardContent>
    </Card>

    <KAnalysis v-if="isCalculated && isFormValid" :roiValue="roiValue" :cacValue="cacValue"/>

    <KApplyCard v-if="false" />

    <KAssigment v-if="false" />
  </main>

  <KFooter />
</template>
