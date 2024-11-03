import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getInvoices = async () => {
  try {
    const response = await axios.get(`${API_URL}/invoices/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const createInvoices = async (invoiceData) => {
  try {
    const response = await axios.post(`${API_URL}/invoices/`, invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

export const createInvoice = async (invoiceId, invoiceData) => {
  try {
    const response = await axios.post(`${API_URL}/invoices/${invoiceId}/`, invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}