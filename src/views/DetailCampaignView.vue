<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Calculator, Calendar, CheckCircle, Notebook, NotebookPen, ReceiptText, XCircle } from 'lucide-vue-next'
import { useCampaignStore } from '@/stores/campaign'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'
import dayjs from 'dayjs'

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const router = useRouter()
const route = useRoute()
const campaignId = route.params.id as string

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const campaignStore = useCampaignStore()
const { isLoading, currentCampaign } = storeToRefs(campaignStore)

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
        <div class="flex flex-col gap-2">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ campaignInfo.title }}
          </h1>
          <p class="text-gray-600">
            {{ currentCampaign?.campaign_type }} • Created on
            {{ dayjs(currentCampaign?.createdAt).format('MMM DD, YYYY') }}
          </p>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-4">
            <NotebookPen class="text-gray-500" />
            <h2 class="text-lg font-semibold">Campaign Details</h2>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-500">Content Type</p>
              <p>{{ currentCampaign?.content_types.join(',') }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-500">Platform</p>
              <p>{{ currentCampaign?.platforms.join(',') }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-500">Influencer Tier</p>
              <div class="flex gap-2">
                <Badge
                  v-for="(item, index) in currentCampaign?.influencer_tiers"
                  :key="index"
                  variant="outline"
                >
                  {{ item }}
                </Badge>
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-500">Total Needed</p>
              <p>{{ currentCampaign?.influencers_needed }} Influencer</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-500">Timeline</p>
              <div class="flex items-center gap-1">
                <Calendar class="h-4 w-4 text-gray-500" />
                <p>
                  {{ dayjs(currentCampaign?.createdAt).format('DD MMM YYYY') }} -
                  {{ dayjs(currentCampaign?.updatedAt).format('DD MMM YYYY') }}
                </p>
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-500">Payment Method</p>
              <p>{{ currentCampaign?.payment_method }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-500">Status</p>
              <Badge
                :variant="
                  currentCampaign?.status === 'cancelled'
                    ? 'destructive'
                    : currentCampaign?.status === 'active'
                      ? 'default'
                      : 'secondary'
                "
                >{{ currentCampaign?.status }}</Badge
              >
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-500">Budget</p>
              <p>Rp. {{ currentCampaign?.budget }}</p>
            </div>
            <div v-if="currentCampaign?.brandUser" class="col-span-2 md:col-auto space-y-1">
              <div class="flex items-center gap-3 border px-4 py-2 w-full rounded-lg">
                <Avatar class="size-8">
                  <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div class="flex flex-col">
                  <span>{{ currentCampaign?.brandUser?.name }}</span>
                  <span class="text-sm text-gray-500">
                    {{ currentCampaign?.brandUser?.brandProfile.company }} •
                    {{ currentCampaign?.brandUser?.brandProfile.category }}
                  </span>
                </div>
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
        <CardTitle class="flex items-center gap-2 text-lg">
          <ReceiptText class="text-gray-500" />
          Campaign Brief
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div>
          <h3 class="font-semibold text-gray-900 mb-3">Product Story</h3>
          <p class="text-gray-700 leading-relaxed">{{ currentCampaign?.product_story }}</p>
        </div>
        <Separator />
        <div>
          <h3 class="font-semibold text-gray-900 mb-3">Key Message</h3>
          <p class="text-gray-700 leading-relaxed">{{ currentCampaign?.key_message }}</p>
        </div>
        <Separator />
        <div>
          <h3 class="font-semibold text-gray-900 mb-3">Campaign Guidelines</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div class="bg-green-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-3">
                <CheckCircle class="h-5 w-5 text-green-600" />
                <h3 class="font-semibold text-green-800">Do's</h3>
              </div>
              <ul class="space-y-2 text-gray-700 list-disc">
                <li v-for="(item, index) in currentCampaign?.content_dos" :key="index" class="ml-6">{{ item }}</li>
              </ul>
            </div>

            <div class="bg-red-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-3">
                <XCircle class="h-5 w-5 text-red-600" />
                <h3 class="font-semibold text-red-800">Don'ts</h3>
              </div>
              <ul class="space-y-2 text-gray-700 list-disc">
                <li v-for="(item, index) in currentCampaign?.content_donts" :key="index" class="ml-6">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- <div v-for="(section, index) in briefSections" :key="index">
          <h3 class="font-semibold text-gray-900 mb-3">{{ section.title }}</h3>

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
        </div> -->
      </CardContent>
    </Card>

    <!-- Review Task Section -->
    <KReviewTask v-if="user.role === 'brand'" :rows="rows" />

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

    <KAnalysis v-if="isCalculated && isFormValid" :roiValue="roiValue" :cacValue="cacValue" />

    <KApplyCard v-if="false" />

    <KAssigment v-if="false" />
  </main>

  <KFooter />
</template>
