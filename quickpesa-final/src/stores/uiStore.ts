import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';
interface ToastData { message: string; type: ToastType; }

interface UIState {
  activeTab: 'game' | 'wallet' | 'profile';
  showProvablyFair: boolean;
  showDepositModal: boolean;
  showWithdrawModal: boolean;
  showLoginModal: boolean;
  showRegisterModal: boolean;
  toast: ToastData | null;
  setActiveTab: (tab: UIState['activeTab']) => void;
  toggleProvablyFair: () => void;
  setShowDepositModal: (show: boolean) => void;
  setShowWithdrawModal: (show: boolean) => void;
  setShowLoginModal: (show: boolean) => void;
  setShowRegisterModal: (show: boolean) => void;
  showToast: (message: string, type: ToastType) => void;
  clearToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'game',
  showProvablyFair: false,
  showDepositModal: false,
  showWithdrawModal: false,
  showLoginModal: false,
  showRegisterModal: false,
  toast: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleProvablyFair: () => set((s) => ({ showProvablyFair: !s.showProvablyFair })),
  setShowDepositModal: (show) => set({ showDepositModal: show }),
  setShowWithdrawModal: (show) => set({ showWithdrawModal: show }),
  setShowLoginModal: (show) => set({ showLoginModal: show }),
  setShowRegisterModal: (show) => set({ showRegisterModal: show }),
  showToast: (message, type) => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));
