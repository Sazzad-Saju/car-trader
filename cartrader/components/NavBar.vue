<script setup>
const user = useSupabaseUser()
const logout = () => {
  //1. user.value = null
  //2. Remove token from Cookie browser
  //3. Navigate to homepage
}
</script>
<template>
    <header
      class="sticky top-0 z-50 flex justify-between items-center space-x-1 border-b-4 border-white bg-white shadow-md px-4"
      style="height: 5rem;">
      <Nuxt-Link class="text-3xl font-mono" to="/">Car Trader</Nuxt-Link>
      <div v-if="user">
        <NuxtLink class="mr-5" to="/profile/listings">profile</NuxtLink>
        <p class="cursor-pointer" @click="logout">Logout</p>
      </div>
      <NuxtLink v-else to="/login">Login</NuxtLink>
    </header>
</template>``