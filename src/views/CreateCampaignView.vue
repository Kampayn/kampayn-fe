<script setup lang="ts">
import { ref, computed, watch, type Ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import { CalendarDays, Loader2 } from 'lucide-vue-next'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCampaignStore } from '@/stores/campaign'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

const campaignStore = useCampaignStore()
const { isLoading } = storeToRefs(campaignStore)

// Constants
const CAMPAIGN_TYPE_OPTIONS = [
  {
    label: 'Brand Awareness',
    value: 'brand_awareness',
    description: 'Increase brand visibility and recognition',
  },
  {
    label: 'Product Launch',
    value: 'product_launch',
    description: 'Introduce new products to market',
  },
  { label: 'Promo/Sale', value: 'promo_sale', description: 'Drive sales and conversions' },
  { label: 'Other', value: 'other', description: 'Custom campaign objectives' },
] as const

const CONTENT_TYPE_OPTIONS = [
  { label: 'Story', value: 'story', description: '24-hour temporary content' },
  { label: 'Post', value: 'post', description: 'Permanent feed content' },
  { label: 'Reels', value: 'reels', description: 'Short-form video content' },
  { label: 'Live', value: 'live', description: 'Real-time streaming content' },
] as const

const PLATFORM_OPTIONS = [
  { label: 'Instagram', id: 'instagram', icon: '📷' },
  { label: 'TikTok', id: 'tiktok', icon: '🎵' },
  { label: 'YouTube', id: 'youtube', icon: '📹' },
] as const

const INFLUENCER_TIER_OPTIONS = [
  {
    label: 'Nano',
    value: 'nano',
    description: '1K-10K followers',
    color: 'bg-green-100 text-green-800',
  },
  {
    label: 'Micro',
    value: 'micro',
    description: '10K-100K followers',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    label: 'Macro',
    value: 'macro',
    description: '100K-1M followers',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    label: 'Mega',
    value: 'mega',
    description: '1M+ followers',
    color: 'bg-orange-100 text-orange-800',
  },
] as const

const PAYMENT_METHOD_OPTIONS = [
  {
    label: 'Secure Payment',
    value: 'secure_payment',
    description: 'Protected by platform guarantee',
  },
  { label: 'Bank Transfer', value: 'bank_transfer', description: 'Direct bank transfer' },
] as const

// Validation schema with enhanced rules
const formSchema = toTypedSchema(
  z
    .object({
      campaign_name: z
        .string()
        .min(3, 'Campaign name must be at least 3 characters')
        .max(100, 'Campaign name must not exceed 100 characters')
        .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Campaign name contains invalid characters'),
      campaign_type: z.enum(['brand_awareness', 'product_launch', 'promo_sale', 'other']),
      product_story: z
        .string()
        .min(20, 'Product story must be at least 20 characters')
        .max(1000, 'Product story must not exceed 1000 characters'),
      key_message: z
        .string()
        .min(10, 'Key message must be at least 10 characters')
        .max(500, 'Key message must not exceed 500 characters'),
      content_dos: z.string().min(10, 'Content dos must be at least 10 characters'),
      content_donts: z.string().min(10, 'Content donts must be at least 10 characters'),
      platforms: z
        .array(z.string())
        .min(1, 'Select at least one platform')
        .max(3, 'Maximum 3 platforms allowed'),
      influencer_tiers: z
        .array(z.string())
        .min(1, 'Select at least one influencer type')
        .max(4, 'Maximum 4 influencer types allowed'),
      content_types: z.enum(['story', 'post', 'reels', 'live']),
      influencers_needed: z
        .number()
        .min(1, 'Minimum 1 influencer required')
        .max(100, 'Maximum 100 influencers allowed')
        .int('Must be a whole number'),
      budget: z
        .number()
        .min(10000, 'Minimum budget is IDR 10,000')
        .max(99999999, 'Maximum budget is IDR 99,999,999'),
      payment_method: z.enum(['secure_payment', 'bank_transfer']),
      start_date: z.string(),
      end_date: z.string(),
      status: z
        .enum(['draft', 'published', 'pending_review', 'active', 'completed', 'cancelled'])
        .default('draft'),
    })
    .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
      message: 'End date must be after start date',
      path: ['end_date'],
    })
    .refine(
      (data) => {
        const diffTime = Math.abs(
          new Date(data.end_date).getTime() - new Date(data.start_date).getTime(),
        )
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays >= 1 && diffDays <= 365
      },
      {
        message: 'Campaign duration must be between 1 day and 1 year',
        path: ['end_date'],
      },
    ),
)

