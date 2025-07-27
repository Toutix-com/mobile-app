import { signal } from '@preact/signals-react';
import { getEvents, getCities, getVenues } from '../../../services/eventService';

// Temporary featuredEvents until we can import from constants
const featuredEvents = [
  {
    id: '1',
    title: 'Moshing music fest - 2025',
    venue: 'Belgrave Music hall',
    date: 'August 13 2025 at 3:30 AM',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
  },
  {
    id: '2',
    title: 'Indie Rock Concert',
    venue: 'The Garage',
    date: 'September 5 2025 at 8:00 PM',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
  },
];

export interface City {
  id: string;
  name: string;
  country: string;
  state: string;
  displayPriority: number;
  locations: any[];
}

export interface Venue {
  id: string;
  name: string;
  timeZone: string;
  displayPriority: number;
  city: any;
}

export const startDate = signal<Date | null>(null);
export const endDate = signal<Date | null>(null);
export const dateType = signal<string>('startDate');
export const allCities = signal<City[]>([]);
export const allVenues = signal<Venue[]>([]);
export const allCategories = signal<any[]>([]);
export const moreEvents = signal<any[]>([]);

export const filteredCities = signal<City[]>([]);
export const allCitiesSheetOpen = signal(false);

export const selectedCities = signal<City[]>([]);
export const selectedCategories = signal<any[]>([]);
export const selectedSubCategories = signal<any[]>([]);
export const selectedBrands = signal<any[]>([]);
export const selectedProducts = signal<any[]>([]);

export const selectedVenues = signal<Venue[]>([]);
export const filteredVenues = signal<Venue[]>([]);
export const allVenuesSheetOpen = signal(false);

export const citySearch = signal<string>('');
export const venueSearch = signal<string>('');

export const offset = signal<number>(0);
export const limit = signal<number>(9);
export const hasMore = signal<boolean>(true);
export const loading = signal<boolean>(false);
export const filterVisible = signal<boolean>(false);
export const dateSheetOpen = signal<boolean>(false);
export const activeIndex = signal<number>(0);
export const calendarMonth = signal<number>(new Date().getMonth());
export const calendarYear = signal<number>(new Date().getFullYear());

export const setStartDate = (date: Date | null) => {
    startDate.value = date;
}

export const setEndDate = (date: Date | null) => {
    endDate.value = date;
}

export const setSelectedCities = (cities: City[]) => {
    selectedCities.value = cities;
}

export const setSelectedCategories = (categories: any[]) => {
  selectedCategories.value = categories;
}

export const setSelectedSubCategories = (subCategories: any[]) => {
  selectedSubCategories.value = subCategories;
}

export const setDateType = (type: string) => {
    dateType.value = type;
}

export const setAllCities = (cities: City[]) => {
    console.log(cities, "cities store");
    allCities.value = cities;
    console.log(cities, "cities store");
}

export const setAllVenues = (venues: Venue[]) => {
    allVenues.value = venues;
}

export const setAllCategories = (categories: object[]) => {
    allCategories.value = categories;
}

export function selectCity(city: City) {
  if (!selectedCities.value.find(c => c.id === city.id)) {
    selectedCities.value = [...selectedCities.value, city];
  }
}

export function deselectCity(cityId: string) {
  selectedCities.value = selectedCities.value.filter(c => c.id !== cityId);
}

export function clearSelectedCities() {
  selectedCities.value = [];
}

export function selectVenue(venue: Venue) {
  if (!selectedVenues.value.find(v => v.id === venue.id)) {
    selectedVenues.value = [...selectedVenues.value, venue];
  }
}

export function deselectVenue(venueId: string) {
  selectedVenues.value = selectedVenues.value.filter(v => v.id !== venueId);
}

export function clearSelectedVenues() {
  selectedVenues.value = [];
}

export function setSelectedVenues(venues: Venue[]) {
  selectedVenues.value = venues;
}

export function setFilteredVenues(venues: Venue[]) {
  filteredVenues.value = venues;
}

