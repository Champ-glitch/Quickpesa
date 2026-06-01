import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { formatKES } from '@/utils/formatters';
import { LoginModal } from '@/components/auth/LoginModal';
import { Wallet, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { user, isAuthenticated } = useUserStore();
  const { setShowDepositModal, toggleProvablyFair } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-dark-900/90 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-md mx-auto px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-brand-green to-emerald-700 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">QP</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">QuickPesa</h1>
            <p className="text-[9px] text-gray-500 -mt-0.5">Aviator</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <button onClick={() => setShowDepositModal(true)}
                className="flex items-center gap-1 bg-brand-green/10 border border-brand-green/20 rounded-lg px-2.5 py-1">
                <Wallet className="w-3 h-3 text-brand-green" />
                <span className="text-xs font-bold font-mono text-brand-green">{formatKES(user.balance)}</span>
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="w-7 h-7 bg-dark-800 border border-dark-border rounded-lg flex items-center justify-center">
                {menuOpen ? <X className="w-3.5 h-3.5 text-white" /> : <Menu className="w-3.5 h-3.5 text-white" />}
              </button>
            </>
          ) : (
            <LoginModal />
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-dark-800 border-b border-dark-border p-3 space-y-1 shadow-xl">
          <button onClick={() => { toggleProvablyFair(); setMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-dark-900 transition-colors text-left">
            <Shield className="w-4 h-4 text-brand-green" /><span className="text-sm text-white">Provably Fair</span>
          </button>
          <p className="text-[10px] text-gray-500 px-3 pt-1">Logged in as {user?.username}</p>
        </div>
      )}
    </nav>
  );
};
