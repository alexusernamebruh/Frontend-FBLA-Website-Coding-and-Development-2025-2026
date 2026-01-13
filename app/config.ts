import axios from 'axios';
export const a = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 100000,
});
