<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next'

import type { AnalysisResult } from '@/types/analysis'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { computed } from 'vue'

interface Props {
  roiValue: number
  cacValue: number
}

const props = defineProps<Props>()

const roiResult = computed((): AnalysisResult => {
  const roi = props.roiValue

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

const cacResult = computed((): AnalysisResult => {
  const cac = props.cacValue

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

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value)
}
</script>

<template>
  <!-- Analysis Results (Show only when calculated) -->
  <div class="space-y-8">
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
              <p class="text-4xl font-bold mb-3 text-gray-900">Rp {{ formatCurrency(cacValue) }}</p>
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
</template>
