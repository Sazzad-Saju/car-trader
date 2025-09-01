// middleware/auth.global.js
export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/profile')) return

  const token = useCookie('auth_token', { path: '/' })
  if (!token.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
