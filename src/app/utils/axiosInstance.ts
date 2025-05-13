import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

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

const refreshTokenRequest = async (oldToken: string | undefined) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/token/refresh`,
      {
        oldToken: oldToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
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
        const userString = localStorage.getItem('user');
        const oldToken = userString ? JSON.parse(userString)?.token : undefined;

        if (!oldToken) {
          processQueue(new Error('Token antigo não encontrado no localStorage'), null);
          return Promise.reject(error);
        }

        const data = await refreshTokenRequest(oldToken);

        if (data) {
          const newToken = typeof data === 'string' ? data : data.token;

          // Atualiza o token dentro do objeto user no localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            const updatedUser = { ...user, token: newToken };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }

          processQueue(null, newToken);

          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          const refreshError = new Error('Erro ao renovar token: Token não retornado ou data inválida');
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
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

api.interceptors.request.use(config => {
  const userString = localStorage.getItem('user');
  const token = userString ? JSON.parse(userString)?.token : null;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;