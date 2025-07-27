import { signal } from '@preact/signals-react';
import { moreEvents } from '../../home/store/home.store';

// Types
export interface TrendingEvent {
  id: string;
  name: string;
}

export interface SearchResultEvent {
  id: string;
  name: string;
  image: string;
  date: string;
  venue: string;
  priceRange: string;
  isResale?: boolean;
  isLimited?: boolean;
  startTimeStamp: string;
  location?: {
    name: string;
  };
  status?: string;
  tag?: {
    text: string;
    color: string;
  };
  minTicketPrice?: number;
  maxTicketPrice?: number;
}

export interface CategoryEvent {
  id: string;
  name: string;
  image: string;
  date: string;
  venue: string;
  priceRange: string;
  startTimeStamp: string;
  location?: {
    name: string;
  };
  status?: string;
  tag?: {
    text: string;
    color: string;
  };
  minTicketPrice?: number;
  maxTicketPrice?: number;
}

// Signals
export const searchQuery = signal<string>('');
export const selectedCity = signal<string>('');
export const selectedVenue = signal<string>('');
export const selectedDate = signal<string>('');
export const selectedMonth = signal<string>('');
export const activeInputField = signal<string>('');
export const showTrending = signal<boolean>(true);
export const showSuggestions = signal<boolean>(false);
export const showNoResults = signal<boolean>(false);
export const showCategories = signal<boolean>(true);
export const trendingEvents = signal<TrendingEvent[]>([]);
export const searchSuggestions = signal<string[]>([]);
export const citySheetOpen = signal<boolean>(false);
export const venueSheetOpen = signal<boolean>(false);
export const dateSheetOpen = signal<boolean>(false);
export const citySearch = signal<string>('');
export const venueSearch = signal<string>('');
export const eventCount = signal<number>(0);

// New signals for search results and category results
export const searchResults = signal<SearchResultEvent[]>([]);
export const selectedCategory = signal<string>('');
export const categoryResults = signal<CategoryEvent[]>([]);

// Setters
export const setSearchQuery = (query: string) => {
  searchQuery.value = query;
};
export const setSelectedCity = (city: string) => {
  selectedCity.value = city;
};
export const setSelectedVenue = (venue: string) => {
  selectedVenue.value = venue;
};
export const setSelectedDate = (date: string) => {
  selectedDate.value = date;
};
export const setSelectedMonth = (month: string) => {
  selectedMonth.value = month;
};
export const setActiveInputField = (field: string) => {
  activeInputField.value = field;
};
export const setCitySheetOpen = (open: boolean) => {
  citySheetOpen.value = open;
};
export const setVenueSheetOpen = (open: boolean) => {
  venueSheetOpen.value = open;
};
export const setDateSheetOpen = (open: boolean) => {
  dateSheetOpen.value = open;
};
export const setCitySearch = (search: string) => {
  citySearch.value = search;
};
export const setVenueSearch = (search: string) => {
  venueSearch.value = search;
};

// Clearers
export const clearSearchQuery = () => {
  searchQuery.value = '';
};
export const clearAllFilters = () => {
  searchQuery.value = '';
  selectedCity.value = '';
  selectedVenue.value = '';
  selectedDate.value = '';
  selectedMonth.value = '';
  citySearch.value = '';
  venueSearch.value = '';
  eventCount.value = 0;
  showTrending.value = true;
  showSuggestions.value = false;
  showNoResults.value = false;
  showCategories.value = true;
};

export const clearSelectedCategory = () => {
  selectedCategory.value = '';
  categoryResults.value = [];
};

export const clearSearchResults = () => {
  searchResults.value = [];
};

// Mock API fetchers (replace with real API calls as needed)
const mockTrendingEvents = [
  { id: '1', name: 'Music Festival' },
  { id: '2', name: 'Theater Night' },
  { id: '3', name: 'Sports Gala' },
];

const mockSuggestions = [
  'Music Festival',
  'Theater Night',
  'Sports Gala',
  'Family Fun',
  'Workshops',
];

export const updateEventCount = () => {
  // Placeholder: count is random for demo
  eventCount.value = Math.floor(Math.random() * 10);
};

