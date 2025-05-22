<template>
  <div class="border rounded-md">
    <div class="flex justify-between items-center p-2 bg-gray-300 rounded-t-md">
      <h1 class="font-semibold">Doctors</h1>
      <HospitalPageAddDoctor :refresh="refresh" />
    </div>
    <UDivider />
    <UTable
      :sort="{
        column: 'name',
        direction: 'asc',
      }"
      :columns="columns"
      :rows="rows"
      :ui="{
        td: {
          padding: 'px-[0.5em] py-[0.25em]',
        },
      }"
    >
      <template #dutyStatus-data="{ row }">
        <div class="flex gap-2 justify-start">
          <URadio
            v-for="(item, index) of availabilityOptions"
            :key="index"
            v-model="row.dutyStatus"
            v-bind="item"
            @click="updateDutyStatus(row.dutyStatus, row.id)"
          />
        </div>
      </template>

      <template #actions-data="{ row }">
        <div class="flex justify-end px-4 gap-2">
          <HospitalPageDeleteEntry
            :id="row.id"
            :entry-name="row.name"
            delete-type="doctor"
            :refresh="refresh"
            :pageToOne="pageToOne"
          />
          <HospitalPageEditDoctor :data="row" :refresh="refresh" />
          <!-- <UButton
            icon="i-heroicons-trash"
            @click="deleteDoctor(row.id)"
            color="red"
          /> -->
        </div>
      </template>
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <span class="text-sm">No Doctors Listed in this hospital.</span>
        </div>
      </template>
    </UTable>
    <UDivider />
    <div
      v-if="rows.length > 0"
      class="flex flex-wrap justify-between items-center p-2"
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
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const store = useAuthStore();

const { hosptalDetails } = store;

//  number: number | null;
//     id: number;
//     name: string;
//     services:
const availabilityOptions = [
  { value: true, label: 'On Duty', icon: 'i-heroicons-check' },
  { value: false, label: 'Off Duty', icon: 'i-heroicons-x-mark' },
];
const pageFrom = computed(() => {
  if (rows.value.length === 0) return 0;
  return (page.value - 1) * pageCount.value + 1;
});

const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);
const page = ref(1);
const pageTotal = computed(() => {
  if (doctors.value) {
    return doctors.value.length;
  }
  return 0;
});
const pageCount = ref(5);
const rows = computed(() => {
  if (doctors.value)
    return doctors.value.slice(
      (page.value - 1) * pageCount.value,
      page.value * pageCount.value
    );
  return [];
});
const pageToOne = () => {
  page.value = 1;
};
const columns = [
  // {
  //   key: 'number',
  //   label: 'Doctor Id',
  // },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'services',
    label: 'Specialization',
    class: 'text-left',
  },
  // {
  //   key: 'dutyStatus',
  //   label: 'Duty Status',
  //   class: 'text-left',
  // },
  {
    key: 'dayAvailable',
    label: 'Day Available',
    class: 'text-left',
  },
  {
    key: 'actions',
    label: 'Actions',
    class: 'text-right',
  },
];

const { data: doctors, refresh } = useFetch('/api/doctor', {
  query: {
    hospitalUserId: hosptalDetails.id,
  },
});

const deleteDoctor = async (id: number) => {
  try {
    const res = await $fetch<SelectDoctor>('/api/doctor/' + id, {
      method: 'DELETE',
      headers: {
        useremail: `${store.userEmail}`,
      },
    });
    await refresh();
    toast.add({
      title: 'Deleted ' + res.name,
      icon: 'i-heroicons-trash',
    });
    page.value = 1;
  } catch (error) {
    toast.add({
      title: 'Deleting Doctor Failed.',
      color: 'red',
      icon: 'i-heroicons-trash',
    });
  }
};
const updateDutyStatus = async (dutyStatus: boolean, id: number) => {
  const dutyStatusVal = !dutyStatus;

  try {
    await $fetch('/api/doctor', {
      method: 'PUT',
      body: {
        id,
        dutyStatus: dutyStatusVal,
      },
      headers: {
        useremail: `${store.userEmail}`,
      },
    });
    await refresh();
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped></style>
