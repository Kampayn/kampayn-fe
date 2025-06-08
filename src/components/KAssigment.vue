<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { Users, Copy, Loader, Send, Loader2, CheckCircle, XCircle } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import { storeToRefs } from 'pinia'
import { useClipboard } from '@vueuse/core'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { Task } from '@/types/task'
import { useTaskStore } from '@/stores/task'
import { useUserStore } from '@/stores/user'
import { useCampaignStore } from '@/stores/campaign'

interface Props {
  task: Task
  campaignId: string
}

const props = defineProps<Props>()

const { copy, copied } = useClipboard()

const taskStore = useTaskStore()
const { isLoading } = storeToRefs(taskStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const campaignStore = useCampaignStore()

// Schema validasi untuk URL submission
const formSchema = toTypedSchema(
  z.object({
    submission_url: z
      .string()
      .min(1, 'URL submission wajib diisi')
      .url('Format URL tidak valid')
      .refine(
        (url) => {
          // Validasi untuk platform penyimpanan umum
          const validDomains = ['drive.google.com']
          return validDomains.some((domain) => url.includes(domain))
        },
        {
          message: 'URL harus dari url yang valid',
        },
      ),
  }),
)

const { handleSubmit, meta, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    submission_url: props.task.submission_url || '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const isSuccess = await taskStore.createOrUpdateTask({
      campaign_id: props.campaignId,
      submission_url: values.submission_url,
    })

    if (isSuccess) campaignStore.getById(props.campaignId, user.value.role)
  } catch (error) {
    console.warn(error)
    toast.error('Gagal menyimpan data')
  }
})

watch(
  copied,
  (value) => {
    if (value) {
      toast.success('Berhasil menyalin URL')
    }
  },
)

onMounted(() => {
  if (props.task.submission_url !== '') {
    setFieldValue('submission_url', props.task.submission_url)
  }
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Users class="h-5 w-5" />
        My Assigment
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <span class="font-medium text-gray-900">Submission Status</span>
          <Badge 
            v-if="task?.status === 'pending'"
            class="bg-teal-100 text-teal-800 hover:bg-teal-200 flex items-center space-x-2"
          >
            <Loader class="h-3 w-3" />
            <span>Pending Review</span>
          </Badge>
          <Badge 
            v-else-if="task?.status === 'approved'"
            class="bg-green-100 text-green-800 hover:bg-green-200 flex items-center space-x-2"
          >
            <CheckCircle class="h-3 w-3" />
            <span>Approved</span>
          </Badge>
          <Badge 
            v-else-if="task?.status === 'rejected'"
            class="bg-red-100 text-red-800 hover:bg-red-200 flex items-center space-x-2"
          >
            <XCircle class="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        </div>

        <form @submit.prevent="onSubmit" class="flex items-end gap-2 w-full">
          <FormField v-slot="{ componentField }" name="submission_url" class="flex-1">
            <FormItem class="w-full">
              <FormLabel>Link Google Drive</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  :readonly="task.status !== 'rejected'"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button
            v-if="task.status === 'rejected'"
            type="submit"
            size="icon"
            :disabled="!meta.valid || isLoading"
          >
            <Loader2 v-if="isLoading" class="animate-spin size-4" />
            <Send v-else class="size-4" />
          </Button>
          <Button
            v-if="task.status === 'pending'"
            type="button"
            size="icon"
            variant="outline"
            @click="copy(task.submission_url)"
          >
            <Copy class="size-4" />
          </Button>
        </form>
      </div>
    </CardContent>
  </Card>
</template>
