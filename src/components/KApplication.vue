<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Users, Plus } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCampaignStore } from '@/stores/campaign'

interface Props {
  campaignId: string
}

const props = defineProps<Props>()

const campaignStore = useCampaignStore()
const { applications } = storeToRefs(campaignStore)

onMounted(() => {
  campaignStore.getApplications(props.campaignId)
})
</script>

<template>
  <Card class="mb-8">
    <CardHeader>
      <CardTitle class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Users class="h-5 w-5" />
          Applications
        </div>

        <Button>
          <Plus class="h-5 w-5" />
          Tambah
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-medium text-gray-600">No</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Influencer</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Category</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Engagement Rate</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in applications"
              :key="row.id"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="py-4 px-4 text-sm">{{ index + 1 }}</td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-medium"
                  >
                    K
                  </div>
                  <span class="font-medium text-gray-900">{{ row.influencer?.name }}</span>
                </div>
              </td>
              <td class="py-4 px-4">
                <span v-for="ctg in row.influencer?.influencerProfile?.categories" :key="ctg">
                  {{ ctg }}
                </span>
              </td>
              <td class="py-4 px-4">
                <span class="text-gray-900">{{
                  row.influencer?.influencerProfile?.instagram_engagement_rate
                }}</span>
              </td>
              <td class="py-4 px-4">
                <div v-if="row.status === 'applied'" class="flex gap-2">
                  <Button size="sm">Accept</Button>
                  <Button size="sm" variant="destructive">Reject</Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</template>
