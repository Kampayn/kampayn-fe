<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import KHeader from '@/components/KHeader.vue'

// Skema validasi kode verifikasi (6 digit)
const formSchema = toTypedSchema(
  z.object({
    code: z.string().length(6, { message: 'Kode harus terdiri dari 6 angka' }),
  }),
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  console.log('Kode verifikasi:', values.code)
})

const email = 'fulan@gmail.com' // Bisa diganti dengan props atau dari route param
</script>

<template>
  <KHeader variant="outline" />

  <main class="flex flex-col items-center justify-center mt-[72px] p-6 h-[calc(100dvh-73px)]">
    <div class="w-full max-w-md border border-gray-100 rounded-md p-8">
      <h1 class="text-2xl font-medium text-center mb-4">Verifikasi Email</h1>
      <p class="text-sm text-center text-muted-foreground mb-6">
        Masukkan kode verifikasi yang telah kami kirim ke emailmu <strong>{{ email }}</strong>
      </p>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="code">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="XXXXXX"
                maxlength="6"
                inputmode="numeric"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="text-sm text-center text-teal-600 hover:underline cursor-pointer">
          Kirim ulang kode
        </div>

        <Button type="submit" size="lg" class="w-full">Masuk</Button>
      </form>
    </div>
  </main>
</template>
