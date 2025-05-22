<template>
  <div>
    <HeaderComponent :headerText="'Hospital Page'" />
    <UContainer
      :ui="{
        padding: 'p-1 sm:p-2 lg:p-4',
        constrained: 'max-w-screen-2xl',
      }"
    >
      <div class="grid gap-4">
        <div class="text-center">
          <h1 class="font-bold text-lg lg:text-2xl xl:text-4xl capitalize">
            {{ `Welcome ${hosptalDetails?.name}` }}
          </h1>
          <p>{{ userEmail }}</p>
        </div>
        <div class="flex flex-col-reverse lg:flex-row gap-8 px-3">
          <UpdateLogo
            class="mx-auto lg:mx-0"
            v-if="hosptalDetails"
            :hosptalDetails="hosptalDetails"
          />
          <HospitalPageDetails
            v-if="showHospitalDetails"
            :hosptalDetails="hosptalDetails"
          />
          <USkeleton
            v-if="!showHospitalDetails"
            class="min-h-64 h-full w-full"
          />
        </div>
        <DoctorAdd />
        <HospitalPageRoom />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth-user'],
});
const showHospitalDetails = ref(true);
const store = useAuthStore();
const { hosptalDetails, userEmail } = storeToRefs(store);

watch(
  () => ({ ...hosptalDetails.value }),
  () => {
    showHospitalDetails.value = false;
    setTimeout(() => {
      showHospitalDetails.value = true;
    }, 500);
  },
  { deep: true }
);
</script>

<style scoped></style>
