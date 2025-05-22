<template>
  <div class="max-w-7xl">
    <div class="my-3 divide-y divide-gray-100 text-sm">
      <div class="flex justify-end">
        <HospitalPageEditHospital />
      </div>
      <div
        v-for="(item, idx) in hospitalDetails"
        :key="idx"
        class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4 even:bg-gray-50"
      >
        <h1 class="font-semibold text-xl text-gray-900 px-2">
          {{ item.title }}
        </h1>
        <span class="text-gray-700 text-lg sm:col-span-2">
          {{ item.description }}
        </span>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-1 py-3 sm:gap-4 even:bg-gray-50 w-full"
      >
        <h1 class="font-semibold text-xl text-gray-900 px-2 md:col-span-1">
          Services
        </h1>
        <div class="flex gap-2 flex-wrap w-full md:col-span-2">
          <span
            v-for="(item, idx) in hosptalDetails.services?.split(', ')"
            :key="idx"
            class="text-gray-700 border-2 w-fit py-1 uppercase px-2 rounded-md text-md whitespace-nowrap"
          >
            {{ item }}
          </span>
        </div>
      </div>
      <!-- 
      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900">Address</dt>
        <dd class="text-gray-700 sm:col-span-2">
          {{ hosptalDetails.address }}
        </dd>
      </div>

    

      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900">Doctors</dt>
        <dd class="text-gray-700 sm:col-span-2">
          {{ hosptalDetails.address }}
        </dd>
      </div>

      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900">Contact Number</dt>
        <dd class="text-gray-700 sm:col-span-2">
          {{ hosptalDetails.contactNumber }}
        </dd>
      </div>
      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900">Available Rooms</dt>
        <dd class="text-gray-700 sm:col-span-2">
          {{ hosptalDetails.availableRooms }}
        </dd>
      </div>
      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900">Location Coordinates (Latlng)</dt>
        <dd class="text-gray-700 sm:col-span-2">
          {{ (hosptalDetails.latitude, hosptalDetails.longitude) }}
        </dd>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ hosptalDetails: SelectHospital }>();

const hospitalDetails = [
  {
    title: 'Description',
    description: props.hosptalDetails.description,
  },
  {
    title: 'Address',
    description: props.hosptalDetails.address,
  },
  {
    title: 'Contact Number',
    description: props.hosptalDetails.contactNumber,
  },

  {
    title: 'Location Coordinates (Latlng)',
    description: `${props.hosptalDetails.latitude}, ${props.hosptalDetails.longitude} `,
  },
];
</script>

<style scoped></style>
