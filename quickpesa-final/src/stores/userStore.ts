import { create } from 'zustand';
import type { User, Transaction } from '@/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  transactions: Transaction[];
  token: string | null;
  setUser: (user: User | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addTransaction: (tx: Transaction) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  transactions: [],
  token: localStorage.getItem('qp_token'),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: (user, token) => {
    localStorage.setItem('qp_token', token);
    set({ user, isAuthenticated: true, token });
  },
  logout: () => {
    localStorage.removeItem('qp_token');
    set({ user: null, isAuthenticated: false, transactions: [], token: null });
  },
  updateBalance: (amount) => set((state) => ({
    user: state.user ? { ...state.user, balance: state.user.balance + amount } : null,
  })),
  addTransaction: (tx) => set((state) => ({
    transactions: [tx, ...state.transactions],
  })),
}));
