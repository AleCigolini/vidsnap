import axios from 'axios';

const api = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;