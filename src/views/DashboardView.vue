<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { Plus, Search } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/user'
import { useCampaignStore } from '@/stores/campaign'
import KHeader from '@/components/KHeader.vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import KFooter from '@/components/KFooter.vue'
import { Input } from '@/components/ui/input'
// import KCard from '@/components/KCard.vue'
import KBrandCard from '@/components/KBrandCard.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const campaignStore = useCampaignStore()
const { campaigns } = storeToRefs(campaignStore)

// const campaigns = ref<number[]>([1, 2, 3])
// const newCampaigns = ref<number[]>([1, 2])

watch(
  () => user.value.role,
  (role) => {
    if (role === 'brand') {
      campaignStore.get()
    }
  },
)

onMounted(() => {
  if (user.value.role === 'brand') {
    campaignStore.get()
  }
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
    <section>
      <div v-if="user.role === 'brand'" class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Campaign Anda</h2>
        <Button as-child>
          <RouterLink to="/create"> Create Campaign <Plus class="h-4 w-4" /> </RouterLink>
        </Button>
      </div>

      <h2 v-else class="mb-6 text-2xl font-semibold">Ongoing Campaigns</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KBrandCard
          v-for="(item, index) in campaigns"
          :key="index"
          :campaign="item"
          :metrics="{
            applications: {
              applied: 10,
              accepted: 999,
              rejected: 3 
            },
            content: {
              pending: 10,
              approved: 999,
              rejected: 3,
            }
          }"
        />
        <!-- <KCard
          v-for="(item, index) in campaigns"
          :key="index"
          @click="$router.push({ name: 'detail', params: { id: item.id } })"
          v-bind="item"
          class="overflow-hidden cursor-pointer"
        /> -->
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
        <Card v-for="(item, index) in campaigns" :key="index" class="overflow-hidden">
          <div class="flex flex-col sm:flex-row">
            <div
              class="bg-gray-100 w-full sm:w-48 h-48 sm:h-auto flex items-center justify-center text-gray-400"
            >
              Pict
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-xl font-semibold mb-2">Judul</h3>
                <p class="text-gray-500 text-sm">Lorem ipsum dolor sit amet...</p>
              </div>
              <div class="text-right mt-4">
                <p class="text-gray-500 text-sm">14 Desember 2024</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  </main>

  <KFooter />
</template>
