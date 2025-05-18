<script setup lang="ts">
import { Lock, Mail, UserRound } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import KHeader from '@/components/KHeader.vue'

const formSchema = toTypedSchema(
  z
    .object({
      username: z.string().min(4).max(20),
      email: z.string().email(),
      password: z.string().min(8),
      confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>

<template>
  <KHeader variant="outline" />

  <main class="flex flex-col items-center justify-center mt-[72px] p-6 h-[calc(100dvh-73px)]">
    <div class="w-full max-w-md border border-gray-100 rounded-md p-8">
      <h1 class="text-2xl font-medium text-center mb-8">Register</h1>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormControl>
              <Input type="text" placeholder="Username" is-icon v-bind="componentField">
                <UserRound class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormControl>
              <Input
                type="email"
                placeholder="Email"
                autocomplete="email"
                is-icon
                v-bind="componentField"
              >
                <Mail class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormControl>
              <Input
                type="password"
                placeholder="Password"
                autocomplete="current-password"
                is-icon
                v-bind="componentField"
              >
                <Lock class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormControl>
              <Input
                type="password"
                placeholder="Confirm Password"
                autocomplete="current-password"
                is-icon
                v-bind="componentField"
              >
                <Lock class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" size="lg" class="w-full">Buat Akun</Button>
      </form>

      <!-- Divider -->
      <div class="my-6 flex items-center">
        <div class="flex-1 border-t border-border"></div>
        <div class="px-3 text-sm text-gray-500">atau</div>
        <div class="flex-1 border-t border-border"></div>
      </div>

      <Button variant="outline" size="lg" class="w-full">
        <img src="/assets/logo/google.svg" alt="Google Logo" width="20" height="20" />
        Masuk dengan Google
      </Button>

      <!-- Register link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Sudah punya akun?
          <RouterLink to="/login" class="text-teal-600 hover:underline font-medium">
            Masuk Sekarang
          </RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>
