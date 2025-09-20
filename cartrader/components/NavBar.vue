<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const user = useSupabaseUser()
const isAuthenticated = userStore.user !== null

const logout = async () => {
  // await userStore.logout()
  // return navigateTo('/login')
}

</script>
<template>
    <header
      class="sticky top-0 z-50 flex justify-between items-center space-x-1 border-b-4 border-white bg-white shadow-md px-4"
      style="height: 5rem;">
      <Nuxt-Link class="text-3xl font-mono" to="/">Car Trader</Nuxt-Link>
      <div v-if="isAuthenticated" class="flex items-center">
        <NuxtLink class="mr-5" to="/profile/listings">profile</NuxtLink>
        <p class="cursor-pointer" @click="logout">Logout</p>
      </div>
      <NuxtLink v-else to="/login">Login</NuxtLink>
    </header>
</template>