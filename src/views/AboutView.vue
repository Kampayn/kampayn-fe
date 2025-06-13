<script setup lang="ts">
import KHeader from '@/components/KHeader.vue'
import KFooter from '@/components/KFooter.vue'
import { Button } from '@/components/ui/button';
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: 'About Us',
  description: 'Learn more about Kampayn and our mission.',
})
</script>

<template>
  <KHeader>
    <template #menus>
      <Button variant="link" as-child>
        <RouterLink to="/">Home</RouterLink>
      </Button>
      <Button variant="link" as-child>
        <RouterLink to="/about">About</RouterLink>
      </Button>
    </template>
  </KHeader>

  <main class="mt-[72px]">
    <!-- About Section -->
    <section class="container mx-auto py-12 px-4">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <!-- Left: Image -->
        <div class="relative h-[300px] md:h-[400px]">
          <img
            src="/assets/illustration/hero.webp"
            alt="Team collaboration"
            class="object-cover rounded-lg w-full h-full"
          />
        </div>

        <!-- Right: Info -->
        <div class="space-y-6">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Tentang Kampaiyn
          </h1>
          <p class="text-lg text-gray-600">
            Kampaiyn adalah platform yang memfasilitasi kolaborasi antara pelaku UMKM dan
            influencer. Di sini, UMKM dapat menemukan influencer yang tepat untuk mempromosikan
            produk mereka, sedangkan influencer dapat memilih produk UMKM berkualitas untuk
            diiklankan kepada audiensnya.
          </p>
          <p class="text-lg text-gray-600">
            <strong>Visi:</strong> Mendorong pertumbuhan UMKM di Indonesia melalui pemasaran digital
            yang efektif dan terjangkau.
          </p>
          <div class="text-lg text-gray-600">
            <strong>Misi:</strong>
            <ul class="list-disc list-inside ml-4">
              <li>Menyediakan akses ke jaringan influencer yang luas.</li>
              <li>Mempermudah proses negosiasi dan pelaksanaan kampanye.</li>
              <li>Menghadirkan dashboard analitik untuk memantau performa iklan.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>

  <KFooter />
</template>
