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
      <h2>Welcome back, {{user?.email }}!</h2>
    </div>
    <div v-else>
      <h2>
        <button class="mt-6 bg-gray-800 text-white px-4 py-2 rounded" @click="logout">
          Logout
        </button>
      </h2>
    </div>
    <CarHero />
  </div>
</template>