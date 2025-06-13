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

  const otherProfile = ref<User>()

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

  const setTokens = (values: { access_token: string; refresh_token: string }) => {
    access_token.value = values.access_token
    refresh_token.value = values.refresh_token
    localStorage.setItem(
      'kampaiyn.auth.user',
      JSON.stringify({
        user: user.value,
        access_token: values.access_token,
        refresh_token: values.refresh_token,
      }),
    )
    api.defaults.headers.common['Authorization'] = `Bearer ${values.access_token}`
  }

  const login = async (params: LoginParams): Promise<{ isSuccess: boolean; user: User | null }> => {
    isLoading.value = true
    try {
      const result = await authService.login(params)

      if (!result.success) {
        toast.error(result.error)
        return {
          isSuccess: false,
          user: null,
        }
      }

      toast.success(result.data.message || 'Login berhasil')

      if (!result.data.data) {
        toast.error('Data pengguna tidak ditemukan')
        return {
          isSuccess: false,
          user: null,
        }
      }

      setUser({
        user: result.data.data.user,
        access_token: result.data.data.accessToken,
        refresh_token: result.data.data.refreshToken,
      })

      return {
        isSuccess: true,
        user: result.data.data.user,
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login')
      console.log(error)
      return {
        isSuccess: false,
        user: null,
      }
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

  const google = async (params: GoogleParams): Promise<{ isSuccess: boolean; user: User | null }> => {
    isLoading.value = true
    try {
      const result = await authService.google(params)
      if (!result.success) {
        toast.error(result.error)
        return {
          isSuccess: false,
          user: null,
        }
      }

      toast.success('Login dengan Google berhasil')
      isGoogleLogin.value = true

      if (!result.data.data) {
        toast.error('Data pengguna tidak ditemukan')
        return {
          isSuccess: false,
          user: null,
        }
      }

      if (result.data.data?.user) {
        setUser({
          user: result.data.data.user,
          access_token: result.data.data.accessToken || '',
          refresh_token: result.data.data.refreshToken || '',
        })
      }

      return {
        isSuccess: true,
        user: result.data.data?.user
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login dengan Google')
      console.log(error)
      return {
          isSuccess: false,
          user: null,
        }
    } finally {
      isLoading.value = false
    }
  }

  const completeProfile = async (params: UserRoleParams): Promise<boolean> => {
    isLoading.value = true
    try {
      const influencerResult = await userService.getInfluencerData(params.instagram_username || '')
      if (!influencerResult.success) {
        toast.error(influencerResult.error)
        return false
      }

      const result = await userService.completeProfile({
        ...params,
        instagram_followers: influencerResult.data.followers.toString(),
        instagram_avg_likes: influencerResult.data.average_likes.toString(),
        instagram_avg_comments: influencerResult.data.average_comments.toString(),
        instagram_engagement_rate: influencerResult.data.engagement_rate.toString(),
      })
      if (!result.success) {
        toast.error(result.error)
        return false
      }

      toast.success(result.data.message)

      // Update user data if needed
      if (result.data.data.user) {
        user.value = { ...user.value, ...result.data.data.user }
      }
      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat melengkapi profil')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const fetchProfile = async (): Promise<boolean> => {
    isLoading.value = true
    try {
      const result = await userService.fetchProfile()
      if (!result.success) {
        toast.error(result.error)
        return false
      }
      toast.success(result.data.message)
      // Update user data if needed
      if (result.data.data.user) {
        user.value = { ...user.value, ...result.data.data.user }
      }

      return true
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengambil data pengguna')
      console.log(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const fetchOtherProfile = async (uid: string): Promise<User | null> => {
    isLoading.value = true
    try {
      const result = await userService.fetchOtherProfile(uid)
      if (!result.success) {
        toast.error(result.error)
        return null
      }
      toast.success(result.data.message)
      // Update user data if needed
      if (result.data.data.user) {
        otherProfile.value = result.data.data.user
      }

      return result.data.data.user
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengambil data pengguna')
      console.log(error)
      return null
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
    otherProfile,
    access_token,
    refresh_token,
    getUser,
    isLoggedIn,
    isGoogleLogin,
    setUser,
    setTokens,
    login,
    google,
    register,
    completeProfile,
    fetchProfile,
    fetchOtherProfile,
    logout,
  }
})
