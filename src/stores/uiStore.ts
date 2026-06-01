import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastData {
  message: string;
  type: ToastType;
}

interface UIState {
  activeTab: 'game' | 'wallet' | 'profile' | 'history';
  showProvablyFair: boolean;
  showChat: boolean;
  showLeaderboard: boolean;
  showDepositModal: boolean;
  showWithdrawModal: boolean;
  toast: ToastData | null;

  setActiveTab: (tab: UIState['activeTab']) => void;
  toggleProvablyFair: () => void;
  toggleChat: () => void;
  toggleLeaderboard: () => void;
  setShowDepositModal: (show: boolean) => void;
  setShowWithdrawModal: (show: boolean) => void;
  showToast: (message: string, type: ToastType) => void;
  clearToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'game',
  showProvablyFair: false,
  showChat: false,
  showLeaderboard: false,
  showDepositModal: false,
  showWithdrawModal: false,
  toast: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleProvablyFair: () => set((s) => ({ showProvablyFair: !s.showProvablyFair })),
  toggleChat: () => set((s) => ({ showChat: !s.showChat })),
  toggleLeaderboard: () => set((s) => ({ showLeaderboard: !s.showLeaderboard })),
  setShowDepositModal: (show) => set({ showDepositModal: show }),
  setShowWithdrawModal: (show) => set({ showWithdrawModal: show }),
  showToast: (message, type) => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));
