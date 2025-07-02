import { signal } from '@preact/signals-react';

export const startDate = signal<Date | null>(null);
export const endDate = signal<Date | null>(null);
export const selectedCities = signal<object[]>([]);
export const selectedCategories = signal<string[]>([]);
export const selectedSubCategories = signal<string[]>([]);
export const selectedBrands = signal<string[]>([]);
export const selectedProducts = signal<string[]>([]);

export const setStartDate = (date: Date | null) => {
    console.log(date, "date store");
    
    startDate.value = date;
}

export const setEndDate = (date: Date | null) => {
    endDate.value = date;
}

export const setSelectedCities = (cities: object[]) => {
    selectedCities.value = cities;
}

export const setSelectedCategories = (categories: string[]) => {
    selectedCategories.value = categories;
}

export const setSelectedSubCategories = (subCategories: string[]) => {
    selectedSubCategories.value = subCategories;
}