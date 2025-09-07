import { signal } from '@preact/signals-react';
import { getOrganizationProfile } from '../../../services/eventService';

export interface OrganizerProfile {
  count: number;
  durationMessage: string;
  pastEvents: any[];
  upcomingEvents: any[];
  organizationDetails:{
    country: string;
    countryCode: string;
    organizationName: string;
    organizationLogo: string;
    organizationPhone: string;
    organizationEmail: string;
    organizationWebsite: string | null;
    organizationDescription?: string | null;
  };
}

export interface OrganizerEventItem {
  id: string;
  title: string;
  date: string;
  venue: string;
  image: string;
}

export const organizerProfile = signal<OrganizerProfile>({
  count: 0,
  durationMessage: '',
  pastEvents: [],
  upcomingEvents: [],
  organizationDetails: {
    country: '',
    countryCode: '',
    organizationName: '',
    organizationLogo: '',
    organizationPhone: '',
    organizationEmail: '',
    organizationWebsite: null,
    organizationDescription: '',
  },
});

export const isOrganizerVerified = signal<boolean>(true);
export const organizerUpcoming = signal<OrganizerEventItem[]>([]);

export const organizerPast = signal<OrganizerEventItem[]>([]);

export const setOrganizerProfile = (data: OrganizerProfile) => {
  organizerProfile.value = data;
};

export const setOrganizerUpcoming = (list: OrganizerEventItem[]) => {
  organizerUpcoming.value = list;
};

export const setOrganizerPast = (list: OrganizerEventItem[]) => {
  organizerPast.value = list;
};

export const isLoadingOrganizer = signal<boolean>(false);
export const organizerError = signal<string | null>(null);

export const fetchOrganizerProfile = async (organizationId: string) => {
  isLoadingOrganizer.value = true;
  organizerError.value = null;
  try {
    const [data, error] = await getOrganizationProfile(organizationId);
    console.log("data", data);
    if (error || !data) {
      throw error || new Error('Failed to load organization');
    }
    setOrganizerProfile(data as OrganizerProfile);

    const formatEvent = (e: any) => ({
      id: e.id,
      title: e.name,
      date: new Date(e.startTimeStamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      venue: e.location?.name || '',
      image: e.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=200&auto=format&fit=crop',
    });

    setOrganizerUpcoming(((data as any).upcomingEvents || []).map(formatEvent));
    setOrganizerPast(((data as any).pastEvents || []).map(formatEvent));

  } catch (err: any) {
    organizerError.value = err?.message || 'Failed to load organizer';
  } finally {
    isLoadingOrganizer.value = false;
  }
};

