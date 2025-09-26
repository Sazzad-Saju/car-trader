<script setup>
const user = useSupabaseUser()
const userStore = useUserStore()
const isAuthenticated = userStore.user !== null

const logout = async () => {
  await userStore.logout()
  return navigateTo('/login')
}
useHead({
  title: 'Car Trader - Home',
});

</script>
<template>
  <div>
    <div v-if="isAuthenticated">
      <h2 class="bg-black text-white">Welcome back, {{user?.user_metadata?.name }}!</h2>
    </div>
    <div v-else>
      <h2 class="bg-black text-white">
        Please Login or Register to access the dashboard.
        <NuxtLink to="/login" class="text-sky-500 underline">Login</NuxtLink> or
        <NuxtLink to="/register" class="text-sky-500 underline">Register</NuxtLink>
      </h2>
    </div>
    <CarHero />
  </div>
</template>