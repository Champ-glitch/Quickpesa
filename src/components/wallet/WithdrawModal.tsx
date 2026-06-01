import { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { X, ArrowUpCircle, Wallet } from 'lucide-react';

export const WithdrawModal = () => {
  const { showWithdrawModal, setShowWithdrawModal } = useUIStore();
  const { user } = useUserStore();
  const { withdraw, isProcessing } = useWallet();
  const [amount, setAmount] = useState(1000);
  const [phone, setPhone] = useState('2547');

  if (!showWithdrawModal) return null;

  const maxAmount = user?.balance || 0;
  const quickAmounts = [500, 1000, 2000, 5000];

  const handleWithdraw = () => {
    if (phone.length < 10) return;
    if (amount > maxAmount) return;
    withdraw(amount, phone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-qp-card border border-qp-border rounded-2xl w-full max-w-sm">
        <div className="p-4 border-b border-qp-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="w-5 h-5 text-qp-accent" />
            <h2 className="text-lg font-bold text-qp-text">Withdraw</h2>
          </div>
          <button
            onClick={() => setShowWithdrawModal(false)}
            className="text-qp-muted hover:text-qp-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Balance */}
          <div className="bg-qp-bg rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-qp-primary" />
              <span className="text-sm text-qp-muted">Available Balance</span>
            </div>
            <span className="text-lg font-bold font-mono text-qp-text">
              KSh {maxAmount.toLocaleString()}
            </span>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-qp-muted mb-2 block">Amount (KSh)</label>
            <div className="relative mb-3">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-qp-muted font-bold">KSh</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-qp-bg border border-qp-border rounded-lg pl-12 pr-4 py-3 text-lg font-bold font-mono text-qp-text focus:outline-none focus:border-qp-primary"
                min={10}
                max={maxAmount}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(Math.min(amt, maxAmount))}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    amount === amt
                      ? 'bg-qp-accent/20 text-qp-accent border border-qp-accent/30'
                      : 'bg-qp-bg text-qp-muted border border-qp-border hover:text-qp-text'
                  }`}
                >
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Phone */}
          <Input
            label="M-Pesa Number"
            prefix="+"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="254712345678"
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isProcessing}
            disabled={amount > maxAmount}
            onClick={handleWithdraw}
          >
            {isProcessing ? 'Processing...' : `Withdraw KSh ${amount.toLocaleString()}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
