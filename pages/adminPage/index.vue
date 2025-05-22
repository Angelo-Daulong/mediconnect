<template>
  <headerComponent :headerText="'Admin page'" />
  <!-- <UButton label="logout" @click="navigateTo('/signInAdmin')" /> -->
  <UContainer
    :ui="{
      padding: 'p-1 sm:p-2 lg:p-4',
      constrained: 'max-w-screen-2xl',
    }"
  >
    <DataTableHospital />
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth-user'],
});
</script>

<style scoped></style>
