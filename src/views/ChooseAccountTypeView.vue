<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

type AccountType = 'brand' | 'influencer' | null
const selectedType = ref<AccountType>(null)

const pick = (type: AccountType) => (selectedType.value = type)
</script>

<template>
  <main class="min-h-screen flex flex-col">
    <div class="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
      <div class="w-full max-w-md mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold mb-2">Tipe Akun</h1>
          <p class="text-gray-600">Pilih peran yang sesuai dengan kebutuhanmu.</p>
        </div>

        <div class="space-y-6">
          <RadioGroup v-model="selectedType">
            <div class="space-y-4">
              <Card
                role="button"
                tabindex="0"
                @click="pick('brand')"
                @keydown.enter.space="pick('brand')"
                :class="[
                  'relative border rounded-lg p-4 cursor-pointer transition-all',
                  selectedType === 'brand'
                    ? 'border-primary ring-1 ring-primary'
                    : 'hover:border-gray-300',
                ]"
              >
                <div class="flex items-start gap-3">
                  <RadioGroupItem value="brand" id="brand" class="mt-1 pointer-events-none" />
                  <div class="flex-1">
                    <Label for="brand" class="text-lg font-medium cursor-pointer">
                      Brand/UMKM
                    </Label>
                    <p class="text-gray-600 mt-1 text-sm">
                      Mencari influencer sebanyak-banyaknya untuk membantu mempromosikan usaha anda
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                role="button"
                tabindex="0"
                @click="pick('influencer')"
                @keydown.enter.space="pick('influencer')"
                :class="[
                  'relative border rounded-lg p-4 cursor-pointer transition-all',
                  selectedType === 'influencer'
                    ? 'border-primary ring-1 ring-primary'
                    : 'hover:border-gray-300',
                ]"
              >
                <div class="flex items-start gap-3">
                  <RadioGroupItem
                    value="influencer"
                    id="influencer"
                    class="mt-1 pointer-events-none"
                  />
                  <div class="flex-1">
                    <Label for="influencer" class="text-lg font-medium cursor-pointer">
                      Influencer
                    </Label>
                    <p class="text-gray-600 mt-1 text-sm">
                      Promosikan diri anda dengan Rate Card dinamis serta dapatkan info pekerjaan
                      terbaru
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </RadioGroup>

          <Button
            @click="$router.push({ name: `${selectedType}-register` })"
            size="lg"
            :disabled="!selectedType"
            class="w-full"
          >
            Buat Akun
          </Button>
        </div>
      </div>
    </div>
  </main>
</template>
