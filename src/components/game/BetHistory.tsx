import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { formatKES, formatMultiplier } from '@/utils/formatters';
import { Trophy, User } from 'lucide-react';

type Tab = 'my' | 'all';

export const BetHistory = () => {
  const [tab, setTab] = useState<Tab>('my');
  const { myBets, activeBets } = useGameStore();
  const all = [...activeBets, ...myBets].slice(0, 20);
  const display = tab === 'my' ? myBets : all;

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-border overflow-hidden">
      <div className="flex border-b border-dark-border">
        <button onClick={() => setTab('my')}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === 'my' ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-500 hover:text-gray-300'}`}>
          <User className="w-3.5 h-3.5 inline mr-1" /> My Bets
        </button>
        <button onClick={() => setTab('all')}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === 'all' ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-500 hover:text-gray-300'}`}>
          <Trophy className="w-3.5 h-3.5 inline mr-1" /> All
        </button>
      </div>
      <div className="max-h-52 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-dark-900/50 sticky top-0">
            <tr className="text-gray-500">
              <th className="text-left py-1.5 px-2.5">User</th>
              <th className="text-right py-1.5 px-2.5">Bet</th>
              <th className="text-right py-1.5 px-2.5">@</th>
              <th className="text-right py-1.5 px-2.5">Profit</th>
            </tr>
          </thead>
          <tbody>
            {display.length === 0 && (
              <tr><td colSpan={4} className="text-center py-6 text-gray-600 text-xs">No bets yet</td></tr>
            )}
            {display.map(bet => (
              <tr key={bet.id} className={`border-b border-dark-border/40 ${bet.status === 'cashed_out' ? 'bg-green-500/5' : ''}`}>
                <td className="py-1.5 px-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-brand-green/20 flex items-center justify-center text-[10px] font-bold text-brand-green">{bet.username[0]}</div>
                    <span className="text-gray-300 text-[11px] truncate max-w-[70px]">{bet.username}</span>
                  </div>
                </td>
                <td className="text-right py-1.5 px-2.5 font-mono text-gray-300 text-[11px]">{formatKES(bet.amount)}</td>
                <td className="text-right py-1.5 px-2.5">
                  {bet.cashoutMultiplier ? <span className="font-mono font-bold text-brand-green text-[11px]">{formatMultiplier(bet.cashoutMultiplier)}</span> : <span className="text-gray-600">—</span>}
                </td>
                <td className="text-right py-1.5 px-2.5">
                  {bet.profit !== null ? <span className={`font-mono font-bold text-[11px] ${bet.profit > 0 ? 'text-brand-green' : 'text-brand-red'}`}>{bet.profit > 0 ? '+' : ''}{formatKES(bet.profit)}</span> : <span className="text-gray-600">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
