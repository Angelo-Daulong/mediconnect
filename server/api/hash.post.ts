import crypto from 'crypto';

// import { hash, compare } from 'bcrypt';

// export default defineEventHandler(async (event) => {
//   const { inputPassword } = getQuery(event);
//   if (!inputPassword) return false;

//   try {
//     if (typeof inputPassword === 'string') {
//       const isMatch = await compare(inputPassword, 'dbpassword');
//       return isMatch;
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
//   return false;
// });

export default defineEventHandler(async (event) => {
  const { inputPassword } = getQuery(event);
  if (!inputPassword || typeof inputPassword !== 'string') return;
  const salt = 'this1isMed1ConN3ct';
  const hashedPassword = crypto
    .pbkdf2Sync(inputPassword, salt, 100, 32, 'sha512')
    .toString('hex');
  return hashedPassword;
});
