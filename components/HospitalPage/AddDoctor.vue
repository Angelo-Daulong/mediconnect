<template>
  <div>
    <UButton
      label="Add Doctor"
      icon="i-heroicons-plus"
      @click="isOpen = true"
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
              Add Doctor
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
            <UFormGroup>
              <UCheckbox
                v-model="existingDoctor"
                label="Add Existing Doctor from other Hospitals"
            /></UFormGroup>

            <UFormGroup v-if="existingDoctor" label="Full Name" name="fullName">
              <UInputMenu
                v-model="state.fullName"
                :search="search"
                :loading="loading"
                placeholder="Search for a doctor..."
                option-attribute="name"
                by="id"
              />
            </UFormGroup>
            <UFormGroup
              v-if="!existingDoctor"
              label="First Name"
              name="firstName"
            >
              <UInput v-model="state.firstName" />
            </UFormGroup>
            <UFormGroup
              v-if="!existingDoctor"
              label="Last Name"
              name="lastName"
            >
              <UInput v-model="state.lastName" />
            </UFormGroup>

            <!-- <UFormGroup label="Duty Status" name="dutyStatus">
              <div class="flex items-center gap-2">
                <URadio
                  v-for="(item, idx) of dutyStatusOptions"
                  :key="idx"
                  v-model="state.dutyStatus"
                  v-bind="item"
                />
              </div>
            </UFormGroup> -->
            <UFormGroup label="Day Available" name="daySelected">
              <USelectMenu
                v-model="state.daySelected"
                :options="dayOfTheWeek"
                multiple
                placeholder="Select Availability Day"
              />
              <div class="flex gap-2 flex-wrap">
                <span v-for="(day, idx) in state.daySelected" :key="idx">
                  {{ day }}
                </span>
              </div>
            </UFormGroup>
            <UFormGroup>
              <UCheckbox
                v-model="existingSpecilization"
                label="Add Existing Specilization"
            /></UFormGroup>

            <UFormGroup
              v-if="!existingSpecilization"
              label="Specialization"
              name="services"
            >
              <UInput v-model="state.services" />
            </UFormGroup>
            <UFormGroup
              v-if="existingSpecilization"
              label="Specialization"
              name="services"
              placeholder="Input Specialization"
            >
              <UInputMenu
                v-model="state.services"
                :search="searchSpecialization"
                :loading="loadingSpecialization"
                placeholder="Search Specialization"
                option-attribute="services"
                by="id"
              />
            </UFormGroup>
            <UFormGroup v-if="errMsg">
              <span class="text-red-500">{{
                'Doctor name already exist.'
              }}</span>
            </UFormGroup>

            <UButton type="submit"> Submit </UButton>
          </UForm>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { z } from 'zod';
import type { SelectDoctor } from '~/utils/schema';
const existingSpecilization = ref(false);
const loading = ref(false);
const loadingSpecialization = ref(false);
const existingDoctor = ref(false);
const props = defineProps<{ refresh: () => void }>();
const dayOfTheWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const store = useAuthStore();
const { hosptalDetails } = store;
const { hosptalDetails: details } = storeToRefs(store);
const dutyStatusOptions = [
  { value: true, label: 'Available', icon: 'i-heroicons-check' },
  { value: false, label: 'Not Available', icon: 'i-heroicons-x-mark' },
];
const isOpen = ref(false);

const state = reactive({
  fullName: '',
  firstName: '',
  lastName: '',
  number: undefined,
  services: '',
  // dutyStatus: true,
  daySelected: [],
});
const schemaServices = z.object({
  id: z.number(),
  services: z.string(),
});
const schema = z.object({
  // fullName: z.string().min(3, 'Must be at least 3 characters').optional(),
  // firstName: z.string().min(3, 'Must be at least 3 characters').optional(),
  // lastName: z.string().min(3, 'Must be at least 3 characters').optional(),
  fullName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  // dutyStatus: z.boolean(),
  // services: z.string().min(3, 'Must be at least 3 characters'),
  services: z.string(),
  daySelected: z.string().array(),
});

type Schema = z.output<typeof schema>;
const toast = useToast();
const errMsg = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const {
    fullName,
    firstName,
    lastName,
    services,
    daySelected,
    // dutyStatus
  } = event.data;
  errMsg.value = false;
  if (!hosptalDetails.id) return console.log('No Hospital ID');

  const fullNameSave = computed(() => {
    if (existingDoctor.value) {
      // If existingDoctor is true, combine firstName and lastName

      if (fullName) {
        return capitalize(fullName);
      }
    } else {
      // If existingDoctor is false, use fullName
      if (firstName && lastName) {
        return capitalize(`${firstName} ${lastName}`);
      }
    }
    return ''; // Return empty if no name data is available
  });
  if (fullNameSave.value === '') {
    return toast.add({
      title: `Doctor name must not be empty.`,
      color: 'amber',
    });
  }
  const data: InsertDoctor = {
    name: fullNameSave.value,
    // dutyStatus: dutyStatus,
    dayAvailable: daySelected.join(', '),
    services: services,
    hospitalId: hosptalDetails.id,
  };
  console.log(data);
  // try {
  //   const res = $fetch('/api/doctor', {
  //     method: 'POST',
  //     body: data,
  //   }).then().catch();
  //   if (error.value) return console.log(error.value);
  //   isOpen.value = false;
  //   props.refresh();
  // } catch (err) {
  //   console.log(err);
  // } finally {
  // }
  $fetch('/api/doctor', {
    method: 'POST',
    body: data,
    headers: {
      useremail: `${store.userEmail}`,
    },
  })
    .then((response) => {
      toast.add({
        title: `Doctor ${fullNameSave} Saved Successfully.`,
        icon: 'i-heroicons-check-circle',
      });
      isOpen.value = false;
      props.refresh();
    })
    .catch((error) => {
      errMsg.value = true;
    });
}
async function search(name: string) {
  loading.value = true;

  const doctors = await $fetch(
    `/api/doctor/search?id=${hosptalDetails.id}&name=${name}`
  );
  const doctorOptions = Array.from(
    new Set(doctors.map((doctors) => doctors.name))
  );

  loading.value = false;

  return doctorOptions;
}
async function searchSpecialization(services: string) {
  loadingSpecialization.value = true;

  const doctors = await $fetch(`/api/doctor/search`, { params: { services } });
  // const specializationOptions = doctors.map((doctor) => ({
  //   services: doctor.services,
  //   id: doctor.id,
  // }));
  const specializationOptions = Array.from(
    new Set(doctors.map((doctors) => doctors.services))
  );
  // const specializationOptions = Array.from(
  //   new Map(
  //     doctors.map((doctor) => [
  //       doctor.services,
  //       { services: doctor.services, id: doctor.id },
  //     ])
  //   ).values()
  // );
  loadingSpecialization.value = false;

  return specializationOptions;
}
watch(
  () => existingDoctor.value,
  () => {
    // Reset fields when existingDoctor changes
    state.firstName = '';
    state.lastName = '';
    state.fullName = '';
  }
);
</script>
