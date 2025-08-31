// plugins/axios.js
import axios from 'axios'
import { useUserStore } from '~/stores/user.js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  axios.defaults.baseURL = config.public.API_BASE_URL
  axios.defaults.withCredentials = false
  axios.defaults.proxyHeaders = false

  // ---- Request interceptor (SSR + client) ----
  axios.interceptors.request.use((req) => {
    // Always read the freshest token via useCookie (SSR-safe)
    const token = useCookie('auth_token', { path: '/' }).value
    if (token) {
      req.headers = req.headers || {}
      req.headers.Authorization = `Bearer ${token}`
    } else if (req.headers && req.headers.Authorization) {
      delete req.headers.Authorization
    }
    return req
  })

  // ---- Response interceptor (mostly client concern) ----
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response } = error || {}
      if (response && response.status === 401) {
        // Clear app auth state
        const store = useUserStore()
        store.resetState()

        // Clear cookie using Nuxt's API
        const cookie = useCookie('auth_token', { path: '/' })
        cookie.value = null

        // Optional: client-side redirect to login, preserving current path
        if (process.client) {
          const router = useRouter()
          try {
            await router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
          } catch (_) {}
        }
      }
      // Always reject to let callers handle details if needed
      return Promise.reject(response || error)
    }
  )

  return { provide: { axios } }
})
