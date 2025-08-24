// plugins/axios.js
import axios from 'axios'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  // Create an axios instance with the API base URL from runtime config
  const axiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl, // The base URL is configured in nuxt.config.ts
    timeout: 10000, // Optional: Set a timeout
    headers: {
      'Content-Type': 'application/json', // Optional: Set default headers
    },
  })

  // Provide the Axios instance globally to be used in other components or composables
  nuxtApp.provide('axios', axiosInstance)
})
