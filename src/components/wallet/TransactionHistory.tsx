import { useUserStore } from '@/stores/userStore';
import { mockTransactions } from '@/mocks/gameRounds';
import { formatKES } from '@/utils/formatters';
import { ArrowDownLeft, ArrowUpRight, Gamepad2, Gift, Clock, CheckCircle } from 'lucide-react';

export const TransactionHistory = () => {
  const { transactions } = useUserStore();
  const all = transactions.length > 0 ? transactions : mockTransactions;

  const getIcon = (type: string) => {
    switch(type) {
      case 'deposit': return <ArrowDownLeft className="w-3.5 h-3.5 text-brand-green" />;
      case 'withdrawal': return <ArrowUpRight className="w-3.5 h-3.5 text-brand-orange" />;
      case 'bet': return <Gamepad2 className="w-3.5 h-3.5 text-brand-red" />;
      case 'win': return <Gift className="w-3.5 h-3.5 text-brand-green" />;
      default: return <Clock className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-border overflow-hidden">
      <div className="p-3 border-b border-dark-border"><h3 className="text-xs font-semibold text-gray-400">Transaction History</h3></div>
      <div className="max-h-72 overflow-y-auto">
        {all.length === 0 ? <div className="text-center py-8 text-gray-600 text-sm">No transactions yet</div> : (
          <div className="divide-y divide-dark-border/40">
            {all.map(tx => (
              <div key={tx.id} className="p-3 flex items-center gap-3 hover:bg-dark-900/30">
                <div className="w-7 h-7 rounded-full bg-dark-900 flex items-center justify-center flex-shrink-0">{getIcon(tx.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white capitalize">{tx.type}</span>
                    <span className={`text-xs font-bold font-mono ${tx.amount > 0 ? 'text-brand-green' : 'text-white'}`}>{tx.amount > 0 ? '+' : ''}{formatKES(Math.abs(tx.amount))}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-gray-500">{tx.createdAt}</span>
                    <div className="flex items-center gap-1">
                      {tx.status === 'completed' ? <CheckCircle className="w-2.5 h-2.5 text-green-400" /> : <Clock className="w-2.5 h-2.5 text-brand-orange" />}
                      <span className="text-[10px] text-gray-500 capitalize">{tx.status}</span>
                    </div>
                  </div>
                  {tx.reference && <span className="text-[9px] text-gray-600 font-mono">Ref: {tx.reference}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
