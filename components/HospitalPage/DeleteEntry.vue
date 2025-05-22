<template>
  <UButton icon="i-heroicons-trash" @click="isOpen = true" color="red" />
  <UModal :ui="{ width: 'w-full md:max-w-xs' }" v-model="isOpen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          padding: 'sm:px-[0.75em] sm:py-[0.5em]',
        },
        footer: {
          padding: 'px-[0.25em] py-[0.25em]',
        },
      }"
    >
      <div class="text-red-600">
        Are you sure you want to delete
        <span class="font-bold">{{ entryName }}</span> ?
      </div>

      <template #footer>
        <div class="flex gap-2 items-center justify-start">
          <UButton
            label="No"
            color="black"
            @click="isOpen = false"
            size="sm"
          /><UButton label="Yes" color="red" size="sm" @click="deleteEntry" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: number;
  entryName: string;
  deleteType: 'room' | 'doctor';
  refresh: () => void;
  pageToOne: () => void;
}>();
const userStore = useAuthStore();
const toast = useToast();
const isOpen = ref(false);
const deleteEntry = async () => {
  try {
    if (props.deleteType === 'room') {
      // console.log('Delete Room' + props.id);
      await $fetch(`/api/room/${props.id}`, {
        method: 'DELETE',
        headers: {
          useremail: `${userStore.userEmail}`,
        },
      });
    }
    if (props.deleteType === 'doctor') {
      // console.log('Delete doctor' + props.id);
      await $fetch(`/api/doctor/${props.id}`, {
        method: 'DELETE',
        headers: {
          useremail: `${userStore.userEmail}`,
        },
      });
    }
    toast.add({
      title: `Deleted ${props.entryName}`,
    });
    isOpen.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    props.refresh();
    props.pageToOne();
  }
};
</script>

<style scoped></style>
