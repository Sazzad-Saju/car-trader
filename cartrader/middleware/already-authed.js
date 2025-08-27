// middleware/already-authed.js
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token')
  if ((to.path === '/login' || to.path === '/signup') && token.value) {
    return navigateTo('/')
  }
})
