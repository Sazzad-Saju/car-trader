<script setup>
definePageMeta({
  layout: "custom",
  middleware: ['already-authed']
});

import { ref } from 'vue'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
const config = useRuntimeConfig()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const loginWithGoogle = () => {
  const apiOrigin = new URL(config.public.API_BASE_URL).origin
  window.location.href = `${apiOrigin}/auth/google/redirect`
}

const login = async () => {
  loading.value = true
  error.value = ''
  try {
    await userStore.loginWithEmail(email.value, password.value)
    navigateTo('/')
  } catch (e) {
    error.value = 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mt-10 max-w-md mx-auto bg-white p-8 rounded shadow">
    <h1 class="text-5xl font-bold mb-7 text-center">Login</h1>
    <form @submit.prevent="login" class="space-y-6">
      <div>
        <label class="block text-lg font-semibold mb-2" for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-sky-400"
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label class="block text-lg font-semibold mb-2" for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-sky-400"
          placeholder="Enter your password"
          required
        />
      </div>
      <div v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</div>
      <button
        type="submit"
        class="w-full bg-sky-500 p-3 rounded text-white font-bold text-lg hover:bg-sky-600 transition"
        :disabled="loading"
      >
        <span v-if="loading">Logging in...</span>
        <span v-else>Login</span>
      </button>
    </form>
    <div class="mt-6 flex items-center justify-center">
      <button
        @click="loginWithGoogle"
        class="bg-red-400 p-3 rounded text-white font-bold text-lg w-full hover:bg-red-500 transition"
      >
        Login with Google
      </button>
    </div>
  </div>
</template>