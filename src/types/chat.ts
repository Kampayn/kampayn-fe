export interface ChatRoom {
  id: string
  members: string[] // Array of user IDs
  lastMessage?: string
  updatedAt: string
  createdAt: string
}

export interface ChatMember {
  id: string
  name: string
  email: string
  role: 'influencer' | 'brand'
  avatar?: string
  company?: string
  online?: boolean
}

export interface LastMessage {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: string
  type: 'text' | 'image' | 'file'
}

export interface ChatMessage {
  id: string
  chatRoomId: string
  senderId: string
  senderName: string
  text: string
  timestamp: string
  type: 'text' | 'image' | 'file'
  readBy: string[] // Array of user IDs who have read this message
  edited?: boolean
  editedAt?: string
}

export interface CreateChatRoomParams {
  members: string[]
  type: 'direct' | 'group'
  name?: string
}

export interface SendMessageParams {
  chatRoomId: string
  text: string
  type?: 'text' | 'image' | 'file'
}