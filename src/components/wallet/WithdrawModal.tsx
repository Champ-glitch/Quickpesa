import { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/common/Button';
import { X, ArrowUpRight, Wallet } from 'lucide-react';

export const WithdrawModal = () => {
  const { showWithdrawModal, setShowWithdrawModal } = useUIStore();
  const { user } = useUserStore();
  const { withdraw, isProcessing } = useWallet();
  const [amount, setAmount] = useState(1000);
  const [phone, setPhone] = useState('2547');

  if (!showWithdrawModal) return null;
  const maxAmt = user?.balance || 0;
  const quickAmounts = [500, 1000, 2000, 5000];

  const handleWithdraw = () => {
    if (phone.length < 10) return;
    if (amount > maxAmt) return;
    withdraw(amount, phone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-border rounded-t-2xl sm:rounded-2xl w-full max-w-sm">
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2"><ArrowUpRight className="w-5 h-5 text-brand-orange" /><h2 className="text-base font-bold text-white">Withdraw</h2></div>
          <button onClick={() => setShowWithdrawModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-dark-900 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><Wallet className="w-4 h-4 text-brand-green" /><span className="text-xs text-gray-400">Available</span></div>
            <span className="text-lg font-bold font-mono text-white">KSh {maxAmt.toLocaleString()}</span>
          </div>

          {/* Amount - FIXED */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">Amount (KSh)</label>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm z-10">KSh</span>
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-dark-900 border border-dark-border rounded-lg pl-14 pr-4 py-3 text-lg font-bold font-mono text-white focus:outline-none focus:border-brand-green min-h-[48px]"
                min={10} 
                max={maxAmt}
              />
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {quickAmounts.map(amt => (
                <button key={amt} onClick={() => setAmount(Math.min(amt, maxAmt))}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${amount === amt ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30' : 'bg-dark-900 text-gray-500 border border-dark-border hover:text-gray-300'}`}>
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Phone - FIXED */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">M-Pesa Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm z-10">+</span>
              <input 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="254712345678"
                className="w-full bg-dark-900 border border-dark-border rounded-lg pl-9 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green min-h-[48px]"
              />
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth loading={isProcessing} disabled={amount > maxAmt} onClick={handleWithdraw}>
            {isProcessing ? 'Processing...' : `Withdraw KSh ${amount.toLocaleString()}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
