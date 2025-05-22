<template>
  <div>
    <UCard
      :ui="{
        base: 'min-w-[300px] max-w-xs w-full h-full',
        body: {
          base: 'flex flex-col gap-4',
        },
      }"
    >
      <div class="w-full h-auto aspect-square">
        <NuxtImg v-if="showImg" :src="imageUrl" class="w-full h-full" />
        <USkeleton
          v-else
          class="w-full h-full shadow-lg aspect-w-1 aspect-h-1 rounded-xl"
        ></USkeleton>
      </div>
      <div class="flex gap-2">
        <UButton
          @click="updatePhotoModal = true"
          label="Update"
          class="w-fit"
          icon="i-heroicons-photo"
          :trailing="true"
        />
        <!-- <UButton
          @click="deletePhotoModal = true"
          label="Delete"
          class="w-fit"
          icon="i-heroicons-x-mark"
          color="red"
          :trailing="true"
        /> -->
        <UModal
          v-model="updatePhotoModal"
          :ui="{
            width: 'w-full sm:max-w-xs',
            padding: 'p-4 sm:p-2',
          }"
        >
          <div class="p-2 flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <UFormGroup label="Hospital Logo" name="hospitalLogo">
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
                @click="imageUrlUpdate = ''"
                label="Clear"
                class="w-fit"
                icon="i-heroicons-x-mark"
                :trailing="true"
              />
              <div class="max-w-sm mx-auto w-full">
                <NuxtImg
                  v-if="imageUrlUpdate"
                  :src="imageUrlUpdate"
                  class="w-full h-full"
                />
                <USkeleton
                  v-else
                  class="w-full h-0 shadow-lg aspect-w-1 aspect-h-1 rounded-xl bg-pho-100"
                />
              </div>
            </div>
            <div class="flex gap-2">
              <UButton
                label="Close"
                class="w-fit"
                @click="updatePhotoModal = false"
              />
              <UButton
                label="Update"
                class="w-fit"
                color="red"
                @click="updatePhoto"
              />
            </div>
          </div>
        </UModal>

        <UModal
          v-model="deletePhotoModal"
          :ui="{
            width: 'w-full sm:max-w-xs',
            padding: 'p-4 sm:p-2',
          }"
        >
          <div class="p-2 flex flex-col gap-4">
            <span class="text-red-500 text-md font-semibold">
              Are you sure you want to remove Logo?</span
            >
            <div class="flex gap-2">
              <UButton
                label="No"
                class="w-fit"
                @click="deletePhotoModal = false"
              />
              <UButton
                label="Yes"
                class="w-fit"
                color="red"
                @click="deletePhoto"
              />
            </div>
          </div>
        </UModal>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js';
const config = useRuntimeConfig().public;
const supabase = createClient(config.supbaseURL, config.supabaseKEY);
const props = defineProps<{ hosptalDetails: SelectHospital }>();
const { hosptalDetails } = props;
const showImg = ref(true);
const handleFileChange = async (event: any) => {
  imgErr.value = '';
  imageFile.value = event.target.files[0];
  if (!imageFile.value) return;
  const imgSize = imageFile.value.size / (1024 * 1024);

  if (imgSize > 5) {
    imgErr.value = 'Image must be less than 5 mb';
    return;
  }

  imageUrlUpdate.value = URL.createObjectURL(imageFile.value);
};

const imageUrlUpdate = ref(
  `${storageUrl}${hosptalDetails.hospitalUserId}_logo`
);
const imageFile = ref<Blob>();
const updatePhotoModal = ref(false);
const deletePhotoModal = ref(false);
const imgErr = ref('');
const imageUrl = ref('');

watchEffect(() => {
  imageUrl.value = `${storageUrl}${hosptalDetails.hospitalUserId}_logo`;
});

const deletePhoto = () => {
  deletePhotoModal.value = false;
  imageUrl.value = '';
};

const updatePhoto = async () => {
  if (imageFile.value) {
    imageUrl.value = '';
    showImg.value = false;
    const { data, error } = await supabase.storage
      .from('mediconnect')
      .update(`${hosptalDetails.hospitalUserId}_logo`, imageFile.value);
    // console.log(data, error);

    setTimeout(() => {
      showImg.value = true;
    }, 500);
    imageUrl.value = `${storageUrl}${data?.path}`;
  }
  updatePhotoModal.value = false;
};
</script>

<style scoped></style>
