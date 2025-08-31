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

// Helper function to parse human-readable dates
const parseHumanDate = (dateString: string): Date | null => {
  try {
    // Handle "Month Day, Year" format (e.g., "August 1, 2025")
    if (dateString.includes(',')) {
      return new Date(dateString);
    }
    
    // Handle "Month Year" format (e.g., "August 2025")
    if (dateString.split(' ').length === 2) {
      const [month, year] = dateString.split(' ');
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
      if (monthIndex >= 0) {
        return new Date(parseInt(year), monthIndex, 1);
      }
    }
    
    // Handle just year (e.g., "2025")
    if (dateString.length === 4 && /^\d{4}$/.test(dateString)) {
      return new Date(parseInt(dateString), 0, 1);
    }
    
    // Try default parsing
    return new Date(dateString);
  } catch (error) {
    console.log('Error parsing human date:', error);
    return null;
  }
};

// Helper function to match dates in different formats
const matchesDateFilter = (eventDate: string, searchDate: string): boolean => {
  if (!searchDate) return true; // No date filter applied
  
  console.log('=== DATE MATCHING DEBUG ===');
  console.log('Event date (ISO):', eventDate);
  console.log('Search date (user input):', searchDate);
  
  try {
    const eventDateObj = new Date(eventDate);
    const searchDateObj = parseHumanDate(searchDate);
    
    if (!searchDateObj) {
      console.log('Failed to parse search date, using fallback');
      return eventDate.includes(searchDate);
    }
    
    console.log('Parsed event date:', eventDateObj);
    console.log('Parsed search date:', searchDateObj);
    console.log('Event date valid:', !isNaN(eventDateObj.getTime()));
    console.log('Search date valid:', !isNaN(searchDateObj.getTime()));
    
    // If searchDate is a full date (e.g., "August 1, 2025")
    if (searchDate.includes(',')) {
      const eventDateStr = eventDateObj.toDateString();
      const searchDateStr = searchDateObj.toDateString();
      console.log('Full date comparison:', eventDateStr, '===', searchDateStr, 'Result:', eventDateStr === searchDateStr);
      return eventDateStr === searchDateStr;
    }
    
    // If searchDate is just month and year (e.g., "August 2025")
    if (searchDate.split(' ').length === 2) {
      const eventMonth = eventDateObj.toLocaleString('en-US', { month: 'long' });
      const eventYear = eventDateObj.getFullYear().toString();
      const searchMonth = searchDateObj.toLocaleString('en-US', { month: 'long' });
      const searchYear = searchDateObj.getFullYear().toString();
      
      console.log('Month/Year comparison:', eventMonth, eventYear, '===', searchMonth, searchYear, 'Result:', eventMonth === searchMonth && eventYear === searchYear);
      return eventMonth === searchMonth && eventYear === searchYear;
    }
    
    // If searchDate is just year (e.g., "2025")
    if (searchDate.length === 4 && /^\d{4}$/.test(searchDate)) {
      const eventYear = eventDateObj.getFullYear().toString();
      console.log('Year comparison:', eventYear, '===', searchDate, 'Result:', eventYear === searchDate);
      return eventYear === searchDate;
    }
    
    // Fallback: try to match as substring
    const fallbackResult = eventDate.includes(searchDate);
    console.log('Fallback substring matching:', eventDate.includes(searchDate), 'Result:', fallbackResult);
    return fallbackResult;
  } catch (error) {
    console.log('Date matching error:', error);
    // Fallback: try to match as substring
    const fallbackResult = eventDate.includes(searchDate);
    console.log('Error fallback substring matching:', fallbackResult);
    return fallbackResult;
  }
};

// New functions for search results and category results
export const performSearch = () => {
  // Test date matching with sample data
  
  // Search through moreEvents signal array instead of mock data
  const query = searchQuery.value;
  const city = selectedCity.value;
  const venue = selectedVenue.value;
  const date = selectedDate.value || selectedMonth.value;

  let filtered: any[] = [];

  console.log('query', query);
  console.log('city', city , selectedCity.value);
  console.log('venue', venue);
  console.log('date', date);

  // If no search criteria, return all events
  if (!query && !city && !venue && !date) {
    filtered = moreEvents.value || [];
  } else {
    // Filter moreEvents based on search criteria
    filtered = (moreEvents.value || []).filter((event: any) => {
      console.log('event', event);
      const matchesQuery = !query || event.name?.toLowerCase().includes(query.toLowerCase());
      const matchesCity = !city || event.location?.city?.name?.toLowerCase().includes(city.toLowerCase());
      const matchesVenue = !venue || event.location?.name?.toLowerCase().includes(venue.toLowerCase());
      const matchesDate = !date || matchesDateFilter(event.startTimeStamp, date);

      console.log('matchesQuery', matchesQuery);
      console.log('matchesCity', matchesCity);
      console.log('matchesVenue', matchesVenue);
      console.log('matchesDate', matchesDate);

              // If any condition is true, include the event (OR logic instead of AND)
        return matchesQuery && matchesCity && matchesVenue && matchesDate;
    });
  }

  console.log('filtered', filtered);

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