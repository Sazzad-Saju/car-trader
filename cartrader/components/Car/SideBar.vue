<script setup>
const { makes } = useCars();
const modal = ref({
  make: false,
  location: false,
  price: false,
});

const updateModal = (key) => {
  modal.value[key] = !modal.value[key];
};
const route = useRoute();
const city = ref('');

const onChangeLocation = () => {
  if (!city.value) return;
  if (!isNaN(parseInt(city.value))) {
    throw createError({
      statusCode: 400,
      message: 'Invalid city format!',
    });
  }
  updateModal('location');
  navigateTo(`/city/${city.value}/car/${route.params.make || ''}`);
  city.value = '';
}

const onChangeMake = (make) => {
  updateModal('make');
  navigateTo(`/city/${route.params.city}/car/${make}`);
}
</script>

<template>
  <div class="shadow border border-gray-200 w-64 mr-10 z-30 h-[190px]">
    <!-- LOCATION START -->
    <div class="p-5 flex justify-between relative cursor-pointer border-b border-gray-200">
      <h3>Location</h3>
      <h3 @click="updateModal('location')" class="text-blue-400 capitalize">{{ $route.params.city }}</h3>
      <div v-if="modal.location" class="absolute border shadow left-56 p-5 top-1 -m-1 bg-white">
        <input type="text" class="border p-1 rounded" v-model="city">
        <button class="bg-blue-400 w-full mt-2 rounded text-white p-1" @click="onChangeLocation">Apply</button>
      </div>
    </div>
    <!-- LOCATION END -->
     
    <!-- MAKE START -->
    <div class="p-5 flex justify-between relative cursor-pointer border-b border-gray-200">
      <h3>Make</h3>
      <h3 class="text-blue-400 capitalize" @click="updateModal('make')">{{ route.params.make || 'Any' }}</h3>
      <div class="absolute border shadow left-56 p-5 top-1 -m-1 w-[600px] flex justify-between flex-wrap bg-white" v-if="modal.make">
        <h4 v-for="make in makes" :key="make" class="w-1/3" @click="onChangeMake(make)">{{ make }}</h4>
      </div>
    </div>
    <!-- MAKE END -->
    <div class="p-5 flex justify-between relative cursor-pointer border-b border-gray-200">
      <h3>Price</h3>
      <h3 class="text-blue-400 capitalize"></h3>
    </div>
  </div>
</template>