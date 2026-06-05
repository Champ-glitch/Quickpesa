import { useGameStore } from '@/stores/gameStore';
import { formatMultiplier, getCrashBadgeColor } from '@/utils/formatters';
import { History } from 'lucide-react';

export const RoundHistory = () => {
  const { roundHistory } = useGameStore();
  return (
    <div className="bg-dark-800 rounded-xl border border-dark-border p-3">
      <div className="flex items-center gap-2 mb-2">
        <History className="w-3.5 h-3.5 text-gray-500" />
        <h3 className="text-xs font-semibold text-gray-400">History</h3>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {roundHistory.length === 0 && <p className="text-xs text-gray-600 py-1">No rounds yet</p>}
        {roundHistory.map(r => (
          <button key={r.id}
            className={`flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-bold font-mono border transition-all hover:scale-105 ${getCrashBadgeColor(r.crashPoint)}`}>
            {formatMultiplier(r.crashPoint)}
          </button>
        ))}
      </div>
    </div>
  );
};
