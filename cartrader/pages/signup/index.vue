<script setup>
import { AuthSignUpConfirmation } from '#components';
import { ref } from 'vue'
definePageMeta({
  layout: "custom",
});

const userStore = useUserStore()

const avatarPreview = ref(null)

function onAvatarChange(e) {
  const file = e.target.files[0]
  form.value.avatar = file
  if (file) {
    avatarPreview.value = URL.createObjectURL(file)
  } else {
    avatarPreview.value = null
  }
}
let errors = ref({})
const form = ref({})
const isSpinner = ref(false)

const signup = async () => {
  console.log('here');
  errors.value = {};  // Clear previous errors
  isSpinner.value = true;

  // Create a FormData object to handle file uploads
  const formData = new FormData();

  // Append form fields to FormData
  for (const [key, value] of Object.entries(form.value)) {
    formData.append(key, value);
  }

  try {
    let res = await userStore.register(formData);  // Send FormData instead of the plain object
    console.log(res);
    if (res.success) {
      // Handle success
    } else {
      errors.value = res.errors;  // Capture validation errors
    }
  } catch (error) {
    isSpinner.value = false;
  } finally {
    isSpinner.value = false;
  }
};

onMounted(() => {
  userStore.isRegisterSuccess = true;
})

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form class="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
      <h2 class="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <div>
        <label class="block mb-1 font-medium">Name</label>
        <input v-model="form.name" type="text" class="w-full border rounded px-3 py-2" placeholder="Your name" />
        <v-errors :form-errors="errors" :error-key="'name'" />
      </div>
      <div>
        <label class="block mb-1 font-medium">Email</label>
        <input v-model="form.email" type="email" class="w-full border rounded px-3 py-2" placeholder="you@email.com" />
        <v-errors :form-errors="errors" :error-key="'email'" />
      </div>
      <div>
        <label class="block mb-1 font-medium border border-gray-300">Avatar</label>
        <input @change="onAvatarChange" type="file" accept="image/*" class="w-full" />
        <v-errors :form-errors="errors" :error-key="'avatar'" />
        <img v-if="avatarPreview" :src="avatarPreview" class="mt-2 w-16 h-16 rounded-full object-cover" />
      </div>
      <div>
        <label class="block mb-1 font-medium">Password</label>
        <input v-model="form.password" type="password" class="w-full border rounded px-3 py-2" placeholder="Password" />
         <v-errors :form-errors="errors" :error-key="'password'" />
      </div>
      <div>
        <label class="block mb-1 font-medium">Confirm Password</label>
        <input v-model="form.password_confirmation" type="password" class="w-full border rounded px-3 py-2" placeholder="Confirm password" />
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600"  @click.prevent="signup">
        Sign Up
      </button>
    </form>
    <!-- <pre>{{ userStore.isRegisterSuccess }}</pre> -->
    <AuthSignUpConfirmation 
      v-if="userStore.isRegisterSuccess"
      :details="userStore.registerMessage"
    />
  </div>
</template>



