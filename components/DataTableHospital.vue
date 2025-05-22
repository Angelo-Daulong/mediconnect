<template>
  <div class="[&>div>pre]:!rounded-t-none [&>div>pre]:!mt-0 grid">
    <UCard
      class="relative overflow-x-auto flex-1 w-full border border-gray-200 dark:border-gray-700"
      :ui="{
        base: '',
        ring: '',

        header: {
          padding: 'px-[1em] py-[0.5em]',
          base: 'flex justify-between items-center',
        },
        body: {
          padding: '',
          base: 'divide-y  divide-gray-200 dark:divide-gray-700',
        },
        footer: { padding: 'p-2' },
      }"
    >
      <template #header>
        <h2
          class="font-semibold text-xl text-gray-900 dark:text-white leading-tight"
        >
          Hospitals
        </h2>
      </template>
      <div class="flex items-center justify-between gap-3 px-4 py-3 flex-wrap">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          autocomplete="off"
          placeholder="Search..."
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
        </UInput>
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-2">
            <UToggle
              on-icon="i-heroicons-check-20-solid"
              off-icon="i-heroicons-x-mark-20-solid"
              size="lg"
              color="pho"
              v-model="denseTable"
            />
            <span> Dense </span>
          </div>
          <AddHospital />
          <span class="text-sm leading-5">Rows per page:</span>
          <USelect
            v-model="pageCount"
            :options="[5, 10, 15, 20]"
            class="me-2 w-20"
            size="xs"
          />
        </div>
      </div>
      <UTable
        :ui="{
          th: {
            padding: `${
              denseTable ? 'px-[0.5em] py-[0.25em] ' : 'lg:px-4 lg:py-4'
            }`,
          },
          td: {
            base: 'max-w-xs text-wrap last:z-10 last:sticky last:right-0 last:bg-gray-100 ',
            padding: `${
              denseTable ? 'px-[0.5em] py-[0.25em] ' : 'lg:px-4 lg:py-4'
            }`,
          },
        }"
        :loading="statusHospital === 'pending'"
        :sort="sort"
        :rows="filteredRows"
        :columns="columns"
      >
        <template #hospitalUserId-data="{ row }"
          ><UAvatar
            :src="`${storageUrl}${row.hospitalUserId}_logo`"
            alt="Avatar"
        /></template>

        <template #latitude-data="{ row }">
          {{ row.latitude.toFixed(4) }}</template
        >
        <template #longitude-data="{ row }"
          >{{ row.longitude.toFixed(4) }}
        </template>
        <template #status-data="{ row }">
          <UButton
            @click="changeStatus(row.status, row.id)"
            :color="row.status ? 'pho' : 'red'"
            :label="row.status ? 'Active' : 'Inactive'"
          />
        </template>
        <template #actions-data="{ row }">
          <div class="flex items-center gap-2 justify-center">
            <EditHospital
              :id="row.hospitalUserId"
              :name="row.name"
              :hospital-details="row"
            />
            <ArchiveHospital :uuid="row.hospitalUserId" />
            <!-- <UTooltip text="Archive Hospital" :popper="{ placement: 'left' }">
              <UButton
                icon="i-heroicons-trash"
                color="red"
                @click="archiveHospital(row.hospitalUserId)"
              />
            </UTooltip> -->
            <!-- <DeleteHospital :id="row.hospitalUserId" :name="row.name" /> -->
          </div>
        </template></UTable
      >
      <template #footer>
        <div
          v-if="filteredRows.length > 0"
          class="flex flex-wrap justify-between items-center"
        >
          <div>
            <span class="text-sm leading-5">
              Showing
              <span class="font-medium">{{ pageFrom }}</span>
              to
              <span class="font-medium">{{ pageTo }}</span>
              of
              <span class="font-medium">{{ pageTotal }}</span>
              results
            </span>
          </div>

          <UPagination
            v-model="page"
            :page-count="Number(pageCount)"
            :total="pageTotal"
            :ui="{
              wrapper: 'flex items-center gap-1',
              rounded: 'min-w-[24px] justify-center',
              default: {
                activeButton: {
                  variant: 'outline',
                },
              },
            }"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { storageUrl } from '#imports';
const store = useHospitalStore();
const { refresh: refreshHospitalUser } = useHospitalUserStore();
const { refresh } = store;
const { hospital, statusHospital } = storeToRefs(store);
const user = useAuthStore();
const denseTable = ref(true);

const search = ref('');
const page = ref<number>(1);
const pageCount = ref(10);
const pageFrom = computed(() => {
  if (filteredRows.value.length === 0) return 0;
  return (page.value - 1) * pageCount.value + 1;
});

const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);
const pageTotal = computed(() => {
  return search.value.length > 0
    ? filteredRows.value.length
    : hospital.value.filter((val) => val.archived === false).length;
});
const sort = ref<{ column: string; direction: 'desc' | 'asc' }>({
  column: 'name',
  direction: 'asc',
});
const columns = [
  {
    key: 'hospitalUserId',
    label: '',
  },

  {
    key: 'name',
    label: 'Hospital Name',
    sortable: true,
  },
  {
    key: 'description',
    label: 'Description',
  },
  {
    key: 'address',
    label: 'Address',
  },
  {
    key: 'services',
    label: 'Services',
  },
  {
    key: 'contactNumber',
    label: 'Contact Number',
  },

  {
    key: 'latitude',
    label: 'Latitude',
  },
  {
    key: 'longitude',
    label: 'Longitude',
  },
  {
    key: 'availableRooms',
    label: 'Available Room/s',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'actions',
    label: 'Actions',
    class: 'last:z-10 last:sticky last:right-0 last:bg-gray-200',
  },
];

// const filteredRows = computed(() => {
//   const filteredHospital = search.value
//     ? hospital.value.filter((val) => {
//         return Object.values(val).some((value) => {
//           return String(value)
//             .toLowerCase()
//             .includes(search.value.toLowerCase());
//         });
//       })
//     : hospital;

//   const dataToSlice = ref(filteredHospital);

//   return dataToSlice.value.slice(
//     (page.value - 1) * pageCount.value,
//     page.value * pageCount.value
//   );
// });

const filteredRows = computed(() => {
  const filteredHospital = search.value
    ? hospital.value.filter((val) => {
        // Check if the hospital is not deleted (deleted: false)
        const isNotDeleted = val.archived === false;

        // Search logic
        const matchesSearch = Object.values(val).some((value) => {
          return String(value)
            .toLowerCase()
            .includes(search.value.toLowerCase());
        });

        return isNotDeleted && matchesSearch; // Filter both by deleted status and search query
      })
    : hospital.value.filter((val) => val.archived === false); // Default filter for non-deleted hospitals

  const dataToSlice = ref(filteredHospital);

  return dataToSlice.value.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value
  );
});

const changeStatus = async (status: boolean, id: number) => {
  let stat = false;
  if (status) {
    stat = true;
  } else {
    stat = false;
  }
  await $fetch('/api/hospital', {
    method: 'PUT',
    body: { id: id, status: !stat },
    headers: {
      useremail: `${user.userEmail}`,
    },
  });
  await refresh();
};

const archiveHospital = async (uuid: string) => {
  const res = await $fetch(`/api/hospitalUser/archive?id=${uuid}`, {
    method: 'PATCH',
  });

  await refresh();
};

onMounted(() => {
  refreshHospitalUser();
  refresh();
});
</script>

<style scoped></style>
