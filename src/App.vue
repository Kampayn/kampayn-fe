<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
import { storeToRefs } from 'pinia'

import { useUserStore } from './stores/user'

const router = useRouter()

const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)

watch(isLoggedIn, async(value) => {
  if (value) {
    const isSuccess = await userStore.fetchProfile()

    if (!isSuccess) {
      userStore.logout()
      router.push('/login')
    }
  } else {
    userStore.logout()
    router.push('/login')
  }
})
</script>

<template>
  <Toaster position="top-center" rich-colors class="pointer-events-auto" />
  <RouterView />
</template>
