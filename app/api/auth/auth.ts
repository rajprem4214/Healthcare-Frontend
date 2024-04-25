// import { getUserStore } from '@/store/auth/Auth';
// import axios from 'axios';

// export async function getOtp(email: string): Promise<void> {
//   await axios.get(
//     `${process.env.NEXT_PUBLIC_BACKEND_BASE}/api/v1/auth/getOtp`,
//     {
//       params: {
//         email: email,
//       },
//     }
//   );
// }

// export async function loginViaOtp(email: string, otp: string) {
//   // Assuming you have an endpoint for OTP login, adjust the URL accordingly

//   const res = await axios.post(
//     `${process.env.NEXT_PUBLIC_BACKEND_BASE}/api/v1/auth/login`,
//     {
//       email,
//       otp,
//       scope: 'offline',
//     }
//   );

//   const responseData = res.data ?? {};

//   // Assuming the response structure contains accessToken, refreshToken, expiry, user, and email
//   const { accessToken, expiry, user } = responseData?.data ?? {};

//   // Store tokens and other relevant user information in localStorage
//   // localStorage.setItem('email', email);
//   // This logic needs to be updated later since it poses security risks.
//   localStorage.setItem('accessToken', accessToken);

//   const loginObject = {
//     user: {
//       email: email,
//       id: user,
//     },
//     accessToken: accessToken,

//     // Other user information if available
//   };

//   return loginObject;
// }

// export async function getUserPofile() {
//   const userStore = getUserStore();

//   if (userStore.tokens.accessToken === null) {
//     throw new Error('Access token is invalid');
//   }

//   const accessToken = userStore.tokens.accessToken ?? '';

//   const resp = await axios.get(
//     `${process.env.NEXT_PUBLIC_BACKEND_BASE}/api/v1/auth/me`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );
//   const respBody = resp?.data?.data ?? {};

//   if (!respBody.user) {
//     throw new Error('User profile details are not found');
//   }
//   const currentUser = respBody.user;

//   const profile: User = {
//     active: Boolean(currentUser.active),
//     admin: Boolean(currentUser.admin),
//     createdAt: currentUser.createdAt ? new Date(currentUser.createdAt) : null,
//     email: currentUser.email,
//     emailVerified: Boolean(currentUser.emailVerified),
//     fullName: currentUser.fullName,
//     healthId: currentUser.healthId,
//     id: currentUser.id,
//     patientId: respBody.patientId ?? '',
//     phoneNumber: currentUser.phoneNumber,
//     projectId: currentUser.projectId,
//     roles: currentUser.roles as UserRole,
//     updatedAt: currentUser.updatedAt ? new Date(currentUser.updatedAt) : null,
//   };
//   return profile;
// }

// export async function logout() {
//   // Clear the authentication-related data
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('refreshToken');

//   // Reset the user state
//   const userState = getUserStore();
//   userState.reset();
// }
