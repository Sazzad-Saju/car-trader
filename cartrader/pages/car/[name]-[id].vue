<script setup>
const route = useRoute();
const { toTitleCase } = useUtilities();
const {cars} = useCars();
useHead({
  title: toTitleCase(route.params.name)
})

const car = computed(() => { 
  return cars.find((c) => {
    return c.id === parseInt(route.params.id);
  })
})

if(!car.value){
  throw createError({
    statusCode: 404,
    message: `Car with ID ${route.params.id} does not exist`
  })
}

definePageMeta({
  layout: 'custom',
})

</script>
<template>
  <div>
    <CarDetailHero :car="car"/>
    <CarDetailAttributes :features="car.features" />
    <CarDetailDescription :description="car.description"/>
    <CarDetailContact />
  </div>
</template>