// middleware/auth.js
import axios from 'axios'
import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token', { path: '/' })
  if (!token.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
