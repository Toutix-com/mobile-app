import { AxiosError } from 'axios';
import { api, commonApiWrapper } from '../utils/apiUtils';
import { getAuthToken } from '../utils/authToken';

export const loginWithOtp = (payload: { email?: string; phoneNumber?: string }) => {
  return commonApiWrapper(api.post('/user/login/with-otp', payload));
};

export const verifyOtp = (payload: { email?: string; phoneNumber?: string; otp: string | number }) => {
  console.log("payload", payload);
  return commonApiWrapper(api.post('/user/login/with-otp', payload));
};

export const updateUserProfile = async ({ 
  firstName, 
  lastName, 
  contactNumber, 
  address, 
  dateOfBirth, 
  imageFile 
}: { 
  firstName: string; 
  lastName: string; 
  contactNumber?: string; 
  address?: string; 
  dateOfBirth?: string; 
  imageFile?: any; 
}) => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  
  if (contactNumber) {
    formData.append('contactNumber', contactNumber);
  }
  
  if (address) {
    formData.append('address', address);
  }
  
  if (dateOfBirth) {
    formData.append('dateOfBirth', dateOfBirth);
  }
  
  if (imageFile) {
    formData.append('imageFile', imageFile);
  }

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

export const loginWithApple = (idToken: string) => {
  return commonApiWrapper(api.post('/user/login/apple-login', {}, {
    headers: { 'idToken': idToken },
  }));
};

export const getUserProfile = async () => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return commonApiWrapper(api.get('/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }));
}; 

export const getErrorDataFromResponse = <T = any>(error: any) => {
  const axiosError = error as AxiosError;
  return (axiosError?.response?.data ?? {}) as T;
}