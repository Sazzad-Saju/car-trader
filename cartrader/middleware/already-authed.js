// middleware/already-authed.js
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/callback') return

  const token = useCookie('auth_token', { path: '/' }).value
  if ((to.path === '/login' || to.path === '/signup') && token) {
    return navigateTo('/')
  }
})
