export const useHospitalUserStore = defineStore('hospitalUserStore', () => {
  const { data: hospitalUser, refresh } = useFetch('/api/hospitalUser', {
    lazy: true,
    default: () => [],
  });

  return { hospitalUser, refresh };
});
