import { signal } from '@preact/signals-react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserState {
  id?: string;
  email?: string;
  mobileNumber?: string;
  firstName?: string;
  lastName?: string;
  isNewUser?: boolean;
  isAuthenticated?: boolean;
  role?: string;
  contactNumber?: string;
  address?: string | null;
  birthday?: Date;
  image?: string | null;
  isLoading?: boolean;
  otp?: string[];
  timer?: any;
}

export interface EventState {
  events: any[];
}

export interface RootState {
  user: UserState;
  events: EventState;
}

export const dateOfBirth = signal<Date>(new Date(2000, 0, 1));

export const showSplash = signal<boolean>(true);
export const setShowSplash = (val: boolean) => { showSplash.value = val; };
