<script setup lang="ts">
import { Button } from '@/components/ui/button'

interface Props {
  variant?: 'outline' | 'solid'
  menus?: Array<string>
}

withDefaults(defineProps<Props>(), {
  variant: 'solid',
})
</script>

<template>
  <header
    class="fixed top-0 left-0 z-10 w-full bg-white"
    :class="[variant === 'outline' && 'border-b border-border']"
  >
    <nav class="container mx-auto flex flex-row items-center justify-between py-4 px-4">
      <div class="flex items-center">
        <RouterLink to="/" class="flex items-center">
          <img
            src="/assets/logo/logo.svg"
            alt="Kampaiyn Logo"
            width="150"
            height="40"
            class="h-10 w-auto"
          />
        </RouterLink>
      </div>

      <div v-if="menus" class="hidden md:flex items-center space-x-8 mx-auto">
        <Button variant="link" as-child>
          <RouterLink v-for="(item, index) in menus" :key="index" :to="`/${item}`">
            {{ item }}
          </RouterLink>
        </Button>
      </div>

      <div class="flex items-center space-x-4">
        <slot></slot>
      </div>
    </nav>
  </header>
</template>
