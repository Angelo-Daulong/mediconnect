<template>
  <UCard
    :ui="{
      base: 'max-w-72 md:max-w-xs w-full',
      body: {
        base: 'flex flex-col gap-2 items-center',
        padding: 'px-[0.75em] py-[0.5em]',
      },
      footer: {
        padding: '',
      },
      header: {
        padding: 'px-[0.75em] py-[0.5em] text-center',
        base: 'bg-gray-300 uppercase',
      },
    }"
  >
    <template #header>
      <h1
        class="font-semibold"
        :class="data.name.length > 20 ? 'overflow-ellipsis truncate' : ''"
      >
        {{ data.name }}
      </h1>
    </template>
    <div class="text-start flex flex-col gap-2">
      <NuxtImg
        v-show="imgLoading"
        :src="`${storageUrl}${data.hospitalUserId}_logo`"
        @load="imgLoading = true"
        class="w-[300px] h-[300px] object-cover aspect-square border-2"
      />
      <USkeleton v-show="!imgLoading" style="height: 300px; width: 300px" />
      <span
        class="font-semibold text-lg truncate overflow-ellipsis max-w-60 md:max-w-64"
        >{{ data.address }}</span
      >
      <span class="font-semibold">{{
        data.dist ? `${data.dist.toFixed(2)} km` : 'allow location access...'
      }}</span>
      <span
        :class="data.availableRooms > 0 ? 'text-green-600' : 'text-red-500'"
        >{{ ` Available Rooms: ${data.availableRooms} ` }}</span
      >
    </div>

    <template #footer>
      <div class="rounded-b-lg w-full bg-pho-500 font-medium text-white">
        <div
          class="flex items-center hover:translate-x-3 hover:cursor-pointer hover:transition-transform"
          @click="seeMore"
        >
          <span class="border-none px-[0.75em] py-[0.5em]" size="xl"
            >See More
          </span>
          <UIcon name="i-heroicons-arrow-right-20-solid" class="w-5 h-5" />
        </div>
      </div>
    </template>
  </UCard>
  <UModal
    v-model="isOpen"
    :ui="{
      width: '',
    }"
  >
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        header: {
          padding: 'px-[0.75em] py-[0.5em]',
        },
        body: {
          base: 'text-white',
          padding: '',
        },
        background: 'bg-gray-900',
      }"
    >
      <template #header>
        <div class="flex gap-2 justify-end">
          <UButton
            icon="i-heroicons-x-mark"
            color="red"
            @click="isOpen = false"
          />
        </div>
      </template>
      <div class="text-center py-2">
        <h1 class="capitalize font-bold text-md md:text-xl">
          {{ data.name }}
        </h1>
      </div>
      <UDivider />
      <div class="grid md:grid-cols-2">
        <div class="w-80 xl:w-[450px] p-4">
          <div>
            <h2 class="text-lg font-bold">Description</h2>

            <p class="mt-1 text-md text-gray-300">
              {{ data.description }}
            </p>
          </div>
          <UDivider class="py-2" />
          <div>
            <h2 class="text-lg font-bold">Address</h2>

            <p class="mt-1 text-md text-gray-300">
              {{ data.address }}
            </p>
          </div>
          <UDivider class="py-2" />
          <div>
            <h2 class="text-lg font-bold">Services</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-if="data.services"
                v-for="(item, idx) in data.services.split(', ')"
                class="border-2 px-[0.5em] py-[0.25em] rounded-lg text-md text-gray-300 uppercase"
              >
                {{ item }}
              </span>
            </div>
          </div>

          <UDivider class="py-2" />
          <div v-if="categoryList">
            <h2 class="text-md font-semibold">
              Available Beds:
              <div v-for="({ category, count }, item) in categoryList">
                {{ count }} - {{ category }}
              </div>
            </h2>
          </div>
          <div v-else>
            <h2 class="text-md font-semibold">No Available Beds</h2>
          </div>
          <UDivider class="py-2" />
          <div>
            <h2 class="text-md font-semibold">Contact Number: 0966 851 3287</h2>
          </div>
          <div>
            <h2 class="text-md font-semibold">
              Distance: {{ data.dist?.toFixed(2) }} km
            </h2>
          </div>
        </div>
        <div
          class="h-64 sm:h-80 lg:h-[400px] xl:h-[500px] w-60 sm:w-80 xl:w-[450px] mx-auto p-2"
        >
          <LMap
            v-if="data.latitude && data.longitude"
            class="h-full w-full"
            :zoom="15"
            :center="[data.latitude, data.longitude]"
            :use-global-leaflet="false"
          >
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              layer-type="base"
              name="OpenStreetMap"
            />
            <LMarker :lat-lng="[data.latitude, data.longitude]"> </LMarker>
          </LMap>
        </div>
      </div>
      <PublicDoctorTable :details="detailsDoctor" />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const store = useLoaderStore();
