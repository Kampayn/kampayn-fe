import { ref, computed, onMounted, type Ref } from 'vue'
import { useCollection } from 'vuefire'
import { collection, query, where, orderBy, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUserStore } from '@/stores/user'
import type { ChatRoom, ChatMessage } from '@/types/chat'

export function useChat() {
  const userStore = useUserStore()
  const isLoadingConversations = ref(false)
  const conversationsError = ref<string | null>(null)
  
  // Create the query for chat rooms where current user is a member
  const chatRoomsQuery = computed(() => {
    if (!userStore.user?.id) return null
    
    return query(
      collection(db, 'chatRooms'),
      where('members', 'array-contains', userStore.user.id),
      orderBy('updatedAt', 'desc')
    )
  })
  
  // Use vuefire's useCollection for real-time updates
  const { data: conversations, pending, error } = useCollection<ChatRoom>(
    chatRoomsQuery,
    { ssrKey: 'chatRooms' }
  )
  
  // Watch for loading and error states
  const watchConversations = () => {
    isLoadingConversations.value = pending.value
    conversationsError.value = error.value?.message || null
  }
  
  onMounted(() => {
    watchConversations()
  })
  
  return {
    conversations: computed(() => conversations.value || []),
    isLoadingConversations: computed(() => pending.value),
    conversationsError: computed(() => error.value?.message || null)
  }
}

// Composable for managing messages in a specific chat room
export function useChatMessages(chatRoomId: Ref<string | null>) {
  const userStore = useUserStore()
  
  // Create reactive query for messages
  const messagesQuery = computed(() => {
    if (!chatRoomId.value) return null
    
    return query(
      collection(db, 'chatRooms', chatRoomId.value, 'messages'),
      orderBy('timestamp', 'asc')
    )
  })
  
  // Use vuefire's useCollection for real-time message updates
  const { data: messages, pending: messagesLoading, error: messagesError } = useCollection<ChatMessage>(
    messagesQuery,
    { ssrKey: 'chatMessages' }
  )
  
  // Send message function
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || !userStore.user?.id || !chatRoomId.value) return
    
    try {
      const messagesColRef = collection(db, 'chatRooms', chatRoomId.value, 'messages')
      const chatDocRef = doc(db, 'chatRooms', chatRoomId.value)
      
      // Add the new message document
      await addDoc(messagesColRef, {
        content: messageText,
        senderId: userStore.user.id,
        timestamp: serverTimestamp(),
        type: 'text'
      })
      
      // Update the lastMessage on the parent chat document
      await updateDoc(chatDocRef, {
        lastMessage: messageText,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }
  
  return {
    messages: computed(() => messages.value || []),
    messagesLoading: computed(() => messagesLoading.value),
    messagesError: computed(() => messagesError.value?.message || null),
    sendMessage
  }
}