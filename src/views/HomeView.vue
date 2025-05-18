<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  Search as SearchIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="container mx-auto py-4 px-4 flex items-center justify-between">
      <div class="flex items-center">
        <RouterLink to="/" class="flex items-center">
          <img
            src="/assets/logo/logo.svg"
            alt="Kampaiyn Logo"
            width="150"
            height="40"
            class="h-10 w-auto"
          />
        </RouterLink>
      </div>

      <div class="hidden md:flex items-center space-x-8 mx-auto">
        <RouterLink
          to="/dashboard"
          class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md bg-gray-100"
        >
          Dashboard
        </RouterLink>
        <RouterLink to="/about" class="text-gray-700 hover:text-gray-900"> About </RouterLink>
      </div>

      <div class="flex items-center space-x-4">
        <button aria-label="Search" class="p-2">
          <SearchIcon class="h-5 w-5" />
        </button>
        <RouterLink to="/login">
          <Button variant="outline">
            Masuk
          </Button>
        </RouterLink>
        <RouterLink to="/register">
          <Button>Daftar</Button>
        </RouterLink>
      </div>
    </header>

    <main class="flex-1">
      <!-- Hero Section -->
      <section class="container mx-auto py-12 px-4">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div class="space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Solusi Digital Untuk Kebutuhan Bisnismu
            </h1>
            <p class="text-lg text-gray-600">
              Solusi cerdas untuk mempertemukan kreativitas dan strategi pemasaran
            </p>
            <Button>
              Gabung Sekarang
            </Button>
          </div>
          <div class="relative h-[300px] md:h-[400px]">
            <img
              src="/assets/illustration/hero.png"
              alt="Team collaboration"
              class="object-cover rounded-lg w-full h-full"
            />
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="bg-[#f0f5f5] py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Kategori Layanan Kami</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-8 rounded-lg shadow-sm text-center">
              <h3 class="text-xl font-semibold">Kesehatan</h3>
            </div>
            <div class="bg-white p-8 rounded-lg shadow-sm text-center">
              <h3 class="text-xl font-semibold">Kuliner</h3>
            </div>
            <div class="bg-white p-8 rounded-lg shadow-sm text-center">
              <h3 class="text-xl font-semibold">Kecantikan</h3>
            </div>
            <div class="bg-white p-8 rounded-lg shadow-sm text-center">
              <h3 class="text-xl font-semibold">Lorem</h3>
            </div>
            <div class="bg-white p-8 rounded-lg shadow-sm text-center">
              <h3 class="text-xl font-semibold">Lorem</h3>
            </div>
            <div class="bg-white p-8 rounded-lg shadow-sm text-center">
              <h3 class="text-xl font-semibold">Lorem</h3>
            </div>
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
                "Saya sering main game di sini, PC-nya sangat cepat dan nyaman! Kursinya ergonomis,
                cocok untuk gaming seharian. Selain itu, internetnya stabil banget."
              </p>
              <p class="font-semibold">— Dimas, Gamer</p>
            </div>
            <div class="border p-6 rounded-lg">
              <p class="mb-4">
                "Studio livestream di sini luar biasa! Semua alat sudah tersedia mulai dari kamera
                hingga lighting profesional. Saya bisa langsung siaran tanpa perlu repot membawa
                perlengkapan sendiri. Internetnya juga super cepat."
              </p>
              <p class="font-semibold">— Nina, Streamer</p>
            </div>
            <div class="border p-6 rounded-lg">
              <p class="mb-4">
                "Saya suka tempat ini karena fasilitasnya lengkap dan harganya terjangkau. Net Cafe
                dan ruang streaming-nya bersih, modern, dan staff-nya ramah. Sangat
                direkomendasikan!"
              </p>
              <p class="font-semibold">— Rizky, Freelancer</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 text-center">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-4">Tunggu apa lagi?</h2>
          <p class="text-gray-600 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>

          <div class="flex justify-center space-x-8 mb-8">
            <RouterLink to="#" class="border rounded-lg p-3 hover:bg-gray-50">
              <FacebookIcon class="h-8 w-8 text-blue-600" />
            </RouterLink>
            <RouterLink to="#" class="border rounded-lg p-3 hover:bg-gray-50">
              <InstagramIcon class="h-8 w-8 text-pink-600" />
            </RouterLink>
            <!-- <RouterLink to="#" class="border rounded-lg p-3 hover:bg-gray-50">
              <img src="/tiktok-icon.png" alt="TikTok" width="32" height="32" />
            </RouterLink> -->
            <!-- <RouterLink to="#" class="border rounded-lg p-3 hover:bg-gray-50">
              <img src="/google-icon.png" alt="Google" width="32" height="32" />
            </RouterLink> -->
          </div>

          <Button> Buat Akun </Button>
        </div>
      </section>
    </main>

    <footer class="bg-[#1a3b3b] text-white py-6">
      <div class="container mx-auto px-4 text-center">
        <p class="text-sm">© Copyright Kampaiyn. All Right Reserved</p>
      </div>
    </footer>
  </div>
</template>
