import { signal } from '@preact/signals-react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  dob: string; // display format e.g. 01.01.1990
  addressLine1: string;
  addressLine2?: string;
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'generic';

export interface PaymentMethod {
  id: string;
  brand: CardBrand;
  last4: string;
  nickname: string;
}

export interface TicketHistoryItem {
  id: string;
  title: string;
  subtitle: string;
  price: string; // e.g. $150.50
  image: string;
}

// Signals
export const profile = signal<UserProfile>({
  id: 'u_1',
  name: 'First name Last name',
  email: 'username@email.com',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop',
  phone: '08766277289',
  dob: '01.01.1990',
  addressLine1: '123 Elm Street, London, SW1A 1AA,',
  addressLine2: 'United Kingdom',
});

export const emailNotifications = signal<boolean>(true);
export const appNotifications = signal<boolean>(true);

export const paymentMethods = signal<PaymentMethod[]>([
  { id: 'pm_1', brand: 'mastercard', last4: '7890', nickname: 'Card nickname' },
  { id: 'pm_2', brand: 'visa', last4: '7890', nickname: 'Card nickname' },
]);

export const ticketHistory = signal<TicketHistoryItem[]>([
  {
    id: 't_1',
    title: 'Night Pulse: An Immersive...',
    subtitle: 'General entry ticket',
    price: '$10.00',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 't_2',
    title: 'Summer Beats: A Vibran...',
    subtitle: 'Standard admission pass',
    price: '$150.50',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 't_3',
    title: 'Ocean Vibes',
    subtitle: 'General admission ticket',
    price: '$150.50',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&auto=format&fit=crop',
  },
]);

// Setters / actions
export const setEmailNotifications = (value: boolean) => {
  emailNotifications.value = value;
};

export const setAppNotifications = (value: boolean) => {
  appNotifications.value = value;
};

export const addPaymentMethod = (method: PaymentMethod) => {
  paymentMethods.value = [method, ...paymentMethods.value];
};

export const removePaymentMethod = (id: string) => {
  paymentMethods.value = paymentMethods.value.filter(m => m.id !== id);
};

export const updateProfile = (updates: Partial<UserProfile>) => {
  profile.value = { ...profile.value, ...updates };
};

export const logout = () => {
  // TODO: wire with auth module
  console.log('Logging out...');
}; 