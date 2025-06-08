<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, CheckCircle2, CircleX, Clock, FileText, Loader, Loader2 } from 'lucide-vue-next'
import type { Campaign } from '@/types/campaign'
import dayjs from 'dayjs'
import { getCampaignTypeLabel } from '@/utils/enumHelper'
import type { Application } from '@/types/application'

interface Props {
  campaign?: Campaign
  application: Application
  isLoading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const emit = defineEmits<{
  (e: 'cancel', id: string): void
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
const canSubmitContent = computed(() => props.application.status === 'accepted')

const handleCancel = () => {
  emit('cancel', props.application.id)
}
</script>

<template>
  <Card class="w-full md:max-w-md transition-shadow duration-200 hover:shadow-lg">
    <CardHeader class="space-y-1">
      <CardTitle class="text-lg leading-tight line-clamp-2">
        {{ campaign?.campaign_name }}
      </CardTitle>
      <p class="text-sm text-muted-foreground">
        {{ getCampaignTypeLabel(campaign?.campaign_type || '') }} • Created on
        {{ dayjs(campaign?.createdAt).format('D MMM YYYY') }}
      </p>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Applied Date -->
      <div class="flex items-center gap-2 text-sm">
        <Clock class="h-4 w-4 text-muted-foreground" />
        <span>Applied on {{ formatDate(application.applied_at) }}</span>
      </div>

      <!-- Campaign Duration -->
      <div class="flex items-center gap-2 text-sm">
        <Calendar class="h-4 w-4 text-muted-foreground" />
        <span>
          {{ formatDate(campaign?.start_date || '') }} -
          {{ formatDate(campaign?.end_date || '') }}
        </span>
      </div>

      <!-- Content Due Date - Only show if approved -->
      <div v-if="application.status === 'accepted'" class="flex items-center gap-2 text-sm">
        <FileText class="h-4 w-4 text-orange-500" />
        <span class="font-medium text-orange-600">
          Content due by {{ formatDate(application.campaign?.end_date || '') }}
        </span>
      </div>

      <Separator />

      <!-- Status Timeline -->
      <div class="space-y-2">
        <p class="text-sm font-medium">Status</p>
        <div class="space-y-2">
          <div v-if="application.status === 'applied'" class="flex items-center gap-2">
            <Loader class="h-4 w-4" />
            <span class="text-sm">Application Pending</span>
          </div>
          <div v-if="application.status === 'accepted'" class="flex items-center gap-2">
            <CheckCircle2 class="h-4 w-4 text-green-600" />
            <span class="text-sm">Application approved</span>
          </div>
          <div v-if="application.status === 'rejected'" class="flex items-center gap-2">
            <CircleX class="h-4 w-4 text-red-600" />
            <span class="text-sm">Application rejected</span>
          </div>

          <!-- <div
            v-if="
              applicationStatus === 'content_submitted' ||
              applicationStatus === 'completed' ||
              applicationStatus === 'paid'
            "
            class="flex items-center gap-2"
          >
            <CheckCircle2 class="h-4 w-4 text-green-600" />
            <span class="text-sm">Content submitted</span>
          </div> -->

          <!-- <div
            v-if="applicationStatus === 'completed' || applicationStatus === 'paid'"
            class="flex items-center gap-2"
          >
            <CheckCircle2 class="h-4 w-4 text-green-600" />
            <span class="text-sm">Campaign completed</span>
          </div>

          <div v-if="applicationStatus === 'paid'" class="flex items-center gap-2">
            <CheckCircle2 class="h-4 w-4 text-green-600" />
            <span class="text-sm">Payment received</span>
          </div> -->
        </div>
      </div>
    </CardContent>

    <CardFooter class="flex gap-2">
      <Button
        v-if="application.status === 'applied'"
        @click="handleCancel"
        class="flex-1"
        variant="destructive"
        size="sm"
        :disabled="isLoading"
      >
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        {{ isLoading ? 'Canceling...' : 'Cancel Apply' }}
      </Button>
      <Button v-if="canSubmitContent" @click="$router.push(`/${campaign?.id}`)" class="flex-1" size="sm">
        <FileText class="mr-1 h-4 w-4" />
        View Brief
      </Button>
    </CardFooter>
  </Card>
</template>
