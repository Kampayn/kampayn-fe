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
import KBrandCard from '@/components/KBrandCard.vue'
import KCampaignCard from '@/components/KCampaignCard.vue'
import KAppliedCampaignCard from '@/components/KAppliedCampaignCard.vue'
import { useApplicationStore } from '@/stores/application'
import { toast } from 'vue-sonner'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const campaignStore = useCampaignStore()
const { campaigns } = storeToRefs(campaignStore)

const applicationStore = useApplicationStore()
const { applications } = storeToRefs(applicationStore)

const selectedCampaignId = ref('')
const selectedApplicationId = ref('')

const handleApply = async (campaign_id: string) => {
  selectedCampaignId.value = campaign_id

  try {
    const isSuccess = await applicationStore.apply(campaign_id)
    if (isSuccess) await applicationStore.get()
  } catch (error) {
    console.log(error)
    toast.error('Gagal mengajukan aplikasi')
  } finally {
    selectedCampaignId.value = ''
  }
}

const handleCancelApplication = async (id: string) => {
  selectedApplicationId.value = id
  try {
    const isSuccess = await applicationStore.cancel(id)

    if (isSuccess) await applicationStore.get()
  } catch (error) {
    console.log(error)
    toast.error('Gagal membatalkan aplikasi')
  } finally {
    selectedApplicationId.value = ''
  }
}

watch(
  () => user.value.role,
  (role) => {
    campaignStore.get(role === 'brand')
    if (role === 'influencer') applicationStore.get()
  },
)

onMounted(() => {
  campaignStore.get(user.value.role === 'brand')
  if (user.value.role === 'influencer') applicationStore.get()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <KHeader variant="outline">
      <template #menus>
        <Button variant="link" as-child>
          <RouterLink to="/dashboard">Dashboard</RouterLink>
        </Button>
        <Button variant="link" as-child>
          <RouterLink to="/chat">Chat</RouterLink>
        </Button>
      </template>
    </KHeader>

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

      <section v-if="user.role === 'influencer' && applications.length">
        <h2 class="mb-6 text-2xl font-semibold">Applied Campaigns</h2>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <KAppliedCampaignCard
            v-for="item in applications"
            :key="item.id"
            :campaign="item.campaign"
            :application="item"
            @cancel="handleCancelApplication"
            :is-loading="selectedApplicationId === item.id"
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
  </div>
</template>
