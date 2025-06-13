<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import { ExternalLink, Loader2, Users } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCampaignStore } from '@/stores/campaign'
import { useTaskStore } from '@/stores/task'
import { useChatNavigation } from '@/composables/useChat'

interface Props {
  campaignId: string
}

const props = defineProps<Props>()

const campaignStore = useCampaignStore()
const { tasks } = storeToRefs(campaignStore)

const taskStore = useTaskStore()
const { createOrNavigateToChat } = useChatNavigation()

const selectedTaskId = ref('')

const tasksCount = computed(() => {
  return tasks.value.length
})

const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
  selectedTaskId.value = id

  try {
    const isSuccess = await taskStore.update({ id, status })
    if (isSuccess) await campaignStore.getTasks(props.campaignId)
  } catch (error) {
    toast.error('Gagal memperbarui status aplikasi')
    console.warn(error)
  } finally {
    selectedTaskId.value = ''
  }
}

const getStatusBadgeVariant = (statusType: string) => {
  switch (statusType) {
    case 'pending':
      return 'outline'
    case 'approved':
      return 'default'
    case 'rejected':
      return 'destructive'
    default:
      return 'outline'
  }
}

onMounted(async () => {
  await campaignStore.getTasks(props.campaignId)
})
</script>

<template>
  <Card class="mb-8">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Users class="h-5 w-5" />
        Review Task
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-medium text-gray-600">No</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Influencer</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Preview</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody v-if="tasksCount > 0">
            <tr
              v-for="(row, index) in tasks"
              :key="row.id"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="py-4 px-4 text-sm">{{ index + 1 }}</td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-medium"
                  >
                    {{
                      row.influencer?.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                    }}
                  </div>
                  <span class="font-medium text-gray-900">{{ row.influencer?.name }}</span>
                </div>
              </td>
              <td class="py-4 px-4">
                <Badge :variant="getStatusBadgeVariant(row.status)">
                  {{ row.status }}
                </Badge>
              </td>
              <td class="py-4 px-4">
                <a
                  :href="row.submission_url"
                  class="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                >
                  {{ row.submission_url }}
                  <ExternalLink class="h-3 w-3" />
                </a>
              </td>
              <td class="py-4 px-4">
                <div v-if="row.status === 'pending'" class="flex gap-2">
                  <Button
                    @click="handleUpdateStatus(row.id, 'approved')"
                    size="sm"
                    :disabled="selectedTaskId === row.id"
                  >
                    <Loader2 v-if="selectedTaskId === row.id" class="mr-2 h-4 w-4 animate-spin" />
                    {{ selectedTaskId === row.id ? 'Accepting...' : 'Accept' }}
                  </Button>
                  <Button
                    @click="handleUpdateStatus(row.id, 'rejected')"
                    size="sm"
                    :disabled="selectedTaskId === row.id"
                    variant="destructive"
                  >
                    <Loader2 v-if="selectedTaskId === row.id" class="mr-2 h-4 w-4 animate-spin" />
                    {{ selectedTaskId === row.id ? 'Rejecting...' : 'Reject' }}
                  </Button>
                </div>
                <Button
                  v-else
                  @click="createOrNavigateToChat(row.influencer?.id || '')"
                  size="sm"
                  variant="outline"
                >
                  Send Message
                </Button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div
          v-if="tasksCount === 0"
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Tasks Yet</h3>
          <p class="text-gray-500 mb-4 max-w-sm">
            There are no tasks to review for this campaign. Tasks will appear here when influencers
            submit their work.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
