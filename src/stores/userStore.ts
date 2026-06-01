import { create } from 'zustand';
import type { User, Transaction } from '@/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  transactions: Transaction[];

  // Actions
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addTransaction: (tx: Transaction) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  transactions: [],

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: (user) => set({ user, isAuthenticated: true }),

  logout: () => set({ user: null, isAuthenticated: false, transactions: [] }),

  updateBalance: (amount) => set((state) => ({
    user: state.user 
      ? { ...state.user, balance: state.user.balance + amount }
      : null,
  })),

  addTransaction: (tx) => set((state) => ({
    transactions: [tx, ...state.transactions],
  })),
}));
