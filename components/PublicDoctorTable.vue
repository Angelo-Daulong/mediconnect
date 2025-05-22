<template>
  <div class="px-2">
    <UTable
      :ui="{
        emptyState: {
          label: 'text-sm text-center text-white',
        },
        th: {
          padding: 'p-2',
          color: 'text-white',
        },
        td: {
          padding: 'p-1',
          color: 'text-gray-400',
          base: 'whitespace-normal',
        },
      }"
      :columns="columns"
      :rows="rows"
    >
      <template #dutyStatus-data="{ row }">
        <span :class="row.dutyStatus ? 'text-pho-500' : 'text-red-500'"
          >{{ row.dutyStatus ? 'On Duty' : 'Off Duty' }}
        </span>
      </template>
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <span class="text-sm">No Doctor Listed in this hospital.</span>
        </div>
      </template>
    </UTable>
    <div
      v-if="details.length > 0"
      class="flex flex-wrap justify-between items-center p-2"
    >
      <div>
        <span class="text-sm leading-5">
          Showing
          <span class="font-medium">{{ pageFrom }}</span>
          to
          <span class="font-medium">{{ pageTo }}</span>
          of
          <span class="font-medium">{{ pageTotal }}</span>
          results
        </span>
      </div>

      <UPagination
        v-model="page"
        :page-count="Number(pageCount)"
        :total="pageTotal"
        :ui="{
          wrapper: 'flex items-center gap-1',
          rounded: 'min-w-[24px] justify-center',
          default: {
            activeButton: {
              variant: 'outline',
            },
          },
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { details } = defineProps<{ details: SelectDoctor[] }>();

const pageFrom = computed(() => {
  if (details.length === 0) return 0;
  return (page.value - 1) * pageCount.value + 1;
});

const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);
const page = ref(1);
const pageTotal = computed(() => {
  if (details) {
    return details.length;
  }
  return 0;
});
const pageCount = ref(3);

const rows = computed(() => {
  if (details)
    return details.slice(
      (page.value - 1) * pageCount.value,
      page.value * pageCount.value
    );
  return [];
});
const columns = [
  {
    key: 'name',
    label: `Doctor's name`,
  },
  { key: 'services', label: `Specialization` },
  { key: 'dayAvailable', label: `Day Available` },
];
</script>

<style scoped></style>
