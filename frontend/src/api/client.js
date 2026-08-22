import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('procureguard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const auditInvoice = async (file) => {
  const formData = new FormData();
  formData.append('invoice', file);

  const response = await axios.post(`${API_BASE_URL}/audit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('procureguard_token') || ''}`,
    },
  });

  return response.data;
};

export const fetchInvoices = async () => {
  const response = await apiClient.get('/invoices');
  return response.data;
};

export const fetchInvoiceById = async (id) => {
  const response = await apiClient.get(`/invoices/${id}`);
  return response.data;
};

export const updateInvoiceStatus = async (id, status) => {
  const response = await apiClient.patch(`/invoices/${id}/status`, { status });
  return response.data;
};

export const fetchBenchmarks = async () => {
  const response = await apiClient.get('/benchmarks');
  return response.data;
};

export const createBenchmark = async (payload) => {
  const response = await apiClient.post('/benchmarks', payload);
  return response.data;
};

export const updateBenchmark = async (id, payload) => {
  const response = await apiClient.put(`/benchmarks/${id}`, payload);
  return response.data;
};

export const deleteBenchmark = async (id) => {
  const response = await apiClient.delete(`/benchmarks/${id}`);
  return response.data;
};

export const fetchSettings = async () => {
  const response = await apiClient.get('/settings');
  return response.data;
};

export const updateSettings = async (payload) => {
  const response = await apiClient.put('/settings', payload);
  return response.data;
};

// Auth API
export const registerUser = async (payload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// M-Pesa API
export const initiateMpesaPayment = async (payload) => {
  const response = await apiClient.post('/mpesa/stkpush', payload);
  return response.data;
};

export const checkMpesaStatus = async (checkoutRequestId) => {
  const response = await apiClient.get(`/mpesa/status/${checkoutRequestId}`);
  return response.data;
};

export const simulateMpesaSuccess = async (checkoutRequestId) => {
  const response = await apiClient.post('/mpesa/simulate', { checkoutRequestId });
  return response.data;
};
