<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MessageCircle,
  MapPin,
  Star,
  Heart,
  TrendingUp,
  Instagram,
  Edit,
  Save,
  X,
  User,
} from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import KHeader from '@/components/KHeader.vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

const route = useRoute()

const userStore = useUserStore()
const { user, otherProfile } = storeToRefs(userStore)

// Reactive state variables
const isEditingBank = ref(false)
const bankAccount = ref('')
const showChat = ref(false) // For demonstration

// Computed properties to easily access nested data
const uid = computed(() => route.params.id)
const userData = computed(() => {
  if (uid.value === 'me') {
    return user.value
  }
  return otherProfile.value
})
const influencerProfile = computed(() => userData.value?.influencerProfile)
const brandProfile = computed(() => userData.value?.brandProfile)

const username = computed(() => {
  if (userData.value?.role === 'brand') {
    return userData.value.name
  }
  return `@${userData.value?.name}`
})

// Event Handlers
const handleChatClick = () => {
  showChat.value = true
  // In a real app, this would open a chat interface
  alert('Chat functionality would be implemented here!')
}

const handleSaveBankAccount = () => {
  isEditingBank.value = false
  // In a real app, this would save to the database
  alert('Bank account information saved!')
}

// Helper function to format large numbers
const formatNumber = (num: string) => {
  return 10
}

onMounted(() => {
  if (uid.value && uid.value !== 'me') {
    userStore.fetchOtherProfile(uid.value.toString())
  } else {
    userStore.fetchProfile()
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
        <RouterLink to="/dashboard">Chat</RouterLink>
      </Button>
    </template>
  </KHeader>

  <div class="max-w-5xl mx-auto mt-[72px] p-6 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex items-center gap-6">
        <Avatar class="w-24 h-24">
          <AvatarImage
            :src="
              brandProfile?.photo_url ||
              influencerProfile?.photo_url ||
              '/placeholder.svg?height=96&width=96'
            "
            :alt="userData?.name"
          />
          <AvatarFallback class="text-2xl font-semibold bg-blue-100 text-blue-600">
            {{ userData?.name.charAt(0).toUpperCase() }}
          </AvatarFallback>
        </Avatar>

        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-3xl font-bold text-gray-900">{{ username }}</h1>
            <Badge v-if="influencerProfile?.categories?.length">
              {{
                influencerProfile?.categories?.[0].charAt(0).toUpperCase() +
                influencerProfile?.categories?.[0].slice(1)
              }}
            </Badge>
          </div>

          <div v-if="userData?.role === 'influencer'" class="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin :size="16" />
            <span>Indonesia</span>
          </div>

          <Button @click="handleChatClick">
            <MessageCircle :size="16" class="mr-1" />
            Chat Now
          </Button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-if="userData?.role === 'influencer'" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-4 text-center">
          <div class="flex items-center justify-center mb-2">
            <Star :size="20" class="text-yellow-500 mr-1" />
            <span class="text-2xl font-bold">4.8</span>
          </div>
          <p class="text-sm text-gray-600">Rating</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 text-center">
          <div class="flex items-center justify-center mb-2">
            <Instagram :size="20" class="text-pink-500 mr-1" />
            <span class="text-2xl font-bold">
              {{ formatNumber(influencerProfile?.instagram_followers || '') }}
            </span>
          </div>
          <p class="text-sm text-gray-600">Instagram Followers</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 text-center">
          <div class="flex items-center justify-center mb-2">
            <Heart :size="20" class="text-red-500 mr-1" />
            <span class="text-2xl font-bold">
              {{ formatNumber(influencerProfile?.instagram_avg_likes || '') }}
            </span>
          </div>
          <p class="text-sm text-gray-600">Avg Likes</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 text-center">
          <div class="flex items-center justify-center mb-2">
            <TrendingUp :size="20" class="text-green-500 mr-1" />
            <span class="text-2xl font-bold">
              {{
                influencerProfile?.instagram_engagement_rate
                  ? `${influencerProfile.instagram_engagement_rate}%`
                  : 'N/A'
              }}
            </span>
          </div>
          <p class="text-sm text-gray-600">Engagement Rate</p>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content -->
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <User class="h-5 w-5" />
              Contact Information
            </div>

            <Button v-if="!isEditingBank" size="sm" @click="isEditingBank = true">
              <Edit class="h-5 w-5" />
              Edit
            </Button>
            <div v-else class="flex gap-1">
              <Button variant="ghost" size="sm" @click="handleSaveBankAccount">
                <Save :size="16" class="mr-1" />
                Save
              </Button>
              <Button variant="ghost" size="sm" @click="isEditingBank = false">
                <X :size="16" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Contact Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Contact Information</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600">Email</p>
                  <p class="font-medium">{{ userData?.email }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Member Since</p>
                  <p class="font-medium">{{ dayjs(userData?.createdAt).format('DD MMMM YYYY') }}</p>
                </div>
              </div>
            </div>

            <!-- Brand Information -->
            <div v-if="userData?.role === 'brand'" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Brand Information</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600">Brand Name</p>
                  <p class="font-medium">{{ brandProfile?.company }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Brand Category</p>
                  <p class="font-medium">{{ brandProfile?.category }}</p>
                </div>
              </div>
            </div>

            <!-- Bank Account Information -->
            <div v-else class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Bank Account</h3>
              </div>

              <div v-if="!isEditingBank" class="space-y-2">
                <p class="text-sm text-gray-600">Account Number</p>
                <p class="font-mono text-lg">
                  {{ bankAccount || 'Not provided' }}
                </p>
              </div>
              <div v-else class="space-y-2">
                <Label for="bankAccount">Account Number</Label>
                <Input
                  id="bankAccount"
                  v-model="bankAccount"
                  placeholder="Enter bank account number"
                  class="max-w-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
