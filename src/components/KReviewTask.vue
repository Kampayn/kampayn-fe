<script setup lang="ts">
import {
  ExternalLink,
  Users,
  Plus,
} from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReviewRow } from '@/types/review'

interface Props {
  rows: ReviewRow[]
}

defineProps<Props>()

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
</script>

<template>
  <Card class="mb-8">
    <CardHeader>
      <CardTitle class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Users class="h-5 w-5" />
          Review Task
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
              <th class="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Preview</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in rows"
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
                      row.influencer
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                    }}
                  </div>
                  <span class="font-medium text-gray-900">{{ row.influencer }}</span>
                </div>
              </td>
              <td class="py-4 px-4">
                <Badge :variant="getStatusBadgeVariant(row.statusType)">
                  {{ row.status }}
                </Badge>
              </td>
              <td class="py-4 px-4">
                <a
                  href="#"
                  class="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                >
                  {{ row.preview }}
                  <ExternalLink class="h-3 w-3" />
                </a>
              </td>
              <td class="py-4 px-4">
                <div v-if="row.statusType === 'pending'" class="flex gap-2">
                  <Button size="sm">Accept</Button>
                  <Button size="sm" variant="destructive">Reject</Button>
                </div>
                <Button v-else size="sm" variant="outline">Send Message</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</template>
