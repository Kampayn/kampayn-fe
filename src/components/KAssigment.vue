<script setup lang="ts">
import { onMounted } from 'vue'
import { Users, Copy, Loader } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { Task } from '@/types/task'

interface Props {
  task: Task
}

const props = defineProps<Props>()

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
    // TODO: Implement API call to update task submission
    console.log('Submitting:', values)
    toast.success('Submission berhasil dikirim!')
  } catch (error) {
    toast.error('Gagal mengirim submission')
    console.error('Submission error:', error)
  }
})

const copyToClipboard = async () => {
  // try {
  //   await navigator.clipboard.writeText(props.task.submission_url)
  //   toast.success('URL berhasil disalin!')
  // } catch (error) {
  //   toast.error('Gagal menyalin URL')
  // }
}

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
          <Badge class="bg-teal-100 text-teal-800 hover:bg-teal-200 flex items-center space-x-2">
            <Loader class="h-3 w-3" />
            <span>Pending Review</span>
          </Badge>
        </div>

        <form @submit.prevent="onSubmit">
          <FormField v-slot="{ componentField }" name="submission_url">
            <FormItem>
              <FormLabel>Link Google Drive</FormLabel>
              <div class="flex space-x-2">
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://instagram.com/p/example..."
                    class="flex-1"
                    v-bind="componentField"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  @click="copyToClipboard"
                  :disabled="!task.submission_url"
                >
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              class="text-red-600 border-red-200 hover:bg-red-50"
            >
              Delete
            </Button>
            <Button
              type="submit"
              class="bg-teal-600 hover:bg-teal-700 text-white"
              :disabled="!meta.valid"
            >
              <Loader v-if="meta.pending" class="mr-2 h-4 w-4 animate-spin" />
              {{ meta.pending ? 'Sending...' : 'Send' }}
            </Button>
          </div>
        </form>
      </div>
    </CardContent>
  </Card>
</template>
