import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  runtimeConfig: {
    public: {
       API_BASE_URL: process.env.API_BASE_URL,
       BASE_URL: process.env.BASE_URL,
    }
  },
  piniaPersistedstate: {
      cookieOptions: {
          sameSite: 'strict',
      },
      storage: 'localStorage'
  },
  image: {
    domains: ['lh3.googleusercontent.com'],
  },
})
