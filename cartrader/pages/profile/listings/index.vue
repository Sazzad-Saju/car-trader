<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { useCars } from '~/composables/useCars'

definePageMeta({
  layout: "custom",
  // middleware: ["auth"], // Ensure the auth middleware is applied
});

const user = useSupabaseUser();
// const { listings } = useCars();
const {data: listings, refresh} = await useFetch(
  `/api/car/listings/user/${user.value?.id}`
)

const handleDelete = async (id) => {
  console.log("Deleting listing with ID:", id);
  await $fetch(`/api/car/listings/${id}`, {
    method: "DELETE"
  });
  listings.value = listings.value.filter(listing => listing.id !== id);
  // refresh(); // Optionally refresh the listings from the server
}

// const userStore = useUserStore();
// const user = computed(() => userStore.user);


</script>

<template>
  <div>
    <!-- User Info -->
    <div v-if="user" class="mt-6 p-4 border rounded flex items-center gap-4">
      <img v-if="user.avatar" :src="user.avatar" alt="Avatar" class="w-12 h-12 rounded-full object-cover" />
      <div>
        <p class="font-semibold">Welcome, {{ user?.user_metadata?.name }}!</p>
        <p class="text-sm text-gray-600">{{ user.email }}</p>
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
      <CarListingCard v-for="listing in listings" :key="listing.id" :listing="listing" @delete-listing="handleDelete" />
    </div>
  </div>
</template>
