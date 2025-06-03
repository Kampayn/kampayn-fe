<script setup lang="ts">
import { Check } from 'lucide-vue-next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2"> Budget & Application Timeline </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <span class="font-semibold text-gray-900">Budget:</span>
          <span class="ml-2 text-gray-700">Rp 000000000,-</span>
        </div>
        <div>
          <span class="font-semibold text-gray-900">Payment:</span>
          <span class="ml-2 text-gray-700">Direct Transfer</span>
        </div>
        <div>
          <span class="font-semibold text-gray-900">Timeline:</span>
          <span class="ml-2 text-gray-700">01-01-2023 - 01-01-2023</span>
        </div>
      </div>

      <Button class="mt-4 w-full">
        <Check class="h-5 w-5" />
        <span>Apply Now</span>
      </Button>
    </CardContent>
  </Card>
</template>
