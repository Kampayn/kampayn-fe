import { api } from '@/lib/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import authService from '@/services/auth'
import type { User, UserRoleParams } from '@/types/user'
import type { GoogleParams, LoginParams, RegisterParams } from '@/types/auth'
import userService from '@/services/user'
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

  const login = async (params: LoginParams): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await authService.login(params)
      
      if (!result.success) {
        toast.error(result.error)
        return false
      }
      
      toast.success(result.data.message || 'Login berhasil')

      if (!result.data.data) {
        toast.error('Data pengguna tidak ditemukan')
        return false
      }

      setUser({
        user: result.data.data.user,
        access_token: result.data.data.accessToken,
        refresh_token: result.data.data.refreshToken,
      })
      
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat login')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (params: RegisterParams): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await authService.register(params)
      if (!result.success) {
        toast.error(result.error)
        return false
      }

      toast.success(result.data.message)
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat registrasi')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const google = async (params: GoogleParams): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await authService.google(params)
      if (!result.success) {
        toast.error(result.error)
        return false
      }

      toast.success('Login dengan Google berhasil')
      console.log('user', result.data)
      isGoogleLogin.value = true
      
      if (result.data.data?.user) {
        setUser({
          user: result.data.data.user,
          access_token: result.data.data.accessToken || '',
          refresh_token: result.data.data.refreshToken || '',
        })
      }
      
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat login dengan Google')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const completeProfile = async (params: UserRoleParams): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await userService.completeProfile(params)
      if (!result.success) {
        toast.error(result.error)
        return false
      }

      toast.success('Profil berhasil dilengkapi')
      console.log(result.data)
      // Update user data if needed
      // if (result.data.user) {
      //   user.value = { ...user.value, ...result.data.user }
      // }
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat melengkapi profil')
      console.log(error)
      return false
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
    completeProfile,
    logout,
  }
})
