<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { ref } from 'vue'

import KFooter from '@/components/KFooter.vue'
import KHeader from '@/components/KHeader.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const tasks = ref([
  {
    id: 1,
    title: 'Upload Instagram Story Produk A',
    status: 'Pending',
    deadline: '25 Mei 2025',
    category: 'Content',
  },
  {
    id: 2,
    title: 'Buat Video TikTok untuk Campaign B',
    status: 'Completed',
    deadline: '20 Mei 2025',
    category: 'Video',
  },
  {
    id: 3,
    title: 'Post Review di Instagram Feed',
    status: 'In Progress',
    deadline: '28 Mei 2025',
    category: 'Review',
  },
  {
    id: 4,
    title: 'Tulis Caption Menarik untuk Produk C',
    status: 'Pending',
    deadline: '29 Mei 2025',
    category: 'Copywriting',
  },
  {
    id: 5,
    title: 'Unggah Reels Testimoni Pelanggan',
    status: 'In Progress',
    deadline: '30 Mei 2025',
    category: 'Testimonial',
  },
])
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

  <main class="flex-1 container mx-auto px-4 py-8 mt-[72px]">
    <section class="text-center mb-10">
      <h1 class="text-3xl font-semibold mb-2">Task List Influencer</h1>
      <p class="text-gray-600">Pantau dan selesaikan tugas campaign kamu</p>
    </section>

    <section>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">Tugas Kamu</h2>
        <!-- <Button variant="outline" class="bg-green-50 border-green-100 text-gray-800 gap-2">
          <Filter class="h-4 w-4" /> Filter
        </Button> -->
      </div>

      <div class="space-y-4">
        <Card v-for="task in tasks" :key="task.id" class="p-4">
          <div class="flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
              <h3 class="font-semibold text-lg mb-1">{{ task.title }}</h3>
              <div class="flex gap-2 text-sm mt-3">
                <Badge variant="outline" class="bg-gray-50 text-gray-600 rounded-full font-normal">
                  {{ task.category }}
                </Badge>
                <Badge
                  :class="[
                    'rounded-full font-normal',
                    task.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : task.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-gray-600',
                  ]"
                >
                  {{ task.status }}
                </Badge>
              </div>
              <p class="text-sm mt-3 text-gray-500 flex items-center gap-1">
                <Clock class="h-4 w-4" /> Deadline: {{ task.deadline }}
              </p>
            </div>
            <div class="mt-4 sm:mt-0">
              <Button
                size="sm"
                :variant="task.status === 'Completed' ? 'outline' : 'default'"
                :class="{
                  'bg-green-50 border-green-200 text-green-700': task.status === 'Completed',
                }"
              >
                {{ task.status === 'Completed' ? 'Selesai' : 'Lihat Detail' }}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  </main>

  <KFooter />
</template>
