<template>
  <div class="bg-pho-500">
    <div
      class="flex justify-between max-w-screen-2xl mx-auto items-center p-2 w-[90%]"
    >
      <NuxtLink to="/">
        <div class="flex gap-2 items-center">
          <NuxtImg src="pho_logo_100x100.png" class="max-w-[50px] w-full" />
          <span class="font-bold"> MediConnect </span>
        </div>
      </NuxtLink>
      <div class="flex gap-4 items-center">
        <span
          class="hidden sm:block font-bold md:text-2xl text-black capitalize"
          >Hospitals</span
        ><UButton
          :label="'Landing Page'"
          :icon="'i-heroicons-arrow-left'"
          color="black"
          @click="navigateTo('/')"
        />
      </div>
    </div>
  </div>

  <UContainer
    :ui="{
      padding: 'p-1 sm:p-2 lg:p-4',
      constrained: 'max-w-screen-2xl',
    }"
  >
    <div
      class="flex gap-2 justify-center xl:justify-start max-w-screen-xl mx-auto mb-4"
    >
      <!-- <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        autocomplete="off"
        placeholder="Search..."
        size="md"
        class="max-w-xs"
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template #trailing>
          <UButton
            v-show="search !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="search = ''"
          />
        </template>
      </UInput> -->
      <UInputMenu
        v-model="selected"
        :options="hospitalRows"
        placeholder="Select a Hospital"
        by="id"
        size="lg"
        class="max-w-md"
        option-attribute="name"
        :search-attributes="['name', 'services', 'doctors']"
        :ui="{ icon: { trailing: { pointer: '' } }, width: 'max-w-lg w-full' }"
      >
        <template #option="{ option: hospital }">
          <span class="truncate">{{ hospital.name }}</span>
        </template>
        <template #trailing>
          <UButton
            v-show="selected.length > 0"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="selected = []"
          />
        </template>
      </UInputMenu>
      <UButton
        :icon="
          sortHospitalDist
            ? 'i-heroicons-bars-arrow-up'
            : 'i-heroicons-bars-arrow-down'
        "
        @click="sortHospitalDist = !sortHospitalDist"
      >
        {{
          sortHospitalDist ? 'Sorted By Distance' : 'Sorted By Available Room/s'
        }}</UButton
      >
    </div>

    <div class="flex flex-wrap gap-2 lg:gap-4 justify-center">
      <div v-for="(item, idx) in hospitalRows" :key="idx">
        <HospitalCard v-if="item.status" :data="item" :lat="lat" :lng="lng" />
      </div>
      <!-- <div v-else class="text-lg">No Hospital Data Available...</div> -->
    </div>
    <!-- <div
      v-else-if="statusHospital === 'pending'"
      class="flex flex-wrap gap-2 lg:gap-4 justify-center"
    >
      <div v-for="n in 8" :key="n">
        <USkeleton class="w-[300px] h-[400px]" />
      </div>
    </div> -->
  </UContainer>
</template>

<script setup lang="ts">
const store = useHospitalStore();
const { refresh, statusHospital } = store;

const selected = ref<any>([]);
const { hospital } = storeToRefs(store);
const search = ref('');
const lat = ref<number | undefined>(undefined);
const lng = ref<number | undefined>(undefined);
const sortHospitalDist = ref(true);

async function getLatLng() {
  try {
    if (navigator.geolocation) {
      // Geolocation is supported by the browser
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(error);
          }
        );
      });
    } else {
      throw new Error('Geolocation is not supported by your browser.');
    }
  } catch (error) {
    console.error('Error retrieving location:', error);
    return null;
  }
}
onMounted(() => {
  getLatLng()
    .then((latLng: any) => {
      if (latLng) {
        // console.log('Latitude:', latLng.latitude);
        // console.log('Longitude:', latLng.longitude);
        lat.value = latLng.latitude;
        lng.value = latLng.longitude;
      } else {
        console.log('Location could not be retrieved.');
      }
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
});

const hospitalRows = computed(() => {
  if (!hospital.value) return []; // Early return if hospital data is not available

  // Map over hospitals to calculate distances
  const hostNew = hospital.value.map((h) => {
    let dist = null;
    if (
      lat.value !== undefined &&
      lng.value !== undefined &&
      h.latitude !== null &&
      h.longitude !== null
    ) {
      dist = calculateDistance(lat.value, lng.value, h.latitude, h.longitude);
    }
    return {
      ...h,
      dist,
    };
  });

  // Filter hospitals based on the selected hospital
  const filteredHospitals = selected?.value?.id
    ? hostNew.filter((hospitalItem) => hospitalItem.id === selected.value.id)
    : hostNew;

  // Sort hospitals based on distance or available rooms
  return sortHospitalDist.value
    ? filteredHospitals.sort(
        (a, b) => (a.dist ?? Infinity) - (b.dist ?? Infinity)
      )
    : filteredHospitals.sort(
        (a, b) => (b.availableRooms ?? 0) - (a.availableRooms ?? 0)
      );
});

onMounted(async () => {
  await refresh();

  // console.log(statusHospital);
});

// watch(
//   () => hospitalRows.value,
//   (newHospitalRows) => {
//     // Only set selected if there are rows and selected is not already set
//     if (newHospitalRows.length > 0 && !selected.value) {
//       selected.value = newHospitalRows[1]; // Select the second item (index 1)
//     }
//   },
//   { immediate: true } // This ensures that the watcher runs immediately when the component is mounted
// );

watch(
  () => hospital.value,
  (newHospital) => {
    if (newHospital && newHospital.length > 0 && !selected.value) {
      const newHospitalRows = hospitalRows.value; // Recompute hospitalRows
      selected.value = newHospitalRows[1] || null; // Handle the case where there's no second item
    }
  },
  { immediate: true }
);
</script>

<style scoped></style>
