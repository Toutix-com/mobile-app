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
  dateOfBirth?: string;
  image?: string | null;
  isLoading?: boolean;
  otp?: string[];
}

export interface EventState {
  events: any[];
}

export interface RootState {
  user: UserState;
  events: EventState;
}

export const rootStore = signal<RootState>({
  user: {
    otp: ['', '', '', '', '', '']
  },
  events: { events: [] },
});

const ROOT_STORE_KEY = 'rootStore';

// Load persisted store on module load
AsyncStorage.getItem(ROOT_STORE_KEY).then((json) => {
  if (json) {
    try {
      rootStore.value = JSON.parse(json);
    } catch {}
  }
});

// Persist store on every change
rootStore.subscribe((value) => {
  AsyncStorage.setItem(ROOT_STORE_KEY, JSON.stringify(value));
});

// Example setters
export const setUser = (user: UserState) => {
  rootStore.value = { ...rootStore.value, user };
};

export const setEvents = (events: any[]) => {
  rootStore.value = { ...rootStore.value, events: { events } };
};

export const updateUser = (fields: Partial<UserState>) => {
  rootStore.value = {
    ...rootStore.value,
    user: {
      ...rootStore.value.user,
      ...fields,
    },
  };
}; 