// Date formatter
const df = new DateFormatter('id-ID', {
  dateStyle: 'medium',
})

// Reactive state
const isDraftSaving = ref(false)
const start = today(getLocalTimeZone())
const end = start.add({ days: 7 })

const dateRange = ref({
  start,
  end,
}) as Ref<DateRange>

// Form setup
const { isFieldDirty, handleSubmit, values, errors, setFieldValue, resetForm, meta } = useForm({
  validationSchema: formSchema,
  initialValues: {
    influencers_needed: 1,
    budget: 100000,
    payment_method: 'bank_transfer' as const,
    start_date: start.toDate('utc').toISOString().split('T')[0],
    end_date: end.toDate('utc').toISOString().split('T')[0],
    status: 'draft' as const,
    platforms: [],
    influencer_tiers: [],
  },
})

// Computed properties
const isFormValid = computed(() => meta.value.valid)
const hasUnsavedChanges = computed(() => meta.value.dirty)
const campaignDuration = computed(() => {
  if (dateRange.value.start && dateRange.value.end) {
    const diffTime = Math.abs(
      dateRange.value.end.toDate('utc').getTime() - dateRange.value.start.toDate('utc').getTime(),
    )
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  return 0
})

const estimatedBudgetPerInfluencer = computed(() => {
  const total = values.influencers_needed || 1
  const budget = values.budget || 0
  return Math.floor(budget / total)
})

// Watchers
watch(
  dateRange,
  (newRange) => {
    if (newRange.start) {
      setFieldValue('start_date', newRange.start.toDate('utc').toISOString().split('T')[0])
    }
    if (newRange.end) {
      setFieldValue('end_date', newRange.end.toDate('utc').toISOString().split('T')[0])
    }
  },
  { deep: true },
)

// Methods
const onSubmit = handleSubmit(async (vals) => {
  try {
    isLoading.value = true

    const isSuccess = await campaignStore.create({
      ...vals,
      content_dos: vals.content_dos
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
      content_donts: vals.content_donts
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
      content_types: [vals.content_types],
      status: 'active',
    })

    if (isSuccess) {
      // Reset form
      resetForm()
      dateRange.value = { start, end }

      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Error submitting campaign:', error)
    toast.error('Failed to publish campaign. Please try again.')
  } finally {
    isLoading.value = false
  }
})

const onSubmitDraft = handleSubmit(async (vals) => {
  try {
    isLoading.value = true

    const isSuccess = await campaignStore.create({
      ...vals,
      content_dos: vals.content_dos
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
      content_donts: vals.content_donts
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
      content_types: [vals.content_types],
      status: 'draft',
    })

    if (isSuccess) {
      // Reset form
      resetForm()
      dateRange.value = { start, end }

      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Error submitting campaign:', error)
    toast.error('Failed to publish campaign. Please try again.')
  } finally {
    isLoading.value = false
  }
})

const handleInfluencerTypeToggle = (type: string) => {
  const currentTypes = values.influencer_tiers || []
  let newTypes: string[]

  if (currentTypes.includes(type)) {
    newTypes = currentTypes.filter((t) => t !== type)
  } else {
    newTypes = [...currentTypes, type]
  }

  setFieldValue('influencer_tiers', newTypes)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}
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
  <main class="flex-1 container mx-auto px-4 py-8 mt-[72px] max-w-4xl">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Create New Campaign</h1>
      <p class="text-gray-600 mt-2">
        Set up your influencer marketing campaign with detailed requirements and guidelines.
      </p>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-8">
      <!-- Campaign Information -->
      <Card>
        <CardHeader>
          <CardTitle>Campaign Information</CardTitle>
          <CardDescription> Basic information about your marketing campaign </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Campaign Name -->
          <FormField
            v-slot="{ componentField }"
            name="campaign_name"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>Campaign Name *</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="e.g., Summer Collection Launch 2025"
                  class="font-medium"
                />
              </FormControl>
              <FormDescription>
                Choose a descriptive name that reflects your campaign goals
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Campaign Type -->
          <FormField
            v-slot="{ value, handleChange }"
            name="campaign_type"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>Campaign Type *</FormLabel>
              <FormControl>
                <RadioGroup
                  :model-value="value"
                  @update:model-value="handleChange"
                  class="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div v-for="opt in CAMPAIGN_TYPE_OPTIONS" :key="opt.value" class="relative">
                    <FormItem
                      class="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                    >
                      <FormControl>
                        <RadioGroupItem :value="opt.value" class="mt-1" />
                      </FormControl>
                      <div class="flex-1">
                        <FormLabel class="font-semibold text-base">{{ opt.label }}</FormLabel>
                        <p class="text-sm text-gray-600 mt-1">{{ opt.description }}</p>
                      </div>
                    </FormItem>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Campaign Brief -->
      <Card>
        <CardHeader>
          <CardTitle>Campaign Brief</CardTitle>
          <CardDescription>
            Detailed information about your product and campaign messaging
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Product Story -->
          <FormField
            v-slot="{ componentField }"
            name="product_story"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>Product Story *</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="Tell the story behind your product. What makes it special? What problem does it solve?"
                  class="min-h-[120px] resize-none"
                />
              </FormControl>
              <FormDescription>
                Share the narrative that will resonate with your target audience
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Key Message -->
          <FormField
            v-slot="{ componentField }"
            name="key_message"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>Key Message *</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="What's the main message you want influencers to communicate?"
                  class="min-h-[80px] resize-none"
                />
              </FormControl>
              <FormDescription>
                The core message that should be consistently communicated
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- <Separator /> -->

          <!-- Content Guidelines -->
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-lg">Content Guidelines</h3>
              <p class="text-sm text-gray-600">Provide clear guidelines for content creation</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Content Dos -->
              <FormField
                v-slot="{ componentField }"
                name="content_dos"
                :validate-on-blur="!isFieldDirty"
              >
                <FormItem>
                  <FormLabel class="text-green-700">✓ Do's *</FormLabel>
                  <FormControl>
                    <Textarea
                      v-bind="componentField"
                      placeholder="• Use natural lighting&#10;• Include product in lifestyle shots&#10;• Tag our brand account"
                      class="min-h-[100px] resize-none border-green-200 focus:border-green-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Content Donts -->
              <FormField
                v-slot="{ componentField }"
                name="content_donts"
                :validate-on-blur="!isFieldDirty"
              >
                <FormItem>
                  <FormLabel class="text-red-700">✗ Don'ts *</FormLabel>
                  <FormControl>
                    <Textarea
                      v-bind="componentField"
                      placeholder="• Don't use competitor products&#10;• Avoid controversial topics&#10;• No misleading claims"
                      class="min-h-[100px] resize-none border-red-200 focus:border-red-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Influencer Requirements -->
      <Card>
        <CardHeader>
          <CardTitle>Influencer Requirements</CardTitle>
          <CardDescription>
            Specify your requirements for influencer selection and content creation
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Platforms -->
          <FormField name="platforms">
            <FormItem>
              <FormLabel>Platforms *</FormLabel>
              <FormDescription>Select the social media platforms for your campaign</FormDescription>

              <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="platform in PLATFORM_OPTIONS" :key="platform.value" class="relative">
                  <label
                    class="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Checkbox
                      :checked="values.platforms?.includes(platform.value)"
                      @update:checked="(checked) => handlePlatformChange(platform.value, checked)"
                    />
                    <div class="flex items-center space-x-2">
                      <span class="text-xl">{{ platform.icon }}</span>
                      <span class="font-medium">{{ platform.label }}</span>
                    </div>
                  </label>
                </div>
              </div> -->

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  v-for="item in PLATFORM_OPTIONS"
                  v-slot="{ value, handleChange }"
                  :key="item.id"
                  type="checkbox"
                  :value="item.id"
                  :unchecked-value="false"
                  name="platforms"
                >
                  <FormItem
                    class="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <FormControl>
                      <Checkbox
                        :model-value="Array.isArray(value) ? value.includes(item.id) : false"
                        @update:model-value="handleChange"
                      />
                    </FormControl>
                    <FormLabel class="flex items-center space-x-2">
                      <span class="text-xl">{{ item.icon }}</span>
                      <span class="font-medium">{{ item.label }}</span>
                    </FormLabel>
                  </FormItem>
                </FormField>
              </div>

              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Influencer Type -->
          <FormField name="influencerType">
            <FormItem>
              <FormLabel>Influencer Type *</FormLabel>
              <FormDescription>Select the influencer tiers you want to work with</FormDescription>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  v-for="type in INFLUENCER_TIER_OPTIONS"
                  :key="type.value"
                  type="button"
                  :variant="values.influencer_tiers?.includes(type.value) ? 'default' : 'outline'"
                  class="h-auto p-4 flex flex-col items-center space-y-2"
                  @click="handleInfluencerTypeToggle(type.value)"
                >
                  <span class="font-semibold capitalize">{{ type.label }}</span>
                  <Badge :class="type.color" variant="secondary" class="text-xs">
                    {{ type.description }}
                  </Badge>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Content Type -->
          <FormField v-slot="{ value, handleChange }" name="content_types">
            <FormItem>
              <FormLabel>Content Type *</FormLabel>
              <FormControl>
                <RadioGroup
                  :model-value="value"
                  @update:model-value="handleChange"
                  class="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <div v-for="opt in CONTENT_TYPE_OPTIONS" :key="opt.value" class="relative">
                    <FormItem
                      class="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                    >
                      <FormControl>
                        <RadioGroupItem :value="opt.value" class="mt-1" />
                      </FormControl>
                      <div class="flex-1">
                        <FormLabel class="font-semibold">{{ opt.label }}</FormLabel>
                        <p class="text-xs text-gray-600 mt-1">{{ opt.description }}</p>
                      </div>
                    </FormItem>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Total Influencer -->
          <FormField v-slot="{ value }" name="influencers_needed" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Total Influencers *</FormLabel>
              <NumberField
                class="max-w-xs"
                :min="1"
                :max="100"
                :model-value="value"
                @update:model-value="(v) => setFieldValue('influencers_needed', v || 1)"
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <FormControl>
                    <NumberFieldInput class="text-center" />
                  </FormControl>
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
              <FormDescription>
                Number of influencers you want to collaborate with (1-100)
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Budget & Timeline -->
      <Card>
        <CardHeader>
          <CardTitle>Budget & Timeline</CardTitle>
          <CardDescription>
            Set your campaign budget, payment method, and schedule
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Budget -->
          <FormField v-slot="{ value }" name="budget" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Campaign Budget *</FormLabel>
              <NumberField
                class="max-w-md"
                :min="10000"
                :max="99999999"
                :format-options="{
                  style: 'currency',
                  currency: 'IDR',
                  currencyDisplay: 'code',
                  minimumFractionDigits: 0,
                }"
                :model-value="value"
                @update:model-value="(v) => setFieldValue('budget', v || 10000)"
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <FormControl>
                    <NumberFieldInput />
                  </FormControl>
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
              <FormDescription>
                <div class="space-y-1">
                  <p>Total budget for the entire campaign (IDR 10K - 99.9M)</p>
                  <p
                    v-if="values.influencers_needed && values.budget"
                    class="text-teal-600 font-medium"
                  >
                    ≈ {{ formatCurrency(estimatedBudgetPerInfluencer) }} per influencer
                  </p>
                </div>
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Payment Method -->
          <FormField
            v-slot="{ componentField }"
            name="payment_method"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>Payment Method *</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="max-w-md">
                    <SelectValue placeholder="Choose payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="method in PAYMENT_METHOD_OPTIONS"
                      :key="method.value"
                      :value="method.value"
                      class="flex flex-col items-start"
                    >
                      <div>{{ method.label }}</div>
                      <div class="text-xs text-gray-500">{{ method.description }}</div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Campaign Duration -->
          <FormField name="dateRange">
            <FormItem>
              <FormLabel>Campaign Duration *</FormLabel>
              <FormDescription>Select the start and end dates for your campaign</FormDescription>
              <Popover>
                <PopoverTrigger as-child>
                  <FormControl>
                    <Button
                      variant="outline"
                      class="w-full max-w-md justify-start text-left font-normal"
                    >
                      <CalendarDays class="mr-2 h-4 w-4" />
                      <template v-if="dateRange.start && dateRange.end">
                        {{ df.format(dateRange.start.toDate(getLocalTimeZone())) }} -
                        {{ df.format(dateRange.end.toDate(getLocalTimeZone())) }}
                        <Badge variant="secondary" class="ml-2">
                          {{ campaignDuration }} {{ campaignDuration === 1 ? 'day' : 'days' }}
                        </Badge>
                      </template>
                      <template v-else> Select campaign dates </template>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0" align="start">
                  <RangeCalendar
                    v-model="dateRange"
                    initial-focus
                    :number-of-months="2"
                    locale="id"
                    :min-value="today(getLocalTimeZone())"
                  />
                  <div class="flex items-center justify-between p-4 border-t">
                    <div class="text-sm text-gray-600">
                      <template v-if="dateRange.start && dateRange.end">
                        {{ campaignDuration }}
                        {{ campaignDuration === 1 ? 'day' : 'days' }} selected
                      </template>
                    </div>
                    <div class="space-x-2">
                      <Button variant="outline" size="sm">Cancel</Button>
                      <Button size="sm">Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage>{{ errors.start_date || errors.end_date }}</FormMessage>
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Form Actions -->
      <Card>
        <CardContent class="pt-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <!-- Form Status -->
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <div
                :class="['w-2 h-2 rounded-full', isFormValid ? 'bg-green-500' : 'bg-yellow-500']"
              />
              <span v-if="isFormValid">Form is valid</span>
              <span v-else>Please complete all required fields</span>
              <span v-if="hasUnsavedChanges" class="text-orange-600 ml-2"> • Unsaved changes </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <Button
                type="button"
                variant="outline"
                class="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 hover:text-teal-800"
                :disabled="isDraftSaving"
                @click="onSubmitDraft"
              >
                <Loader2 v-if="isDraftSaving" class="mr-2 h-4 w-4 animate-spin" />
                Save as Draft
              </Button>
              <Button
                type="submit"
                class="bg-teal-600 hover:bg-teal-700"
                :disabled="!isFormValid || isLoading"
              >
                <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                {{ isLoading ? 'Publishing...' : 'Publish Campaign' }}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>

    <!-- Form Progress Indicator -->
    <div class="fixed bottom-6 right-6 z-50" v-if="hasUnsavedChanges">
      <Card class="shadow-lg">
        <CardContent class="p-4">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span class="text-sm font-medium">Unsaved changes</span>
            <Button size="sm" variant="outline" @click="onSubmitDraft" :disabled="isDraftSaving">
              <Loader2 v-if="isDraftSaving" class="mr-1 h-3 w-3 animate-spin" />
              Save Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>

  <KFooter />
</template>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-enter-active {
  animation: fadeIn 0.3s ease-out;
}

/* Form field focus enhancements */
.form-field:focus-within {
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  border-radius: 0.375rem;
}

/* Custom scrollbar for textareas */
.textarea-custom::-webkit-scrollbar {
  width: 6px;
}

.textarea-custom::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 0.25rem;
}

.textarea-custom::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 0.25rem;
}

.textarea-custom::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

/* Responsive improvements */
@media (max-width: 640px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .grid-responsive {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .container {
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

/* Enhanced focus states for better accessibility */
.focus-enhanced:focus {
  outline: 2px solid #14b8a6;
  outline-offset: 2px;
}

/* Smooth transitions for interactive elements */
.transition-smooth {
  transition: all 0.2s ease-in-out;
}

/* Custom hover effects */
.hover-lift:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Loading state animations */
@keyframes pulse-subtle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.pulse-subtle {
  animation: pulse-subtle 2s infinite;
}
</style>
