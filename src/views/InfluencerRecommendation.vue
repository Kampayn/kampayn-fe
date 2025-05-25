<script setup lang="ts">
import { ref } from 'vue'

import KHeader from '@/components/KHeader.vue'
import KFooter from '@/components/KFooter.vue'
import IconStar from '@/components/icons/IconStar.vue'
import IconEndorse from '@/components/icons/IconEndorse.vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Filter, ChevronDown } from 'lucide-vue-next'

const bestForYou = ref([
  {
    id: 1,
    name: 'Keysha Moe',
    followers: '14M Followers',
    rating: '5.0',
    endorsed: '19 kali diendorse',
    tags: ['Kesehatan', 'Food', '+2'],
  },
  {
    id: 2,
    name: 'Keysha Moe',
    followers: '14M Followers',
    rating: '5.0',
    endorsed: '19 kali diendorse',
    tags: ['Kesehatan', 'Food', '+2'],
  },
  {
    id: 3,
    name: 'Keysha Moe',
    followers: '14M Followers',
    rating: '5.0',
    endorsed: '19 kali diendorse',
    tags: ['Kesehatan', 'Food', '+2'],
  },
  {
    id: 4,
    name: 'Keysha Moe',
    followers: '14M Followers',
    rating: '5.0',
    endorsed: '19 kali diendorse',
    tags: ['Kesehatan', 'Food', '+2'],
  },
  {
    id: 5,
    name: 'Keysha Moe',
    followers: '14M Followers',
    rating: '5.0',
    endorsed: '19 kali diendorse',
    tags: ['Kesehatan', 'Food', '+2'],
  },
  {
    id: 6,
    name: 'Keysha Moe',
    followers: '14M Followers',
    rating: '5.0',
    endorsed: '19 kali diendorse',
    tags: ['Kesehatan', 'Food', '+2'],
  },
  {
    id: 7,
    name: 'Keysha Moe',
    followers: '14M Followers',
    rating: '5.0',
    endorsed: '19 kali diendorse',
    tags: ['Kesehatan', 'Food', '+2'],
  },
])

const workedTogether = ref([...bestForYou.value])
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

  <main class="container mx-auto px-4 py-12 mt-[72px]">
    <h1 class="text-3xl font-semibold mb-6">Rekomendasi Influencer</h1>
    <hr class="border-t border-gray-300 mb-6" />

    <section class="mb-20">
      <div class="flex justify-between items-center mb-5 pb-2">
        <h2 class="text-2xl">Best For You</h2>
        <div class="flex items-center gap-3">
          <Button variant="outline" class="gap-1">Show <ChevronDown class="w-4 h-4" /></Button>
          <Button variant="outline" class="gap-1"><Filter class="w-4 h-4" /> Filter</Button>
        </div>
      </div>

      <div class="flex flex-wrap justify-center sm:justify-start gap-4 mt-6 sm:ml-5">
        <Card
          v-for="influencer in bestForYou"
          :key="influencer.id"
          class="relative w-[295px] h-[343px] rounded-[20px] shadow-md bg-white"
        >
          <!-- Foto -->
          <div
            class="absolute bg-green-100 rounded-full"
            style="width: 53.28px; height: 54px; top: 53px; left: 35.5px"
          ></div>

          <!-- Nama -->
          <h3
            class="absolute font-semibold text-xl"
            style="top: 50px; left: 110px; right: 43px"
          >
            {{ influencer.name }}
          </h3>

          <!-- Followers -->
          <p
            class="absolute text-sm text-gray-500"
            style="top: 85px; left: 110px; right: 43px"
          >
            {{ influencer.followers }}
          </p>

          <!-- Rating -->
          <p
            class="absolute flex items-center gap-1 text-sm text-gray-500"
            style="top: 112px; left: 110px; right: 43px"
          >
            <IconStar class="w-4 h-4" /> {{ influencer.rating }}
          </p>

          <!-- Endorse -->
          <p
            class="absolute flex items-center gap-1 text-sm text-gray-500"
            style="top: 140px; left: 110px; right: 43px"
          >
            <IconEndorse class="w-4 h-4" /> {{ influencer.endorsed }}
          </p>

          <!-- Tags -->
          <div
            class="absolute flex flex-wrap gap-2 text-sm"
            style="top: 178px; left: 36.5px; right: 48.3px"
          >
            <span
              v-for="tag in influencer.tags"
              :key="tag"
              class="bg-gray-100 text-gray-700 rounded-full px-3 py-[2px]"
            >
              {{ tag }}
            </span>
          </div>

          <Button
            class="absolute text-sm font-medium bg-[#D6E8E3] text-black rounded-md border-transparent hover:bg-[#F3F4F6] hover:border hover:border-[#2BAE66] transition-all duration-200 py-2"
            style="top: 250px; left: 37px; right: 33px"
          >
            Booking Influencer
          </Button>
        </Card>
      </div>
    </section>

    <section class="mb-20">
      <div class="flex justify-between items-center mb-5 pb-2">
        <h2 class="text-2xl">Worked Together</h2>
        <div class="flex items-center gap-3">
          <Button variant="outline" class="gap-1">Show <ChevronDown class="w-4 h-4" /></Button>
          <Button variant="outline" class="gap-1"><Filter class="w-4 h-4" /> Filter</Button>
        </div>
      </div>

      <div class="flex flex-wrap justify-center sm:justify-start gap-4 mt-6 sm:ml-5">
        <Card
          v-for="influencer in bestForYou"
          :key="influencer.id"
          class="relative w-[295px] h-[343px] rounded-[20px] shadow-md bg-white"
        >
          <!-- Foto -->
          <div
            class="absolute bg-green-100 rounded-full"
            style="width: 53.28px; height: 54px; top: 53px; left: 35.5px"
          ></div>

          <!-- Nama -->
          <h3
            class="absolute font-semibold text-xl"
            style="top: 50px; left: 110px; right: 43px"
          >
            {{ influencer.name }}
          </h3>

          <!-- Followers -->
          <p
            class="absolute text-sm text-gray-500"
            style="top: 85px; left: 110px; right: 43px"
          >
            {{ influencer.followers }}
          </p>

          <!-- Rating -->
          <p
            class="absolute flex items-center gap-1 text-sm text-gray-500"
            style="top: 112px; left: 110px; right: 43px"
          >
            <IconStar class="w-4 h-4" /> {{ influencer.rating }}
          </p>

          <!-- Endorse -->
          <p
            class="absolute flex items-center gap-1 text-sm text-gray-500"
            style="top: 140px; left: 110px; right: 43px"
          >
            <IconEndorse class="w-4 h-4" /> {{ influencer.endorsed }}
          </p>

          <!-- Tags -->
          <div
            class="absolute flex flex-wrap gap-2 text-sm"
            style="top: 178px; left: 36.5px; right: 48.3px"
          >
            <span
              v-for="tag in influencer.tags"
              :key="tag"
              class="bg-gray-100 text-gray-700 rounded-full px-3 py-[2px]"
            >
              {{ tag }}
            </span>
          </div>

          <Button
            class="absolute text-sm font-medium bg-[#D6E8E3] text-black rounded-md border-transparent hover:bg-[#F3F4F6] hover:border hover:border-[#2BAE66] transition-all duration-200 py-2"
            style="top: 250px; left: 37px; right: 33px"
          >
            Booking Influencer
          </Button>
        </Card>
      </div>
    </section>
  </main>

  <KFooter />
</template>
