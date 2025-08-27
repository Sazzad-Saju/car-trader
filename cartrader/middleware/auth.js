export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('auth_token', { path: '/' });  // Ensure correct path for cookie
  
  // Only run the middleware on the client side
  if (import.meta.server) {
    return; // Skip SSR check
  }

  // If there's no token in the cookie, redirect to login
  if (!token.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath } // Preserve the target route for redirect after login
    });
  }

  // Ensure user is loaded
  const userStore = useUserStore();
  if (!userStore.user) {
    try {
      await userStore.getUser();  // Fetch user data if not already loaded
    } catch {
      // If user fetch fails, reset state and redirect to login
      userStore.resetState();
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  }
});
