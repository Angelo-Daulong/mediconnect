<template>
  <div>
    <UButton
      icon="i-heroicons-pencil-square"
      @click="openModal = true"
      color="white"
    />
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
              Edit Room
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
            <UFormGroup label="Category" name="category">
              <UInput v-model="state.category" />
            </UFormGroup>
            <!-- <UFormGroup label="Availability" name="availability">
              <div class="flex items-center gap-2">
                <URadio
                  v-for="item of availabilityOptions"
                  :key="item.value"
                  v-model="state.availability"
                  v-bind="item"
                />
              </div>
            </UFormGroup> -->
            <UButton type="submit"> Edit room </UButton>
          </UForm>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { z } from 'zod';
const store = useAuthStore();
const props = defineProps<{
  category: string;
  roomName: string;
  refresh: () => void;
  availability: boolean;
  id: number;
}>();

const openModal = ref(false);
const state = reactive<{ roomName: string; category: string }>({
  roomName: '',
  category: '',
});

watchEffect(() => {
  state.roomName = props.roomName;
  state.category = props.category;
});

const availabilityOptions = ref([
  { value: true, label: 'Available' },
  { value: false, label: 'Not Available' },
]);

const schema = z.object({
  roomName: z.string().min(3, 'Must be at least 3 characters'),
  category: z.string().min(3, 'Must be at least 3 characters'),
});

type Schema = z.output<typeof schema>;

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const { roomName, category } = event.data;
  const data = {
    roomName,
    category,
    id: props.id,
  };
  console.log(data);
  const response = await $fetch('/api/room', {
    method: 'PATCH',
    body: data,
    headers: {
      useremail: `${store.userEmail}`,
    },
  });
  props.refresh();
  openModal.value = false;
};
</script>

<style scoped></style>
