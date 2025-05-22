export const useVerifyOtpStore = defineStore('verifyOtpStore', {
  state: () => ({
    otp: '',
    expiry: 0,
  }),
});
