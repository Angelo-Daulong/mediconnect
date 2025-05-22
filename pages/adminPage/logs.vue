<template>
  <headerComponent :headerText="'Admin page'" />
  <UContainer
    :ui="{
      padding: 'p-1 sm:p-2 lg:p-4',
      constrained: 'max-w-screen-2xl',
    }"
  >
    <DataTableLogs />
  </UContainer>
</template>

<script setup lang="ts"></script>
