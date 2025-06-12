import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion,
  getDocs
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { 
  ChatRoom, 
  ChatMessage, 
  CreateChatRoomParams, 
  SendMessageParams 
} from '@/types/chat'

export const chatService = {
  /**
   * Get chat rooms for a specific user
   */
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    const chatRoomsRef = collection(db, 'chatRooms')
    const q = query(
      chatRoomsRef,
      where('members', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatRoom[]
  },

  /**
   * Create a new chat room
   */
  async createChatRoom(params: CreateChatRoomParams): Promise<string> {
    const chatRoomsRef = collection(db, 'chatRooms')
    
    const chatRoomData = {
      members: params.members,
      memberDetails: [], // This should be populated with actual user data
      type: params.type,
      name: params.name || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null
    }
    
    const docRef = await addDoc(chatRoomsRef, chatRoomData)
    return docRef.id
  },

  /**
   * Send a message to a chat room
   */
  async sendMessage(params: SendMessageParams, senderId: string, senderName: string): Promise<string> {
    const messagesRef = collection(db, 'messages')
    
    const messageData = {
      chatRoomId: params.chatRoomId,
      senderId,
      senderName,
      text: params.text,
      type: params.type || 'text',
      timestamp: serverTimestamp(),
      readBy: [senderId], // Sender has read the message by default
      edited: false
    }
    
    // Add the message
    const messageDocRef = await addDoc(messagesRef, messageData)
    
    // Update the chat room's last message and updatedAt
    const chatRoomRef = doc(db, 'chatRooms', params.chatRoomId)
    await updateDoc(chatRoomRef, {
      lastMessage: {
        id: messageDocRef.id,
        senderId,
        senderName,
        text: params.text,
        timestamp: serverTimestamp(),
        type: params.type || 'text'
      },
      updatedAt: serverTimestamp()
    })
    
    return messageDocRef.id
  },

  /**
   * Get messages for a specific chat room
   */
  async getMessages(chatRoomId: string): Promise<ChatMessage[]> {
    const messagesRef = collection(db, 'messages')
    const q = query(
      messagesRef,
      where('chatRoomId', '==', chatRoomId),
      orderBy('timestamp', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[]
  },

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    const promises = messageIds.map(messageId => {
      const messageRef = doc(db, 'messages', messageId)
      return updateDoc(messageRef, {
        readBy: arrayUnion(userId)
      })
    })
    
    await Promise.all(promises)
  },

  /**
   * Find or create a direct chat room between two users
   */
  async findOrCreateDirectChat(userId1: string, userId2: string): Promise<string> {
    const chatRoomsRef = collection(db, 'chatRooms')
    
    // Try to find existing direct chat
    const q = query(
      chatRoomsRef,
      where('type', '==', 'direct'),
      where('members', 'array-contains', userId1)
    )
    
    const querySnapshot = await getDocs(q)
    const existingChat = querySnapshot.docs.find(doc => {
      const data = doc.data()
      return data.members.includes(userId2)
    })
    
    if (existingChat) {
      return existingChat.id
    }
    
    // Create new direct chat
    return await this.createChatRoom({
      members: [userId1, userId2],
      type: 'direct'
    })
  }
}

export default chatService