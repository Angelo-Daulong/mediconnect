<template>
  <div>
    <UButton
      icon="i-heroicons-trash"
      color="red"
      @click="addToArchive = !addToArchive"
    />

    <UModal
      :ui="{
        width: '',
      }"
      v-model="addToArchive"
    >
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          footer: {
            padding: 'px-[0.75em] py-[0.5em]',
          },
        }"
      >
        <h3>Archive Hospital?</h3>

        <template #footer>
          <div class="flex gap-2 items-center justify-end">
            <UButton
              label="Close"
              color="black"
              @click="addToArchive = false"
              size="md"
            /><UButton
              label="Yes"
              color="red"
              size="md"
              @click="archiveHospital"
            />
          </div>
        </template> </UCard
    ></UModal>
  </div>
</template>

<script setup lang="ts">
const store = useHospitalStore();

const { refresh } = store;
const addToArchive = ref(false);
const props = defineProps<{ uuid: string }>();

const archiveHospital = async () => {
  console.log(props.uuid);
  const res = await $fetch(`/api/hospitalUser/archive?id=${props.uuid}`, {
    method: 'PATCH',
  });
  addToArchive.value = false;
  await refresh();
};
</script>

<style scoped></style>
