// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    // Keep store in sync with Supabase session
    async init() {
      const supabase = useSupabaseClient()

      // Get the current user session
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user || null

      // React to user session changes
      supabase.auth.onAuthStateChange((_event, session) => {
        // Manually control the user state based on session
        this.user = session?.user || null
      })
    },

    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const supabase = useSupabaseClient()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        return true
      } catch (err) {
        this.error = err?.message || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },

    async register(email, password, name) {
      this.loading = true
      this.error = null
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })
      if (error) {
        this.error = error.message
        this.loading = false
        return false
      }
      this.user = data.user
      this.loading = false
      return true
    },

    async logout() {
      const supabase = useSupabaseClient()
      await supabase.auth.signOut()
      this.user = null
    }
  }
})
