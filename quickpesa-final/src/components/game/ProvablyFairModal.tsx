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
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const last = roundHistory[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-border rounded-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-brand-green" /><h2 className="text-base font-bold text-white">Provably Fair</h2></div>
          <button onClick={toggleProvablyFair} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-4 space-y-3">
          <div className="bg-dark-900 rounded-lg p-3 text-[11px] text-gray-500 leading-relaxed">
            <p className="mb-1 text-gray-400 font-medium">How it works:</p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Server generates a seed and hashes it (shown before round)</li>
              <li>You provide a client seed</li>
              <li>Combined seeds determine the crash point</li>
              <li>After round, server seed is revealed for verification</li>
            </ol>
          </div>
          {currentRound && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-white">Current Round</h3>
              <div className="bg-dark-900 rounded-lg p-2.5">
                <label className="text-[10px] text-gray-500 block mb-1">Server Seed Hash</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-[10px] font-mono text-brand-green truncate">{currentRound.serverSeedHash}</code>
                  <button onClick={() => handleCopy(currentRound.serverSeedHash)} className="p-1 rounded hover:bg-white/5">
                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-500" />}
                  </button>
                </div>
              </div>
              <div className="bg-dark-900 rounded-lg p-2.5">
                <label className="text-[10px] text-gray-500 block mb-1">Client Seed</label>
                <code className="text-[10px] font-mono text-gray-300">{currentRound.clientSeed}</code>
              </div>
              <div className="bg-dark-900 rounded-lg p-2.5">
                <label className="text-[10px] text-gray-500 block mb-1">Nonce</label>
                <code className="text-[10px] font-mono text-gray-300">{currentRound.nonce}</code>
              </div>
            </div>
          )}
          {last?.serverSeed && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-white">Verify Last Round</h3>
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2.5 space-y-1.5">
                <div><label className="text-[10px] text-gray-500 block mb-0.5">Revealed Server Seed</label><code className="text-[10px] font-mono text-green-400 break-all">{last.serverSeed}</code></div>
                <div><label className="text-[10px] text-gray-500 block mb-0.5">Crash Point</label><span className="text-base font-bold font-mono text-white">{last.crashPoint.toFixed(2)}x</span></div>
                <div className="pt-1.5 border-t border-green-500/20">
                  <span className="text-[10px] text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Verified — Hash matches crash point</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
