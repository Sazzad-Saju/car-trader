<template>
  <div>Signing you in…</div>
</template>

<script setup>
import axios from 'axios'
import { useUserStore } from '~/stores/user'
import { useCookie } from '#app'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

onMounted(async () => {
  const tokenParam = route.query.token
  const redirect = route.query.redirect || '/'
  const oauthError = route.query.error

  if (oauthError) {
    return router.replace({ path: '/login', query: { error: String(oauthError) } })
  }

  if (typeof tokenParam === 'string' && tokenParam) {
    // Set token in cookie (SSR-safe)
    const cookie = useCookie('auth_token', { path: '/' })
    cookie.value = tokenParam

    store.setToken(tokenParam)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + tokenParam

    try {
      await store.getUser()
      window.location.replace(redirect) // hard reload for SSR
    } catch (e) {
      store.resetState()
      cookie.value = null
      window.location.replace('/login')
    }
  } else {
    return router.replace('/login')
  }
})
</script>
