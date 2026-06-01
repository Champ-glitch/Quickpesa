import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';
import { useGameSocket } from '@/hooks/useGameSocket';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/common/Button';
import { GAME_CONFIG } from '@/utils/constants';
import { formatKES } from '@/utils/formatters';
import { Zap, Lock } from 'lucide-react';

interface BetPanelProps { panelId: string; }

const BetPanel = ({ panelId }: BetPanelProps) => {
  const [amount, setAmount] = useState<number>(GAME_CONFIG.DEFAULT_BET);
  const [autoCashout, setAutoCashout] = useState<number | null>(null);
  const [isAuto, setIsAuto] = useState(false);
  const { currentRound, myBets, activeBets } = useGameStore();
  const { user } = useUserStore();
  const { placeBet, cashOut } = useGameSocket();
  const { showToast } = useUIStore();

  const isBetting = currentRound?.state === 'betting';
  const isFlying = currentRound?.state === 'flying';
  const myActive = activeBets.find(b => b.id.includes(panelId));
  const myPlaced = myBets.find(b => b.id.includes(panelId));

  const quickAmts = [50, 100, 200, 500, 1000];
  const autoOpts = [1.5, 2, 3, 5, 10];

  const handlePlace = () => {
    if (!user) { showToast('Login to play', 'error'); return; }
    if (amount < GAME_CONFIG.MIN_BET) { showToast(`Min bet ${formatKES(GAME_CONFIG.MIN_BET)}`, 'error'); return; }
    if (amount > GAME_CONFIG.MAX_BET) { showToast(`Max bet ${formatKES(GAME_CONFIG.MAX_BET)}`, 'error'); return; }
    if (user.balance < amount) { showToast('Insufficient balance', 'error'); return; }
    placeBet(amount, isAuto ? autoCashout || undefined : undefined);
  };

  const handleCashout = () => { if (myActive) cashOut(myActive.id, amount); };

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-border p-2.5 space-y-2">
      {/* Amount input - FIXED: proper sizing */}
      <div className="flex items-center bg-dark-900 rounded-lg border border-dark-border overflow-hidden h-11">
        <button 
          onClick={() => setAmount(Math.max(10, amount - 10))} 
          className="px-2.5 h-full text-gray-500 hover:text-white hover:bg-dark-700 transition-colors text-lg font-bold flex-shrink-0"
        >
          −
        </button>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))}
          className="flex-1 min-w-0 bg-transparent text-center text-base font-bold font-mono text-white focus:outline-none px-1 py-2"
          min={10}
        />
        <button 
          onClick={() => setAmount(Math.min(100000, amount + 10))} 
          className="px-2.5 h-full text-gray-500 hover:text-white hover:bg-dark-700 transition-colors text-lg font-bold flex-shrink-0"
        >
          +
        </button>
      </div>

      {/* Quick amounts */}
      <div className="grid grid-cols-5 gap-1">
        {quickAmts.map(amt => (
          <button key={amt} onClick={() => setAmount(amt)}
            className={`py-1.5 rounded-md text-[10px] font-semibold transition-all ${
              amount === amt ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' : 'bg-dark-900 text-gray-500 border border-dark-border hover:text-gray-300'
            }`}>
            {amt}
          </button>
        ))}
      </div>

      {/* Auto cashout */}
      <div className="flex items-center gap-1.5">
        <button onClick={() => setIsAuto(!isAuto)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
            isAuto ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30' : 'bg-dark-900 text-gray-500 border border-dark-border'
          }`}>
          <Zap className="w-2.5 h-2.5" /> Auto
        </button>
        {isAuto && (
          <div className="flex gap-0.5">
            {autoOpts.map(opt => (
              <button key={opt} onClick={() => setAutoCashout(opt)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${autoCashout === opt ? 'bg-brand-orange/20 text-brand-orange' : 'bg-dark-900 text-gray-500'}`}>
                {opt}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action button */}
      {isBetting && !myPlaced && (
        <Button variant="primary" size="lg" fullWidth onClick={handlePlace} className="h-12 text-sm">BET</Button>
      )}
      {isBetting && myPlaced && (
        <Button variant="secondary" size="lg" fullWidth disabled className="h-12 text-sm"><Lock className="w-3.5 h-3.5 mr-1" /> LOCKED</Button>
      )}
      {isFlying && myActive && (
        <Button variant="danger" size="lg" fullWidth onClick={handleCashout} className="h-12 text-sm animate-pulse-fast">
          CASH OUT {currentRound?.currentMultiplier?.toFixed(2)}x
        </Button>
      )}
      {isFlying && !myActive && (
        <Button variant="ghost" size="lg" fullWidth disabled className="h-12 text-sm">ROUND IN PROGRESS</Button>
      )}
      {currentRound?.state === 'crashed' && (
        <Button variant="secondary" size="lg" fullWidth disabled className="h-12 text-sm">ROUND ENDED</Button>
      )}
    </div>
  );
};

export const BetControls = () => (
  <div className="grid grid-cols-2 gap-2">
    <BetPanel panelId="bet1" />
    <BetPanel panelId="bet2" />
  </div>
);
