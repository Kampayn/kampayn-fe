<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, ArrowLeft } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@vueuse/core'
import KHeader from '@/components/KHeader.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useChat, useChatMessages } from '@/composables/useChat'
import type { ChatRoom, ChatMessage } from '@/types/chat'
import KChatRoomList from '@/components/KChatRoomList.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

// --- Vue Reactive State ---
const newMessage = ref('')
const showUserList = ref(true)
const messagesEndRef = ref<HTMLDivElement | null>(null)

// Use the chat composable
const { conversations, isLoadingConversations, conversationsError } = useChat()
const selectedChatRoom = ref<ChatRoom | null>(null)
const selectedChatRoomId = computed(() => selectedChatRoom.value?.id || null)

// Use chat messages composable
const { messages, messagesLoading, messagesError, sendMessage } = useChatMessages(selectedChatRoomId)

// --- Composables ---
const isDesktop = useMediaQuery('(min-width: 768px)')

// --- Watchers (Effects) ---
// Scroll to bottom of messages when messages change
watch(
  messages,
  async () => {
    await nextTick() // Wait for the DOM to update before scrolling
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
  },
  { deep: true }, // Use 'deep' to watch for changes inside the array
)

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

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChatRoom.value) return
  
  try {
    await sendMessage(newMessage.value)
    newMessage.value = ''
  } catch (error) {
    console.error('Failed to send message:', error)
    // You might want to show a toast notification here
  }
}

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSendMessage()
  }
}

const formatTime = (timestamp: any) => {
  if (!timestamp) return ''
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

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

    <!-- Chat Interface - Full width on mobile when chat is open -->
    <div :class="cn('flex flex-col flex-1', !isDesktop && showUserList && 'hidden')">
      <!-- Chat Header -->
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Button
            v-if="!isDesktop"
            variant="ghost"
            size="icon"
            class="mr-1"
            @click="showUserList = true"
          >
            <ArrowLeft class="h-5 w-5" />
          </Button>
          <!-- Update template to use selectedChatRoom instead of selectedUser -->
          <Avatar>
            <AvatarImage
              :src="selectedChatRoom?.avatar || '/placeholder.svg?height=40&width=40'"
              :alt="selectedChatRoom?.name || 'Chat Room'"
            />
            <AvatarFallback class="bg-blue-100 text-blue-600">
              {{ selectedChatRoom?.name?.charAt(0).toUpperCase() || 'C' }}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 class="font-semibold">
              {{ selectedChatRoom?.name || 'Select a chat' }}
            </h3>
            <p class="text-xs text-gray-500">
              {{ selectedChatRoom ? `${selectedChatRoom.members.length} members` : 'No chat selected' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 p-4">
        <div class="space-y-4">
          <!-- Loading state for messages -->
          <div v-if="messagesLoading" class="text-center text-gray-500">
            Loading messages...
          </div>
          
          <!-- Error state for messages -->
          <div v-else-if="messagesError" class="text-center text-red-500">
            Error loading messages: {{ messagesError }}
          </div>
          
          <!-- Messages list -->
          <div
            v-for="message in messages"
            :key="message.id"
            :class="cn('flex', message.senderId === userStore.user?.id ? 'justify-end' : 'justify-start')"
          >
            <div
              :class="
                cn(
                  'max-w-[70%] rounded-lg p-3',
                  message.senderId === userStore.user?.id
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none',
                )
              "
            >
              <p>{{ message.content }}</p>
              <p
                :class="
                  cn(
                    'text-xs mt-1',
                    message.senderId === userStore.user?.id ? 'text-blue-100' : 'text-gray-500',
                  )
                "
              >
                {{ formatTime(message.timestamp) }}
              </p>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-if="!messagesLoading && !messagesError && messages.length === 0" class="text-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
          
          <div ref="messagesEndRef" />
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex gap-2">
          <Input
            v-model="newMessage"
            placeholder="Type a message..."
            class="flex-1"
            @keydown="handleKeyPress"
          />
          <Button :disabled="newMessage.trim() === '' || !selectedChatRoom" @click="handleSendMessage">
            <Send class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
