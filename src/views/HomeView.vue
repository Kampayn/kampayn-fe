<script setup lang="ts">
import { Button } from '@/components/ui/button'
import KHeader from '@/components/KHeader.vue'
import KFooter from '@/components/KFooter.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
    <!-- Hero Section -->
    <section class="container mx-auto py-12 px-4">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div class="space-y-6">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Scale your business with intelligent insights
          </h1>
          <p class="text-lg text-gray-600">
            Growth your business with with our AI-powered platform. Make smarter decisions and grow
            faster than ever before.
          </p>
          <Button size="lg">Gabung Sekarang</Button>
        </div>
        <div class="relative h-[300px] md:h-[400px]">
          <img
            src="/assets/illustration/hero.webp"
            alt="Team collaboration"
            class="object-cover rounded-lg w-full h-full"
          />
        </div>
      </div>
    </section>

    <section id="features" class="py-24 bg-primary/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-4 mb-16">
          <h2 class="text-4xl font-bold text-gray-900">Why everyone choose Kampaiyn</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Built for modern workflow to move fast and make data-driven decisions.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <Card
            class="bg-white border-0 shadow-lg rounded-3xl p-8 hover:shadow-xl transition-shadow"
          >
            <CardContent class="p-0 space-y-6">
              <div
                class="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center"
              >
                <BarChart3 class="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
                <p class="text-gray-600">
                  Get deep insights into your business with AI-powered analytics and real-time
                  reporting.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            class="bg-white border-2 border-primary shadow-lg rounded-3xl p-8 hover:shadow-xl transition-shadow relative"
          >
            <Badge class="absolute -top-3 left-6 bg-primary text-white"> Most Popular </Badge>
            <CardContent class="p-0 space-y-6">
              <div
                class="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center"
              >
                <Zap class="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                <p class="text-gray-600">
                  Built for speed with edge computing and optimized for performance at scale.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            class="bg-white border-0 shadow-lg rounded-3xl p-8 hover:shadow-xl transition-shadow"
          >
            <CardContent class="p-0 space-y-6">
              <div
                class="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center"
              >
                <Shield class="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
                <p class="text-gray-600">
                  Bank-level security with SOC 2 compliance and end-to-end encryption.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Testimoni Pengguna</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="border p-6 rounded-lg">
            <p class="mb-4">
              “Sebagai pemilik brand lokal fashion, saya terbantu banget lewat Kampaiyn. 
              Saya bisa temukan influencer dengan gaya yang sesuai brand saya. 
              Hasil kontennya keren dan bikin brand saya lebih dikenal.”
            </p>
            <p class="font-semibold">— Ayu, Pemilik Butik Handmade</p>
          </div>
          <div class="border p-6 rounded-lg">
            <p class="mb-4">
              “Kampaiyn memudahkan saya sebagai beauty creator untuk terhubung dengan brand yang tepat. 
              Saya bisa pilih campaign yang sesuai niche dan audiens saya.”
            </p>
            <p class="font-semibold">— Nadia, Beauty Content Creator</p>
          </div>
          <div class="border p-6 rounded-lg">
            <p class="mb-4">
              “Saya sempat ragu bisa promosiin produk snack saya lewat konten lucu. 
              Tapi ternyata, lewat Kampaiyn, banyak creator komedi yang bisa bikin produk saya viral dengan cara unik.”
            </p>
            <p class="font-semibold">— Tomi, Pemilik Snack Kekinian</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-20 text-center bg-cover bg-center bg-no-repeat relative"
      style="background-image: url('/assets/illustration/cta-bg.png')"
    >
      <!-- Overlay putih dengan transparansi -->
      <div class="absolute inset-0 bg-white/80"></div>

      <!-- Konten CTA -->
      <div class="relative container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-4 text-gray-900">Tunggu apa lagi?</h2>
        <p class="text-gray-600 mb-8">Mulai perjalananmu bersama kami hari ini!</p>
        <Button> Buat Akun </Button>
      </div>
    </section>

  </main>

  <KFooter />
</template>
