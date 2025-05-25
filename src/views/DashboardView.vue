<script setup lang="ts">
import { ref } from 'vue'

import KHeader from '@/components/KHeader.vue'
import { ChevronDown, Filter, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import KFooter from '@/components/KFooter.vue'

const campaigns = ref<number[]>([1, 2, 3])
const newCampaigns = ref<number[]>([1, 2, 3, 4, 5, 6])
</script>

<template>
  <KHeader :menus="['Dashboard', 'About']">
    <Button variant="outline" as-child>
      <RouterLink to="/login">Masuk</RouterLink>
    </Button>
    <Button as-child>
      <RouterLink to="/register">Daftar</RouterLink>
    </Button>
  </KHeader>

  <!-- Main Content -->
  <main class="flex-1 container mx-auto px-4 py-8 mt-[72px]">
    <!-- Greeting -->
    <section class="text-center mb-16">
      <h1 class="text-3xl font-semibold mb-2">Hello, Yaria!</h1>
      <p class="text-gray-600">Selamat datang di dashboard bisnismu</p>
    </section>

    <!-- Campaign Section -->
    <section class="mb-16">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">Campaign</h2>
        <div class="flex gap-2">
          <Button variant="outline" class="bg-green-50 border-green-100 text-gray-800 gap-2">
            Show <ChevronDown class="h-4 w-4" />
          </Button>
          <Button variant="outline" class="bg-green-50 border-green-100 text-gray-800 gap-2">
            <Filter class="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div class="space-y-4">
        <Card v-for="item in campaigns" :key="item" class="overflow-hidden">
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

      <div class="flex justify-end mt-4">
        <Button variant="ghost" class="text-gray-600 gap-2">
          View More <ChevronDown class="h-4 w-4" />
        </Button>
      </div>
    </section>

    <!-- New Campaigns Section -->
    <section>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">New Campaigns</h2>
        <Button as-child>
          <RouterLink to="/create"> Create Campaign <Plus class="h-4 w-4" /> </RouterLink>
        </Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="item in newCampaigns"
          :key="item"
          @click="$router.push({ name: 'detail', params: { id: item } })"
          class="overflow-hidden cursor-pointer"
        >
          <div class="bg-gray-100 h-48 flex items-center justify-center text-gray-400">Pict</div>
          <div class="p-4">
            <h3 class="font-semibold mb-1">Kacang Tanah</h3>
            <p class="text-gray-500 text-sm mb-2">Rinrain Store • Product Launch</p>

            <div class="flex gap-2 mb-3">
              <Badge variant="outline" class="bg-gray-50 text-gray-600 rounded-full font-normal">
                Food
              </Badge>
              <Badge variant="outline" class="bg-gray-50 text-gray-600 rounded-full font-normal">
                Healthy
              </Badge>
            </div>

            <p class="text-gray-600 text-sm mb-3">Timeline: 10 - 20 Juni 2024</p>

            <Button
              variant="outline"
              size="sm"
              class="bg-green-50 border-green-100 text-gray-800 text-xs"
            >
              Mulai dari Rp2 Juta
            </Button>
          </div>
        </Card>
      </div>
    </section>
  </main>

  <KFooter />
</template>
