<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Users, Loader2, UserSearchIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCampaignStore } from '@/stores/campaign'
import { useApplicationStore } from '@/stores/application'
import { toast } from 'vue-sonner'
import KInfluencerModal from '@/components/KInfluencerModal.vue'
import { useModal } from '@/composables/useModal'

interface Props {
  campaignId: string
}

const props = defineProps<Props>()

const { openModal } = useModal()

const campaignStore = useCampaignStore()
const { applications } = storeToRefs(campaignStore)

const applicationStore = useApplicationStore()

const selectedApplicationId = ref('')

const pendingCount = computed(() => {
  return applications.value.filter((app) => app.status === 'applied').length
})

const handleOpenInfluencerModal = () => {
  openModal({
    component: KInfluencerModal,
    props: {
      campaignId: props.campaignId,
    },
  })
}

const handleUpdateStatus = async (id: string, status: 'accepted' | 'rejected') => {
  selectedApplicationId.value = id

  try {
    const isSuccess = await applicationStore.update({ id, status })
    if (isSuccess) await campaignStore.getApplications(props.campaignId)
  } catch (error) {
    toast.error('Gagal memperbarui status aplikasi')
    console.warn(error)
  } finally {
    selectedApplicationId.value = ''
  }
}

onMounted(async () => {
  await campaignStore.getApplications(props.campaignId)
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

        <Button @click="handleOpenInfluencerModal">
          <UserSearchIcon class="h-5 w-5" />
          Find Influencer
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
          <tbody v-if="pendingCount > 0">
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
                  <Button
                    @click="handleUpdateStatus(row.id, 'accepted')"
                    size="sm"
                    :disabled="selectedApplicationId === row.id"
                  >
                    <Loader2
                      v-if="selectedApplicationId === row.id"
                      class="mr-2 h-4 w-4 animate-spin"
                    />
                    {{ selectedApplicationId === row.id ? 'Accepting...' : 'Accept' }}
                  </Button>
                  <Button
                    @click="handleUpdateStatus(row.id, 'rejected')"
                    size="sm"
                    :disabled="selectedApplicationId === row.id"
                    variant="destructive"
                  >
                    <Loader2
                      v-if="selectedApplicationId === row.id"
                      class="mr-2 h-4 w-4 animate-spin"
                    />
                    {{ selectedApplicationId === row.id ? 'Rejecting...' : 'Reject' }}
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>

        </table>
        
        <!-- Empty State -->
        <div v-if="pendingCount === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p class="text-gray-500 mb-4 max-w-sm">
            There are no pending applications for this campaign. Applications will appear here when influencers apply.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
