import { useUserStore } from '@/stores/userStore';
import { mockTransactions } from '@/mocks/gameRounds';
import { formatKES } from '@/utils/formatters';
import { ArrowDownLeft, ArrowUpRight, Gamepad2, Gift, Clock, CheckCircle } from 'lucide-react';

export const TransactionHistory = () => {
  const { transactions } = useUserStore();
  const allTransactions = transactions.length > 0 ? transactions : mockTransactions;

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-qp-primary" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-qp-accent" />;
      case 'bet': return <Gamepad2 className="w-4 h-4 text-red-400" />;
      case 'win': return <Gift className="w-4 h-4 text-qp-primary" />;
      case 'bonus': return <Gift className="w-4 h-4 text-qp-accent" />;
      default: return <Clock className="w-4 h-4 text-qp-muted" />;
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-3 h-3 text-green-400" />;
    if (status === 'pending') return <Clock className="w-3 h-3 text-qp-accent" />;
    return <Clock className="w-3 h-3 text-red-400" />;
  };

  return (
    <div className="bg-qp-card rounded-xl border border-qp-border overflow-hidden">
      <div className="p-3 border-b border-qp-border">
        <h3 className="text-sm font-semibold text-qp-text">Transaction History</h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {allTransactions.length === 0 ? (
          <div className="text-center py-8 text-qp-muted text-sm">
            No transactions yet
          </div>
        ) : (
          <div className="divide-y divide-qp-border/50">
            {allTransactions.map((tx) => (
              <div key={tx.id} className="p-3 flex items-center gap-3 hover:bg-qp-bg/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-qp-bg flex items-center justify-center flex-shrink-0">
                  {getIcon(tx.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-qp-text capitalize">{tx.type}</span>
                    <span className={`text-sm font-bold font-mono ${
                      tx.amount > 0 ? 'text-qp-primary' : 'text-qp-text'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{formatKES(Math.abs(tx.amount))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-qp-muted">{tx.createdAt}</span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(tx.status)}
                      <span className="text-xs text-qp-muted capitalize">{tx.status}</span>
                    </div>
                  </div>
                  {tx.reference && (
                    <span className="text-[10px] text-qp-muted/50 font-mono">Ref: {tx.reference}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
