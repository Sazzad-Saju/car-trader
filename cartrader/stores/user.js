// stores/user.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useCookie } from '#app'

const COOKIE_NAME = 'auth_token'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    api_token: '',
    isLoggedIn: false,
    isRegisterSuccess: false,
    registerMessage: '',
  }),

  actions: {
    // Canonical place to set token (cookie + axios header + state)
    setToken(token) {
      if (!token) return
      const cookie = useCookie(COOKIE_NAME, { path: '/' })
      cookie.value = token
      this.api_token = token
      this.isLoggedIn = true
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    // Hydrate on boot/refresh (SSR-safe)
    initAuth() {
      const cookie = useCookie(COOKIE_NAME, { path: '/' })
      const token = cookie.value
      if (token) {
        this.api_token = token
        this.isLoggedIn = true
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        this.resetState()
      }
    },

    // Email/password login
    async login(email, password) {
      try {
        const { data } = await axios.post('/login', { email, password })
        const token = data?.data?.token
        if (token) {
          this.setToken(token)
          this.user = data.data
        }
        return data
      } catch (error) {
        console.error('Login failed:', error)
      }
    },

    async register(payload) {
      try {
        const { data } = await axios.post('/register', payload)
        if (data.success) {
          this.isRegisterSuccess = true
          this.registerMessage = 'Sign up completed. Please verify your email.'
        } else {
          this.isRegisterSuccess = false
          this.registerMessage = ''
          console.log(data.message)
        }
        return data
      } catch (error) {
        console.error('Registration failed:', error)
        this.isRegisterSuccess = false
        this.registerMessage = ''
        return error?.response?.data
      }
    },

    async getUser() {
      try {
        const { data } = await axios.get('/user')
        if (data) {
          this.user = data
          this.isLoggedIn = true
        } else {
          this.resetState()
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.resetState()
        throw error
      }
    },

    async logout() {
      try {
        await axios.post('/logout').catch(() => {})
      } finally {
        const cookie = useCookie(COOKIE_NAME, { path: '/' })
        cookie.value = null // delete cookie
        this.resetState()
      }
    },

    resetState() {
      this.user = null
      this.api_token = ''
      this.isLoggedIn = false
      this.isRegisterSuccess = false
      this.registerMessage = ''
      delete axios.defaults.headers.common.Authorization
    },
  },

  // Do NOT persist api_token via Pinia (cookie already persists it)
  persist: {
    paths: ['user', 'isLoggedIn'],
  },
})
