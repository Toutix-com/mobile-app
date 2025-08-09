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

export const rootStore = signal<RootState>({
  user: {
    birthday: new Date(2000, 0, 1)
  },
  events: { events: [] },
});

const ROOT_STORE_KEY = 'rootStore';

// Load persisted store on module load
AsyncStorage.getItem(ROOT_STORE_KEY).then((json) => {
  if (json) {
    try {
      const parsed = JSON.parse(json);
     
      if (parsed.user?.birthday) {
        parsed.user.birthday = new Date(parsed.user.birthday);
      }
      rootStore.value = parsed;
    } catch (err) {
      console.error('Failed to load root store', err);
    }
  }
});

// Persist store on every change
rootStore.subscribe((value) => {
  AsyncStorage.setItem(ROOT_STORE_KEY, JSON.stringify(value));
});

export const setEvents = (events: any[]) => {
  rootStore.value = { ...rootStore.value, events: { events } };
};