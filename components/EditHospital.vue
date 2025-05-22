<template>
  <div>
    <UButton
      icon="i-heroicons-pencil-square"
      color="white"
      @click="openModal"
    />
    <UModal :ui="{ width: 'w-full md:max-w-screen-lg' }" v-model="isOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          footer: {
            padding: 'px-[0.75em] py-[0.5em]',
          },
          header: {
            padding: 'px-[0.75em] py-[0.5em]',
          },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg"> Edit {{ name }} User</span>
            <UButton
              icon="i-heroicons-x-mark-solid"
              color="red"
              @click="isOpen = false"
              size="md"
            />
          </div>
        </template>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <UFormGroup label="Email" name="email">
                <UInput v-model="state.email" />
              </UFormGroup>

              <UFormGroup label="Password" name="password">
                <UInput
                  v-model="state.password"
                  :type="`${showPassword ? 'text' : 'password'}`"
                  autocomplete="off"
                  :ui="{ icon: { trailing: { pointer: '' } } }"
                >
                  <template #trailing>
                    <UButton
                      color="gray"
                      variant="link"
                      :icon="`${
                        showPassword
                          ? 'i-heroicons-eye-slash'
                          : 'i-heroicons-eye'
                      }`"
                      :padded="false"
                      @click="showPassword = !showPassword"
                    /> </template
                ></UInput>
              </UFormGroup>
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
                </UFormGroup>

                <!-- <UFormGroup label="Services" name="services">
                      <UInput
                        v-model="services"
                        size="md"
                        autocomplete="off"
                        placeholder="Add Services"
                        :ui="{ icon: { trailing: { pointer: '' } } }"
                      >
                        <template #trailing>
                          <UButton
                            v-show="services !== ''"
                            color="gray"
                            variant="link"
                            label="Add"
                            icon="i-heroicons-plus"
                            :padded="false"
                            @click="() => state.services.push(services)"
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
                    </UFormGroup> -->
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
                </UFormGroup>
              </div>
            </div>
            <div class="flex flex-col justify-between">
              <div class="flex flex-col gap-2">
                <UFormGroup label="Hospital Logo">
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg, image/png"
                    @change="handleFileChange"
                    class="w-full h-full"
                  />
                  <span v-if="imgErr" class="text-red-500">{{ imgErr }}</span>
                </UFormGroup>
                <UButton
                  @click="imageUrl = ''"
                  label="Clear"
                  class="w-fit"
                  icon="i-heroicons-x-mark"
                  :trailing="true"
                />
                <div class="max-w-sm mx-auto w-full">
                  <NuxtImg v-if="imageUrl" :src="imageUrl" />
                  <USkeleton
                    v-else
                    class="w-full h-0 shadow-lg aspect-w-1 aspect-h-1 rounded-xl bg-pho-100"
                  />
                </div>
              </div>
              <UButton
                type="submit"
                class="px-[1em] py-[0.75em] mt-2"
                color="black"
                label="Update Hospital"
              />
            </div>
          </div>

          <!-- <UButton type="submit"> Save Update </UButton> -->
        </UForm>
      </UCard></UModal
    >
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { createClient } from '@supabase/supabase-js';
const config = useRuntimeConfig().public;
const supabase = createClient(config.supbaseURL, config.supabaseKEY);
const isOpen = ref(false);
const userStore = useAuthStore();
const props = defineProps<{
  name: string;
  id: string;
  hospitalDetails?: SelectHospital;
}>();
const storeLoader = useLoaderStore();
const { isOpenLoader } = storeToRefs(storeLoader);
const { refresh: refreshHospitalUser } = useHospitalUserStore();
const { refresh } = useHospitalStore();
const services = ref('');
const showPassword = ref(false);
const toast = useToast();
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
  email: z.string().email('Invalid email'),
  password: z.string().min(5, 'Must be at least 5 characters'),

  hospitalName: z.string().min(5, 'Must be at least 5 characters'),
  address: z.string().min(5, 'Must be at least 5 characters'),
  description: z.string().min(5, 'Must be at least 5 characters'),
  contactNumber: z
    .number()
    .int() // Ensure it's an integer
    .min(1000000000, { message: 'Contact number must be at least 10 digits' })
    .max(9999999999, { message: 'Contact number must be at least 10 digits' })
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
  email: string;
  password: string;
  hospitalName: string;

  address: string;
  description: string;
  contactNumber?: number;

  lat?: number;
  lng?: number;
}
const state = reactive<IState>({
  email: '',
  password: '',
  hospitalName: '',
  // services: [],
  address: '',
  description: '',
  contactNumber: undefined,
  lat: undefined,
  lng: undefined,
});
const handleClick = (event: { latlng: any }) => {
  const { lat, lng } = event.latlng;
  state.lat = lat;
  state.lng = lng;
};
const imgErr = ref('');
const imageFile = ref<Blob>();
const imageUrl = ref('');
const handleFileChange = async (event: any) => {
  imgErr.value = '';
  imageFile.value = event.target.files[0];
  if (!imageFile.value) return;
  const imgSize = imageFile.value.size / (1024 * 1024);

  if (imgSize > 5) {
    imgErr.value = 'Image must be less than 5 mb';
    return;
  }

  imageUrl.value = URL.createObjectURL(imageFile.value);
};
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isOpenLoader.value = true;

  const {
    email,
    password,
    address,
    contactNumber,
    description,
    hospitalName,
    lat,

    lng,
  } = event.data;
  const data: InsertHospitalUser = {
    id: props.id,
    email: email,
    password: password,
  };
  const hospitalData = {
    id: props.hospitalDetails?.id,
    name: hospitalName,
    address,
    description,
    contactNumber,

    latitude: lat,
    longitude: lng,
  };
  try {
    await $fetch('/api/hospitalUser', {
      method: 'PATCH',
      body: data,
      headers: {
        useremail: `${userStore.userEmail}`,
      },
    });
    await $fetch('/api/hospital', {
      method: 'PUT',
      body: hospitalData,
      headers: {
        useremail: `${userStore.userEmail}`,
      },
    });
    if (imageFile.value) {
      const { data: imgData, error } = await supabase.storage
        .from('mediconnect')
        .upload(`${data.id}_logo`, imageFile.value, {
          upsert: true,
        });
    }
    toast.add({
      title: 'Successfully Updated Hospital',
      icon: 'i-heroicons-user',
    });
    isOpen.value = false;
    await refreshHospitalUser();
    await refresh();
  } catch (error) {
    console.error(error);
  } finally {
    isOpenLoader.value = false;
  }
};

const openModal = async () => {
  const { id, email, password } = await $fetch<{
    id: string;
    email: string;
    password: string;
  }>('/api/hospitalUser/' + props.id);
  state.email = email;
  state.password = password;
  imageUrl.value = `${storageUrl}${id}_logo`;
  isOpen.value = true;
};
watchEffect(() => {
  if (props.hospitalDetails) {
    state.hospitalName = props.hospitalDetails.name;
    state.address = props.hospitalDetails.address || '';
    state.contactNumber = props.hospitalDetails.contactNumber
      ? props.hospitalDetails.contactNumber
      : 0;
    state.description = props.hospitalDetails.description || '';
    state.lat = props.hospitalDetails.latitude
      ? props.hospitalDetails.latitude
      : 0;
    state.lng = props.hospitalDetails.longitude
      ? props.hospitalDetails.longitude
      : 0;
  }
});
</script>

<style scoped></style>
