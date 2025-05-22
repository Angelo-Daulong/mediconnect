<template>
  <div
    :style="{
      backgroundImage: `url(${blurHospital})`,
    }"
    class="h-screen bg-cover bg-center"
  >
    <div class="w-full flex justify-end gap-4 p-4 absolute">
      <!-- <UButton
        label="Sign In as Admin"
        size="xl"
        class="font-semibold"
        @click="navigateTo('/signIn')"
      />
      <UButton
        label="Sign In as Hospital"
        size="xl"
        class="font-semibold"
        @click="navigateTo('/signIn')"
      /> -->

      <UDropdown
        :items="items"
        :popper="{ placement: 'bottom-start' }"
        :ui="{
          background: 'bg-pho-500',
          item: {
            active: 'bg-pho-400 text-slate-100',
            inactive: 'text-white',
            icon: {
              active: 'text-slate-100',
              inactive: 'text-white',
            },
          },
        }"
      >
        <UButton
          size="xl"
          label="Sign In"
          class="font-semibold"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />
      </UDropdown>
    </div>
    <div class="flex justify-center items-center h-full">
      <div class="flex flex-col gap-6 items-center w-[90%] mx-auto">
        <div class="flex gap-4">
          <NuxtImg
            src="pho_logo.png"
            class="max-w-[5rem] md:max-w-[15rem] xl:max-w-xs w-full"
          />
          <!-- <NuxtImg
            src="PPB.png"
            class="max-w-[5rem] md:max-w-[15rem] xl:max-w-xs w-full"
          /> -->
          <NuxtImg
            src="PPNRC.png"
            class="max-w-[5rem] md:max-w-[15rem] xl:max-w-xs w-full"
          />
        </div>

        <span
          class="drop-shadow-md text-black font-bold text-md md:text-lg xl:text-2xl"
          >Welcome to</span
        >
        <span
          class="drop-shadow-md text-black rounded-md text-2xl md:text-4xl xl:text-7xl font-bold"
          >MediConnect Bukidnon</span
        >
        <span
          class="drop-shadow-md text-black font-bold text-md md:text-lg xl:text-2xl"
          >Helping you find the nearest hospital near you.</span
        >
        <UButton
          @click="findHospitals"
          class="font-semibold"
          label="Find Hospitals"
          size="xl"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import blurHospital from '@/assets/blur-hospital.jpg';
const loading = ref(false);
const items = [
  [
    {
      label: 'Admin',
      icon: 'i-heroicons-user-circle',
      click: () => {
        navigateTo('/signInAdmin');
      },
    },
  ],
  [
    {
      label: 'Hospital',
      icon: 'i-heroicons-building-office',

      click: () => {
        navigateTo('/signInHospital');
      },
    },
  ],
];
const store = useHospitalStore();
const { refresh, statusHospital } = store;
const { hospital } = storeToRefs(store);

const findHospitals = async () => {
  if (hospital.value?.length === 0) {
    await refresh();
  }
  await navigateTo('/hospitals');
};
</script>

<style scoped></style>
