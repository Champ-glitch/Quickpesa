import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { formatKES, formatMultiplier } from '@/utils/formatters';
import { Trophy, User } from 'lucide-react';

type TabType = 'my' | 'all';

export const BetHistory = () => {
  const [activeTab, setActiveTab] = useState<TabType>('my');
  const { myBets, activeBets } = useGameStore();

  const allBets = [...activeBets, ...myBets].slice(0, 20);
  const displayBets = activeTab === 'my' ? myBets : allBets;

  return (
    <div className="bg-qp-card rounded-xl border border-qp-border overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-qp-border">
        <button
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'my'
              ? 'text-qp-primary border-b-2 border-qp-primary'
              : 'text-qp-muted hover:text-qp-text'
          }`}
        >
          <User className="w-4 h-4 inline mr-1.5" />
          My Bets
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'text-qp-primary border-b-2 border-qp-primary'
              : 'text-qp-muted hover:text-qp-text'
          }`}
        >
          <Trophy className="w-4 h-4 inline mr-1.5" />
          All Players
        </button>
      </div>

      {/* Table */}
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-qp-bg/50 sticky top-0">
            <tr className="text-qp-muted text-xs">
              <th className="text-left py-2 px-3">User</th>
              <th className="text-right py-2 px-3">Bet</th>
              <th className="text-right py-2 px-3">@</th>
              <th className="text-right py-2 px-3">Profit</th>
            </tr>
          </thead>
          <tbody>
            {displayBets.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-qp-muted text-xs">
                  No bets yet
                </td>
              </tr>
            )}
            {displayBets.map((bet) => (
              <tr
                key={bet.id}
                className={`border-b border-qp-border/50 transition-colors ${
                  bet.status === 'cashed_out' ? 'bg-green-500/5' : ''
                }`}
              >
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-qp-primary/20 flex items-center justify-center text-xs font-bold text-qp-primary">
                      {bet.username[0]}
                    </div>
                    <span className="text-qp-text text-xs truncate max-w-[80px]">
                      {bet.username}
                    </span>
                  </div>
                </td>
                <td className="text-right py-2 px-3 font-mono text-qp-text">
                  {formatKES(bet.amount)}
                </td>
                <td className="text-right py-2 px-3">
                  {bet.cashoutMultiplier ? (
                    <span className="font-mono font-bold text-qp-primary">
                      {formatMultiplier(bet.cashoutMultiplier)}
                    </span>
                  ) : (
                    <span className="text-qp-muted">—</span>
                  )}
                </td>
                <td className="text-right py-2 px-3">
                  {bet.profit !== null ? (
                    <span className={`font-mono font-bold ${
                      bet.profit > 0 ? 'text-qp-primary' : 'text-red-400'
                    }`}>
                      {bet.profit > 0 ? '+' : ''}{formatKES(bet.profit)}
                    </span>
                  ) : (
                    <span className="text-qp-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
