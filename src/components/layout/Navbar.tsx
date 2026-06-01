import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { formatKES } from '@/utils/formatters';
import { LoginModal } from '@/components/auth/LoginModal';
import { Wallet, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { user, isAuthenticated } = useUserStore();
  const { setShowDepositModal, toggleProvablyFair } = useUIStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-qp-bg/80 backdrop-blur-md border-b border-qp-border">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-qp-primary to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">QP</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-qp-text leading-tight">QuickPesa</h1>
            <p className="text-[10px] text-qp-muted -mt-0.5">Crash Game</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex items-center gap-1.5 bg-qp-primary/10 border border-qp-primary/20 rounded-lg px-3 py-1.5"
              >
                <Wallet className="w-3.5 h-3.5 text-qp-primary" />
                <span className="text-sm font-bold font-mono text-qp-primary">
                  {formatKES(user.balance)}
                </span>
              </button>

              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-8 h-8 bg-qp-card border border-qp-border rounded-lg flex items-center justify-center"
              >
                {showMenu ? <X className="w-4 h-4 text-qp-text" /> : <Menu className="w-4 h-4 text-qp-text" />}
              </button>
            </>
          ) : (
            <LoginModal />
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {showMenu && (
        <div className="absolute top-full left-0 right-0 bg-qp-card border-b border-qp-border p-4 space-y-2 shadow-xl">
          <button
            onClick={() => { toggleProvablyFair(); setShowMenu(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-qp-bg transition-colors text-left"
          >
            <Shield className="w-4 h-4 text-qp-primary" />
            <span className="text-sm text-qp-text">Provably Fair</span>
          </button>
          <div className="pt-2 border-t border-qp-border">
            <p className="text-xs text-qp-muted px-3">Logged in as {user?.username}</p>
          </div>
        </div>
      )}
    </nav>
  );
};
