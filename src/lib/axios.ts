import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import authService from '@/services/auth'
import { useUserStore } from '@/stores/user'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
})

export const apiML = axios.create({
  baseURL: import.meta.env.VITE_API_ML_BASE_URL,
  timeout: 30000,
})

// Keep track of refreshing state to prevent multiple refresh requests
let isRefreshing = false
// Store pending requests to retry after token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
  config: InternalAxiosRequestConfig
}> = []

// Process the queue of failed requests
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      // Add the new token to the header
      prom.config.headers.Authorization = `Bearer ${token}`
      // Retry the request
      axios(prom.config)
        .then((response) => prom.resolve(response))
        .catch((err) => prom.reject(err))
    }
  })

  // Reset the queue
  failedQueue = []
}

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest.headers._retry) {
      if (isRefreshing) {
        // If already refreshing, add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest })
        })
      }

      // Mark as retrying to prevent infinite loop
      originalRequest.headers._retry = true
      isRefreshing = true

      // Get the user store
      const userStore = useUserStore()

      try {
        // Try to refresh the token
        const result = await authService.refreshToken(userStore.refresh_token)
        // const { data, error: refreshError } = await authService.refreshToken(
        //   userStore.refresh_token,
        // )

        if (!result.success) {
          // If refresh fails, logout and reject all queued requests
          userStore.logout()

          processQueue(new AxiosError('Failed to refresh token'))

          window.location.href = '/login'
          return Promise.reject(new AxiosError('Failed to refresh token'))
        }

        // Update tokens in store
        userStore.setTokens({
          access_token: result.data.data.accessToken,
          refresh_token: result.data.data.refreshToken,
        })

        // Update Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${result.data.data.accessToken}`
        originalRequest.headers.Authorization = `Bearer ${result.data.data.accessToken}`

        // Process queued requests
        processQueue(null, result.data.data.accessToken)
        isRefreshing = false

        // Retry the original request
        return axios(originalRequest)
      } catch (err) {
        // If something goes wrong, logout and reject all queued requests
        userStore.logout()
        processQueue(err as AxiosError)
        isRefreshing = false
        return Promise.reject(err)
      }
    }

    // For other errors, just reject
    return Promise.reject(error)
  },
)

// Request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.isLoggedIn) {
      config.headers.Authorization = `Bearer ${userStore.access_token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)
