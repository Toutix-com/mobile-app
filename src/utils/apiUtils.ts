import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { inlinePromise, InlineArrayResult } from './promise-util';

export const api: AxiosInstance = axios.create({
  baseURL: 'https://stg.api.toutix.com',
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
