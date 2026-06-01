import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/common/Button';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { DepositModal } from '@/components/wallet/DepositModal';
import { WithdrawModal } from '@/components/wallet/WithdrawModal';
import { formatKES } from '@/utils/formatters';
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

export const WalletPage = () => {
  const { user, isAuthenticated } = useUserStore();
  const { setShowDepositModal, setShowWithdrawModal } = useUIStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Wallet className="w-12 h-12 text-qp-muted" />
        <p className="text-qp-muted">Login to access your wallet</p>
      </div>
    );
  }

  const netProfit = user.totalWon - user.totalWagered;

  return (
    <div className="space-y-4 pb-20">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-qp-primary/20 to-emerald-900/20 rounded-2xl border border-qp-primary/20 p-6 text-center">
        <p className="text-sm text-qp-muted mb-1">Available Balance</p>
        <p className="text-4xl font-bold font-mono text-qp-text">{formatKES(user.balance)}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          {netProfit >= 0 ? (
            <TrendingUp className="w-4 h-4 text-qp-primary" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-sm font-medium ${netProfit >= 0 ? 'text-qp-primary' : 'text-red-400'}`}>
            {netProfit >= 0 ? '+' : ''}{formatKES(netProfit)} all time
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowDepositModal(true)}
        >
          <ArrowDownLeft className="w-5 h-5 mr-2" />
          Deposit
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setShowWithdrawModal(true)}
        >
          <ArrowUpRight className="w-5 h-5 mr-2" />
          Withdraw
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-qp-card rounded-xl border border-qp-border p-4">
          <p className="text-xs text-qp-muted mb-1">Total Wagered</p>
          <p className="text-lg font-bold font-mono text-qp-text">{formatKES(user.totalWagered)}</p>
        </div>
        <div className="bg-qp-card rounded-xl border border-qp-border p-4">
          <p className="text-xs text-qp-muted mb-1">Total Won</p>
          <p className="text-lg font-bold font-mono text-qp-text">{formatKES(user.totalWon)}</p>
        </div>
      </div>

      {/* Transaction History */}
      <TransactionHistory />

      {/* Modals */}
      <DepositModal />
      <WithdrawModal />
    </div>
  );
};
