<script setup lang="ts">
import { useUserStore } from '@/stores/user'
// import { storeToRefs } from 'pinia'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import type { ChatRoom } from '@/types/chat'
import { onMounted, ref } from 'vue'
import type { User } from '@/types/user'
import { storeToRefs } from 'pinia'

interface Props {
  chatRoom: ChatRoom
}

const props = defineProps<Props>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const userProfile = ref<User | null>(null)

const receiver = (members: string[]) => {
  return members.find((member) => member !== user?.value.id)
}

onMounted(async () => {
  const uid = receiver(props.chatRoom.members)
  if (!uid) {
    return
  }

  try {
    const user = await userStore.fetchOtherProfile(uid)
    userProfile.value = user
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
})
</script>

<template>
  <div
    :class="[
      'flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100',
      //   selectedChatRoom?.id === chatRoom.id && 'bg-gray-100',
    ]"
  >
    <Avatar>
      <AvatarImage
        :src="userProfile?.name || '/placeholder.svg?height=40&width=40'"
        :alt="userProfile?.name || 'User'"
      />
      <AvatarFallback class="bg-blue-100 text-blue-600">
        {{ userProfile?.name?.charAt(0)?.toUpperCase() || 'C' }}
      </AvatarFallback>
    </Avatar>
    <div class="flex-1 min-w-0">
      <p class="font-medium truncate">{{ userProfile?.name }}</p>
      <p v-if="chatRoom.lastMessage" class="text-sm text-gray-500 truncate">
        {{ chatRoom.lastMessage }}
      </p>
      <p v-else class="text-sm text-gray-400 italic">No messages yet</p>
    </div>
  </div>
</template>
