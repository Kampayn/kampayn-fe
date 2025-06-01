<script setup lang="ts">
import { LoaderCircle, Phone, UserRound } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import KHeader from '@/components/KHeader.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(3),
    category: z.string(),
    phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/),
  }),
)

const { isFieldDirty, handleSubmit, meta } = useForm({
  validationSchema: formSchema,
})

const categories = [
  {
    value: 'fashion',
    label: 'Fashion',
  },
  {
    value: 'food',
    label: 'Food',
  },
  {
    value: 'beauty',
    label: 'Beauty',
  },
  {
    value: 'health',
    label: 'Health',
  },
]

const onSubmit = handleSubmit(async (values) => {
  const isSuccess = await userStore.completeProfile({
    role: 'brand',
    category: values.category,
    phone_number: values.phone,
    company: values.name,
  })

  if (isSuccess) router.push('/dashboard')
})
</script>

<template>
  <KHeader variant="outline" />

  <main class="flex flex-col items-center justify-center mt-[72px] p-6 h-[calc(100dvh-73px)]">
    <div class="w-full max-w-md border border-gray-100 rounded-md p-8">
      <h1 class="text-2xl font-medium text-center mb-8">Register Brand / UMKM</h1>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormControl>
              <Input type="text" placeholder="Brand / UMKM Name" is-icon v-bind="componentField">
                <UserRound class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="category" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger size="lg" class="w-full">
                  <SelectValue placeholder="Select content category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="(item, index) in categories" :key="index" :value="item.value">
                    {{ item.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="phone" :validate-on-blur="!isFieldDirty">
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

        <Button type="submit" size="lg" :disabled="!meta.valid || isLoading" class="w-full">
          <LoaderCircle v-if="isLoading" class="animate-spin size-5 mr-2" />
          <template v-else>Register</template>
        </Button>
      </form>
    </div>
  </main>
</template>
