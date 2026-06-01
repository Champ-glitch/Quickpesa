import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';
import { useGameSocket } from '@/hooks/useGameSocket';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/common/Button';
import { GAME_CONFIG } from '@/utils/constants';
import { formatKES } from '@/utils/formatters';
import { Zap, Lock } from 'lucide-react';

interface BetPanelProps {
  panelId: 'bet1' | 'bet2';
}

const BetPanel = ({ panelId }: BetPanelProps) => {
  const [amount, setAmount] = useState(GAME_CONFIG.DEFAULT_BET);
  const [autoCashout, setAutoCashout] = useState<number | null>(null);
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);

  const { currentRound, myBets, activeBets, countdown } = useGameStore();
  const { user } = useUserStore();
  const { placeBet, cashOut } = useGameSocket();
  const { showToast } = useUIStore();

  const isBettingPhase = currentRound?.state === 'betting';
  const isFlyingPhase = currentRound?.state === 'flying';
  const myActiveBet = activeBets.find(b => b.id.includes(panelId));
  const myPlacedBet = myBets.find(b => b.id.includes(panelId));

  const quickAmounts = [50, 100, 200, 500, 1000, 2000];
  const autoOptions = [1.5, 2, 3, 5, 10];

  const handlePlaceBet = () => {
    if (!user) {
      showToast('Please login first', 'error');
      return;
    }
    if (amount < GAME_CONFIG.MIN_BET) {
      showToast(`Minimum bet is ${formatKES(GAME_CONFIG.MIN_BET)}`, 'error');
      return;
    }
    if (amount > GAME_CONFIG.MAX_BET) {
      showToast(`Maximum bet is ${formatKES(GAME_CONFIG.MAX_BET)}`, 'error');
      return;
    }
    if (user.balance < amount) {
      showToast('Insufficient balance', 'error');
      return;
    }

    placeBet(amount, isAutoEnabled ? autoCashout || undefined : undefined);
  };

  const handleCashout = () => {
    if (myActiveBet) {
      cashOut(myActiveBet.id, amount);
    }
  };

  return (
    <div className="bg-qp-card rounded-xl border border-qp-border p-3 space-y-3">
      {/* Amount input */}
      <div className="relative">
        <div className="flex items-center bg-qp-bg rounded-lg border border-qp-border overflow-hidden">
          <button
            onClick={() => setAmount(Math.max(GAME_CONFIG.MIN_BET, amount - 10))}
            className="px-3 py-2.5 text-qp-muted hover:text-qp-text transition-colors"
          >
            −
          </button>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="flex-1 bg-transparent text-center text-lg font-bold font-mono text-qp-text focus:outline-none"
            min={GAME_CONFIG.MIN_BET}
            max={GAME_CONFIG.MAX_BET}
          />
          <button
            onClick={() => setAmount(Math.min(GAME_CONFIG.MAX_BET, amount + 10))}
            className="px-3 py-2.5 text-qp-muted hover:text-qp-text transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Quick amounts */}
      <div className="grid grid-cols-3 gap-1.5">
        {quickAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => setAmount(amt)}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
              amount === amt
                ? 'bg-qp-primary/20 text-qp-primary border border-qp-primary/30'
                : 'bg-qp-bg text-qp-muted hover:text-qp-text border border-qp-border'
            }`}
          >
            {formatKES(amt)}
          </button>
        ))}
      </div>

      {/* Auto cashout */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsAutoEnabled(!isAutoEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isAutoEnabled
              ? 'bg-qp-accent/20 text-qp-accent border border-qp-accent/30'
              : 'bg-qp-bg text-qp-muted border border-qp-border'
          }`}
        >
          <Zap className="w-3 h-3" />
          Auto
        </button>
        {isAutoEnabled && (
          <div className="flex gap-1">
            {autoOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setAutoCashout(opt)}
                className={`px-2 py-1 rounded text-xs font-mono ${
                  autoCashout === opt
                    ? 'bg-qp-accent/20 text-qp-accent'
                    : 'bg-qp-bg text-qp-muted'
                }`}
              >
                {opt}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action button */}
      {isBettingPhase && !myPlacedBet && (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handlePlaceBet}
        >
          PLACE BET
        </Button>
      )}

      {isBettingPhase && myPlacedBet && (
        <Button variant="secondary" size="lg" fullWidth disabled>
          <Lock className="w-4 h-4 mr-2" />
          BET LOCKED
        </Button>
      )}

      {isFlyingPhase && myActiveBet && (
        <Button
          variant="danger"
          size="lg"
          fullWidth
          onClick={handleCashout}
          className="animate-pulse-fast"
        >
          CASH OUT @ {currentRound?.currentMultiplier?.toFixed(2)}x
        </Button>
      )}

      {isFlyingPhase && !myActiveBet && (
        <Button variant="ghost" size="lg" fullWidth disabled>
          ROUND IN PROGRESS
        </Button>
      )}

      {currentRound?.state === 'crashed' && (
        <Button variant="secondary" size="lg" fullWidth disabled>
          ROUND ENDED
        </Button>
      )}
    </div>
  );
};

export const BetControls = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <BetPanel panelId="bet1" />
      <BetPanel panelId="bet2" />
    </div>
  );
};
