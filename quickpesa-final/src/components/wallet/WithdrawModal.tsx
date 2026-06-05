import { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/common/Button';
import { withdrawMpesa } from '@/services/api';
import { X, ArrowUpRight, Wallet, Smartphone } from 'lucide-react';

export const WithdrawModal = () => {
  const { showWithdrawModal, setShowWithdrawModal, showToast } = useUIStore();
  const { user, updateBalance, addTransaction } = useUserStore();
  const [amount, setAmount] = useState(1000);
  const [phone, setPhone] = useState(user?.phone || '254');
  const [isLoading, setIsLoading] = useState(false);

  if (!showWithdrawModal) return null;

  const maxAmt = user?.balance || 0;
  const quickAmounts = [500, 1000, 2000, 5000];

  const handleWithdraw = async () => {
    if (!user) { showToast('Please login first', 'error'); return; }
    if (amount < 50) { showToast('Minimum withdrawal is KSh 50', 'error'); return; }
    if (amount > maxAmt) { showToast('Insufficient balance', 'error'); return; }
    if (!phone || phone.length < 12) { showToast('Enter a valid M-Pesa number e.g. 254712345678', 'error'); return; }

    setIsLoading(true);
    try {
      const res = await withdrawMpesa(amount, phone);
      updateBalance(-amount);
      addTransaction({
        id: res.data.transaction_id,
        userId: user.id,
        type: 'withdrawal',
        amount: -amount,
        status: 'pending',
        method: 'mpesa',
        createdAt: new Date().toISOString(),
      });
      showToast(`KSh ${amount.toLocaleString()} withdrawal initiated. Check M-Pesa shortly.`, 'success');
      setShowWithdrawModal(false);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Withdrawal failed. Try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-border rounded-t-2xl sm:rounded-2xl w-full max-w-sm">
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-brand-orange" />
            <h2 className="text-base font-bold text-white">Withdraw to M-Pesa</h2>
          </div>
          <button onClick={() => setShowWithdrawModal(false)} className="text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-dark-900 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-brand-green" />
              <span className="text-xs text-gray-400">Available balance</span>
            </div>
            <span className="text-lg font-bold font-mono text-white">KSh {maxAmt.toLocaleString()}</span>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">Amount (KSh)</label>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm z-10">KSh</span>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-dark-900 border border-dark-border rounded-lg pl-14 pr-4 py-3 text-lg font-bold font-mono text-white focus:outline-none focus:border-brand-green min-h-[48px]"
                min={50} max={maxAmt} />
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {quickAmounts.map(amt => (
                <button key={amt} onClick={() => setAmount(Math.min(amt, maxAmt))}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${amount === amt ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30' : 'bg-dark-900 text-gray-500 border border-dark-border hover:text-gray-300'}`}>
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-1.5">Min: KSh 50 | Arrives within 1 minute</p>
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

          <Button variant="primary" size="lg" fullWidth loading={isLoading}
            disabled={amount > maxAmt || amount < 50} onClick={handleWithdraw}>
            {isLoading ? 'Processing...' : `Withdraw KSh ${amount.toLocaleString()}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
