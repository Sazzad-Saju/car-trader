<script setup>
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: "custom",
  middleware: ["auth"],
});
const {listings} = useCars();

const { get } = useApi()
// Current user (client-only to avoid SSR cookie/401 issues)
const { data: me } = await useAsyncData(
  'me',
  async () => {
    try {
      return await get('/auth/user') // -> http://127.0.0.1:8000/api/auth/user
    } catch (err) {
      // Not logged in (401) or other issue
      return null
    }
  },
  { server: false } // important!
)
</script>

<template>
  <div>
    <!-- User Info -->
    <div v-if="me" class="mt-6 p-4 border rounded flex items-center gap-4">
      <img
        v-if="me.avatar"
        :src="me.avatar"
        alt="Avatar"
        class="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <p class="font-semibold">Welcome, {{ me.name }}!</p>
        <p class="text-sm text-gray-600">{{ me.email }}</p>
      </div>
    </div>
    
    <!-- End of User Info -->
    <div class="flex justify-between mt-24 items-center">
      <h1 class="text-6xl">My Listings</h1>
      <NuxtLink
        to="/profile/listings/create"
        class="w-9 h-9 bg-blue-400 flex justify-center items-center rounded-full text-white font-bold cursor-pointer"
      >
        +
      </NuxtLink>
    </div>
    <div class="shadow rounded p-3 mt-5">
      <CarListingCard v-for="listing in listings" :key="listing.id" :listing="listing" />
    </div>
  </div>
</template>
