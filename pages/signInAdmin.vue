<template>
  <div
    class="min-h-svh grid items-center bg-[url('/assets/blur-hospital.jpg')] bg-cover bg-center"
  >
    <UCard
      :ui="{
        base: 'max-w-md mx-auto w-full ',
        background: 'bg-gray-100',
        header: {
          base: 'text-center text-2xl font-bold',
        },
        footer: {
          base: 'flex gap-2',
        },
      }"
    >
      <template #header> Sign In as Admin </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UDivider
          :ui="{
            avatar: {
              base: 'flex-shrink-0',
              size: '3xl',
            },
          }"
          :avatar="{ src: 'pho_logo_100x100.png' }"
        />
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" size="md" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" size="md" />
        </UFormGroup>
        <UDivider />
        <NuxtTurnstile v-model="token" />
        <UDivider />
        <span v-if="credentialsNotValid" class="text-red-500">{{
          credentialsNotValid
        }}</span>
        <div>
          <UButton
            type="submit"
            class="px-[1em] py-[0.75em]"
            color="black"
            label="Sign in"
          />
        </div>
      </UForm>
      <template #footer
        ><UButton label="Landing Page" @click="navigateTo('/')" />
        <UButton
          label="Sign In as Hospital"
          @click="navigateTo('/signInHospital')"
      /></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
const store = useAuthStore();
const token = ref('');
const response = ref('');
const { userEmail, userRole } = storeToRefs(store);

const toast = useToast();
const credentialsNotValid = ref('');
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!token) {
    return toast.add({
      title: 'Not Valid Captcha',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
  credentialsNotValid.value = '';
  const { email } = event.data;

  const res = await $fetch<boolean>('/api/adminUser/login', {
    method: 'POST',
    body: event.data,
    headers: {
      useremail: `${store.userEmail}`,
    },
  });
  if (res) {
    userEmail.value = email;
    userRole.value = 'admin';
    navigateTo('/adminPage');
  } else {
    credentialsNotValid.value = 'Credentials not Valid!';
  }
};
</script>

<style scoped></style>
