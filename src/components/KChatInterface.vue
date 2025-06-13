<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, ArrowLeft } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/user'
import { useChatMessages } from '@/composables/useChat'
import type { ChatRoom } from '@/types/chat'
import type { User } from '@/types/user'
import { storeToRefs } from 'pinia'

interface Props {
  selectedChatRoom: ChatRoom | null
  isDesktop: boolean
  showUserList: boolean
}

interface Emits {
  (e: 'update:showUserList', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const userProfile = ref<User | null>(null)

const receiver = (members: string[]) => {
  return members.find((member) => member !== user?.value.id)
}

// --- Vue Reactive State ---
const newMessage = ref('')
const messagesEndRef = ref<HTMLDivElement | null>(null)

// Computed for selected chat room ID
const selectedChatRoomId = computed(() => props.selectedChatRoom?.id || null)

// Use chat messages composable
const { messages, messagesLoading, messagesError, sendMessage } =
  useChatMessages(selectedChatRoomId)

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

// --- Methods ---
const handleSendMessage = async () => {
  if (!newMessage.value.trim() || !props.selectedChatRoom) return

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

const handleBackToUserList = () => {
  emit('update:showUserList', true)
}

// Watch for changes in selectedChatRoom to update userProfile reactively
watch(
  () => props.selectedChatRoom,
  async (newChatRoom) => {
    if (!newChatRoom) {
      userProfile.value = null
      return
    }

    const uid = receiver(newChatRoom.members || [])
    if (!uid) {
      userProfile.value = null
      return
    }

    try {
      const user = await userStore.fetchOtherProfile(uid)
      userProfile.value = user
    } catch (error) {
      console.error('Error fetching user profile:', error)
      userProfile.value = null
    }
  },
  { immediate: true }, // Run immediately on component mount
)
</script>

<template>
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
          @click="handleBackToUserList"
        >
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <!-- Update template to use selectedChatRoom instead of selectedUser -->
        <Avatar>
          <AvatarImage
            :src="userProfile?.name || '/placeholder.svg?height=40&width=40'"
            :alt="userProfile?.name || 'User'"
          />
          <AvatarFallback class="bg-blue-100 text-blue-600">
            {{ userProfile?.name?.charAt(0)?.toUpperCase() || 'C' }}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 class="font-semibold">
            {{ userProfile?.name || 'Select a chat' }}
          </h3>
          <p class="text-xs text-gray-500">
            {{ userProfile?.role }}
          </p>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 p-4">
      <div class="space-y-4">
        <!-- Loading state for messages -->
        <div v-if="messagesLoading" class="text-center text-gray-500">Loading messages...</div>

        <!-- Error state for messages -->
        <div v-else-if="messagesError" class="text-center text-red-500">
          Error loading messages: {{ messagesError }}
        </div>

        <!-- Messages list -->
        <div
          v-for="message in messages"
          :key="message.id"
          :class="
            cn('flex', message.senderId === userStore.user?.id ? 'justify-end' : 'justify-start')
          "
        >
          <div
            :class="
              cn(
                'max-w-[70%] rounded-lg p-3',
                message.senderId === userStore.user?.id
                  ? 'bg-primary text-white rounded-br-none'
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
        <div
          v-if="!messagesLoading && !messagesError && messages.length === 0"
          class="text-center text-gray-500"
        >
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
        <Button
          :disabled="newMessage.trim() === '' || !selectedChatRoom"
          @click="handleSendMessage"
        >
          <Send class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
