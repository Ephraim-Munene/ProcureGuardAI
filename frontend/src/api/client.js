import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const auditInvoice = async (file) => {
  const formData = new FormData();
  formData.append('invoice', file);

  const response = await axios.post(`${API_BASE_URL}/audit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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