export function setCitySearch(search: string) {
  citySearch.value = search;
}

export function setVenueSearch(search: string) {
  venueSearch.value = search;
}

export function setMoreEvents(events: Event[]) {
  moreEvents.value = events;
  console.log(moreEvents.value, "moreEvents store");
}

export function setOffset(offsetValue: number) {
  offset.value = offsetValue;
}

export function setLimit(limitValue: number) {
  limit.value = limitValue;
}

export function setHasMore(hasMoreValue: boolean) {
  hasMore.value = hasMoreValue;
}

export function setLoading(loadingValue: boolean) {
  loading.value = loadingValue;
}

export function setFilterVisible(filterVisibleValue: boolean) {
  filterVisible.value = filterVisibleValue;
}

export function setDateSheetOpen(dateSheetOpenValue: boolean) {
  dateSheetOpen.value = dateSheetOpenValue;
}

export function setActiveIndex(activeIndexValue: number) {
  activeIndex.value = activeIndexValue;
}

export function setCalendarMonth(month: number) {
  calendarMonth.value = month;
}

export function setCalendarYear(year: number) {
  calendarYear.value = year;
}

// Event loading and management
export const loadMoreEvents = async () => {
  if (loading.value || !hasMore.value) return;
  setLoading(true);
  try {
    const apiResponse: any = await getEvents(offset.value, limit.value);
    const newEvents = apiResponse?.[0]?.list || [];

    if (newEvents.length > 0) {
      const formattedEvents = newEvents.map((event: any) => {
        const eventDate = new Date(event.startTimeStamp || new Date());
        const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const day = eventDate.getDate();

        let tag = null;
        if (event.status) {
          const tagData = event.status;
          if (tagData === 'PUBLISHED') {
            tag = { text: 'Published', color: '#5A677D' };
          } else if (tagData === 'SOLD_OUT') {
            tag = { text: 'Sold out', color: '#B08F2B' };
          }
        }

        return {
          ...event,
          tag: tag,
        };
      });

      setMoreEvents([...moreEvents.value, ...formattedEvents]);
      setLoading(false);
      setOffset(offset.value + limit.value);
      if (newEvents.length < limit.value) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  } catch (error) {
    console.error("Failed to fetch more events", error);
  } finally {
    setLoading(false);
  }
};

// UI handlers
export const handleNextPress = (flatListRef: any) => {
  if (activeIndex.value < featuredEvents.length - 1) {
    flatListRef.current?.scrollToIndex({
      animated: true,
      index: activeIndex.value + 1,
    });
  }
};

export const openFilter = () => {
  setFilterVisible(true);
};

export const handleShowAllCities = () => {
  setFilterVisible(false);
  setTimeout(() => {
    allCitiesSheetOpen.value = true;
    setCitySearch('');
  }, 100);
};

export const handleShowAllVenues = () => {
  setFilterVisible(false);
  setTimeout(() => {
    allVenuesSheetOpen.value = true;
    setVenueSearch('');
  }, 100);
};

export const handleUseSelectedCities = () => {
  allCitiesSheetOpen.value = false;
  setTimeout(() => {
    openFilter();
  }, 600);
};

export const handleUseSelectedVenues = () => {
  allVenuesSheetOpen.value = false;
  setTimeout(() => {
    openFilter();
  }, 600);
};

export const handleClearCities = () => {
  setSelectedCities([]);
};

export const handleClearVenues = () => {
  setSelectedVenues([]);
};

export const clearAllFilters = () => {
  setSelectedCities([]);
  setSelectedVenues([]);
  setSelectedCategories([]);
  setStartDate(null);
  setEndDate(null);
  // Note: selectedCategory is local state in HomeScreen, not in store
};

// Filtering functions
export const mapFilteredAllCities = () => {
  filteredCities.value = (allCities.value || []).filter(city =>
    city.name.toLowerCase().includes(citySearch.value.toLowerCase())
  );
};

export const mapFilteredAllVenues = () => {
  filteredVenues.value = (allVenues.value || []).filter(venue =>
    venue.name.toLowerCase().includes(venueSearch.value.toLowerCase())
  );
};

export const filterEvents = (events: any[]) => {
  return events.filter(event => {
    // 1. Filter by selected cities
    const selectedCityIds = (selectedCities.value || []).map(city => city.id);
    if (selectedCityIds.length > 0) {
      const eventCityId = event.location?.city?.id;
      if (!eventCityId || !selectedCityIds.includes(eventCityId)) {
        return false;
      }
    }
    // 2. Filter by selected venues
    const selectedVenueIds = (selectedVenues.value || []).map(venue => venue.id);
    if (selectedVenueIds.length > 0) {
      const eventVenueId = event.location?.id;
      if (!eventVenueId || !selectedVenueIds.includes(eventVenueId)) {
        return false;
      }
    }
    // 3. Filter by selected categories
    const selectedCategoryNames = selectedCategories.value
      .map(category => typeof category === 'string' ? category : category.name)
      .filter(Boolean);
    if (selectedCategoryNames.length > 0) {
      const eventCategory = event.category?.name;
      if (!eventCategory || !selectedCategoryNames.includes(eventCategory)) {
        return false;
      }
    }
    // 4. Filter by start date
    if (startDate.value) {
      const eventStartDate = new Date(event.startTimeStamp);
      if (eventStartDate < startDate.value) {
        return false;
      }
    }
    // 5. Filter by end date
    if (endDate.value) {
      const eventEndDate = new Date(event.endTimeStamp);
      if (eventEndDate > endDate.value) {
        return false;
      }
    }
    // If all filters pass, include the event
    return true;
  });
};

export const getFilteredEvents = (selectedCategory: string | null) => {
  let events = selectedCategory
    ? moreEvents.value.filter(event => event.category?.name === selectedCategory)
    : moreEvents.value;

  // Then apply all other filters from the filter modal
  events = filterEvents(events);

  return events;
};

export const hasActiveFilters = () => {
  const hasCityFilters = (selectedCities.value || []).length > 0;
  const hasVenueFilters = (selectedVenues.value || []).length > 0;
  const hasCategoryFilters = selectedCategories.value.length > 0;
  const hasDateFilters = startDate.value !== null || endDate.value !== null;
  return hasCityFilters || hasVenueFilters || hasCategoryFilters || hasDateFilters;
};

// Initialization functions
export const initializeData = async () => {
  try {
    const citiesResponse: any = await getCities();
    setAllCities(citiesResponse?.[0]?.list || []);
  } catch (err) {
    console.log(err, "err Cities");
  }
  
  try {
    const venuesResponse: any = await getVenues(0, 100);
    setAllVenues(venuesResponse?.[0]?.list || []);
  } catch (err) {
    console.log(err, "err Venues");
  }
};

export const initializeSelectedItems = () => {
  if ((selectedCities.value || []).length === 0) {
    setSelectedCities((allCities.value || []).slice(0, 5));
  }
  if ((selectedVenues.value || []).length === 0) {
    setSelectedVenues((allVenues.value || []).slice(0, 5));
  }
};

// Sheet handlers
export const handleSelectCityInSheet = (cityId: string) => {
  const city = (allCities.value || []).find(c => c.id === cityId);
  if (!city) return;
  if ((selectedCities.value || []).find(c => c.id === cityId)) {
    setSelectedCities((selectedCities.value || []).filter(c => c.id !== cityId));
  } else {
    setSelectedCities([...(selectedCities.value || []), city]);
  }
};

export const handleSelectVenueInSheet = (venueId: string) => {
  const venue = (allVenues.value || []).find(v => v.id === venueId);
  if (!venue) return;
  if ((selectedVenues.value || []).find(v => v.id === venueId)) {
    setSelectedVenues((selectedVenues.value || []).filter(v => v.id !== venueId));
  } else {
    setSelectedVenues([...(selectedVenues.value || []), venue]);
  }
};