export const updateSearchSuggestions = () => {
  if (searchQuery.value.length > 0) {
    // Filter mock suggestions by query
    searchSuggestions.value = mockSuggestions.filter(s =>
      s.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    showSuggestions.value = searchSuggestions.value.length > 0;
    showNoResults.value = searchSuggestions.value.length === 0;
    showTrending.value = false;
    showCategories.value = false;
  } else {
    searchSuggestions.value = [];
    showSuggestions.value = false;
    showNoResults.value = false;
    showTrending.value = true;
    showCategories.value = true;
  }
};

export const handleInputFocus = (field: string) => {
  setActiveInputField(field);
  if (field === 'eventName') {
    showTrending.value = false;
    showCategories.value = false;
    if (searchQuery.value.length > 0) {
      updateSearchSuggestions();
    }
  }
};

// New functions for search results and category results
export const performSearch = () => {
  // Search through moreEvents signal array instead of mock data
  const query = searchQuery.value.toLowerCase();
  const city = selectedCity.value.toLowerCase();
  const venue = selectedVenue.value.toLowerCase();
  const date = selectedDate.value || selectedMonth.value;

  // Filter moreEvents based on search criteria
  let filtered = (moreEvents.value || []).filter((event: any) => {
    const matchesQuery = !query || event.name?.toLowerCase().includes(query);
    const matchesCity = !city || event.location?.name?.toLowerCase().includes(city);
    const matchesVenue = !venue || event.location?.name?.toLowerCase().includes(venue);
    const matchesDate = !date || event.startTimeStamp?.includes(date);

    return matchesQuery && matchesCity && matchesVenue && matchesDate;
  });

  // Convert to SearchResultEvent format with proper EventCard structure
  const searchResultsData: SearchResultEvent[] = filtered.map((event: any) => {
    // Create tag information
    let tag: { text: string; color: string; } | undefined = undefined;
    if (event.status) {
      if (event.status === 'PUBLISHED') {
        tag = { text: 'Published', color: '#5A677D' };
      } else if (event.status === 'SOLD_OUT') {
        tag = { text: 'Sold out', color: '#B08F2B' };
      } else if (event.status === 'LIMITED') {
        tag = { text: 'Limited tickets', color: '#8B7355' };
      }
    }

    return {
      id: event.id,
      name: event.name,
      image: event.image,
      date: event.startTimeStamp,
      venue: event.location?.name || 'Unknown venue',
      priceRange: `$${event.minTicketPrice || 0} - $${event.maxTicketPrice || 0}`,
      isResale: event.allowResale,
      isLimited: event.status === 'LIMITED',
      // Add EventCard specific properties
      startTimeStamp: event.startTimeStamp,
      location: event.location,
      status: event.status,
      tag: tag,
      minTicketPrice: event.minTicketPrice,
      maxTicketPrice: event.maxTicketPrice,
    };
  });

  searchResults.value = searchResultsData;
  eventCount.value = searchResultsData.length;
};

export const selectCategory = (category: string) => {
  selectedCategory.value = category;
  
  // Filter moreEvents by category
  const categoryEvents = (moreEvents.value || []).filter((event: any) => {
    return event.category?.name?.toLowerCase() === category.toLowerCase();
  });

  // Convert to CategoryEvent format with proper EventCard structure
  const categoryResultsData: CategoryEvent[] = categoryEvents.map((event: any) => {
    // Create tag information
    let tag: { text: string; color: string; } | undefined = undefined;
    if (event.status) {
      if (event.status === 'PUBLISHED') {
        tag = { text: 'Published', color: '#5A677D' };
      } else if (event.status === 'SOLD_OUT') {
        tag = { text: 'Sold out', color: '#B08F2B' };
      } else if (event.status === 'LIMITED') {
        tag = { text: 'Limited tickets', color: '#8B7355' };
      }
    }

    return {
      id: event.id,
      name: event.name,
      image: event.image,
      date: event.startTimeStamp,
      venue: event.location?.name || 'Unknown venue',
      priceRange: `$${event.minTicketPrice || 0} - $${event.maxTicketPrice || 0}`,
      // Add EventCard specific properties
      startTimeStamp: event.startTimeStamp,
      location: event.location,
      status: event.status,
      tag: tag,
      minTicketPrice: event.minTicketPrice,
      maxTicketPrice: event.maxTicketPrice,
    };
  });

  categoryResults.value = categoryResultsData;
};

// Initialize trending events (mock)
trendingEvents.value = mockTrendingEvents; 