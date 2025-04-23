// api.ts
import axios from 'axios';
import { getRefreshToken } from '../utils/auth';
import { refreshTokenRequest } from '../utils/tokenService';
import { setAuthTokensInUser, clearAuthTokens } from '../utils/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const newTokenData = await refreshTokenRequest(refreshToken);
          if (newTokenData?.token) {
            setAuthTokensInUser(newTokenData.token, refreshToken);
            originalRequest.headers['Authorization'] = `Bearer ${newTokenData.token}`;
            return api(originalRequest);
          } else {
            clearAuthTokens();
            window.location.href = '/login';
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("Erro ao tentar renovar o token:", refreshError);
          clearAuthTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else {
        clearAuthTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const getTreinos = async (token: any) => {
  try {
    const response = await api.get('/treino');
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar os treinos:", error.response || error.message);
    throw new Error(error?.response?.data?.message || "Erro ao buscar os dados");
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar o usuário:", error.response || error.message);
    throw new Error(error?.response?.data?.message || "Erro ao buscar os dados do usuário");
  }
};

export default api;