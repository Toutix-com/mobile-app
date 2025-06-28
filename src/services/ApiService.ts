import { api, commonApiWrapper } from '../utils/apiUtils';
import { getAuthToken } from '../utils/authToken';

export const loginWithOtp = (payload: { email?: string; mobileNumber?: string }) => {
  return commonApiWrapper(api.post('/user/login/with-otp', payload));
};

export const verifyOtp = (payload: { email: string; otp: string | number }) => {
  console.log("payload", payload);
  return commonApiWrapper(api.post('/user/login/with-otp', payload));
};

export const updateUserProfile = async ({ firstName, lastName, dateOfBirth }: { firstName: string; lastName: string; dateOfBirth?: string; }) => {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  if (dateOfBirth) formData.append('dateOfBirth', dateOfBirth);

  return commonApiWrapper(api.patch('/user/update/image/profile', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }));
};

export const loginWithGoogle = (idToken: string) => {
  return commonApiWrapper(api.post('/user/login/google-login', {}, {
    headers: { 'idToken': idToken },
  }));
}; 