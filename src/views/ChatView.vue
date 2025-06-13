<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@vueuse/core'
import KHeader from '@/components/KHeader.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useChat } from '@/composables/useChat'
import type { ChatRoom } from '@/types/chat'
import KChatRoomList from '@/components/KChatRoomList.vue'
import KChatInterface from '@/components/KChatInterface.vue'
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: 'Chat',
  description: 'Chat with other users on Kampayn',
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

// --- Vue Reactive State ---
const showUserList = ref(true)

// Use the chat composable
const { conversations, isLoadingConversations, conversationsError } = useChat()
const selectedChatRoom = ref<ChatRoom | null>(null)

// --- Composables ---
const isDesktop = useMediaQuery('(min-width: 768px)')

// --- Watchers (Effects) ---
// Reset mobile view when switching to desktop
watch(isDesktop, (isNowDesktop) => {
  if (isNowDesktop) {
    showUserList.value = true
  }
})

// --- Methods ---
const handleChatRoomSelect = (chatRoom: ChatRoom) => {
  selectedChatRoom.value = chatRoom
  if (!isDesktop.value) {
    showUserList.value = false
  }
}

// Remove handleUserSelect function as we're not using it anymore

onMounted(() => {
  console.log('uid', user.value.id)

  if (!user.value.id) {
    console.warn('User not logged in')
    return
  }
})
</script>

<template>
  <KHeader variant="outline">
    <template #menus>
      <Button variant="link" as-child>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </Button>
      <Button variant="link" as-child>
        <RouterLink to="/chat">Chat</RouterLink>
      </Button>
    </template>
  </KHeader>

  <div class="flex mt-[72px] h-[calc(100vh-72px)] bg-white">
    <!-- User List - Hidden on mobile when chat is open -->
    <div
      :class="
        cn(
          'border-r border-gray-200 flex-shrink-0',
          isDesktop ? 'w-80' : 'w-full',
          !isDesktop && !showUserList && 'hidden',
        )
      "
    >
      <div class="px-4 py-[22px] border-b border-gray-200">
        <h2 class="text-xl font-bold">Messages</h2>
      </div>
      <div class="h-[calc(100vh-5rem-72px)]">
        <div class="space-y-1 p-2">
          <!-- Loading state -->
          <div v-if="isLoadingConversations" class="p-4 text-center text-gray-500">
            Loading conversations...
          </div>
          
          <!-- Error state -->
          <div v-else-if="conversationsError" class="p-4 text-center text-red-500">
            Error: {{ conversationsError }}
          </div>
          
          <!-- Chat rooms list -->
          <KChatRoomList
            v-for="chatRoom in conversations"
            :key="chatRoom.id"
            :chatRoom="chatRoom"
            @click="handleChatRoomSelect(chatRoom)"
          />
          
          <!-- Empty state -->
          <div v-if="!isLoadingConversations && !conversationsError && conversations.length === 0" class="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Interface Component -->
    <KChatInterface
      v-if="selectedChatRoom"
      :selected-chat-room="selectedChatRoom"
      :is-desktop="isDesktop"
      :show-user-list="showUserList"
      @update:show-user-list="showUserList = $event"
    />
    
    <!-- Empty State when no chat room is selected -->
    <div
      v-else
      :class="cn('flex flex-col flex-1 items-center justify-center', !isDesktop && showUserList && 'hidden')"
    >
      <div class="text-center text-gray-500 max-w-md">
        <div class="mb-4">
          <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
        <p class="text-sm text-gray-500">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  </div>
</template>
