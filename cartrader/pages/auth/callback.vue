<!-- pages/auth/callback.vue -->
<script setup>
const route = useRoute()
const authToken = useCookie('auth_token', {
  maxAge: 60 * 60 * 24 * 30,
  sameSite: 'lax',
  secure: process.client && location.protocol === 'https:',
  httpOnly: false
})

const tokenParam = route.query.token
if (tokenParam) {
  authToken.value = tokenParam
  const { fetchUser } = useAuth()
  await fetchUser()
  await navigateTo('/', { replace: true })
} else {
  await navigateTo('/login', { replace: true })
}
</script>

<template><div>Signing you in…</div></template>
