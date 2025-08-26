<script setup>
const { user, fetchUser, logout } = useAuth()

// Ensure user state is populated on refresh
onMounted(() => {
  if (!user.value) fetchUser().catch(() => {})
})
</script>
<template>
    <header
      class="sticky top-0 z-50 flex justify-between items-center space-x-1 border-b-4 border-white bg-white shadow-md px-4"
      style="height: 5rem;">
      <Nuxt-Link class="text-3xl font-mono" to="/">Car Trader</Nuxt-Link>
      <div v-if="user" class="flex items-center">
        <NuxtLink class="mr-5" to="/profile/listings">profile</NuxtLink>
        <p class="cursor-pointer" @click="logout">Logout</p>
      </div>
      <NuxtLink v-else to="/login">Login</NuxtLink>
    </header>
</template>