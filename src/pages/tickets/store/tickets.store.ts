import { signal } from '@preact/signals-react';
import { getAllTickets, TicketApiModel, generateTicketQr } from '../../../services/ticketServices';
import { getEvents } from '../../../services/eventService';

export interface TicketItem {
  id: string;
  title: string;
  dateLabel: string; // e.g., Saturday, August 10, 2025
  timeLabel: string; // e.g., 5:00PM - 3:00AM
  price?: string; // formatted price, e.g., $150.50
  event?: {
    id: string;
    name: string;
    startTimeStamp?: string;
    location?: { id: string; name: string };
    image?: string;
  };
  seatId: string;
  ticketCategory?: { id: string; title: string };
}

// Mock tickets for now. Replace with service call when API is ready
export const tickets = signal<TicketItem[]>([]);

export const isLoadingTickets = signal<boolean>(false);
export const ticketsError = signal<string | null>(null);
export const qrExpanded = signal<boolean>(false);
export const activeTicketId = signal<string | null>(null);
export const qrCodeValue = signal<string | null>(null);
export const isGeneratingQr = signal<boolean>(false);
export const qrSecondsRemaining = signal<number>(900); // 15 minutes default
export const qrExpired = signal<boolean>(false);
let qrTimerHandle: any = null;

export const setTickets = (items: TicketItem[]) => {
  tickets.value = items;
};

export const setIsLoadingTickets = (loading: boolean) => {
  isLoadingTickets.value = loading;
};

export const loadTickets = async () => {
  try {
    setIsLoadingTickets(true);
    ticketsError.value = null;
    const [data, error] = await getAllTickets();
    console.log(data, "data");
    if (error || !data) {
      throw error || new Error('Failed to fetch tickets');
    }
    const mapped: TicketItem[] = (data.list || []).map((t: TicketApiModel, idx) => {
      const start = new Date(t.event.startTimeStamp);
      const dateLabel = start.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
      });
      const timeLabel = `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
      console.log(t, "t");
      return {
        ...t,
        title: `${t.event.name}`,
        dateLabel,
        timeLabel,
        price: `$${Number(t.price).toFixed(2)}`,
      };
    });
    setTickets(mapped);
  } catch (err: any) {
    ticketsError.value = err?.message || 'Failed to load tickets';
  } finally {
    setIsLoadingTickets(false);
  }
};

export const openQrFullscreen = () => {
  qrExpanded.value = true;
};

export const closeQrFullscreen = () => {
  qrExpanded.value = false;
};

export const generateQrForTicket = async (ticketId: string) => {
  try {
    isGeneratingQr.value = true;
    activeTicketId.value = ticketId;
    const [data, error] = await generateTicketQr(ticketId);
    if (error || !data) {
      throw error || new Error('Failed to generate QR');
    }
    qrCodeValue.value = data.dynamicQrCode;
    // Reset timer for 15 minutes on each generation
    qrSecondsRemaining.value = 15 * 60;
    qrExpired.value = false;
    if (qrTimerHandle) {
      clearInterval(qrTimerHandle);
    }
    qrTimerHandle = setInterval(() => {
      if (qrSecondsRemaining.value > 0) {
        qrSecondsRemaining.value = qrSecondsRemaining.value - 1;
      } else {
        clearInterval(qrTimerHandle);
        qrTimerHandle = null;
        qrExpired.value = true;
      }
    }, 1000);
  } catch (err: any) {
    ticketsError.value = err?.message || 'Failed to generate QR';
    qrCodeValue.value = null;
  } finally {
    isGeneratingQr.value = false;
  }
};

export const reloadQrNow = async () => {
  if (activeTicketId.value) {
    await generateQrForTicket(activeTicketId.value);
  }
};


