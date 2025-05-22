<template>
  <div>
    <UButton icon="i-heroicons-trash" color="red" @click="isOpen = true" />
    <UModal v-model="isOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          footer: {
            padding: 'px-[0.75em] py-[0.5em]',
          },
        }"
      >
        <div class="text-red-600">
          Are you sure you want to delete
          <span class="uppercase font-semibold">{{ name }}</span> ? This will
          delete the user, hospital details and any information associated with
          the hospital.
        </div>

        <template #footer>
          <div class="flex gap-2 items-center justify-end">
            <UButton
              label="Close"
              color="black"
              @click="isOpen = false"
              size="md"
            /><UButton
              label="Yes"
              color="red"
              size="md"
              @click="deleteHospital"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js';
const config = useRuntimeConfig().public;
const supabase = createClient(config.supbaseURL, config.supabaseKEY);
const userStore = useAuthStore();
const isOpen = ref(false);
const { refresh: refreshHospital } = useHospitalStore();
const { refresh: refreshHospitalUser } = useHospitalUserStore();
const props = defineProps<{ id: string; name: string }>();
const toast = useToast();
const { closeLoader, openLoader } = useLoaderStore();

const deleteHospital = async () => {
  openLoader();
  try {
    const hospital = await $fetch<SelectHospital>('/api/hospital/' + props.id, {
      method: 'GET',
    });

    const delDoctor = await $fetch<SelectDoctor>('/api/doctor', {
      method: 'DELETE',
      params: {
        hospitalId: hospital.id,
      },
      headers: {
        useremail: `${userStore.userEmail}`,
      },
    });

    const delRoom = await $fetch<SelectHospital>('/api/room', {
      method: 'DELETE',
      params: {
        hospitalId: hospital.id,
      },
      headers: {
        useremail: `${userStore.userEmail}`,
      },
    });

    const delHospital = await $fetch<SelectHospital>(
      '/api/hospital/' + hospital.id,
      {
        method: 'DELETE',
        headers: {
          useremail: `${userStore.userEmail}`,
        },
      }
    );
    const delHospitalUser = await $fetch<SelectHospitalUser>(
      '/api/hospitalUser/' + props.id,
      {
        method: 'DELETE',
        headers: {
          useremail: `${userStore.userEmail}`,
        },
      }
    );

    const { data, error } = await supabase.storage
      .from('mediconnect')
      .remove([`${props.id}_logo`]);

    if (error) {
      console.error(error);
    }

    isOpen.value = false;
    await refreshHospital();
    await refreshHospitalUser();
    toast.add({ title: 'Deleted Successfully.' });
  } catch (error) {
    console.error(error);
  } finally {
    closeLoader();
  }
};
</script>

<style scoped></style>
