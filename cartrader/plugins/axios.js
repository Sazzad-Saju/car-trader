// plugins/axios.js
import axios from 'axios'
import { useUserStore } from '~/stores/user.js'
import { useRouter } from '#app'
import { isProtectedPath } from '~/utils/protectedRoutes' // ✅ reuse

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  axios.defaults.baseURL = config.public.API_BASE_URL
  axios.defaults.withCredentials = false
  axios.defaults.proxyHeaders = false

  axios.interceptors.request.use((req) => {
    const token = useCookie('auth_token', { path: '/' }).value
    if (token) {
      req.headers = req.headers || {}
      req.headers.Authorization = `Bearer ${token}`
    } else if (req.headers && req.headers.Authorization) {
      delete req.headers.Authorization
    }
    return req
  })

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response } = error || {}

      if (response && response.status === 401) {
        const store = useUserStore()
        store.resetState()
        const cookie = useCookie('auth_token', { path: '/' })
        cookie.value = null

        if (process.client) {
          const router = useRouter()
          const currentPath = router.currentRoute.value.fullPath || '/'
          if (isProtectedPath(currentPath)) {
            try {
              await router.push({ path: '/login', query: { redirect: currentPath } })
            } catch (_) {}
          }
        }
      }
      return Promise.reject(response || error)
    }
  )

  return { provide: { axios } }
})
