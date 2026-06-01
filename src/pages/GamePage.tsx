import { CrashGraph } from '@/components/game/CrashGraph';
import { BetControls } from '@/components/game/BetControls';
import { RoundHistory } from '@/components/game/RoundHistory';
import { BetHistory } from '@/components/game/BetHistory';
import { LiveChat } from '@/components/game/LiveChat';
import { ProvablyFairModal } from '@/components/game/ProvablyFairModal';
import { useGameSocket } from '@/hooks/useGameSocket';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { Shield, LogIn } from 'lucide-react';

export const GamePage = () => {
  const { isAuthenticated } = useUserStore();
  const { toggleProvablyFair } = useUIStore();
  useGameSocket();

  return (
    <div className="space-y-3 pb-20">
      {/* Provably Fair badge */}
      <button
        onClick={toggleProvablyFair}
        className="w-full flex items-center justify-center gap-2 py-2 bg-qp-card border border-qp-border rounded-xl text-xs text-qp-muted hover:text-qp-primary transition-colors"
      >
        <Shield className="w-3.5 h-3.5" />
        <span>Provably Fair — Verify Every Round</span>
      </button>

      {/* Crash Graph */}
      <CrashGraph />

      {/* Bet Controls or Login Prompt */}
      {isAuthenticated ? (
        <BetControls />
      ) : (
        <div className="bg-qp-card rounded-xl border border-qp-border p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-qp-primary/10 rounded-full flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6 text-qp-primary" />
          </div>
          <p className="text-qp-muted text-sm">Login to place bets and win big!</p>
          <p className="text-xs text-qp-muted/60">Demo mode: Use the login button in the navbar</p>
        </div>
      )}

      {/* Round History */}
      <RoundHistory />

      {/* Bet History */}
      <BetHistory />

      {/* Live Chat */}
      <LiveChat />

      {/* Provably Fair Modal */}
      <ProvablyFairModal />
    </div>
  );
};
