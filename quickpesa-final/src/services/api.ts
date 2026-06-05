import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://quickpesa-backend.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data: { phone: string; username: string; password: string }) =>
  api.post('/auth/register', data);

export const loginUser = (data: { phone: string; password: string }) =>
  api.post('/auth/login', data);

export const getMe = () => api.get('/auth/me');

export const depositMpesa = (amount: number, phone: string) =>
  api.post('/wallet/deposit', { amount, phone });

export const withdrawMpesa = (amount: number, phone: string) =>
  api.post('/wallet/withdraw', { amount, phone });

export const getTransactions = () => api.get('/wallet/transactions');

export const checkDepositStatus = (checkoutRequestId: string) =>
  api.get(`/wallet/deposit/status/${checkoutRequestId}`);
