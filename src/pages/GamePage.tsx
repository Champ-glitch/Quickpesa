import { CrashGraph } from '@/components/game/CrashGraph';
import { BetControls } from '@/components/game/BetControls';
import { RoundHistory } from '@/components/game/RoundHistory';
import { BetHistory } from '@/components/game/BetHistory';
import { LiveChat } from '@/components/game/LiveChat';
import { ProvablyFairModal } from '@/components/game/ProvablyFairModal';
import { useGameSocket } from '@/hooks/useGameSocket';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { LoginModal } from '@/components/auth/LoginModal';
import { Shield, Users } from 'lucide-react';

export const GamePage = () => {
  const { isAuthenticated } = useUserStore();
  const { toggleProvablyFair } = useUIStore();
  useGameSocket();

  return (
    <div className="space-y-2 pb-20">
      {/* Provably Fair badge */}
      <button onClick={toggleProvablyFair}
        className="w-full flex items-center justify-center gap-2 py-1.5 bg-dark-800 border border-dark-border rounded-lg text-[10px] text-gray-500 hover:text-brand-green transition-colors">
        <Shield className="w-3 h-3" /><span>Provably Fair</span>
      </button>

      {/* Crash Graph */}
      <CrashGraph />

      {/* Bet Controls */}
      {isAuthenticated ? <BetControls /> : (
        <div className="bg-dark-800 rounded-xl border border-dark-border p-5 text-center space-y-3">
          <Users className="w-8 h-8 text-gray-600 mx-auto" />
          <p className="text-gray-500 text-sm">Login to place bets and win!</p>
          <LoginModal />
        </div>
      )}

      <RoundHistory />
      <BetHistory />
      <LiveChat />
      <ProvablyFairModal />
    </div>
  );
};
