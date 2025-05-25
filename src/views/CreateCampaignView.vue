<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import {
  CalendarDate,
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date'
import { CalendarDays } from 'lucide-vue-next'
import type { DateRange } from 'reka-ui'

import KHeader from '@/components/KHeader.vue'
import KFooter from '@/components/KFooter.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const df = new DateFormatter('id-ID', {
  dateStyle: 'medium',
})

const formSchema = toTypedSchema(
  z
    .object({
      // campaignImage: z.string().min(2),
      campaignName: z.string().min(2),
      campaignType: z.enum(['brandAwareness', 'productLaunch', 'promoSale', 'other']),
      productStory: z.string().min(10),
      keyMessage: z.string().min(10),
      contentDos: z.string().min(5),
      contentDonts: z.string().min(5),
      platforms: z.array(z.string()).min(1),
      influencerType: z.array(z.string()).min(1),
      contentType: z.enum(['story', 'post', 'reels', 'live']),
      totalInfluencer: z.number().min(1).max(100),
      budget: z.number().min(10000).max(99999999),
      paymentMethod: z.enum(['securePayment', 'directTransfer']),
      startDate: z.date(),
      endDate: z.date(),
    })
    .refine(
      (data) => {
        return data.endDate >= data.startDate
      },
      {
        message: 'End date must be after start date',
        path: ['endDate'],
      },
    ),
)

// const industryCategories = [
//   { label: 'Fashion', value: 'fashion' },
//   { label: 'Food & Beverage', value: 'food' },
//   { label: 'Technology', value: 'technology' },
//   { label: 'Beauty', value: 'beauty' },
//   { label: 'Health & Wellness', value: 'health' },
//   { label: 'Travel', value: 'travel' },
//   { label: 'Education', value: 'education' },
//   { label: 'Entertainment', value: 'entertainment' },
// ]

// const influencerCategories = [
//   { label: 'Fashion', value: 'fashion' },
//   { label: 'Food', value: 'food' },
//   { label: 'Technology', value: 'technology' },
//   { label: 'Beauty', value: 'beauty' },
//   { label: 'Lifestyle', value: 'lifestyle' },
//   { label: 'Travel', value: 'travel' },
//   { label: 'Fitness', value: 'fitness' },
//   { label: 'Gaming', value: 'gaming' },
// ]

const campaignTypeOptions = [
  { label: 'Brand Awareness', value: 'brandAwareness' },
  { label: 'Product Launch', value: 'productLaunch' },
  { label: 'Promo/Sale', value: 'promoSale' },
  { label: 'Lainnya', value: 'other' },
]

const contentTypeOptions = [
  { label: 'Story', value: 'story' },
  { label: 'Post', value: 'post' },
  { label: 'Reels', value: 'reels' },
  { label: 'Live', value: 'live' },
]

const start = today(getLocalTimeZone())
const end = start.add({ days: 7 })

const value = ref({
  start,
  end,
}) as Ref<DateRange>

// wire up vee-validate with your Zod schema
const { isFieldDirty, handleSubmit, values, errors, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    totalInfluencer: 1,
    budget: 10000,
    paymentMethod: 'directTransfer',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
})

const onSubmit = handleSubmit((vals) => {
  console.log(vals)
  alert('Campaign created successfully!')
})

function onSaveDraft() {
  console.log('Draft saved:', values)
  alert('Draft saved successfully!')
}

// // Helper function to format date range display
// const formatDateRange = (startDate: Date, endDate: Date) => {
//   const options: Intl.DateTimeFormatOptions = {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   }

