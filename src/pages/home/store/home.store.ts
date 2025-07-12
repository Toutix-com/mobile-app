import { signal } from '@preact/signals-react';

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
export const allCategories = signal<object[]>([]);
export const moreEvents = signal<Event[]>([]);

export const filteredCities = signal<City[]>([]);
export const allCitiesSheetOpen = signal(false);

export const selectedCities = signal<City[]>([]);
export const selectedCategories = signal<object[]>([]);
export const selectedSubCategories = signal<object[]>([]);
export const selectedBrands = signal<object[]>([]);
export const selectedProducts = signal<object[]>([]);

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

export const setSelectedCategories = (categories: object[]) => {
    selectedCategories.value = categories;
}

export const setSelectedSubCategories = (subCategories: object[]) => {
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