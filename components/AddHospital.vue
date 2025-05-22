<template>
  <Loader v-if="loading" />
  <div>
    <UButton
      label="Add Hospital"
      @click="isOpen = true"
      icon="i-heroicons-plus-circle"
    />

    <UModal :ui="{ width: 'w-full md:max-w-screen-lg' }" v-model="isOpen">
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
              Add Hospital
            </h3>
            <UButton
              color="red"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>

        <div class="h-full">
          <div>
            <UForm
              class="space-y-4"
              :schema="schema"
              :state="state"
              @submit="onSubmit"
            >
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <UFormGroup label="Email" name="email">
                    <UInput v-model="state.email" size="md" />
                    <span v-if="emailExist" class="text-red-500"
                      >Email is already taken.</span
                    >
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
                      <span v-if="hospitalNameExist" class="text-red-500"
                        >Hospital Name is already taken.</span
                      >
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
                      <span v-if="contactNumberExist" class="text-red-500"
                        >Mobile Number is already taken.</span
                      >
                    </UFormGroup>
                    <UFormGroup :ui="{}" label="Hospital Status" name="status">
                      <div
                        class="flex flex-col items-start gap-2 border border-gray-00 p-1 rounded-md bg-white"
                      >
                        <URadio
                          v-for="(item, n) of statusOptions"
                          :key="n"
                          v-model="state.status"
                          v-bind="item"
                        />
                      </div>
                    </UFormGroup>
                  </div>
                </div>
                <div class="flex flex-col justify-between">
                  <div class="flex flex-col gap-2">
                    <UFormGroup label="Hospital Logo" name="hospitalLogo">
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/jpeg, image/png"
                        @change="handleFileChange"
                        class="w-full h-full"
                      />
                      <span v-if="imgErr" class="text-red-500">{{
                        imgErr
                      }}</span>
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
                    :label="
                      verifyOTP ? 'Verify Verification Code' : 'Save Hospital'
                    "
                  />
                  <UInput
                    v-if="verifyOTP"
                    v-model="stateOTP.otp"
                    placeholder="Input verification code..."
                  />
                  <p
                    v-if="verifyMessage"
                    class="text-red-500 font-bold uppercase"
                  >
                    {{ verifyMessage }}
                  </p>
                </div>
              </div>
            </UForm>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { capitalize } from 'vue';
import { createClient } from '@supabase/supabase-js';

import crypto from 'crypto';
const { generateOtp, verifyOtp, generateExpiry } = useOtp();
const config = useRuntimeConfig().public;
const supabase = createClient(config.supbaseURL, config.supabaseKEY);
const storeHospital = useHospitalStore();
const { refresh } = storeHospital;
const { hospital } = storeToRefs(storeHospital);
const userStore = useAuthStore();
const { hospitalUser, refresh: refreshHospitalUser } = useHospitalUserStore();
const storeOTP = useVerifyOtpStore();
const { expiry, otp } = storeToRefs(storeOTP);
const loading = ref(false);
const imageUrl = ref('');
const imageFile = ref<Blob>();
const imgErr = ref('');

const verifyOTP = ref(false);

const emailExist = ref(false);
const hospitalNameExist = ref(false);
const contactNumberExist = ref(false);

const verifyMessage = ref('');
const statusOptions = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];
const verifyEntry = async () => {
  otp.value = generateOtp();
  expiry.value = generateExpiry();
  console.log(otp.value);
  await $fetch('/api/email', {
    method: 'POST',
    params: {
      email: state.email,
      otp: otp.value,
    },
  });
};

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

const toast = useToast();
// const services = ref('');
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(5, 'Must be at least 5 characters'),
  hospitalName: z.string().min(5, 'Must be at least 5 characters'),
  // services: z.string().optional().array(),
  address: z.string().min(5, 'Must be at least 5 characters'),
  description: z.string().min(5, 'Must be at least 5 characters'),

  // contactNumber: z
  //   .number()
  //   .min(1000000000, 'Must be a 10 digit number.')
  //   .max(9999999999, 'Must be a 10 digit number.'),
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
  status: z.boolean(),
});

type Schema = z.output<typeof schema>;
const showPassword = ref(false);
interface IState {
  email: string;
  password: string;
  hospitalName: string;
  services: string[];
  address: string;
  description: string;
  contactNumber?: number;
  // availableRooms?: number;
  lat?: number;
  lng?: number;
  status: undefined | boolean;
}
const state = reactive<IState>({
  email: '',
  password: '',
  hospitalName: '',
  services: [],
  address: '',
  description: '',
  contactNumber: undefined,

  lat: undefined,
  lng: undefined,
  status: undefined,
});

