<script setup lang="ts">
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useModal } from '@/composables/useModal'

interface Props {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Are you sure?',
  description: 'This action cannot be undone.',
  confirmText: 'Continue',
  cancelText: 'Cancel',
})

const { closeModal } = useModal()

const handleConfirm = () => {
  props.onConfirm?.()
  closeModal()
}

const handleCancel = () => {
  props.onCancel?.()
  closeModal()
}
</script>

<template>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{{ title }}</AlertDialogTitle>
      <AlertDialogDescription>
        {{ description }}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel @click="handleCancel">{{ cancelText }}</AlertDialogCancel>
      <AlertDialogAction @click="handleConfirm" class="bg-red-600 hover:bg-red-700">
        {{ confirmText }}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</template>