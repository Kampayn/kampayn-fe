<script setup lang="ts">
import { ref, computed, watch, onMounted, type Ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const campaignId = route.params.id as string

const campaignStore = useCampaignStore()
const { isLoading, currentCampaign } = storeToRefs(campaignStore)

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
const start = today(getLocalTimeZone())
const end = start.add({ days: 7 })

const dateRange = ref({
  start,
  end,
}) as Ref<DateRange>

// Form setup dengan initial values dari currentCampaign
const { isFieldDirty, handleSubmit, values, errors, setFieldValue, resetForm, meta } = useForm({
  validationSchema: formSchema,
  initialValues: {
    influencers_needed: 1,
    budget: 100000,
    payment_method: 'bank_transfer' as const,
    start_date: '',
    end_date: '',
    status: 'draft' as const,
    platforms: [],
    influencer_tiers: [],
  },
})

// Computed properties
const isFormValid = computed(() => meta.value.valid)
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
    const isSuccess = await campaignStore.update(campaignId, {
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
    })

    if (isSuccess) {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Error updating campaign:', error)
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

watch(
  currentCampaign,
  (campaign) => {
    if (campaign) {
      // Set form values dari data campaign
      setFieldValue('campaign_name', campaign.campaign_name)
      setFieldValue('campaign_type', campaign.campaign_type)
      setFieldValue('product_story', campaign.product_story)
      setFieldValue('key_message', campaign.key_message)
      setFieldValue('content_dos', campaign.content_dos.join('\n'))
      setFieldValue('content_donts', campaign.content_donts.join('\n'))
      setFieldValue(
        'platforms',
        campaign.platforms.map((str) => str.toLowerCase()),
      )
      setFieldValue('influencer_tiers', campaign.influencer_tiers)
      setFieldValue(
        'content_types',
        campaign.content_types[0] as 'story' | 'post' | 'reels' | 'live',
      )
      setFieldValue('influencers_needed', campaign.influencers_needed)
      setFieldValue('budget', parseInt(campaign.budget))
      setFieldValue('payment_method', campaign.payment_method as 'secure_payment' | 'bank_transfer')
      setFieldValue('start_date', campaign.start_date)
      setFieldValue('end_date', campaign.end_date)
      setFieldValue('status', campaign.status)
    }
  },
  { immediate: true },
)

// Load campaign data on mount
onMounted(async () => {
  const isSuccess = await campaignStore.getById(campaignId, 'brand')
  if (!isSuccess) {
    toast.error('Campaign tidak ditemukan')
    router.push('/dashboard')
  }
})

onUnmounted(() => {
  resetForm()
})
</script>

<template>
  <!-- Copy template dari CreateCampaignView.vue dengan perubahan title -->
  <KHeader :menus="['Dashboard', 'About']">
    <Button variant="outline" as-child>
      <RouterLink to="/login">Masuk</RouterLink>
    </Button>
    <Button as-child>
      <RouterLink to="/register">Daftar</RouterLink>
    </Button>
  </KHeader>

  <main class="flex-1 container mx-auto px-4 py-8 mt-[72px] max-w-4xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Edit Campaign</h1>
      <p class="text-gray-600 mt-2">
        Update your influencer marketing campaign details and requirements.
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading && !currentCampaign" class="flex justify-center items-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" />
      <span class="ml-2">Loading campaign data...</span>
    </div>

    <!-- Form (copy dari CreateCampaignView.vue) -->
    <form v-else @submit.prevent="onSubmit" class="space-y-8">
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

      <!-- Submit buttons -->
      <div class="flex gap-4 pt-6">
        <Button type="button" variant="outline" @click="router.push('/dashboard')" class="flex-1">
          Batal
        </Button>
        <Button type="submit" :disabled="isLoading || !isFormValid" class="flex-1">
          <Loader2 v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
          Update Campaign
        </Button>
      </div>
    </form>
  </main>

  <KFooter />
</template>