const stateOTP = reactive({
  otp: '',
});

const isOpen = ref(false);

const handleClick = (event: { latlng: any }) => {
  const { lat, lng } = event.latlng;
  state.lat = lat;
  state.lng = lng;
  // console.log('Clicked location:', state.loc);
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  let result = {
    success: false,
    message: '',
  };
  verifyOTP.value = true;
  if (otp.value === '') await verifyEntry();
  // if (stateOTP.otp !== '') {
  //   result = verifyOtp(stateOTP.otp, otp.value, expiry.value);
  //   console.log(result.success);
  //   if ((result.message === 'Expired')) {
  //     verifyMessage.value = 'Expired sending new code.';
  //     return await verifyEntry();
  //   }
  // } else {
  //   verifyMessage.value = 'Input Verification Code...';
  // }
  // if (result.success === false) return (verifyMessage.value = result.message);
  if (stateOTP.otp !== '') {
    const result = verifyOtp(stateOTP.otp, otp.value, expiry.value);
    // console.log(result.success);

    if (result.message === 'Expired') {
      verifyMessage.value = 'Expired, sending new code.';
      return await verifyEntry();
    }

    if (!result.success) {
      verifyMessage.value = result.message;
      return;
    }
  } else {
    return (verifyMessage.value = 'Input Verification Code...');
  }

  loading.value = true;
  emailExist.value = false;
  hospitalNameExist.value = false;
  contactNumberExist.value = false;

  const {
    email,
    password,
    hospitalName,
    address,
    description,
    lat,
    lng,
    status,
    contactNumber,
  } = event.data;
  const hashedPassword = await $fetch<string>('/api/hash', {
    method: 'POST',
    params: {
      inputPassword: password,
    },
  });

  const user: InsertHospitalUser = {
    email: email,
    password: hashedPassword,
  };
  try {
    emailExist.value = searchInArray(hospitalUser, email);
    if (emailExist.value) throw new Error('Email is already taken.');
    hospitalNameExist.value = searchInArray(hospital.value, hospitalName);
    if (hospitalNameExist.value)
      throw new Error('Hospital Name is already taken.');
    contactNumberExist.value = searchInArray(hospital.value, contactNumber);
    if (contactNumberExist.value)
      throw new Error('Contact number is already taken.');

    const { id } = await $fetch('/api/hospitalUser', {
      method: 'POST',
      body: user,
      headers: {
        useremail: `${userStore.userEmail}`,
      },
    });
    const data: InsertHospital = {
      name: capitalize(hospitalName),
      hospitalUserId: id,
      address: address,
      status: status,
      contactNumber: contactNumber,
      description: description,
      latitude: lat,
      longitude: lng,
    };
    const { name } = await $fetch('/api/hospital', {
      method: 'POST',
      body: data,
      headers: {
        useremail: `${userStore.userEmail}`,
      },
    });
    if (imageFile.value) {
      const { data: imgData, error } = await supabase.storage
        .from('mediconnect')
        .upload(`${id}_logo`, imageFile.value);
      // console.log(data);
      if (error) {
        console.error(error);
        return;
      }
    }

    state.email = '';
    state.hospitalName = '';
    state.address = '';

    state.contactNumber = undefined;
    state.description = '';
    state.services = [];
    state.password = '';
    state.lat = undefined;
    state.lng = undefined;
    state.status = undefined;
    imageFile.value = undefined;
    imageUrl.value = '';

    toast.add({
      color: 'lime',
      title: `Saved Data for Hospital: ${name}`,
    });

    isOpen.value = false;
  } catch (error: any) {
    const err: string = error.data.message;
    if (err.includes('hospital_user_email_unique')) {
      return toast.add({
        title: 'Error',
        icon: 'i-heroicons-x-circle',
        description: 'Hospital User email is not available.',
        color: 'red',
      });
    }
    if (err.includes('hospital_name_unique')) {
      return toast.add({
        title: 'Error',
        icon: 'i-heroicons-x-circle',
        description: 'Hospital Name is already taken.',
        color: 'red',
      });
    }
    if (err.includes('hospital_contact_number_unique')) {
      return toast.add({
        title: 'Error',
        icon: 'i-heroicons-x-circle',
        description: 'Contact Number already taken.',
        color: 'red',
      });
    }
    console.error(err);
  } finally {
    refresh();
    refreshHospitalUser();
    loading.value = false;
  }
};
</script>
