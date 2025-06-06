<script setup lang="ts">
import { onMounted, watch } from 'vue'
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

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const campaignStore = useCampaignStore()
const { campaigns } = storeToRefs(campaignStore)

// const campaigns = ref<number[]>([1, 2, 3])
// const newCampaigns = ref<number[]>([1, 2])

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
      <h2 class="mb-6 text-2xl font-semibold">Ongoing Campaigns</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
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
        <KCampaignCard v-for="(item, index) in campaigns" :key="index" :campaign="item" />
      </div>
    </section>
  </main>

  <KFooter />
</template>
