<script setup lang="ts">
import { Users, Copy, Loader } from 'lucide-vue-next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'
</script>

<template>
  <Card v-if="true">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Users class="h-5 w-5" />
        Influencer Assigment
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <span class="font-medium text-gray-900">Submission Status</span>
          <Badge class="bg-teal-100 text-teal-800 hover:bg-teal-200 flex items-center space-x-2">
            <Loader class="h-3 w-3" />
            <span>Pending Review</span>
          </Badge>
        </div>

        <div>
          <label class="block font-medium text-gray-900 mb-2">Link Submission</label>
          <div class="flex space-x-2">
            <Input
              type="url"
              placeholder="https://hdsufHSDejdfbSDdefnsdlX..."
              class="flex-1"
              defaultValue="https://hdsufHSDejdfbSDdefnsdlX..."
            />
            <Button variant="outline" size="icon">
              <Copy class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <Button variant="outline" class="text-red-600 border-red-200 hover:bg-red-50">
            Delete
          </Button>
          <Button class="bg-teal-600 hover:bg-teal-700 text-white">Send</Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
