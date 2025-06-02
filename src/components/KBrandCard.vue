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
            {{ metrics.applications.accepted  }} Accepted
          </p>
          <p class="text-xs text-blue-700">
            {{ metrics.applications.applied }} Apply •
            {{ metrics.applications.rejected }} Reject
          </p>
        </div>

        <div class="bg-green-50 p-3 rounded-md">
          <div class="flex items-center gap-2 mb-1">
            <FileText class="h-4 w-4 text-green-600" />
            <span class="text-xs font-medium text-green-600">Content</span>
          </div>
          <p class="text-lg font-bold text-green-900">
            {{ metrics.content.approved }} Approved
          </p>
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
      <Button @click="$router.push({ name: 'detail', params: { id: campaign.id } })" class="flex-1" size="sm">
        <Eye class="h-4 w-4 mr-1" />
        See Details
      </Button>
      <Button class="flex-1" size="sm" variant="outline">
        <Settings class="h-4 w-4 mr-1" />
        Edit Campaign
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator' // Placeholder

// Assuming lucide-vue-next for icons
import {
  Calendar,
  DollarSign,
  Users,
  FileText,
  Settings,
  Eye,
  Clapperboard,
} from 'lucide-vue-next'
import type { Campaign } from '@/types/campaign'

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
</script>
