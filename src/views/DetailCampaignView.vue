<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import KFooter from '@/components/KFooter.vue'
import KHeader from '@/components/KHeader.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, ExternalLink, Calculator, TrendingUp, Users } from 'lucide-vue-next'

// Types
interface ReviewRow {
  id: number
  influencer: string
  preview: string
  status: string
  statusType: 'pending' | 'approved' | 'revision'
  comment: string
}

interface AnalysisResult {
  label: string
  desc: string
  color: string
}

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
    comment: '',
  },
  {
    id: 2,
    influencer: 'Keysha Moe',
    preview: 'Link GDrive',
    status: 'Approved',
    statusType: 'approved',
    comment: 'Bagus sekali. Saya suka.\nSilahkan di upload',
  },
  {
    id: 3,
    influencer: 'Keysha Moe',
    preview: 'Link GDrive',
    status: 'Needs Revision',
    statusType: 'revision',
    comment: 'Tolong ganti hashtag-nya\njadi #RimrainJaya',
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

const roiResult = computed((): AnalysisResult => {
  const roi = roiValue.value

  const roiCategories = [
    {
      min: 100,
      label: '🚀 Sangat Menguntungkan',
      desc: 'Pertahankan strategi campaign ini! Pertimbangkan untuk meningkatkan skala campaign atau menjadikannya strategi utama.',
      color: 'text-green-600',
    },
    {
      min: 50,
      label: '🟢 Menguntungkan',
      desc: 'Campaign berjalan baik. Evaluasi elemen terbaik (influencer, konten, platform) dan replikasi ke campaign berikutnya.',
      color: 'text-green-600',
    },
    {
      min: 20,
      label: '🟡 Cukup Baik',
      desc: 'Masih menguntungkan, tapi ada ruang untuk optimasi. Coba review pemilihan influencer, waktu posting, atau copywriting konten.',
      color: 'text-yellow-500',
    },
    {
      min: 5,
      label: '🟠 Kurang Efisien',
      desc: 'Efektivitas rendah. Mungkin biaya terlalu tinggi atau hasilnya kurang kuat. Lakukan A/B testing konten atau nego ulang harga dengan influencer.',
      color: 'text-orange-500',
    },
    {
      min: 0,
      label: '🔴 Hampir Rugi',
      desc: 'Campaign nyaris tidak memberikan hasil. Identifikasi titik lemah: targeting audiens, jenis konten, atau kanal distribusi.',
      color: 'text-red-500',
    },
    {
      min: -Infinity,
      label: '❌ Merugi',
      desc: 'Campaign gagal secara finansial. Hindari pola yang sama, evaluasi seluruh eksekusi mulai dari konsep, biaya, hingga pemilihan influencer.',
      color: 'text-red-700',
    },
  ]

  return (
    roiCategories.find((category) => roi >= category.min) || roiCategories[roiCategories.length - 1]
  )
})

// CAC Calculation
const cacValue = computed(() => {
  const cost = parseFloat(totalCost.value) || 0
  const customers = parseInt(totalCustomer.value) || 0
  if (customers === 0) return 0
  return cost / customers
})

const cacResult = computed((): AnalysisResult => {
  const cac = cacValue.value

  const cacCategories = [
    {
      max: 10000,
      label: '🚀 Sangat Efisien',
      desc: 'Biaya per akuisisi sangat rendah. Strategi campaign sangat efektif! Pertimbangkan untuk men-scale atau memperpanjang campaign.',
      color: 'text-green-600',
    },
    {
      max: 30000,
      label: '🟢 Efisien',
      desc: 'Biaya akuisisi masih dalam batas efisien. Pertahankan pendekatan saat ini, evaluasi elemen terbaik untuk diperkuat.',
      color: 'text-green-600',
    },
    {
      max: 60000,
      label: '🟡 Cukup Efisien',
      desc: 'Masih layak, tetapi pertimbangkan untuk menekan biaya (misalnya dengan nego influencer atau efisiensi konten iklan).',
      color: 'text-yellow-500',
    },
    {
      max: 100000,
      label: '🟠 Kurang Efisien',
      desc: 'Biaya akuisisi cukup tinggi. Tinjau ulang target audiens, efektivitas konten, dan conversion funnel.',
      color: 'text-orange-500',
    },
    {
      max: Infinity,
      label: '🔴 Tidak Efisien',
      desc: 'Biaya per pelanggan sangat tinggi. Campaign perlu dievaluasi menyeluruh. Coba strategi baru: targeting lebih sempit, influencer mikro, atau pendekatan lain.',
      color: 'text-red-700',
    },
  ]

  return (
    cacCategories.find((category) => cac < category.max) || cacCategories[cacCategories.length - 1]
  )
})

// Methods
const handleCalculate = () => {
  if (isFormValid.value) {
    isCalculated.value = true
  }
}

const getStatusBadgeVariant = (statusType: string) => {
  switch (statusType) {
    case 'pending':
      return 'outline'
    case 'approved':
      return 'default'
    case 'revision':
      return 'destructive'
    default:
      return 'outline'
  }
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value)
}

