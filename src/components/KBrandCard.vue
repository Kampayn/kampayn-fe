<template>
  <Card class="w-full max-w-md hover:shadow-lg transition-shadow duration-200">
    <CardHeader class="space-y-3">
      <div class="flex items-start justify-between">
        <div class="space-y-1 flex-1 min-w-0">
          <CardTitle class="text-lg leading-tight line-clamp-2">
            {{ campaign.campaign_name }}
          </CardTitle>
          <p class="text-sm text-muted-foreground">
            {{ campaign.campaign_type }}
          </p>
        </div>
        <Badge :class="statusColor" variant="outline">
          {{ campaign.status }}
        </Badge>
      </div>

      <Separator />
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Key Metrics Grid -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-blue-50 p-3 rounded-md">
          <div class="flex items-center gap-2 mb-1">
            <Users class="h-4 w-4 text-blue-600" />
            <span class="text-xs font-medium text-blue-600">Applications</span>
          </div>
          <p class="text-lg font-bold text-blue-900">
            {{ metrics.applications.accepted }} Accepted
          </p>
          <p class="text-xs text-blue-700">
            {{ metrics.applications.applied }} Apply • {{ metrics.applications.rejected }} Reject
          </p>
        </div>

        <div class="bg-green-50 p-3 rounded-md">
          <div class="flex items-center gap-2 mb-1">
            <FileText class="h-4 w-4 text-green-600" />
            <span class="text-xs font-medium text-green-600">Content</span>
          </div>
          <p class="text-lg font-bold text-green-900">{{ metrics.content.approved }} Approved</p>
          <p class="text-xs text-green-700">
            {{ metrics.content.pending }} Pending • {{ metrics.content.rejected }} Reject
          </p>
        </div>
      </div>

      <!-- Budget Information -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <DollarSign class="h-4 w-4 text-muted-foreground" />
            <span class="text-sm font-medium">Budget</span>
          </div>
          <span class="text-sm font-semibold">
            {{ formatCurrency(campaign.budget, campaign.currency) }}
          </span>
        </div>
      </div>

      <!-- Campaign Timeline -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Calendar class="h-4 w-4 text-muted-foreground" />
            <span class="text-sm font-medium">Timeline</span>
          </div>
          <span class="text-sm font-semibold">
            {{ formatDate(campaign.start_date) }} -
            {{ formatDate(campaign.end_date) }}
          </span>
        </div>
      </div>

      <!-- Platforms -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Clapperboard class="h-4 w-4 text-muted-foreground" />
            <span class="text-sm font-medium">Platforms</span>
          </div>
          <span class="text-sm font-semibold">
            {{ campaign.platforms.join(', ') }}
          </span>
        </div>
      </div>

      <!-- Content Type -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FileText class="h-4 w-4 text-muted-foreground" />
            <span class="text-sm font-medium">Content Type</span>
          </div>
          <span class="text-sm font-semibold">
            {{ campaign.content_types.join(', ') }}
          </span>
        </div>
      </div>
    </CardContent>

    <CardFooter class="flex gap-2">
      <Button @click="$router.push({ name: 'detail', params: { id: campaign.id } })" class="flex-1">
        <Eye class="h-4 w-4 mr-1" />
        See Details
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button size="icon" variant="outline">
            <Settings class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="handleUpdate"> Update </DropdownMenuItem>
          <DropdownMenuItem v-if="campaign.status !== 'active'" @click="handleUpdateStatus('active')">
            Set Active
          </DropdownMenuItem>
          <DropdownMenuItem v-if="campaign.status === 'active'" @click="handleUpdateStatus('cancelled')">
            Set Inactive
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="campaign.status !== 'active'"
            @click="handleOpenModal"
            variant="destructive"
            >Delete</DropdownMenuItem
          >
        </DropdownMenuContent>
      </DropdownMenu>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCampaignStore } from '@/stores/campaign'

import type { Campaign } from '@/types/campaign'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, DollarSign, Users, FileText, Settings, Eye, Clapperboard } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useModal } from '@/composables/useModal'
import KDeleteModal from '@/components/KDeleteModal.vue'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'

const { openModal } = useModal()

interface CampaignMetrics {
  applications: {
    applied: number
    accepted: number
    rejected: number
  }
  content: {
    rejected: number
    approved: number
    pending: number
  }
}

interface Props {
  campaign: Campaign
  metrics: CampaignMetrics
}

const props = defineProps<Props>()
const router = useRouter()
const campaignStore = useCampaignStore()
const {isLoading} = storeToRefs(campaignStore)

const formatCurrency = (amount: string, currency: string): string => {
  const num = Number.parseFloat(amount)
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num)
  }
  return `${currency} ${num.toLocaleString()}`
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getStatusColorClasses = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const statusColor = computed(() => getStatusColorClasses(props.campaign.status))

const handleUpdate = () => {
  router.push({ name: 'edit-campaign', params: { id: props.campaign.id } })
}

const handleUpdateStatus = async (status: "draft" | "published" | "pending_review" | "active" | "completed" | "cancelled") => {
  if (isLoading.value) return
  
  try {
    // Prepare data sesuai dengan CreateParams interface
    const updateData = {
      campaign_name: props.campaign.campaign_name,
      campaign_type: props.campaign.campaign_type,
      product_story: props.campaign.product_story,
      key_message: props.campaign.key_message,
      content_dos: props.campaign.content_dos,
      content_donts: props.campaign.content_donts,
      platforms: props.campaign.platforms,
      influencer_tiers: props.campaign.influencer_tiers,
      content_types: props.campaign.content_types,
      influencers_needed: props.campaign.influencers_needed,
      budget: Number.parseFloat(props.campaign.budget),
      currency: props.campaign.currency,
      payment_method: props.campaign.payment_method as 'secure_payment' | 'bank_transfer',
      start_date: props.campaign.start_date,
      end_date: props.campaign.end_date,
      status
    }
    
    const isSuccess = await campaignStore.update(props.campaign.id, updateData)
    if (isSuccess) {
      // Update local campaign object untuk reactivity
      Object.assign(props.campaign, { status })
    }
  } catch (error) {
    console.error('Error updating campaign status:', error)
    toast.error('Terjadi kesalahan saat mengubah status campaign')
  }
}

const handleDelete = async () => {
  const success = await campaignStore.deleteCampaign(props.campaign.id)
  if (success) {
    // Campaign sudah dihapus dari store, tidak perlu action tambahan
  }
}

const handleOpenModal = () => {
  openModal({
    component: KDeleteModal,
    isAlert: true,
    props: {
      title: 'Hapus Campaign',
      description: `Apakah Anda yakin ingin menghapus campaign "${props.campaign.campaign_name}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: handleDelete,
    },
  })
}
</script>
