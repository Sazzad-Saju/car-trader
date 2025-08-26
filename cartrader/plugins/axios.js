// plugins/axios.js
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')

  const axiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl, // e.g. http://127.0.0.1:8000/api
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  })

  // Attach Authorization header if we have a token
  axiosInstance.interceptors.request.use((cfg) => {
    if (token.value) {
      cfg.headers = cfg.headers || {}
      cfg.headers.Authorization = `Bearer ${token.value}`
    }
    return cfg
  })

  // Optional: handle 401 -> clear token + redirect to /login
  axiosInstance.interceptors.response.use(
    r => r,
    async (error) => {
      if (error?.response?.status === 401) {
        token.value = null
        const user = useState('user', () => null)
        user.value = null
        if (process.client) await navigateTo('/login')
      }
      return Promise.reject(error)
    }
  )

  nuxtApp.provide('axios', axiosInstance)
})
