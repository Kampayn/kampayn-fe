<script setup lang="ts">
import { ref } from 'vue'
import { LoaderCircle, Lock, Mail } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useFirebaseAuth } from 'vuefire'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
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
  z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
  }),
)

const { isFieldDirty, handleSubmit, meta } = useForm({
  validationSchema: formSchema,
})

const handleGoogleSignIn = async () => {
  isGoogleLoading.value = true

  try {
    if (!auth) throw new Error('Firebase auth is not initialized')

    const userCredential = await signInWithPopup(auth, googleAuthProvider)

    // Get ID token for backend validation
    const idToken = await userCredential.user.getIdToken()
    const loginSuccess = await userStore.google({ idToken })

    // Only redirect if login was successful
    if (loginSuccess) router.push('/dashboard')
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

    const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password)

    // Get ID token for backend validation
    const idToken = await userCredential.user.getIdToken()
    const loginSuccess = await userStore.login({
      email: values.email,
      password: values.password,
      idToken,
    })

    // Only redirect if login was successful
    if (loginSuccess) router.push('/dashboard')
  } catch (error) {
    toast.error('Email atau password salah')
    console.error('Email/Password sign in error:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <KHeader variant="outline" />

  <main class="flex flex-col items-center justify-center mt-[72px] p-6 h-[calc(100dvh-73px)]">
    <div class="w-full max-w-md border border-gray-100 rounded-md p-8">
      <h1 class="text-2xl font-medium text-center mb-8">Log in</h1>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
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

        <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormControl>
              <Input
                type="password"
                placeholder="Password"
                autocomplete="current-password"
                is-icon
                v-bind="componentField"
              >
                <Lock class="size-5 text-muted-foreground" />
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Forgot password -->
        <div class="flex justify-end">
          <RouterLink to="/forgot-password" class="text-sm text-gray-600 hover:text-teal-600">
            Lupa password?
          </RouterLink>
        </div>

        <Button
          type="submit"
          size="lg"
          :disabled="!meta.valid || isLoading || isGoogleLoading"
          class="w-full"
        >
          <LoaderCircle v-if="isLoading" class="animate-spin size-5 mr-2" />
          <template v-else>Masuk</template>
        </Button>
      </form>

      <!-- Divider -->
      <div class="my-6 flex items-center">
        <div class="flex-1 border-t border-border"></div>
        <div class="px-3 text-sm text-gray-500">atau</div>
        <div class="flex-1 border-t border-border"></div>
      </div>

      <Button
        @click="handleGoogleSignIn"
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
          Masuk dengan Google
        </template>
      </Button>

      <!-- Register link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Belum punya akun?
          <RouterLink to="/register" class="text-teal-600 hover:underline font-medium">
            Daftar Akun
          </RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>
