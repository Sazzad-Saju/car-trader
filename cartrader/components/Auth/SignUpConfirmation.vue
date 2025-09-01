<script setup>
const props =  defineProps(['details'])
const router = useRouter();

function navigateToLogin(event) {
  event.preventDefault();
  router.push('/login');
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
      <div class="flex justify-end p-2">
        <button @click="navigateToLogin" class="text-gray-400 hover:text-gray-600">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
            <path d="M19 5L5 19M5 5L19 19" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="flex flex-col items-center p-6">
        <div class="bg-green-500 rounded-full p-3 mb-4">
          <svg width="48px" height="48px" viewBox="0 0 1024 1024" fill="#fff">
            <path d="M512 1017.6C233.6 1017.6 7.2 790.4 7.2 512S233.6 6.4 512 6.4s505.6 226.4 505.6 505.6-226.4 505.6-505.6 505.6zM512 54.4C260 54.4 55.2 260 55.2 512s204.8 457.6 457.6 457.6 457.6-204.8 457.6-457.6S764.8 54.4 512 54.4z m-31.2 652s-0.8 0 0 0h-5.6v-0.8H472l-1.6-0.8c-0.8 0-0.8 0-1.6-0.8h-1.6l-0.8-0.8-2.4-0.8-1.6-1.6-202.4-170.4c-4.8-4-8-9.6-8.8-16-0.8-6.4 1.6-12.8 5.6-17.6 4.8-5.6 11.2-8.8 18.4-8.8 5.6 0 11.2 2.4 15.2 5.6l185.6 156.8 296.8-296.8c4.8-4.8 10.4-7.2 16.8-7.2s12.8 2.4 16.8 7.2c4.8 4.8 7.2 10.4 7.2 16.8s-2.4 12.8-7.2 16.8l-312 312-2.4 1.6-0.8 0.8c-0.8 0.8-1.6 0.8-2.4 1.6 0 0.8 0 0.8-0.8 0.8l-0.8 0.8c-0.8 0-2.4 0.8-2.4 0.8-0.8 0-0.8 0-1.6 0.8H480.8z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-green-600 mb-2">Success</h3>
        <p class="text-gray-700 text-center mb-6">{{ details }}</p>
        <button @click="navigateToLogin" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded transition">
          Continue to Login
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .modal{
    background: #cac9c999;
  }
</style>