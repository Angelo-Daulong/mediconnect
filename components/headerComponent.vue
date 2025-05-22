<template>
  <div class="bg-pho-500">
    <div
      class="flex justify-between max-w-screen-2xl mx-auto items-center p-2 w-[90%]"
    >
      <div class="flex gap-2 items-center">
        <NuxtImg src="pho_logo_100x100.png" class="max-w-[50px] w-full" />
        <span class="font-bold hidden md:block"> MediConnect </span>
      </div>
      <div
        v-if="
          $route.fullPath === '/adminPage/logs' ||
          $route.fullPath === '/adminPage' ||
          $route.fullPath === '/adminPage/archive'
        "
        class="flex items-center justify-center gap-4"
      >
        <NuxtLink
          :class="
            $route.fullPath === '/adminPage' ? 'font-bold' : 'font-semibold'
          "
          class="hover:scale-105"
          to="/adminPage"
          >Hospital
        </NuxtLink>
        <NuxtLink
          :class="
            $route.fullPath === '/adminPage/logs'
              ? 'font-bold'
              : 'font-semibold'
          "
          class="hover:scale-105"
          to="/adminPage/logs"
          >Log</NuxtLink
        >
        <NuxtLink
          :class="
            $route.fullPath === '/adminPage/archive'
              ? 'font-bold'
              : 'font-semibold'
          "
          class="hover:scale-105"
          to="/adminPage/archive"
          >Archive</NuxtLink
        >
      </div>
      <div class="flex gap-4 items-center">
        <span
          class="hidden sm:block font-bold md:text-2xl text-black capitalize"
          >{{ headerText }}</span
        ><UButton
          :label="'Sign Out'"
          :icon="'i-heroicons-arrow-right-start-on-rectangle'"
          color="black"
          @click="signOut"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ headerText: string }>();
const { signOut } = useAuthStore();
const route = useRoute();
// console.log(route.fullPath);
</script>

<style scoped></style>
