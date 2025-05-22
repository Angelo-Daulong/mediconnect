<template>
  <div class="[&>div>pre]:!rounded-t-none [&>div>pre]:!mt-0 grid">
    <UCard
      class="relative overflow-x-auto flex-1 w-full border border-gray-200 dark:border-gray-700"
      :ui="{
        base: '',
        ring: '',

        header: {
          padding: 'px-[1em] py-[0.5em]',
          base: 'flex justify-between items-center',
        },
        body: {
          padding: '',
          base: 'divide-y  divide-gray-200 dark:divide-gray-700',
        },
        footer: { padding: 'p-2' },
      }"
    >
      <template #header>
        <h2
          class="font-semibold text-xl text-gray-900 dark:text-white leading-tight"
        >
          Transcation Logs
        </h2>
      </template>
      <div class="flex items-center justify-between gap-3 px-4 py-3 flex-wrap">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          autocomplete="off"
          placeholder="Search..."
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              v-show="search !== ''"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="search = ''"
            />
          </template>
        </UInput>
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-2">
            <UToggle
              on-icon="i-heroicons-check-20-solid"
              off-icon="i-heroicons-x-mark-20-solid"
              size="lg"
              color="pho"
              v-model="denseTable"
            />
            <span> Dense </span>
          </div>
          <UButton
            icon="i-heroicons-arrow-path"
            class="rounded-[50%]"
            @click="refresh"
          />

          <span class="text-sm leading-5">Rows per page:</span>
          <USelect
            v-model="pageCount"
            :options="[5, 10, 15, 20]"
            class="me-2 w-20"
            size="xs"
          />
        </div>
      </div>
      <UTable
        :ui="{
          th: {
            padding: `${
              denseTable ? 'px-[0.5em] py-[0.25em] ' : 'lg:px-4 lg:py-4'
            }`,
          },
          td: {
            base: 'max-w-xs text-wrap  ',
            padding: `${
              denseTable ? 'px-[0.5em] py-[0.25em] ' : 'lg:px-4 lg:py-4'
            }`,
          },
        }"
        :loading="status === 'pending'"
        :sort="sort"
        :rows="filteredRows"
        :columns="columns"
      >
        <template #timestamp-data="{ row }">
          {{ timestampToDate(row.timestamp) }}
        </template>
      </UTable>

      <template #footer>
        <div
          v-if="filteredRows.length > 0"
          class="flex flex-wrap justify-between items-center"
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
      </template>
    </UCard>
  </div>
</template>

<script setup>
import { format } from 'date-fns';

const {
  data: transaction,
  status,
  refresh,
} = await useFetch('/api/transaction');

const columns = [
  {
    key: 'user',
    label: 'User',
  },
  {
    key: 'timestamp',
    label: 'Timestamp',
  },
  {
    key: 'method',
    label: 'Method',
  },
  {
    key: 'endpoint',
    label: 'Endpoint',
  },
  {
    key: 'context',
    label: 'Context',
  },
];

const sort = ref({
  column: 'timestamp',
  direction: 'asc',
});
const denseTable = ref(false);
const search = ref('');
const page = ref(1);
const pageCount = ref(5);
const pageFrom = computed(() => {
  if (filteredRows.value.length === 0) return 0;
  return (page.value - 1) * pageCount.value + 1;
});

const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);
const pageTotal = computed(() => {
  return search.value.length > 0
    ? filteredRows.value.length
    : transaction.value.length;
});
const filteredRows = computed(() => {
  const filteredlogs = search.value
    ? transaction.value.filter((val) => {
        return Object.values(val).some((value) => {
          return String(value)
            .toLowerCase()
            .includes(search.value.toLowerCase());
        });
      })
    : transaction;

  const dataToSlice = ref(filteredlogs);

  return dataToSlice.value.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value
  );
});

function timestampToDate(timestamp) {
  // Convert timestamp to a Date object
  const date = new Date(timestamp * 1000);

  // Format the date using date-fns
  return format(date, 'MM-dd-yyyy HH:mm');
}
</script>
