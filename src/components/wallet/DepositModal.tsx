import { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useWallet } from '@/hooks/useWallet';
import { depositChannels } from '@/mocks/gameRounds';
import { Button } from '@/components/common/Button';
import { X, ArrowDownLeft, Smartphone, Building2, Bitcoin, Check } from 'lucide-react';

const channelIcons: Record<string, React.ReactNode> = {
  mpesa: <Smartphone className="w-5 h-5 text-brand-green" />,
  airtel: <Smartphone className="w-5 h-5 text-brand-red" />,
  bank: <Building2 className="w-5 h-5 text-brand-blue" />,
  crypto: <Bitcoin className="w-5 h-5 text-brand-orange" />,
};

export const DepositModal = () => {
  const { showDepositModal, setShowDepositModal } = useUIStore();
  const { deposit, isProcessing } = useWallet();
  const [amount, setAmount] = useState(500);
  const [phone, setPhone] = useState('2547');
  const [selectedChannel, setSelectedChannel] = useState('mpesa');

  if (!showDepositModal) return null;

  const channel = depositChannels.find(c => c.id === selectedChannel);
  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleDeposit = () => {
    if (phone.length < 10) return;
    if (channel && (amount < channel.minAmount || amount > channel.maxAmount)) return;
    deposit(amount, phone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-border rounded-t-2xl sm:rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-dark-border flex items-center justify-between sticky top-0 bg-dark-800 z-10">
          <div className="flex items-center gap-2"><ArrowDownLeft className="w-5 h-5 text-brand-green" /><h2 className="text-base font-bold text-white">Deposit</h2></div>
          <button onClick={() => setShowDepositModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 space-y-4">
          {/* Channels */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Select Channel</label>
            <div className="grid grid-cols-2 gap-2">
              {depositChannels.map(ch => (
                <button key={ch.id} onClick={() => setSelectedChannel(ch.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
                    selectedChannel === ch.id ? 'bg-brand-green/10 border-brand-green/40' : 'bg-dark-900 border-dark-border hover:border-gray-600'
                  }`}>
                  {channelIcons[ch.id]}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{ch.name}</p>
                    <p className="text-[10px] text-gray-500">{ch.processingTime}</p>
                  </div>
                  {selectedChannel === ch.id && <Check className="w-3.5 h-3.5 text-brand-green ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
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
              />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {quickAmounts.map(amt => (
                <button key={amt} onClick={() => setAmount(amt)}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${amount === amt ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' : 'bg-dark-900 text-gray-500 border border-dark-border hover:text-gray-300'}`}>
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>
            {channel && (
              <p className="text-[10px] text-gray-500 mt-1.5">
                Min: KSh {channel.minAmount.toLocaleString()} | Max: KSh {channel.maxAmount.toLocaleString()} | Fee: {channel.fee}
              </p>
            )}
          </div>

          {/* Phone - FIXED */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Phone Number</label>
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

          <div className="bg-dark-900 rounded-lg p-3 flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-gray-500">You will receive an STK push on your phone. Enter your PIN to complete.</p>
          </div>

          <Button variant="primary" size="lg" fullWidth loading={isProcessing} onClick={handleDeposit}>
            {isProcessing ? 'Processing...' : `Deposit KSh ${amount.toLocaleString()}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