const { isOpenLoader } = storeToRefs(store);
const props = defineProps<{
  data: HospitalWDist;
  lat?: number;
  lng?: number;
}>();

interface HospitalWDist extends SelectHospital {
  dist: number | null;
  availableRooms: number;
}
const detailsDoctor = ref<SelectDoctor[]>([]);
const imgLoading = ref(false);
const isOpen = ref(false);
// const availableRooms = ref<number>(0);
// const dist = computed(() => {
//   if (props.lat && props.lng && props.data.latitude && props.data.longitude)
//     return calculateDistance(
//       props.lat,
//       props.lng,
//       props.data.latitude,
//       props.data.longitude
//     );
// });
const categoryList = ref<GroupedCategory[]>([]);
const seeMore = async () => {
  // isOpenLoader.value = true;
  const res = await $fetch('/api/doctor', {
    method: 'GET',
    params: {
      hospitalUserId: props.data.id,
    },
  });
  detailsDoctor.value = res;
  const category = await $fetch(
    `/api/room/ctg?hospitalUserId=${props.data.id}`
  );
  const groupedCategory: GroupedCategory[] = category.reduce((acc, curr) => {
    if (typeof curr === 'object' && 'category' in curr) {
      const existingCategory = acc.find(
        (item) => item.category === curr.category
      );
      if (existingCategory) {
        existingCategory.count++;
      } else {
        acc.push({ category: curr.category, count: 1 });
      }
    }

    return acc;
  }, [] as GroupedCategory[]);
  categoryList.value = groupedCategory;
  // detailsDoctor.value = await $fetch('/api/doctor', {
  //   method: 'GET',
  //   params: {
  //     hospitalUserId: props.data.id,
  //   },
  // });
  // const room = await $fetch('/api/room', {
  //   method: 'GET',
  //   params: {
  //     hospitalUserId: props.data.id,
  //   },
  // });

  // const rooms = room.filter((r) => r.availability).map((r) => r.roomName);
  // availableRooms.value = rooms.length;
  isOpen.value = true;
  // isOpenLoader.value = false;
};
// const category = await $fetch(`/api/room/ctg?hospitalUserId=${props.data.id}`);
interface GroupedCategory {
  category: string;
  count: number;
}
// const groupedData: GroupedCategory[] = category.reduce((acc, curr) => {
//   if (typeof curr === 'object' && 'category' in curr) {
//     const existingCategory = acc.find(
//       (item) => item.category === curr.category
//     );
//     if (existingCategory) {
//       existingCategory.count++;
//     } else {
//       acc.push({ category: curr.category, count: 1 });
//     }
//   }

//   return acc;
// }, [] as GroupedCategory[]);
const groupedData = await useAsyncData('categoryData', async () => {
  const hospitalUserId = props.data.id;
  const category = await $fetch(
    `/api/room/ctg?hospitalUserId=${hospitalUserId}`
  );

  const groupedCategory: GroupedCategory[] = category.reduce((acc, curr) => {
    if (typeof curr === 'object' && 'category' in curr) {
      const existingCategory = acc.find(
        (item) => item.category === curr.category
      );
      if (existingCategory) {
        existingCategory.count++;
      } else {
        acc.push({ category: curr.category, count: 1 });
      }
    }

    return acc;
  }, [] as GroupedCategory[]);

  return groupedCategory;
});
// console.log(groupedData);
</script>

<style scoped></style>
