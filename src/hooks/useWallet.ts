import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';

export const useWallet = () => {
  const { user, updateBalance, addTransaction } = useUserStore();
  const { showToast, setShowDepositModal, setShowWithdrawModal } = useUIStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const deposit = async (amount: number, _phone: string) => {
    setIsProcessing(true);

    // Mock M-Pesa STK push
    await new Promise(r => setTimeout(r, 2000));

    updateBalance(amount);
    addTransaction({
      id: `dep_${Date.now()}`,
      userId: user?.id || '',
      type: 'deposit',
      amount,
      status: 'completed',
      method: 'mpesa',
      reference: `MP${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    });

    showToast(`KSh ${amount} deposited successfully!`, 'success');
    setShowDepositModal(false);
    setIsProcessing(false);
  };

  const withdraw = async (amount: number, _phone: string) => {
    if (!user || user.balance < amount) {
      showToast('Insufficient balance', 'error');
      return;
    }

    setIsProcessing(true);

    // Mock withdrawal processing
    await new Promise(r => setTimeout(r, 2000));

    updateBalance(-amount);
    addTransaction({
      id: `wdr_${Date.now()}`,
      userId: user.id,
      type: 'withdrawal',
      amount: -amount,
      status: 'pending',
      method: 'mpesa',
      reference: `WD${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    });

    showToast(`KSh ${amount} withdrawal initiated`, 'info');
    setShowWithdrawModal(false);
    setIsProcessing(false);
  };

  return { deposit, withdraw, isProcessing };
};
