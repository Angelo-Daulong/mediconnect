// export const useAuthStore = defineStore('authStore', () => {
//   const userEmail = ref('');
//   const userRole = ref('');

//   const hosptalDetails = ref<SelectHospital>();

//   const signOut = () => {
//     userEmail.value = '';
//     userRole.value = '';
//     hosptalDetails.value = {} as SelectHospital;
//     navigateTo('/');
//   };

//   return { userEmail, userRole, hosptalDetails, signOut };
// });
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    userEmail: '',
    userRole: '',
    hosptalDetails: {} as SelectHospital,
  }),
  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: 'strict',
    }),
  },

  actions: {
    signOut() {
      this.userEmail = '';
      this.userRole = '';
      this.hosptalDetails = {} as SelectHospital;
      navigateTo('/');
    },
  },
});
