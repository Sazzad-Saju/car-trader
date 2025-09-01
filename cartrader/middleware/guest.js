// middleware/guest.js
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/callback') return

  // If redirect param wrongly points back to /login, drop it
  if (to.path === '/login' && typeof to.query.redirect === 'string' && to.query.redirect.startsWith('/login')) {
    return navigateTo('/login') // strip the bad redirect param
  }

  const token = useCookie('auth_token', { path: '/' }).value
  if ((to.path === '/login' || to.path === '/signup') && token) {
    return navigateTo('/')
  }
})
