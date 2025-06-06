<script setup lang="ts">
import { LoaderCircle, Mail } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/user'
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
import { onMounted } from 'vue'

const router = useRouter()

const userStore = useUserStore()
const { isLoading, user } = storeToRefs(userStore)

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    instagram: z.string(),
    category: z.string(),
  }),
)

const { isFieldDirty, handleSubmit, setFieldValue, meta } = useForm({
  validationSchema: formSchema,
  initialValues: {
    email: 'test@kampaiyn.com',
  },
})

const onSubmit = handleSubmit(async (values) => {
  const isSuccess = await userStore.completeProfile({
    role: 'influencer',
    category: values.category,
    instagram_username: values.instagram,
  })

  if (isSuccess) router.push('/dashboard')
})

const categories = [
  {
    value: 'beauty',
    label: 'Beauty',
  },
  {
    value: 'comedy',
    label: 'Comedy',
  },
  {
    value: 'fashion',
    label: 'Fashion',
  },
  {
    value: 'food',
    label: 'Food',
  },
  {
    value: 'lifestyle',
    label: 'Lifestyle',
  },
]

onMounted(() => {
  setFieldValue('email', user.value.email)
})
</script>

<template>
  <KHeader variant="outline" />

  <main class="flex flex-col items-center justify-center mt-[72px] p-6 h-[calc(100dvh-73px)]">
    <div class="w-full max-w-md border border-gray-100 rounded-md p-8">
      <h1 class="text-2xl font-medium text-center mb-8">Register Influencer</h1>

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

        <FormField v-slot="{ componentField }" name="instagram" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormControl>
              <Input type="text" placeholder="Instagram Username" is-icon v-bind="componentField">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-instagram-icon lucide-instagram size-5 text-muted-foreground"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
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
                  <SelectItem v-for="item in categories" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" size="lg" :disabled="!meta.valid || isLoading" class="w-full"
          ><LoaderCircle v-if="isLoading" class="animate-spin size-5 mr-2" />
          <template v-else>Register</template></Button
        >
      </form>
    </div>
  </main>
</template>
