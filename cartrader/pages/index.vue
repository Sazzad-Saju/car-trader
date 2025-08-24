<script setup>
import { useApi } from '~/composables/useApi'
useHead({
  title: 'Car Trader - Home',
});

const { get } = useApi()
const { data: greeting, error } = await useAsyncData('greeting', async () => {
  try {
    return await get('/greeting')  // Call the /greeting endpoint on Laravel
  } catch (err) {
    console.error('Error fetching greeting:', err)
    return null
  }
})

</script>
<template>
  <div>
  <h1>{{ greeting?.message || 'Loading...' }}</h1>
    <CarHero />
  </div>
</template>