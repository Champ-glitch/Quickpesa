import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/common/Button';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { DepositModal } from '@/components/wallet/DepositModal';
import { WithdrawModal } from '@/components/wallet/WithdrawModal';
import { formatKES } from '@/utils/formatters';
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown, Users } from 'lucide-react';

export const WalletPage = () => {
  const { user, isAuthenticated } = useUserStore();
  const { setShowDepositModal, setShowWithdrawModal } = useUIStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Wallet className="w-12 h-12 text-gray-700" />
        <p className="text-gray-500 text-sm">Login to access your wallet</p>
      </div>
    );
  }

  const net = user.totalWon - user.totalWagered;

  return (
    <div className="space-y-3 pb-20">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-brand-green/20 to-emerald-900/30 rounded-2xl border border-brand-green/20 p-5 text-center">
        <p className="text-xs text-gray-400 mb-1">Available Balance</p>
        <p className="text-3xl font-bold font-mono text-white">{formatKES(user.balance)}</p>
        <div className="flex items-center justify-center gap-1 mt-1.5">
          {net >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-brand-green" /> : <TrendingDown className="w-3.5 h-3.5 text-brand-red" />}
          <span className={`text-xs font-medium ${net >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>{net >= 0 ? '+' : ''}{formatKES(net)} all time</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="primary" size="lg" onClick={() => setShowDepositModal(true)}><ArrowDownLeft className="w-4 h-4 mr-1.5" /> Deposit</Button>
        <Button variant="secondary" size="lg" onClick={() => setShowWithdrawModal(true)}><ArrowUpRight className="w-4 h-4 mr-1.5" /> Withdraw</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-dark-800 rounded-xl border border-dark-border p-3">
          <p className="text-[10px] text-gray-500 mb-0.5">Total Wagered</p>
          <p className="text-base font-bold font-mono text-white">{formatKES(user.totalWagered)}</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-border p-3">
          <p className="text-[10px] text-gray-500 mb-0.5">Total Won</p>
          <p className="text-base font-bold font-mono text-white">{formatKES(user.totalWon)}</p>
        </div>
      </div>

      <TransactionHistory />
      <DepositModal />
      <WithdrawModal />
    </div>
  );
};