//   if (startDate && endDate) {
//     return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`
//   }
//   return 'Select date range'
// }
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

  <!-- Main Content -->
  <main class="flex-1 container mx-auto px-4 py-8 mt-[72px]">
    <form @submit.prevent="onSubmit" class="space-y-8">
      <!-- Campaign Information -->
      <div class="space-y-6">
        <h2 class="text-lg font-semibold">Campaign Information</h2>

        <!-- Campaign Name -->
        <FormField v-slot="{ componentField }" name="campaignName">
          <FormItem>
            <FormLabel>Name Campaign</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="Masukkan Nama Campaign" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Campaign Type -->
        <FormField v-slot="{ value, handleChange }" name="campaignType">
          <FormItem>
            <FormLabel>Campaign Type</FormLabel>
            <FormControl>
              <RadioGroup
                :model-value="value"
                @update:model-value="handleChange"
                class="flex flex-col space-y-1"
              >
                <FormItem
                  v-for="opt in campaignTypeOptions"
                  :key="opt.value"
                  class="flex items-center space-x-3"
                >
                  <FormControl>
                    <RadioGroupItem :value="opt.value" />
                  </FormControl>
                  <FormLabel class="font-normal">{{ opt.label }}</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Campaign Brief -->
      <div class="space-y-6">
        <h2 class="text-lg font-semibold">Campaign Brief</h2>

        <!-- Product Story -->
        <FormField v-slot="{ componentField }" name="productStory">
          <FormItem>
            <FormLabel>Product Story</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" placeholder="Product Story" class="min-h-[120px]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Key Message -->
        <FormField v-slot="{ componentField }" name="keyMessage">
          <FormItem>
            <FormLabel>Key Message</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" placeholder="Key Message" class="min-h-[80px]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="space-y-4">
          <h3 class="font-medium">Content Guidelines</h3>

          <!-- Content Dos -->
          <FormField v-slot="{ componentField }" name="contentDos">
            <FormItem>
              <FormLabel>Do's</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Do's" class="min-h-[80px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Content Donts -->
          <FormField v-slot="{ componentField }" name="contentDonts">
            <FormItem>
              <FormLabel>Don'ts</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Don'ts" class="min-h-[80px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>

      <!-- Influencer Requirements -->
      <div class="space-y-6">
        <h2 class="text-lg font-semibold">Influencer Requirements</h2>

        <!-- Platforms (checkbox group) -->
        <FormField v-slot="{ value, handleChange }" name="platforms">
          <FormItem>
            <FormLabel>Platforms</FormLabel>
            <FormDescription>Select the platforms</FormDescription>
            <div class="flex flex-col gap-2">
              <label
                v-for="plat in ['instagram', 'tiktok', 'youtube']"
                :key="plat"
                class="flex items-center gap-2"
              >
                <Checkbox :model-value="value" @update:model-value="handleChange" />
                {{ plat.charAt(0).toUpperCase() + plat.slice(1) }}
              </label>
            </div>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Content Type (button group) -->
        <FormField v-slot="{ value, handleChange }" name="influencerType">
          <FormItem>
            <FormLabel>Influencer Type</FormLabel>
            <div class="flex flex-wrap gap-2 mt-2">
              <Button
                v-for="type in ['nano', 'micro', 'macro', 'mega']"
                :key="type"
                type="button"
                :variant="value?.includes(type) ? 'default' : 'outline'"
                class="capitalize"
                @click="
                  () => {
                    const arr = value ? value.slice() : []
                    if (arr.includes(type)) arr.splice(arr.indexOf(type), 1)
                    else arr.push(type)
                    handleChange(arr)
                  }
                "
              >
                {{ type }}
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Influencer Category -->
        <FormField v-slot="{ value, handleChange }" name="contentType">
          <FormItem>
            <FormLabel>Tipe Konten</FormLabel>
            <FormControl>
              <RadioGroup
                :model-value="value"
                @update:model-value="handleChange"
                class="flex flex-col space-y-1"
              >
                <FormItem
                  v-for="opt in contentTypeOptions"
                  :key="opt.value"
                  class="flex items-center space-x-3"
                >
                  <FormControl>
                    <RadioGroupItem :value="opt.value" />
                  </FormControl>
                  <FormLabel class="font-normal">{{ opt.label }}</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Total Influencer -->
        <FormField v-slot="{ value }" name="totalInfluencer">
          <FormItem>
            <FormLabel>Total Influencer</FormLabel>
            <NumberField
              class="gap-2"
              :min="1"
              :model-value="value"
              @update:model-value="
                (v) => {
                  if (v) {
                    setFieldValue('totalInfluencer', v)
                  } else {
                    setFieldValue('totalInfluencer', undefined)
                  }
                }
              "
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <FormControl>
                  <NumberFieldInput />
                </FormControl>
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            <FormDescription> Enter value between 10 and 100. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Budget & Timeline -->
      <div class="space-y-6">
        <h2 class="text-lg font-semibold">Budget & Timeline</h2>

        <!-- Payment Method -->
        <FormField v-slot="{ componentField }" name="paymentMethod">
          <FormItem>
            <FormLabel>Payment Method</FormLabel>

            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="securePayment">Secure Payment</SelectItem>
                  <SelectItem value="directTransfer">Direct Transfer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value }" name="budget">
          <FormItem>
            <FormLabel>Budget</FormLabel>
            <NumberField
              class="gap-2"
              :min="0"
              :format-options="{
                style: 'currency',
                currency: 'IDR',
                currencyDisplay: 'code',
                currencySign: 'accounting',
              }"
              :model-value="value"
              @update:model-value="
                (v) => {
                  if (v) {
                    setFieldValue('budget', v)
                  } else {
                    setFieldValue('budget', undefined)
                  }
                }
              "
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <FormControl>
                  <NumberFieldInput />
                </FormControl>
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            <FormDescription> Enter value between 10.000 and 99.999.999. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Range Calendar -->
        <FormField name="dateRange">
          <FormItem>
            <FormLabel>Campaign Duration</FormLabel>
            <FormDescription>Select the start and end dates for your campaign</FormDescription>
            <Popover>
              <PopoverTrigger as-child>
                <FormControl>
                  <Button variant="outline" class="w-full justify-start text-left font-normal">
                    <CalendarDays class="mr-2 h-4 w-4" />
                    <template v-if="value.start">
                      <template v-if="value.end">
                        {{ df.format(value.start.toDate(getLocalTimeZone())) }} -
                        {{ df.format(value.end.toDate(getLocalTimeZone())) }}
                      </template>

                      <template v-else>
                        {{ df.format(value.start.toDate(getLocalTimeZone())) }}
                      </template>
                    </template>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <RangeCalendar
                  v-model="value"
                  initial-focus
                  :number-of-months="2"
                  locale="id"
                  :min-value="new CalendarDate(2025, 1, 1)"
                  @update:start-value="
                    (startDate: DateValue | undefined) => (value.start = startDate)
                  "
                />

                <div class="inline-flex gap-[26px] items-center justify-end px-6 py-4 w-full">
                  <template v-if="value.start">
                    <template v-if="value.end">
                      {{ df.format(value.start.toDate(getLocalTimeZone())) }} -
                      {{ df.format(value.end.toDate(getLocalTimeZone())) }}
                    </template>

                    <template v-else>
                      {{ df.format(value.start.toDate(getLocalTimeZone())) }}
                    </template>
                  </template>

                  <!-- Replace the existing date range buttons -->
                  <div class="space-x-2">
                    <Button variant="outline" class="w-28"> Batal </Button>
                    <Button class="w-28"> Terapkan </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage>{{ errors.startDate || errors.endDate }}</FormMessage>
          </FormItem>
        </FormField>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          class="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 hover:text-teal-800"
          @click="onSaveDraft"
        >
          Save as Draft
        </Button>
        <Button type="submit" class="bg-teal-600 hover:bg-teal-700"> Publish </Button>
      </div>
    </form>
  </main>

  <KFooter />
</template>
