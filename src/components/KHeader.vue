<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/user'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Bell, LogOut, Menu, MessageCircle, User } from 'lucide-vue-next'

interface Props {
  variant?: 'outline' | 'solid'
}

withDefaults(defineProps<Props>(), {
  variant: 'solid',
})

const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)

const links = [
  {
    label: 'Profile',
    href: '/profile/me',
    icon: User,
  },
  {
    label: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
  {
    label: 'Chats',
    href: '/chats',
    icon: MessageCircle,
  },
  {
    label: 'Logout',
    href: '/logout',
    icon: LogOut,
  },
]
</script>

<template>
  <header
    class="fixed top-0 left-0 z-10 w-full bg-white"
    :class="[variant === 'outline' && 'border-b border-border']"
  >
    <nav class="container mx-auto flex flex-row items-center justify-between py-4 px-4">
      <div class="flex items-center">
        <RouterLink :to="isLoggedIn ? '/dashboard' : '/'" class="flex items-center">
          <img
            src="/assets/logo/logo.svg"
            alt="Kampaiyn Logo"
            width="150"
            height="40"
            class="h-10 w-auto"
          />
        </RouterLink>
      </div>

      <div class="hidden md:flex items-center space-x-4 mx-auto">
        <slot name="menus"></slot>
      </div>

      <div v-if="!isLoggedIn" class="flex items-center space-x-4">
        <Button variant="outline" as-child>
          <RouterLink to="/login">Masuk</RouterLink>
        </Button>
        <Button as-child>
          <RouterLink to="/register">Daftar</RouterLink>
        </Button>
      </div>
      <div v-else class="flex items-center space-x-4">
        <Avatar class="size-7">
          <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <Sheet>
          <SheetTrigger as-child><Button variant="outline" size="icon"><Menu /></Button></SheetTrigger>
          <SheetContent class="w-[400px] sm:w-[540px]">
            <div class="flex flex-col gap-4 px-7 py-5 w-full">
              <template v-for="(link, index) in links" :key="index">
                <RouterLink
                  v-if="link.label !== 'Logout'"
                  :to="link.href"
                  class="flex gap-2 text-xl font-medium"
                  ><component :is="link.icon" /> {{ link.label }}</RouterLink
                >
                <button
                  v-if="link.label === 'Logout'"
                  :to="link.href"
                  class="flex gap-2 text-xl text-destructive text-start font-medium"
                >
                  <component :is="link.icon" /> {{ link.label }}
                </button>
              </template>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  </header>
</template>
