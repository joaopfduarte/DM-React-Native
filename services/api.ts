import axios from 'axios';
import { getToken } from './auth.service';

const api = axios.create({
  baseURL: 'https://api-dm-69db35e2f2d0.herokuapp.com',
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {

    if (error.response?.status === 401) {
      console.log('Não autorizado');
    }

    if (error.response?.status === 500) {
      console.log('Erro interno');
    }

    return Promise.reject(error);
  }
);

export default api;