import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Change to your API base URL
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

