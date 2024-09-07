import axios, { AxiosResponse, Method } from 'axios';
import { url } from './config';
import { toast } from 'react-toastify';

const API_PATH = `${url}`

export interface ApiResponse {
  ok: boolean;
  error?: string; // ? means optional
  [key: string]: any; // [key: string] means any key can be used
}

let activeRequests: AbortController[] = [];

/**
 * Makes an HTTP request to the backend API.
 * @param {string} method - The HTTP method to use for the request (e.g. "GET", "POST").
 * @param {string} path - The API endpoint to send the request to.
 * @param {Object} [data] - Optional request body as an object (for "POST" and "PUT" requests).
 * @param {string} [token] - Optional user authentication token to include in the request headers.
 * @returns {Promise<ApiResponse>} - A promise that resolves to the response data (as a JavaScript object).
 */
const apiRequest = async (
  method: Method,
  path: string,
  data: unknown | null = null,
  token: string | null = null
): Promise<ApiResponse> => {

  const contentType = (data instanceof FormData) ? 'multipart/form-data' : 'application/json';
  
  const controller = new AbortController();
  activeRequests.push(controller);

  // Set up the axios instance with default options
  const instance = axios.create({
    baseURL: API_PATH,
    headers: {
      'Content-Type': contentType,
    },
    signal: (path === '/profile' ? null : controller.signal)
  });

  // Add an interceptor to handle errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        error.response = {
          data: {
            ok: false,
            error:
              'Could not connect to server. Is your internet connection ok?',
          },
        };
      }
      return Promise.reject(error);
    }
  );

  // Append the request auth token
  if (token !== null) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else if (localStorage.getItem('token')) {
    instance.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  try {
    const controller = new AbortController();
    // Attempt to make the axios request async
    const response: AxiosResponse = await instance({
      method,
      url: path,
      data,
    });

    activeRequests = activeRequests.filter((reqController) => reqController !== controller);

    if (response.data === null) {
      return { ok: true };
    } else if (typeof response.data === 'object') {
      response.data.ok = true;
      return response.data;
    } else if (typeof response.data === 'number') {
      return { ok: true, data: response.data };
    } else {
      response.data.ok = true;
      return response.data;
    }
  } catch (error: unknown) {
    activeRequests = activeRequests.filter((reqController) => reqController !== controller);
    if (axios.isAxiosError(error)) {
      if (!(error.response?.status === undefined || error.response?.data.detail === undefined)) {
        toast.error(`Error ${error.response?.status}: ${JSON.stringify(error.response?.data.detail)}`);
      }
      return { ok: false, status: error.response?.status, detail: error.response?.data.detail };
    } else {
      return {
        ok: false,
        detail: 'An unknown error occurred',
      };
    }
  }
};

export const cancelAllRequests = () => {
  activeRequests.forEach((controller) => controller.abort());
  activeRequests = [];
};

export default apiRequest;
