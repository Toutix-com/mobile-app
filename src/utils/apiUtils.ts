import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { inlinePromise, InlineArrayResult } from '../lib/promise-util';
import { API_BASE_URL } from '@env';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export interface ApiListResponse<T> {
  count: number;
  list: T[];
}

export interface ServerResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export const setAuthToken = (apiInstance: AxiosInstance, token: string): void => {
  apiInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const commonApiWrapper = async <T>(
  apiPromise: Promise<AxiosResponse<ServerResponse<T>>>,
): Promise<InlineArrayResult<T, AxiosError<ErrorResponse>>> => {
  const [response, error] = await inlinePromise<AxiosResponse<ServerResponse<T>>, AxiosError<ErrorResponse>>(apiPromise);
  if (error || !response) {
    return [null, error];
  }
  return [response.data.data, null];
};
