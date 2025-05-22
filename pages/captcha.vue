<template>
  <div>
    <NuxtTurnstile v-model="token" />
  </div>
</template>

<script setup lang="ts">
const token = ref('');
</script>

<style scoped></style>
