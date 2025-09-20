<script setup>
definePageMeta({
  layout: "custom",
  // middleware: ["auth"], // Ensure the auth middleware is applied
});
</script>
<template>
    <div class="rounded shadow mt-20">
        <CarMessageCard />
        <CarMessageCard />
        <CarMessageCard />
        <CarMessageCard />
    </div>
</template>