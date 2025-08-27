<script setup>
import { onMounted } from 'vue'
import Cookies from "js-cookie";
import { useUserStore } from "~/stores/user";

const route = useRoute();
const router = useRouter();
const store = useUserStore();

definePageMeta({
  middleware: [],
});

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
    const authToken = useCookie("auth_token", {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secure: process.client && location.protocol === "https:",
      httpOnly: false,
    });
    authToken.value = tokenParam;
    try {
      await store.getUser();
      await router.replace(redirect);
    } catch (e) {
      console.log('getUser error:', e);
      store.resetState();
      Cookies.remove("auth_token");
      await router.replace("/login");
    }
  } else {
    await router.replace("/login");
  }
});
</script>

<template>
  <div>Signing you in…</div>
</template>
