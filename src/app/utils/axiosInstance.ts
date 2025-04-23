import axios from 'axios';
import { refreshTokenRequest } from './tokenService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Flag para evitar múltiplas chamadas de refresh simultâneas
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

// Interceptor de resposta
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh_token')
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const data = await refreshTokenRequest(refreshToken || undefined);

        if (data?.token) {
          localStorage.setItem('token', data.token);
          processQueue(null, data.token);

          originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
          return api(originalRequest);
        } else {
          processQueue(new Error('Erro ao renovar token'), null);
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Interceptor de requisição (para adicionar o token automaticamente)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
