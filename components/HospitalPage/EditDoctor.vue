<template>
  <div>
    <UButton
      icon="i-heroicons-pencil-square"
      @click="isOpen = true"
      color="white"
    />

    <UModal v-model="isOpen">
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
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Edit Doctor
            </h3>
            <UButton
              color="red"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
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
            <UFormGroup label="Full Name" name="fullname">
              <UInput v-model="state.fullname" />
            </UFormGroup>

            <UFormGroup label="Specialization" name="services">
              <UInput v-model="state.services" />
            </UFormGroup>

            <UFormGroup label="Day Available" name="dayAvailable">
              <USelectMenu
                v-model="state.dayAvailable"
                :options="dayOfTheWeek"
                multiple
                placeholder="Select Availability Day"
              />
              <div class="flex gap-2 flex-wrap">
                <span v-for="(day, idx) in state.dayAvailable" :key="idx">
                  {{ day }}
                </span>
              </div>
            </UFormGroup>
            <UButton type="submit"> Update Doctor </UButton>
          </UForm>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { z } from 'zod';

const props = defineProps<{ data: SelectDoctor; refresh: () => void }>();

const store = useAuthStore();
const { hosptalDetails } = store;
const { hosptalDetails: details } = storeToRefs(store);
const dayOfTheWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const isOpen = ref(false);

const state = reactive<{
  fullname: string;
  services: string;
  dayAvailable: string[];
}>({
  fullname: '',
  services: '',
  dayAvailable: [],
});

const schema = z.object({
  fullname: z.string().min(3, 'Must be at least 3 characters'),
  services: z.string().min(3, 'Must be at least 3 characters'),
  dayAvailable: z.string().array(),
});

type Schema = z.output<typeof schema>;
const toast = useToast();
const errMsg = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { fullname, services, dayAvailable } = event.data;
  errMsg.value = false;
  if (!hosptalDetails.id) return console.log('No Hospital ID');
  const fullName = capitalize(fullname);
  const data: InsertDoctor = {
    id: props.data.id,
    name: fullName,
    services: services,
    dayAvailable: dayAvailable.join(', '),
  };

  await $fetch('/api/doctor', {
    method: 'PUT',
    body: data,
    headers: {
      useremail: `${store.userEmail}`,
    },
  })
    .then(() => {
      toast.add({
        title: `Doctor ${fullName} Updated Successfully.`,
        icon: 'i-heroicons-check-circle',
      });
      isOpen.value = false;
    })
    .catch((error) => {
      errMsg.value = true;
    });

  await props.refresh();
}
watchEffect(() => {
  state.fullname = props.data.name;
  state.services = props.data.services || '';
  state.services = props.data.services || '';
  state.dayAvailable =
    props.data.dayAvailable?.split(',').map((day) => day.trim()) || [];
});
</script>
