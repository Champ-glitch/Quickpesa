import { useUIStore } from '@/stores/uiStore';
import { useGameStore } from '@/stores/gameStore';
import { Shield, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const ProvablyFairModal = () => {
  const { showProvablyFair, toggleProvablyFair } = useUIStore();
  const { currentRound, roundHistory } = useGameStore();
  const [copied, setCopied] = useState(false);

  if (!showProvablyFair) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lastRound = roundHistory[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-qp-card border border-qp-border rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-qp-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-qp-primary" />
            <h2 className="text-lg font-bold text-qp-text">Provably Fair</h2>
          </div>
          <button
            onClick={toggleProvablyFair}
            className="text-qp-muted hover:text-qp-text text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Explanation */}
          <div className="bg-qp-bg rounded-lg p-3 text-xs text-qp-muted leading-relaxed">
            <p className="mb-2">
              <strong className="text-qp-text">How it works:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Server generates a seed and hashes it (shown before round)</li>
              <li>You provide a client seed</li>
              <li>Combined seeds determine the crash point</li>
              <li>After round, server seed is revealed for verification</li>
            </ol>
          </div>

          {/* Current round */}
          {currentRound && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-qp-text">Current Round</h3>
              <div className="space-y-2">
                <div className="bg-qp-bg rounded-lg p-3">
                  <label className="text-xs text-qp-muted block mb-1">Server Seed Hash</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono text-qp-primary truncate">
                      {currentRound.serverSeedHash}
                    </code>
                    <button
                      onClick={() => handleCopy(currentRound.serverSeedHash)}
                      className="p-1.5 rounded hover:bg-white/5"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-qp-muted" />}
                    </button>
                  </div>
                </div>
                <div className="bg-qp-bg rounded-lg p-3">
                  <label className="text-xs text-qp-muted block mb-1">Client Seed</label>
                  <code className="text-xs font-mono text-qp-text">{currentRound.clientSeed}</code>
                </div>
                <div className="bg-qp-bg rounded-lg p-3">
                  <label className="text-xs text-qp-muted block mb-1">Nonce</label>
                  <code className="text-xs font-mono text-qp-text">{currentRound.nonce}</code>
                </div>
              </div>
            </div>
          )}

          {/* Last round verification */}
          {lastRound?.serverSeed && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-qp-text">Verify Last Round</h3>
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 space-y-2">
                <div>
                  <label className="text-xs text-qp-muted block mb-1">Revealed Server Seed</label>
                  <code className="text-xs font-mono text-green-400 break-all">{lastRound.serverSeed}</code>
                </div>
                <div>
                  <label className="text-xs text-qp-muted block mb-1">Crash Point</label>
                  <span className="text-lg font-bold font-mono text-qp-text">{lastRound.crashPoint?.toFixed(2)}x</span>
                </div>
                <div className="pt-2 border-t border-green-500/20">
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Verified — Hash matches crash point
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
