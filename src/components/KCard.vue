<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Campaign } from '@/types/campaign'

defineProps<Campaign>()
</script>

<template>
  <Card class="overflow-hidden cursor-pointer">
    <div class="bg-gray-100 h-48 flex items-center justify-center text-gray-400">Pict</div>
    <div class="p-4">
      <h3 class="font-semibold mb-1">{{ campaign_name }}</h3>
      <p class="text-gray-500 text-sm mb-2">Rinrain Store • Product Launch</p>

      <div class="flex gap-2 mb-3">
        <Badge variant="outline" class="bg-gray-50 text-gray-600 rounded-full font-normal">
          Food
        </Badge>
        <Badge variant="outline" class="bg-gray-50 text-gray-600 rounded-full font-normal">
          Healthy
        </Badge>
      </div>

      <p class="text-gray-600 text-sm mb-3">Timeline: 10 - 20 Juni 2024</p>

      <Button
        variant="outline"
        size="sm"
        class="bg-green-50 border-green-100 text-gray-800 text-xs"
      >
        Mulai dari Rp2 Juta
      </Button>
    </div>
  </Card>
</template>
