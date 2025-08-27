<template>
  <div>Signing you in…</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from "~/stores/user";
import { useCookie } from '#app';  // Using Nuxt's `useCookie`

const route = useRoute();
const router = useRouter();
const store = useUserStore();

onMounted(async () => {
  const tokenParam = route.query.token;
  const redirect = route.query.redirect || "/";
  const oauthError = route.query.error;

  if (oauthError) {
    await router.replace({ path: "/login", query: { error: oauthError } });
    return;
  }

  if (tokenParam && typeof tokenParam === "string") {
    store.setToken(tokenParam);

    // Ensure consistent cookie settings (same path, same site, etc.)
    const authToken = useCookie('auth_token', {
      path: '/',                // Path to ensure it works across the entire domain
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',           // Lax for cross-site requests
      secure: process.client && location.protocol === "https:",  // Secure flag for HTTPS
      httpOnly: false,           // Allow access via JavaScript
    });
    authToken.value = tokenParam;

    try {
      await store.getUser(); // Ensure user is fetched after setting the token
      await router.replace(redirect); // Redirect to the original page
    } catch (e) {
      console.log('getUser error:', e);
      store.resetState();
      authToken.value = null;  // Clear cookie on error
      await router.replace("/login");
    }
  } else {
    await router.replace("/login");
  }
});
</script>
