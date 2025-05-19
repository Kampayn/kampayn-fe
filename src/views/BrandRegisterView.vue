<script setup lang="ts">
import { Mail, Phone, UserRound } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import KHeader from '@/components/KHeader.vue'

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    name: z.string(),
    phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/),
  }),
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    email: 'test@kampaiyn.com',
  },
})

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>

<template>
  <KHeader variant="outline" />

  <main class="flex flex-col items-center justify-center mt-[72px] p-6 h-[calc(100dvh-73px)]">
    <div class="w-full max-w-md border border-gray-100 rounded-md p-8">
      <h1 class="text-2xl font-medium text-center mb-8">Register Brand / UMKM</h1>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormControl>
              <Input
                type="email"
                placeholder="Email"
                autocomplete="email"
                readonly
                is-icon
                v-bind="componentField"
              >
                <Mail class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormControl>
              <Input type="text" placeholder="Brand / UMKM Name" is-icon v-bind="componentField">
                <UserRound class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="phone">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="Phone Number"
                autocomplete="mobile"
                is-icon
                v-bind="componentField"
              >
                <Phone class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" size="lg" class="w-full">Register</Button>
      </form>
    </div>
  </main>
</template>
