<template>
  <div class="border rounded-md">
    <div class="flex justify-between items-center p-2 bg-gray-300 rounded-t-md">
      <h1 class="font-semibold">Beds</h1>
      <UButton icon="i-heroicons-plus" label="Add Bed" @click="openModalFunc" />
    </div>
    <UDivider />
    <UTable
      :sort="{
        column: 'roomName',
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
      <template #availability-data="{ row }">
        <div class="flex gap-2 justify-center">
          <URadio
            v-for="(item, index) of availabilityOptions"
            :key="index"
            v-model="row.availability"
            v-bind="item"
            @click="updateRoomAvailability(row.availability, row.id)"
          />
        </div>
        <!-- <div class="flex justify-center">
          <div
            class="flex items-center gap-2 text-pho-500"
            v-if="row.availability"
          >
            <UIcon name="i-heroicons-check-badge" class="text-xl" /><span
              >Availabile</span
            >
          </div>
          <div class="flex items-center gap-2 text-red-500" v-else>
            <UIcon name="i-heroicons-x-circle" class="text-xl" /><span
              >Not Availabile</span
            >
          </div>
        </div> -->
      </template>

      <template #actions-data="{ row }">
        <div class="flex justify-end px-4 gap-2">
          <HospitalPageDeleteEntry
            v-if="row.availability == true"
            :id="row.id"
            :entry-name="row.roomName"
            delete-type="room"
            :refresh="refresh"
            :pageToOne="pageToOne"
          />
          <HospitalPageEditRoom
            :category="row.category"
            :room-name="row.roomName"
            :availability="row.availability"
            :id="row.id"
            :refresh="refresh"
          />
          <!-- <UButton
            icon="i-heroicons-trash"
            @click="deleteRoom(row.id)"
            color="red"
          /> -->
        </div>
      </template>
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <span class="text-sm"
            >No Available Room Listed in this hospital.</span
          >
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
  <UModal v-model="openModal">
    <UCard
      :ui="{
        base: 'h-full flex flex-col w-full',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        background: 'bg-gray-200',
        body: {
          base: 'grow',
        },
      }"
      ><template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Add Room
          </h3>
          <UButton
            color="red"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="openModal = false"
          />
        </div>
      </template>
      <div>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup label="Room name" name="roomName">
            <UInput v-model="state.roomName" />
          </UFormGroup>

          <UFormGroup label="Availability" name="availability">
            <div class="flex items-center gap-2">
              <URadio
                v-for="(item, idx) of availabilityOptions"
                :key="idx"
                v-model="state.availability"
                v-bind="item"
              />
            </div>
          </UFormGroup>
          <UCheckbox
            v-model="selectCategory"
            label="Select Existing Category"
            :ui="{}"
          />
          <UFormGroup label="Category" name="category">
            <UInputMenu
              v-if="selectCategory"
              :search="search"
              :loading="loading"
              v-model="state.category"
              placeholder="Select a category..."
              option-attribute="category"
              by="category"
            />

            <UInput
              v-if="!selectCategory"
              v-model="state.category"
              placeholder="Input a category..."
            />
          </UFormGroup>
          <UButton type="submit"> Save room </UButton>
        </UForm>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { z } from 'zod';
const store = useAuthStore();
const { hosptalDetails } = store;
const selectCategory = ref(false);
const pageFrom = computed(() => {
  if (rows.value.length === 0) return 0;
  return (page.value - 1) * pageCount.value + 1;
});

const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);
const page = ref(1);
const pageTotal = computed(() => {
  if (room.value) {
    return room.value.length;
  }
  return 0;
});
const pageCount = ref(5);
const rows = computed(() => {
  if (room.value)
    return room.value.slice(
      (page.value - 1) * pageCount.value,
      page.value * pageCount.value
    );
  return [];
});
const pageToOne = () => {
  page.value = 1;
};
const openModal = ref(false);
const toast = useToast();
const availabilityOptions = [
  { value: true, label: 'Available', icon: 'i-heroicons-check' },
  { value: false, label: 'Not Available', icon: 'i-heroicons-x-mark' },
];

const columns = [
  {
    key: 'roomName',
    label: 'Bay',
  },
  {
    key: 'availability',
    label: 'Availability',
    class: 'text-center',
  },
  {
    key: 'category',
    label: 'Category',
    class: 'text-center',
  },
  {
    key: 'actions',
    label: 'Actions',
    class: 'text-right',
  },
];

const openModalFunc = () => {
  (state.roomName = ''), (state.availability = undefined);
  openModal.value = true;
};
const { data: room, refresh } = useFetch('/api/room', {
  query: {
    hospitalUserId: hosptalDetails.id,
  },
});

const state = reactive<{
  roomName: string;
  availability: boolean | undefined;
  category: string;
}>({
  roomName: '',
  availability: true,
  category: '',
});

const schema = z.object({
  roomName: z.string().min(3, 'Must be at least 3 characters'),
  availability: z.boolean(),
  category: z.string().min(3, 'Must be at least 3 characters'),
});

type Schema = z.output<typeof schema>;

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const { roomName: rn, availability, category: cat } = event.data;
  // console.log(event.data);
  const category = capitalize(cat);
  const roomName = capitalize(rn);
  const data: InsertRoom = {
    category,
    roomName,
    availability,
    hospitalId: hosptalDetails.id,
  };
  try {
    await $fetch('/api/room', {
      method: 'POST',
      body: data,
      headers: {
        useremail: `${store.userEmail}`,
      },
    });
    await refresh();
    openModal.value = false;
    toast.add({
      title: 'Successfully Added room.',
    });
    (state.roomName = ''),
      (state.availability = undefined),
      (state.category = '');
  } catch (error) {
    console.log(error);
  }
};

const deleteRoom = async (id: number) => {
  try {
    await $fetch('/api/room/' + id, {
      method: 'DELETE',
      headers: {
        useremail: `${store.userEmail}`,
      },
    });
    await refresh();
    toast.add({ title: 'Successfully deleted room.' });
  } catch (error) {
    console.log(error);
  }
};

const updateRoomAvailability = async (availability: boolean, id: number) => {
  const availablelityVal = !availability;
  await $fetch('/api/room', {
    method: 'PATCH',
    body: {
      id,
      availability: availablelityVal,
    },
    headers: {
      useremail: `${store.userEmail}`,
    },
  });
  await refresh();
};
const loading = ref(false);

async function search(categorySearch: string) {
  loading.value = true;

  const category = await $fetch(`/api/room/ctg`, {
    params: { categorySearch },
  });

  loading.value = false;

  return Array.from(new Set(category.map((cat) => cat.category)));
}

watch(
  () => selectCategory.value,
  () => {
    // Reset fields when existingDoctor changes
    state.category = '';
  }
);
</script>

<style scoped></style>
