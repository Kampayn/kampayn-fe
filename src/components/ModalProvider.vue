<script setup lang="ts">
import { Dialog } from '@/components/ui/dialog'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { useModal } from '@/composables/useModal'

const { show, showAlert, component, componentProps, isAlert } = useModal()
</script>

<template>
  <!-- Regular Dialog -->
  <Dialog :open="show" @update:open="(value) => (show = value)" v-if="!isAlert">
    <component :is="component" v-bind="componentProps" v-if="component" />
  </Dialog>
  
  <!-- Alert Dialog -->
  <AlertDialog :open="showAlert" @update:open="(value) => (showAlert = value)" v-if="isAlert">
    <component :is="component" v-bind="componentProps" v-if="component" />
  </AlertDialog>
</template>
