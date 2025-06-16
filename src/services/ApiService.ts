import { API_BASE_URL } from '@env';
import { getAuthToken } from '../utils/authToken';

export const loginWithOtp = async (payload: { email?: string; mobileNumber?: string }) => {
  const url = `${API_BASE_URL}/user/login/with-otp`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  return response;
};

export const verifyOtp = async (payload: { email: string; otp: string | number }) => {
  const url = `${API_BASE_URL}/user/login/with-otp`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to verify OTP');
  }
  return response.json();
};

export const updateUserProfile = async ({ firstName, lastName, dateOfBirth }: { firstName: string; lastName: string; dateOfBirth?: string; }) => {
  const url = `${API_BASE_URL}/user/update/image/profile`;
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  if (dateOfBirth) formData.append('dateOfBirth', dateOfBirth);

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  return response.json();
};

export const loginWithGoogle = async (idToken: string) => {
  const url = `${API_BASE_URL}/user/login/google-login`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' , 'idToken': idToken},
    
  });
  if (!response.ok) {
    throw new Error('Failed to login with Google');
  }
  return response.json();
}; 