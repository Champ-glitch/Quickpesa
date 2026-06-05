import { useState, useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { initiateSTKPush, pollTransactionStatus } from '@/services/payhero';
import type { Transaction } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const CALLBACK_URL = import.meta.env.VITE_PAYHERO_CALLBACK_URL || 'https://api.quickpesa.com/webhooks/payhero';

export const useWallet = () => {
  const { user, updateBalance, addTransaction, setUser } = useUserStore();
  const { showToast, setShowDepositModal, setShowWithdrawModal } = useUIStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingTx, setPendingTx] = useState<string | null>(null);

  const deposit = async (amount: number, phone: string, channel: 'mpesa' | 'airtel' = 'mpesa') => {
    if (!user) {
      showToast('Please login first', 'error');
      return;
    }

    setIsProcessing(true);
    const reference = `QP_${user.id}_${Date.now()}`;

    try {
      if (USE_MOCK) {
        // Mock flow for development
        await new Promise(r => setTimeout(r, 2000));

        const mockTx: Transaction = {
          id: `dep_${Date.now()}`,
          userId: user.id,
          type: 'deposit',
          amount,
          status: 'completed',
          method: channel,
          reference: `MP${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          createdAt: new Date().toISOString(),
        };

        addTransaction(mockTx);
        updateBalance(amount);
        showToast(`KSh ${amount} deposited successfully!`, 'success');
        setShowDepositModal(false);
      } else {
        // Real PayHero flow
        const { checkout_request_id, message } = await initiateSTKPush({
          amount,
          phone_number: phone,
          channel,
          external_reference: reference,
          callback_url: CALLBACK_URL,
          description: `QuickPesa deposit - ${user.username}`,
        });

        showToast('M-Pesa prompt sent! Check your phone', 'info');
        setPendingTx(checkout_request_id);

        // Poll for confirmation
        const tx = await pollTransactionStatus(
          checkout_request_id,
          (status) => {
            if (status === 'pending') showToast('Waiting for M-Pesa confirmation...', 'info');
          }
        );

        if (tx && tx.status === 'completed') {
          const depositTx: Transaction = {
            id: `dep_${Date.now()}`,
            userId: user.id,
            type: 'deposit',
            amount: tx.amount,
            status: 'completed',
            method: channel,
            reference: tx.mpesa_receipt || reference,
            createdAt: new Date().toISOString(),
          };

          addTransaction(depositTx);
          updateBalance(tx.amount);
          showToast(`KSh ${tx.amount} deposited successfully!`, 'success');
          setShowDepositModal(false);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Deposit failed', 'error');
    } finally {
      setIsProcessing(false);
      setPendingTx(null);
    }
  };

  const withdraw = async (amount: number, _phone: string) => {
    if (!user || user.balance < amount) {
      showToast('Insufficient balance', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(r => setTimeout(r, 2000));

      const withdrawalTx: Transaction = {
        id: `wdr_${Date.now()}`,
        userId: user.id,
        type: 'withdrawal',
        amount: -amount,
        status: 'pending',
        method: 'mpesa',
        reference: `WD${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        createdAt: new Date().toISOString(),
      };

      addTransaction(withdrawalTx);
      updateBalance(-amount);
      showToast(`KSh ${amount} withdrawal initiated`, 'info');
      setShowWithdrawModal(false);
    } catch (err: any) {
      showToast(err.message || 'Withdrawal failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle PayHero webhook callback (call this from your backend webhook handler)
  const handlePayHeroCallback = useCallback((payload: any) => {
    if (!user) return;

    const { status, amount, external_reference, mpesa_receipt } = payload;

    if (status === 'completed') {
      const tx: Transaction = {
        id: `dep_${Date.now()}`,
        userId: user.id,
        type: 'deposit',
        amount,
        status: 'completed',
        method: 'mpesa',
        reference: mpesa_receipt || external_reference,
        createdAt: new Date().toISOString(),
      };

      addTransaction(tx);
      updateBalance(amount);
      showToast(`KSh ${amount} confirmed via M-Pesa!`, 'success');
    } else if (status === 'failed') {
      showToast('M-Pesa payment failed. Please try again.', 'error');
    }
  }, [user, addTransaction, updateBalance, showToast]);

  return { deposit, withdraw, isProcessing, pendingTx, handlePayHeroCallback };
};
