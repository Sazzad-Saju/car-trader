<script setup>
const auth = useUserStore()
useHead({
  title: 'Car Trader - Home',
});

</script>
<template>
  <div>
    <div v-if="auth?.isLoggedIn">
      <h2>Welcome back, {{ auth.user?.name }}!</h2>
    </div>
    <div v-else>
      <h2>Please log in to access your account.</h2>
    </div>
    <CarHero />
  </div>
</template>