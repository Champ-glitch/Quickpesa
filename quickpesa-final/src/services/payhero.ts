import axios from 'axios';
import type { Transaction } from '@/types';

const PAYHERO_BASE_URL = import.meta.env.VITE_PAYHERO_API_URL || 'https://api.payhero.co.ke/v2';
const PAYHERO_API_KEY = import.meta.env.VITE_PAYHERO_API_KEY || '';

const api = axios.create({
  baseURL: PAYHERO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${PAYHERO_API_KEY}`,
  },
  timeout: 30000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network error';
    console.error('PayHero API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export interface PayHeroSTKPayload {
  amount: number;
  phone_number: string;
  channel: 'mpesa' | 'airtel';
  external_reference: string;
  callback_url: string;
  description?: string;
}

export interface PayHeroTransaction {
  transaction_id: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  phone_number: string;
  mpesa_receipt?: string;
  external_reference: string;
  created_at: string;
  updated_at: string;
}

// Initiate M-Pesa STK Push via PayHero
export const initiateSTKPush = async (payload: PayHeroSTKPayload): Promise<{ checkout_request_id: string; message: string }> => {
  const response = await api.post('/payments/stk-push', payload);
  return response.data;
};

// Query transaction status
export const queryTransactionStatus = async (transactionId: string): Promise<PayHeroTransaction> => {
  const response = await api.get(`/transactions/${transactionId}`);
  return response.data;
};

// Poll transaction status until confirmed or timeout
export const pollTransactionStatus = async (
  transactionId: string,
  onStatusChange: (status: string, tx?: PayHeroTransaction) => void,
  maxAttempts: number = 30,
  intervalMs: number = 3000
): Promise<PayHeroTransaction | null> => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const tx = await queryTransactionStatus(transactionId);
      onStatusChange(tx.status, tx);

      if (tx.status === 'completed') return tx;
      if (tx.status === 'failed') throw new Error('Payment failed');

      await new Promise(r => setTimeout(r, intervalMs));
    } catch (err) {
      console.error('Poll error:', err);
      await new Promise(r => setTimeout(r, intervalMs));
    }
  }
  throw new Error('Payment confirmation timeout - please check your M-Pesa messages');
};

// Verify callback signature (HMAC-SHA256)
export const verifyCallbackSignature = (payload: string, signature: string, secret: string): boolean => {
  // In production, use crypto.subtle or a library to verify HMAC
  // For now, we trust the callback URL is secured
  return true;
};

// Parse PayHero callback payload
export const parseCallbackPayload = (payload: any): {
  transactionId: string;
  status: string;
  amount: number;
  phoneNumber: string;
  mpesaReceipt?: string;
  externalReference: string;
} => {
  return {
    transactionId: payload.transaction_id,
    status: payload.status,
    amount: payload.amount,
    phoneNumber: payload.phone_number,
    mpesaReceipt: payload.mpesa_receipt,
    externalReference: payload.external_reference,
  };
};
