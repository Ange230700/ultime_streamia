// src\lib\authAxios.ts

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import isTokenExpired from "@/app/modules/isTokenExpired";
import axiosRetry, {
  exponentialDelay,
  isNetworkOrIdempotentRequestError,
} from "axios-retry";

let accessToken: string | null = null;
let isRefreshing = false;
let requestQueue: (() => void)[] = [];

export function setAccessToken(token: string | null) {
  accessToken = token;
}

const authAxios: AxiosInstance = axios.create({
  baseURL: "/",
  withCredentials: true, // Required for HttpOnly cookie
});

// ✅ Attach Authorization header
authAxios.interceptors.request.use(
  async (config) => {
    if (accessToken && isTokenExpired(accessToken)) {
      const res = await axios.get<{ token: string }>("/api/auth/refresh", {
        withCredentials: true,
      });
      accessToken = res.data.token;
      setAccessToken(accessToken);
    }
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err: Error) => Promise.reject(err),
);

// ✅ Handle 401 responses
authAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          requestQueue.push(() => resolve(authAxios(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.get<{ token: string }>("/api/auth/refresh", {
          withCredentials: true,
        });

        accessToken = res.data.token;

        // Update retry request with new token
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        // Retry queued requests
        requestQueue.forEach((cb) => cb());
        requestQueue = [];

        return authAxios(originalRequest);
      } catch (err) {
        requestQueue = [];
        return Promise.reject(
          err instanceof Error ? err : new Error(String(err)),
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

axiosRetry(authAxios, {
  retries: 2,
  retryDelay: exponentialDelay,
  retryCondition: (error) =>
    isNetworkOrIdempotentRequestError(error) ||
    (error.response?.status ?? 0) >= 500,
});

export default authAxios;
