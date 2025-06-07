<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Plus, Search } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/user'
import { useCampaignStore } from '@/stores/campaign'
import KHeader from '@/components/KHeader.vue'
import { Button } from '@/components/ui/button'
import KFooter from '@/components/KFooter.vue'
import { Input } from '@/components/ui/input'
// import KCard from '@/components/KCard.vue'
import KBrandCard from '@/components/KBrandCard.vue'
import KCampaignCard from '@/components/KCampaignCard.vue'
import KAppliedCampaignCard from '@/components/KAppliedCampaignCard.vue'
import type { Campaign } from '@/types/campaign'
import type { Application } from '@/types/application'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const campaignStore = useCampaignStore()
const { campaigns } = storeToRefs(campaignStore)

const selectedCampaignId = ref('')

const handleApply = async (campaign_id: string) => {
  selectedCampaignId.value = campaign_id

  try {
    await campaignStore.apply(campaign_id)
  } catch (error) {
    console.log(error)
  } finally {
    selectedCampaignId.value = ''
  }
}

const campaignBlabla = ref<Campaign>({
  id: '15e44f5f-d6d2-42c4-bdd3-bb64e13dd531',
  campaign_name: 'Minimo',
  campaign_type: 'product_launch',
  budget: '100000.00',
  currency: 'IDR',
  start_date: '2025-06-18',
  end_date: '2025-06-21',
  influencers_needed: 10,
  content_types: ['image', 'video'],
  payment_method: 'bank_transfer',
  user_id: '1',
  product_story: 'Minimo is a new product that is launching soon',
  key_message: 'Minimo is a new product that is launching soon',
  content_dos: [
    'Minimo is a new product that is launching soon',
    'Minimo is a new product that is launching soon',
  ],
  content_donts: [
    'Minimo is a new product that is launching soon',
    'Minimo is a new product that is launching soon',
  ],
  createdAt: '2021-01-01T00:00:00.000Z',
  updatedAt: '2021-01-01T00:00:00.000Z',
  platforms: ['instagram'],
  influencer_tiers: ['nano'],
  status: 'active',
})

const applicationBlablabla = ref<Application>({
  id: '820ea274-5fdf-4127-b122-00b41d6a541f',
  campaign_id: '15e44f5f-d6d2-42c4-bdd3-bb64e13dd531',
  influencer_id: '04b303f9-344b-4ee0-a649-5f97a375e215',
  status: 'accepted',
  applied_at: '2025-06-07T07:21:48.278Z',
  createdAt: '2025-06-07T07:21:48.279Z',
  updatedAt: '2025-06-07T07:21:48.279Z',
  campaign: campaignBlabla.value,
})

watch(
  () => user.value.role,
  (role) => {
    campaignStore.get(role === 'brand')
  },
)

onMounted(() => {
  campaignStore.get(user.value.role === 'brand')
})
</script>

<template>
  <KHeader :menus="['Dashboard', 'About']" variant="outline" />

  <!-- Main Content -->
  <main class="flex-1 container mx-auto px-4 py-8 mt-[72px]">
    <!-- Greeting -->
    <section class="text-center mb-16">
      <h1 class="text-3xl font-semibold mb-2">Hello, {{ user.name }}!</h1>
      <p class="text-gray-600">
        Selamat datang di dashboard {{ user.role === 'brand' ? 'bisnismu' : 'pekerjaanmu' }}
      </p>
    </section>

    <!-- New Campaigns Section -->
    <section v-if="user.role === 'brand'">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Campaign Anda</h2>
        <Button as-child>
          <RouterLink to="/create"> Create Campaign <Plus class="h-4 w-4" /> </RouterLink>
        </Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KBrandCard
          v-for="(item, index) in campaigns"
          :key="index"
          :campaign="item"
          :metrics="{
            applications: {
              applied: 10,
              accepted: 999,
              rejected: 3,
            },
            content: {
              pending: 10,
              approved: 999,
              rejected: 3,
            },
          }"
        />
      </div>
    </section>

    <section v-else>
      <h2 class="mb-6 text-2xl font-semibold">Applied Campaigns</h2>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KAppliedCampaignCard
          v-for="i in 3"
          :key="i"
          :campaign="campaignBlabla"
          :application="applicationBlablabla"
        />
      </div>
    </section>

    <!-- New Campaign Section -->
    <section v-if="user.role === 'influencer'" class="my-16">
      <div class="flex justify-between items-center mb-6 w-full">
        <h2 class="text-2xl font-semibold">New Campaign</h2>
        <div class="w-full max-w-xs">
          <Input type="search" placeholder="Cari Campaign" is-icon>
            <Search />
          </Input>
        </div>
      </div>

      <div class="space-y-4">
        <KCampaignCard
          v-for="(item, index) in campaigns"
          :key="index"
          :campaign="item"
          :is-loading="selectedCampaignId === item.id"
          @apply="handleApply"
        />
      </div>
    </section>
  </main>

  <KFooter />
</template>
