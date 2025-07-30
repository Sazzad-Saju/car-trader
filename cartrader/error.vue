<script setup>
const error = useError();
const handleError = () => {
    clearError({
      redirect: '/',
    });
}

</script>
<template>
  <div class="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-white">
    <h1 class="text-9xl">{{ error.statusCode }}</h1>
    <p class="mt-7 text-4xl">{{ error.message }}</p>
    <button @click="handleError" class="text-xl bg-blue-400 px-10 py-6 text-white rounded mt-5">
      Go Back
    </button>
  </div>
</template>