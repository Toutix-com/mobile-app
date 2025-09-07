import { api, commonApiWrapper, ServerResponse } from '../utils/apiUtils';
import { getAuthToken } from '../utils/authToken';

export interface TicketApiModel {
  id: string;
  qrCode: string | null;
  price: string;
  resalePrice: string | null;
  isResale: boolean;
  status: string;
  scannedCount: number;
  lastScannedTime: string | null;
  createdAt: string;
  event: {
    id: string;
    name: string;
    startTimeStamp: string;
    location: { id: string; name: string };
  };
  ticketCategory: { id: string; title: string };
  user: { id: string };
  resaleUser: any;
  seatId: string;
}

export interface GetAllTicketsResponse {
  list: TicketApiModel[];
  count: number;
}

export const getAllTickets = async () => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  return commonApiWrapper<GetAllTicketsResponse>(
    api.get('/ticket/my/active', {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};

export interface GenerateQrResponse {
  dynamicQrCode: string;
}

export const generateTicketQr = async (ticketId: string) => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  return commonApiWrapper<GenerateQrResponse>(
    api.get(`/ticket/generate/${ticketId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};


