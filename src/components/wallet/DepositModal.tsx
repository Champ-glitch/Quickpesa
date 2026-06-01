import { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { X, Smartphone, ArrowDownCircle } from 'lucide-react';

export const DepositModal = () => {
  const { showDepositModal, setShowDepositModal } = useUIStore();
  const { deposit, isProcessing } = useWallet();
  const [amount, setAmount] = useState(500);
  const [phone, setPhone] = useState('2547');

  if (!showDepositModal) return null;

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleDeposit = () => {
    if (phone.length < 10) return;
    deposit(amount, phone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-qp-card border border-qp-border rounded-2xl w-full max-w-sm">
        <div className="p-4 border-b border-qp-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="w-5 h-5 text-qp-primary" />
            <h2 className="text-lg font-bold text-qp-text">Deposit</h2>
          </div>
          <button
            onClick={() => setShowDepositModal(false)}
            className="text-qp-muted hover:text-qp-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
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
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    amount === amt
                      ? 'bg-qp-primary/20 text-qp-primary border border-qp-primary/30'
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

          {/* Info */}
          <div className="bg-qp-bg rounded-lg p-3 flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-qp-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-qp-muted">
              You will receive an M-Pesa STK push on your phone. Enter your PIN to complete the deposit.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isProcessing}
            onClick={handleDeposit}
          >
            {isProcessing ? 'Processing...' : `Deposit KSh ${amount.toLocaleString()}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
