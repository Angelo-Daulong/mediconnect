export const useHospitalStore = defineStore('hospitalStore', () => {
  const {
    data: hospital,
    status: statusHospital,
    refresh,
  } = useFetch('/api/hospital', {
    lazy: false,
    default: () => [],
  });

  return { hospital, statusHospital, refresh };
});