// Watch for form changes to reset calculation
watch([totalProfit, totalCustomer, totalCost], () => {
  if (isCalculated.value) {
    isCalculated.value = false
  }
})
</script>

<template>
  <KHeader />

  <main class="flex-1 container mx-auto px-4 py-8 mt-[72px] max-w-7xl">
    <!-- Header & Back Button -->
    <div class="mb-8 flex items-start md:items-center gap-4">
      <RouterLink
        to="/campaigns"
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
    <Card class="mb-8">
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
    <Card class="mb-8">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Users class="h-5 w-5" />
          Review Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 font-medium text-gray-600">No</th>
                <th class="text-left py-3 px-4 font-medium text-gray-600">Influencer</th>
                <th class="text-left py-3 px-4 font-medium text-gray-600">Preview</th>
                <th class="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th class="text-left py-3 px-4 font-medium text-gray-600">Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in rows"
                :key="row.id"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="py-4 px-4 text-sm">{{ index + 1 }}</td>
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-medium"
                    >
                      {{
                        row.influencer
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                      }}
                    </div>
                    <span class="font-medium text-gray-900">{{ row.influencer }}</span>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <a
                    href="#"
                    class="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                  >
                    {{ row.preview }}
                    <ExternalLink class="h-3 w-3" />
                  </a>
                </td>
                <td class="py-4 px-4">
                  <Badge :variant="getStatusBadgeVariant(row.statusType)">
                    {{ row.status }}
                  </Badge>
                </td>
                <td class="py-4 px-4">
                  <Button v-if="row.statusType === 'pending'" size="sm" variant="outline">
                    Add Comment
                  </Button>
                  <div v-else class="text-sm text-gray-700 whitespace-pre-line max-w-xs">
                    {{ row.comment }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Campaign Analysis Form -->
    <Card class="mb-8">
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

    <!-- Analysis Results (Show only when calculated) -->
    <div v-if="isCalculated && isFormValid" class="space-y-8">
      <!-- Results Cards -->
      <Card class="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-green-800">
            <TrendingUp class="h-5 w-5" />
            Campaign Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-gray-700 mb-6">
            Based on your campaign data, here are the efficiency analysis results:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- ROI Card -->
            <Card class="bg-white shadow-sm">
              <CardContent class="p-6 text-center">
                <h4 class="text-sm font-medium text-gray-600 mb-2">ROI (Return On Investment)</h4>
                <p class="text-4xl font-bold mb-3 text-gray-900">{{ roiValue.toFixed(1) }}%</p>
                <p :class="['font-semibold mb-2', roiResult.color]">{{ roiResult.label }}</p>
                <p class="text-sm text-gray-600 leading-relaxed">{{ roiResult.desc }}</p>
              </CardContent>
            </Card>

            <!-- CAC Card -->
            <Card class="bg-white shadow-sm">
              <CardContent class="p-6 text-center">
                <h4 class="text-sm font-medium text-gray-600 mb-2">
                  CAC (Customer Acquisition Cost)
                </h4>
                <p class="text-4xl font-bold mb-3 text-gray-900">
                  Rp {{ formatCurrency(cacValue) }}
                </p>
                <p :class="['font-semibold mb-2', cacResult.color]">{{ cacResult.label }}</p>
                <p class="text-sm text-gray-600 leading-relaxed">{{ cacResult.desc }}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <!-- Insight Section -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2"> 💡 Key Insights </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-gray-700 leading-relaxed">
              {{ roiResult.desc }}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>

  <KFooter />
</template>
