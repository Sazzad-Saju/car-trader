<script setup>
definePageMeta({
    layout: "custom",
});

const config = useRuntimeConfig()

const login = () => {
  const apiOrigin = new URL(config.public.apiBaseUrl).origin // -> http://127.0.0.1:8000
  window.location.href = `${apiOrigin}/auth/google/redirect`
}
</script>

<template>
    <div class="mt-10">
        <h1 class="text-5xl font-bold mb-7">
            Login
        </h1>
        <button @click="login" class="bg-red-400 p-3 rounded text-white font-bold">Login with Google</button>
    </div>
</template>