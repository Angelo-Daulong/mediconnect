export default defineNuxtRouteMiddleware((to, from) => {
  const store = useAuthStore();
  if (!store.userEmail) {
    return navigateTo('/');
  }
  if (to.path === '/adminPage' && store.userRole !== 'admin') {
    return navigateTo('/');
  }
  if (to.path === '/hospitalPage' && store.userRole !== 'hospital') {
    return navigateTo('/');
  }
});
