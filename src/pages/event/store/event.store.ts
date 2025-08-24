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

// EventDetailsScreen signals
export const showDetailsModal = signal<boolean>(false);

// EventTicketsScreen signals
export const ticketQuantities = signal<{ [id: string]: number }>({});
export const TRANSACTION_FEE_PERCENT = 0.1;

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

// EventDetailsScreen functions
export const setShowDetailsModal = (show: boolean) => {
  showDetailsModal.value = show;
};

export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export const formatPrice = (event: EventDetails) => {
  if (event.minTicketPrice === event.maxTicketPrice) {
    return `$${event.minTicketPrice}`;
  }
  return `$${event.minTicketPrice} - $${event.maxTicketPrice}`;
};

export const formatTimeRange = (startTimestamp: string, endTimestamp: string) => {
  const startTime = formatTime(startTimestamp);
  const endTime = formatTime(endTimestamp);
  return `${startTime} - ${endTime}`;
};

export const formatEventDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const formatEventTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
};

export const formatEventTimeRange = (startTimestamp: string, endTimestamp: string) => {
  const startTime = formatEventTime(startTimestamp);
  const endTime = formatEventTime(endTimestamp);
  return `${startTime} - ${endTime}`;
};

// EventTicketsScreen functions
export const setTicketQuantities = (quantities: { [id: string]: number }) => {
  ticketQuantities.value = quantities;
};

export const addTicket = (id: string, max: number) => {
  const current = ticketQuantities.value[id] || 0;
  if (current < max) {
    ticketQuantities.value = {
      ...ticketQuantities.value,
      [id]: current + 1
    };
  }
};

export const removeTicket = (id: string) => {
  const current = ticketQuantities.value[id] || 0;
  if (current > 0) {
    const newQuantities = { ...ticketQuantities.value };
    if (current === 1) {
      delete newQuantities[id];
    } else {
      newQuantities[id] = current - 1;
    }
    ticketQuantities.value = newQuantities;
  }
};

export const getSubtotal = () => {
  if (!selectedEvent.value) return 0;
  
  return selectedEvent.value.ticketCategories.reduce((sum, cat) => {
    const qty = ticketQuantities.value[cat.id] || 0;
    return sum + qty * cat.price;
  }, 0);
};

export const getTransactionFee = () => {
  return getSubtotal() * TRANSACTION_FEE_PERCENT;
};

export const getTotal = () => {
  return getSubtotal() + getTransactionFee();
};

export const clearTicketQuantities = () => {
  ticketQuantities.value = {};
};
