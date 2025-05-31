import { api } from '@/lib/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import authService from '@/services/auth'
import type { User } from '@/types/user'
import type { GoogleParams, LoginParams, RegisterParams } from '@/types/auth'
// import { logCustomEvent } from '@/lib/analytics'

interface Data {
  user: User
  access_token: string
  refresh_token: string
}

export const useUserStore = defineStore('user', () => {
  const isLoading = ref(false)
  const isGoogleLogin = ref(false)
  const user = ref<Omit<User, 'token'>>({
    id: '',
    name: '',
    email: '',
  })
  const access_token = ref('')
  const refresh_token = ref('')

  const storedUser = localStorage.getItem('kampaiyn.auth.user')
  if (storedUser) {
    const userData = JSON.parse(storedUser) as Data
    user.value = {
      id: userData.user.id,
      name: userData.user.name,
      email: userData.user.email,
    }
    access_token.value = userData.access_token
    refresh_token.value = userData.refresh_token

    api.defaults.headers.common['Authorization'] = `Bearer ${access_token.value}`
  }

  const getUser = computed(() => user.value)

  const isLoggedIn = computed(() => {
    return Boolean(user.value.id)
  })

  const setUser = (values: Data) => {
    user.value = values.user
    access_token.value = values.access_token
    refresh_token.value = values.refresh_token

    localStorage.setItem(
      'kampaiyn.auth.user',
      JSON.stringify({
        user: values.user,
        access_token: values.access_token,
        refresh_token: values.refresh_token,
      }),
    )

    api.defaults.headers.common['Authorization'] = `Bearer ${values.access_token}`

    // TODO Log user properties
    // logCustomEvent('user_info', {
    //   user_id: values.user.id,
    //   user_role: values.user.role,
    //   has_updated_profile: values.user.profile_has_updated,
    // })
  }

  const login = async (params: LoginParams) => {
    isLoading.value = true
    try {
      const { data, error } = await authService.login(params)
      if (error) {
        toast.error('Login failed')
        console.log(error)
        console.log(data)
        return
      }
      toast.success('Logged in successfully')

      setUser(data!.data!)
    } catch (error) {
      toast.error('Login failed 2')
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  const register = async (params: RegisterParams) => {
    isLoading.value = true
    try {
      const { data, error } = await authService.register(params)
      if (error) {
        toast.error('Registration failed')
        console.log(error)
        console.log(data)
        return
      }

      toast.success(data!.message)
    } catch (error) {
      toast.error('Registration failed 2')
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  const google = async (params: GoogleParams) => {
    isLoading.value = true
    try {
      const { data, error } = await authService.google(params)
      if (error) {
        toast.error('Google login failed')
        console.log(error)
        console.log(data)
        return
      }

      toast.success('Google login successful')
      // setUser(data!.Data)
      console.log('user', data)
      isGoogleLogin.value = true
    } catch (error) {
      toast.error('Google login failed 2')
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    // TODO Log logout event before clearing user data
    // if (user.value.id) {
    //   logCustomEvent('logout', { user_id: user.value.id })
    // }

    user.value = {
      id: '',
      name: '',
      email: '',
    }
    access_token.value = ''
    refresh_token.value = ''
    localStorage.removeItem('kampaiyn.auth.user')
    api.defaults.headers.common['Authorization'] = ''

    // TODO google Logout
  }

  return {
    isLoading,
    user,
    access_token,
    refresh_token,
    getUser,
    isLoggedIn,
    isGoogleLogin,
    setUser,
    login,
    google,
    register,
    logout,
  }
})
