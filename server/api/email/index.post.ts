export default defineEventHandler(async (event) => {
  const { email, otp } = getQuery(event);
  const { sendMail } = useNodeMailer();
  if (email && otp) {
    return sendMail({
      subject: 'Email Verification',
      text: `Your verification code is ${otp}`,
      to: email,
    });
  }
  return 'Provide Email to and OTP';
});
