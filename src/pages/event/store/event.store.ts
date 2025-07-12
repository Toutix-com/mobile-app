import { signal } from '@preact/signals-react';
import { getEventById } from '../../../services/eventService';

// Event interface based on the API response
export interface EventDetails {
  id: string;
  name: string;
  image: string;
  serviceFee: string;
  transactionFee: string;
  allowResale: boolean;
  startTimeStamp: string;
  endTimeStamp: string;
  description: string;
  htmlDescription: string;
  status: string;
  ticketCloseTimeStamp: string;
  displayPriority: number;
  maxTicketLimit: number;
  category: {
    id: string;
    name: string;
    description: string;
  };
  location: {
    id: string;
    name: string;
    lat: number;
    lon: number;
    address: string;
    timeZone: string;
  };
  ticketCategories: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    maxTicketCount: number;
  }>;
  organizer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    image: string | null;
  };
  organization: {
    id: string;
    organizationName: string;
    organizationDescription: string | null;
    organizationLogo: string | null;
    organizationEmail: string;
    organizationCurrency: string;
  };
  hostedEventCount: number;
  durationMessage: string;
  minTicketPrice: number;
  maxTicketPrice: number;
  upcomingEvents: any[];
  isTicketSalesClosed: boolean;
}

// Signals
export const selectedEvent = signal<EventDetails | null>(null);
export const eventLoading = signal<boolean>(false);
export const eventError = signal<string | null>(null);

// Functions
export const fetchEventById = async (eventId: string) => {
  try {
    eventLoading.value = true;
    eventError.value = null;
    
    const [data, error] = await getEventById(eventId);
    
    if (error) {
      throw error;
    }
    
    if (data) {
      selectedEvent.value = data as EventDetails;
    } else {
      throw new Error('Failed to fetch event details');
    }
  } catch (error: any) {
    console.error('Error fetching event:', error);
    eventError.value = error?.message || 'Failed to fetch event details';
    selectedEvent.value = null;
  } finally {
    eventLoading.value = false;
  }
};

export const clearSelectedEvent = () => {
  selectedEvent.value = null;
  eventError.value = null;
};
