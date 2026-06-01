import { useGameStore } from '@/stores/gameStore';
import { formatMultiplier, getCrashPointColor } from '@/utils/formatters';
import { History } from 'lucide-react';

export const RoundHistory = () => {
  const { roundHistory } = useGameStore();

  return (
    <div className="bg-qp-card rounded-xl border border-qp-border p-3">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-4 h-4 text-qp-muted" />
        <h3 className="text-sm font-semibold text-qp-text">Round History</h3>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {roundHistory.length === 0 && (
          <p className="text-xs text-qp-muted py-2">No rounds yet</p>
        )}
        {roundHistory.map((round) => (
          <button
            key={round.id}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all hover:scale-105 ${
              getCrashPointColor(round.crashPoint || 1)
            }`}
          >
            {formatMultiplier(round.crashPoint || 1)}
          </button>
        ))}
      </div>
    </div>
  );
};
