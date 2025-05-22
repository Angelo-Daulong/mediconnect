<template>
  <div
    class="fixed left-0 top-0 h-full w-full z-[999] bg-gray-500 bg-opacity-80"
  >
    <div class="h-full flex items-center justify-center">
      <div
        class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      >
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div>
    </div>
  </div>
</template>
