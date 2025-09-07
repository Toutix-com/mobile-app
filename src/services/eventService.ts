import { api, commonApiWrapper } from '../utils/apiUtils';

export const getEventById = (id: string) => {
  return commonApiWrapper(api.get(`/event/single/${id}`));
};

export const getEvents = (offset: number, limit: number) => {
  return commonApiWrapper(api.post('/event/query', { params: { offset, limit } }));
};

export const getCities = () => {
  return commonApiWrapper(api.get('/city/names'));
};

export const getVenues = (offset: number, limit: number) => {
  return commonApiWrapper(api.get(`location/names?offset=${offset}&limit=${limit}`));
};

export const getCategories = (offset: number, limit: number) => {
  return commonApiWrapper(api.get(`category/names?offset=${offset}&limit=${limit}`));
};

export const getOrganizationProfile = (organizationId: string) => {
  return commonApiWrapper(api.get(`/event/organization/${organizationId}`));
};
