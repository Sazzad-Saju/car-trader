<template>
  <div v-if="errorMessage" class="invalid-feedback d-block text-red-500">{{ errorMessage }}</div>
</template>

<script setup>
const props = defineProps(['formErrors', 'errorKey'])

const errorMessage = computed(() => {
  if (
      props.formErrors &&
      props.errorKey &&
      props.formErrors[props.errorKey] &&
      Object.keys(props.formErrors[props.errorKey]).length > 0
  ) {
    return Object.values(props.formErrors[props.errorKey]).join(' ');
  } else {
    return null;
  }

});

</script>