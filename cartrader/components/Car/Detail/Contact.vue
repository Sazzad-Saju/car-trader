<script setup>
const route = useRoute();
const message = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})
const errorMessage = ref('')
const successMessage = ref('')
const disableButton = computed(() => {
  for(let key in message.value){
    if(!message.value[key]) return true;
  }
  return false;
})

const onSubmit = async () => {
  try{
    const response = await $fetch(`/api/car/listings/${route.params.id}/message`, {
      method: 'POST',
      body: message.value,
    })
    message.value = {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
    errorMessage.value = '';
    successMessage.value = 'Message sent successfully!'
  }catch(err){
    errorMessage.value = err.message;
    successMessage.value = '';
  }
}
</script>

<template>
  <div class="mt-10 w-[678px]">
    <div class="flex justify-between gap-4">
      <input v-model="message.name" type="text" class="border border-gray-200 p-1 flex-1" placeholder="Name" />
      <input v-model="message.email" type="text" class="border border-gray-200 p-1 flex-1" placeholder="Email" />
      <input v-model="message.phone" type="text" class="border border-gray-200 p-1 flex-1" placeholder="Phone" />
    </div>
    <div class="flex mt-4">
      <textarea v-model="message.message"
        class="border border-gray-200 p-1 w-full"
        placeholder="Message"
      ></textarea>
    </div>
    <button :disabled="disableButton" @click="onSubmit" class="bg-blue-400 text-white px-10 py-3 rounded mt-4">Submit</button>
    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
    <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
  </div>
</template>
