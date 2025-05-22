<template>
  <div>
    <UButton
      label="Edit Hospital Info"
      icon="i-heroicons-pencil"
      @click="isOpen = true"
    />
    <UModal :ui="{ width: 'w-full md:max-w-screen-md' }" v-model="isOpen">
      <UCard
        :ui="{
          base: 'h-full flex flex-col w-full',
          rounded: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          background: 'bg-gray-200',
          body: {
            base: 'grow',
          },
          header: {
            padding: 'p-2',
          },
        }"
      >
        <template #header
          ><div class="flex justify-between items-center">
            <span class="font-bold">Edit</span>
            <UButton
              icon="i-heroicons-x-mark"
              color="red"
              @click="isOpen = false"
            /></div
        ></template>
        <UForm
          class="space-y-4"
          :schema="schema"
          :state="state"
          @submit="onSubmit"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <div class="w-fit mx-auto grid items-center">
                <h1 class="font-semibold">Select Location Coordinates</h1>
                <div class="max-w-md xl:max-w-lg pt-2">
                  <LMap
                    style="
                      height: 300px;
                      @media (min-width: 1536px) {
                        height: 400px;
                      }
                    "
                    :zoom="9"
                    :center="[8.065107520386732, 124.98586296990293]"
                    :use-global-leaflet="false"
                    @click="handleClick"
                  >
                    <LTileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      layer-type="base"
                      name="OpenStreetMap"
                    />
                    <LMarker
                      v-if="state.lat && state.lng"
                      :lat-lng="[state.lat, state.lng]"
                    />
                  </LMap>
                </div>

                <div class="flex gap-2">
                  <UFormGroup label="Latitude" name="lat">
                    <UInput v-model="state.lat" size="md" disabled />
                  </UFormGroup>
                  <UFormGroup label="Longitude" name="lng">
                    <UInput v-model="state.lng" size="md" disabled />
                  </UFormGroup>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <div>
                <UFormGroup label="Hospital Name" name="hospitalName">
                  <UInput v-model="state.hospitalName" size="md" />
                  <span v-if="hospitalNameExist" class="text-red-500"
                    >Hospital Name is already taken.</span
                  >
                </UFormGroup>

                <UFormGroup label="Services" name="services">
                  <UInput
                    v-model="servicesRef"
                    size="md"
                    autocomplete="off"
                    placeholder="Add Services"
                    :ui="{ icon: { trailing: { pointer: '' } } }"
                  >
                    <template #trailing>
                      <UButton
                        v-show="servicesRef !== ''"
                        color="gray"
                        variant="link"
                        label="Add"
                        icon="i-heroicons-plus"
                        :padded="false"
                        @click="() => state.services.push(servicesRef)"
                      />
                    </template>
                  </UInput>
                  <div class="flex gap-2 flex-wrap py-2">
                    <span
                      class="flex gap-2 items-center border px-[0.5em] rounded w-fit"
                      v-for="(service, index) in state.services"
                      >{{ service }}
                      <Icon
                        name="i-heroicons-trash"
                        color="red"
                        class="cursor-pointer"
                        @click="state.services.splice(index, 1)"
                    /></span>
                  </div>
                </UFormGroup>
                <UFormGroup label="Address" name="address">
                  <UInput v-model="state.address" size="md" />
                </UFormGroup>
                <UFormGroup label="Description" name="description">
                  <UTextarea v-model="state.description" />
                </UFormGroup>
                <UFormGroup label="Contact Number" name="contactNumber">
                  <UInput
                    v-model="state.contactNumber"
                    size="md"
                    type="number"
                    placeholder="XXX XXX XXXX"
                  >
                    <template #leading>
                      <span class="text-sm"> +63</span>
                    </template>
                  </UInput>
                  <span v-if="contactNumberExist" class="text-red-500"
                    >Mobile Number is already taken.</span
                  >
                </UFormGroup>
              </div>
              <UButton
                type="submit"
                class="px-[1em] py-[0.75em] mt-2"
                color="black"
                label="Update Hospital"
              />
            </div>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const store = useAuthStore();
const { signOut } = store;
const { refresh } = useHospitalStore();
const {
  name,
  address,
  contactNumber,
  description,
  latitude,
  longitude,
  services,
  id,
} = store.hosptalDetails;
const isOpen = ref(false);
const { hosptalDetails } = storeToRefs(store);
const emailExist = ref(false);
const hospitalNameExist = ref(false);
const contactNumberExist = ref(false);
const toast = useToast();
const servicesRef = ref('');
const allowedPrefixes = [
  '817',
  '813',
  '922',
  '895',
  '904',
  '907',
  '923',
  '896',
  '905',
  '908',
  '924',
  '897',
  '906',
  '909',
  '925',
  '898',
  '915',
  '910',
  '931',
  '991',
  '916',
  '911',
  '932',
  '992',
  '917',
  '912',
  '933',
  '993',
  '926',
  '913',
  '934',
  '994',
  '927',
  '914',
  '940',
  '935',
  '918',
  '941',
  '936',
  '919',
  '942',
  '937',
  '920',
  '943',
  '945',
  '921',
  '944',
  '953',
  '928',
  '973',
  '954',
  '929',
  '974',
  '955',
  '930',
  '956',
  '938',
  '965',
  '939',
  '966',
  '946',
  '967',
  '947',
  '975',
  '948',
  '976',
  '949',
  '977',
  '950',
  '978',
  '951',
  '979',
  '963',
  '994',
  '970',
  '995',
  '981',
  '996',
  '989',
  '997',
  '992',
  '998',
];
const schema = z.object({
  hospitalName: z.string().min(5, 'Must be at least 5 characters'),
  services: z.string().optional().array(),
  address: z.string().min(5, 'Must be at least 5 characters'),
  description: z.string().min(5, 'Must be at least 5 characters'),

  contactNumber: z
    .number()
    .min(1000000000, 'Must be a 10 digit number.')
    .max(9999999999, 'Must be a 10 digit number.')
    .refine((value) => {
      const valueStr = value.toString(); // Convert to string for prefix check
      for (const prefix of allowedPrefixes) {
        if (valueStr.startsWith(prefix)) {
          return true;
        }
      }
      return false;
    }, 'Contact number must must be valid.'),
  lat: z.number(),
  lng: z.number(),
});

type Schema = z.output<typeof schema>;

interface IState {
  hospitalName: string;
  services: string[];
  address: string;
  description: string;
  contactNumber?: number;

  lat?: number;
  lng?: number;
}
const state = reactive<IState>({
  hospitalName: name,
  services: services ? services.split(', ') : [],
  address: address ? address : '',
  description: description ? description : '',
  contactNumber: contactNumber ? contactNumber : undefined,
  lat: latitude ? latitude : undefined,
  lng: longitude ? longitude : undefined,
});
const handleClick = (event: { latlng: any }) => {
  const { lat, lng } = event.latlng;
  state.lat = lat;
  state.lng = lng;
  // console.log('Clicked location:', state.loc);
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const {
    hospitalName,
    address,

    contactNumber,
    description,
    lat,
    lng,
    services,
  } = event.data;
  const data = {
    name: hospitalName,
    services: services.join(', '),
    address: address,
    description: description,
    contactNumber: contactNumber,
    latitude: lat,
    longitude: lng,
  };
  try {
    const res = await $fetch<SelectHospital>('/api/hospital/' + id, {
      method: 'PATCH',
      body: data,
      headers: {
        useremail: `${store.userEmail}`,
      },
    });

    hosptalDetails.value = res;

    isOpen.value = false;
    await refresh();
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped></style>
