export const useOtp = () => {
  const generateOtp = (length = 6) => {
    const otp = Array.from({ length }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    return otp;
  };

  const generateExpiry = (expiryMinutes = 3) => {
    return Date.now() + expiryMinutes * 60 * 1000; // OTP expires in X minutes
  };

  const verifyOtp = (
    enteredOtp: string,
    storedOtp: string,
    expiryTime: number
  ) => {
    if (Date.now() > expiryTime) {
      return { success: false, message: 'Expired' };
    }
    if (enteredOtp === storedOtp) {
      return { success: true, message: 'Verified' };
    }
    return { success: false, message: 'Invalid' };
  };

  return { generateOtp, generateExpiry, verifyOtp };
};
