<template>
  <div>
    <Loader v-if="isOpenLoader" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>
<script setup lang="ts">
const store = useLoaderStore();
const { isOpenLoader } = storeToRefs(store);

const colorMode = useColorMode();

colorMode.preference = 'light';
// console.log(colorMode.preference);
</script>

<style>
body {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
}
.dark-mode body {
  background-color: #091a28;
  color: #ebf4f1;
}
.sepia-mode body {
  background-color: #f1e7d0;
  color: #433422;
}
</style>
