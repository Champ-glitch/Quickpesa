import { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/common/Button';
import { depositMpesa, checkDepositStatus } from '@/services/api';
import { X, ArrowDownLeft, Smartphone } from 'lucide-react';

export const DepositModal = () => {
  const { showDepositModal, setShowDepositModal, showToast } = useUIStore();
  const { user, updateBalance, addTransaction } = useUserStore();
  const [amount, setAmount] = useState(500);
  const [phone, setPhone] = useState(user?.phone || '254');
  const [isLoading, setIsLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  if (!showDepositModal) return null;

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleDeposit = async () => {
    if (!user) { showToast('Please login first', 'error'); return; }
    if (amount < 10) { showToast('Minimum deposit is KSh 10', 'error'); return; }
    if (!phone || phone.length < 12) { showToast('Enter a valid M-Pesa number e.g. 254712345678', 'error'); return; }

    setIsLoading(true);
    try {
      const res = await depositMpesa(amount, phone);
      const { checkout_request_id, transaction_id } = res.data;

      showToast('M-Pesa prompt sent! Enter your PIN', 'success');
      setIsLoading(false);
      setPolling(true);

      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await checkDepositStatus(checkout_request_id);
          const { status, amount: confirmedAmount } = statusRes.data;

          if (status === 'completed') {
            clearInterval(interval);
            setPolling(false);
            updateBalance(confirmedAmount);
            addTransaction({
              id: transaction_id,
              userId: user.id,
              type: 'deposit',
              amount: confirmedAmount,
              status: 'completed',
              method: 'mpesa',
              createdAt: new Date().toISOString(),
            });
            showToast(`KSh ${confirmedAmount.toLocaleString()} deposited successfully!`, 'success');
            setShowDepositModal(false);
          } else if (status === 'failed') {
            clearInterval(interval);
            setPolling(false);
            showToast('M-Pesa payment failed. Try again.', 'error');
          }
        } catch { /* keep polling */ }

        if (attempts >= 30) {
          clearInterval(interval);
          setPolling(false);
          showToast('Timeout — check your M-Pesa messages and try again', 'error');
        }
      }, 3000);

    } catch (err: any) {
      setIsLoading(false);
      showToast(err.response?.data?.error || 'Deposit failed. Try again.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-border rounded-t-2xl sm:rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-dark-border flex items-center justify-between sticky top-0 bg-dark-800 z-10">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-brand-green" />
            <h2 className="text-base font-bold text-white">Deposit via M-Pesa</h2>
          </div>
          <button onClick={() => setShowDepositModal(false)} className="text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">Amount (KSh)</label>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm z-10">KSh</span>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-dark-900 border border-dark-border rounded-lg pl-14 pr-4 py-3 text-lg font-bold font-mono text-white focus:outline-none focus:border-brand-green min-h-[48px]"
                min={10} max={150000} />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {quickAmounts.map(amt => (
                <button key={amt} onClick={() => setAmount(amt)}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${amount === amt ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' : 'bg-dark-900 text-gray-500 border border-dark-border hover:text-gray-300'}`}>
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-1.5">Min: KSh 10 | Max: KSh 150,000 | No fees</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">M-Pesa Number</label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="254712345678"
                className="w-full bg-dark-900 border border-dark-border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green min-h-[48px]" />
            </div>
          </div>

          {polling && (
            <div className="bg-brand-green/10 border border-brand-green/30 rounded-lg p-3 flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin flex-shrink-0" />
              <p className="text-xs text-brand-green">Waiting for M-Pesa confirmation...</p>
            </div>
          )}

          <div className="bg-dark-900 rounded-lg p-3 flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-gray-500">You'll receive an M-Pesa STK push. Enter your PIN to complete. Funds reflect instantly.</p>
          </div>

          <Button variant="primary" size="lg" fullWidth loading={isLoading || polling} onClick={handleDeposit} disabled={polling}>
            {polling ? 'Confirming payment...' : isLoading ? 'Sending prompt...' : `Deposit KSh ${amount.toLocaleString()}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
