<script setup lang="ts">
import { LoaderCircle, Lock, Mail, UserRound } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useFirebaseAuth } from 'vuefire'
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/user'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import KHeader from '@/components/KHeader.vue'

const googleAuthProvider = new GoogleAuthProvider()

const auth = useFirebaseAuth()
const router = useRouter()
const userStore = useUserStore()

const { isLoading } = storeToRefs(userStore)
const isGoogleLoading = ref(false)

const formSchema = toTypedSchema(
  z
    .object({
      username: z
        .string()
        .min(4, 'Username minimal 4 karakter')
        .max(20, 'Username maksimal 20 karakter'),
      email: z.string().email('Email tidak valid'),
      password: z.string().min(8, 'Password minimal 8 karakter'),
      confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password tidak cocok',
      path: ['confirmPassword'],
    }),
)

const { handleSubmit, meta } = useForm({
  validationSchema: formSchema,
})

const handleGoogleSignUp = async () => {
  isGoogleLoading.value = true

  try {
    if (!auth) throw new Error('Firebase auth is not initialized')

    const result = await signInWithPopup(auth, googleAuthProvider)

    // Get ID token for backend validation
    const idToken = await result.user.getIdToken()
    console.log('Google Registration ID Token:', idToken)

    // Optional: Send token to your backend for validation and user creation
    // await validateTokenWithBackend(idToken, { isNewUser })

    if (result.operationType === 'signIn') {
      toast.success('Akun berhasil dibuat dengan Google')
    } else {
      toast.success('Berhasil masuk dengan Google')
    }

    router.push('/dashboard') // or wherever you want to redirect
  } catch (error) {
    toast.error('Gagal login dengan Google')
    console.error('Google login failed:', error)
  } finally {
    isGoogleLoading.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  try {
    if (!auth) throw new Error('Firebase auth is not initialized')

    const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)

    // Update user profile with username
    await updateProfile(userCredential.user, {
      displayName: values.username,
    })

    // Get ID token for backend validation
    const idToken = await userCredential.user.getIdToken()
    userStore.register({
      name: values.username,
      email: values.email,
      password: values.password,
      idToken,
    })
  } catch (error) {
    toast.error('Gagal membuat akun. Silakan coba lagi')
    console.error('Email registration error:', error)
  } finally {
    isLoading.value = false
  }
})

// Optional: Function to validate token with your backend
// const validateTokenWithBackend = async (idToken: string, userData?: any) => {
//   try {
//     const response = await fetch('http://localhost:3000/api/auth/register', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${idToken}`
//       },
//       body: JSON.stringify(userData || {})
//     })

//     if (!response.ok) {
//       throw new Error('Backend validation failed')
//     }

//     const data = await response.json()
//     console.log('Backend registration success:', data)
//     return data
//   } catch (error) {
//     console.error('Backend registration error:', error)
//     // Don't throw error here - frontend registration can work without backend
//     return null
//   }
// }
</script>

<template>
  <KHeader variant="outline" />

  <main class="flex flex-col items-center justify-center mt-[72px] p-6 h-[calc(100dvh-73px)]">
    <div class="w-full max-w-md border border-gray-100 rounded-md p-8">
      <h1 class="text-2xl font-medium text-center mb-8">Register</h1>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormControl>
              <Input type="text" placeholder="Username" is-icon v-bind="componentField">
                <UserRound class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormControl>
              <Input
                type="email"
                placeholder="Email"
                autocomplete="email"
                is-icon
                v-bind="componentField"
              >
                <Mail class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormControl>
              <Input
                type="password"
                placeholder="Password"
                autocomplete="new-password"
                is-icon
                v-bind="componentField"
              >
                <Lock class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormControl>
              <Input
                type="password"
                placeholder="Confirm Password"
                autocomplete="new-password"
                is-icon
                v-bind="componentField"
              >
                <Lock class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button
          type="submit"
          size="lg"
          :disabled="!meta.valid || isLoading || isGoogleLoading"
          class="w-full"
        >
          <LoaderCircle v-if="isLoading" class="animate-spin size-5 mr-2" />
          <template v-else>Buat Akun</template>
        </Button>
      </form>

      <!-- Divider -->
      <div class="my-6 flex items-center">
        <div class="flex-1 border-t border-border"></div>
        <div class="px-3 text-sm text-gray-500">atau</div>
        <div class="flex-1 border-t border-border"></div>
      </div>

      <Button
        @click="handleGoogleSignUp"
        variant="outline"
        size="lg"
        :disabled="isLoading || isGoogleLoading"
        class="w-full"
      >
        <LoaderCircle v-if="isGoogleLoading" class="animate-spin size-5 mr-2" />
        <template v-else>
          <img
            src="/assets/logo/google.svg"
            alt="Google Logo"
            width="20"
            height="20"
            class="mr-2"
          />
          Daftar dengan Google
        </template>
      </Button>

      <!-- Login link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Sudah punya akun?
          <RouterLink to="/login" class="text-teal-600 hover:underline font-medium">
            Masuk Sekarang
          </RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>
