<script setup>

import { ref } from 'vue'
import { useUserStore } from '~/stores/user'

const email = ref('')
const password = ref('')
const name = ref('')
const loading = ref(false)
const error = ref(null)

const userStore = useUserStore()
const router = useRouter()

const register = async () => {
  loading.value = true
  error.value = null

  const ok = await userStore.register(email.value, password.value, name.value)
  loading.value = userStore.loading
  error.value = userStore.error

  if (ok) {
    router.push('/')
  }
}
</script>

<template>
  <div class="mt-10 max-w-md mx-auto bg-white p-8 rounded shadow">
    <h1 class="text-5xl font-bold mb-7 text-center">Register</h1>
    <form @submit.prevent="register" class="space-y-6">
      <div>
        <label class="block text-lg font-semibold mb-2" for="name">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-sky-400"
          placeholder="Enter your name"
          required
        />
      </div>
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
        <span v-if="loading">Registering...</span>
        <span v-else>Register</span>
      </button>
    </form>
  </div>
</template>