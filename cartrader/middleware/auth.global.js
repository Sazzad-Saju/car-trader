// middleware/auth.global.js
import { isProtectedPath } from '~/utils/protectedRoutes'

export default defineNuxtRouteMiddleware((to) => {
  if (!isProtectedPath(to.path)) return

  const token = useCookie('auth_token', { path: '/' })
  if (!token.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
