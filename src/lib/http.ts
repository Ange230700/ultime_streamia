// src/lib/http.ts

import axios from "axios";
import axiosRetry, {
  exponentialDelay,
  isNetworkOrIdempotentRequestError,
} from "axios-retry";

// Create a single axios instance for all non-auth API calls:
const http = axios.create({
  baseURL: "/",
  withCredentials: true, // if you need cookies
  headers: { "Content-Type": "application/json" },
});

// Retries up to 3 times on network errors or idempotent requests (GET/HEAD/OPTIONS)
// with exponential backoff (1000ms, 2000ms, 4000ms…)
axiosRetry(http, {
  retries: 3,
  retryDelay: exponentialDelay,
  retryCondition: (error) => {
    // retry on network errors (timeout, DNS, etc)
    // or any 5xx response
    return (
      isNetworkOrIdempotentRequestError(error) ||
      (error.response?.status != null && error.response.status >= 500)
    );
  },
});

export default http;
