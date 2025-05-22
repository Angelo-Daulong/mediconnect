export const useLoaderStore = defineStore('loaderStore', {
  state: () => ({
    isOpenLoader: false,
  }),

  actions: {
    closeLoader() {
      this.isOpenLoader = false;
    },
    openLoader() {
      this.isOpenLoader = true;
    },
  },
});
