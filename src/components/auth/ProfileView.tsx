import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { formatKES } from '@/utils/formatters';
import { Button } from '@/components/common/Button';
import { User, Wallet, Trophy, Settings, LogOut, Shield, Clock } from 'lucide-react';

export const ProfileView = () => {
  const { user, logout } = useUserStore();
  const { setActiveTab, setShowDepositModal, setShowWithdrawModal } = useUIStore();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 bg-qp-card rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-qp-muted" />
        </div>
        <p className="text-qp-muted">Please login to view your profile</p>
      </div>
    );
  }

  const stats = [
    { label: 'Balance', value: formatKES(user.balance), icon: Wallet, color: 'text-qp-primary' },
    { label: 'Total Wagered', value: formatKES(user.totalWagered), icon: Trophy, color: 'text-qp-accent' },
    { label: 'Total Won', value: formatKES(user.totalWon), icon: Trophy, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-4">
      {/* Profile header */}
      <div className="bg-qp-card rounded-xl border border-qp-border p-4 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-qp-primary to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-bold text-white">{user.username[0]}</span>
        </div>
        <h2 className="text-lg font-bold text-qp-text">{user.username}</h2>
        <p className="text-sm text-qp-muted">{user.phone}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            user.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {user.isVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-qp-card rounded-xl border border-qp-border p-3 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-xs text-qp-muted">{stat.label}</p>
              <p className="text-sm font-bold font-mono text-qp-text">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="primary" onClick={() => setShowDepositModal(true)}>
          <Wallet className="w-4 h-4 mr-2" />
          Deposit
        </Button>
        <Button variant="secondary" onClick={() => setShowWithdrawModal(true)}>
          <Wallet className="w-4 h-4 mr-2" />
          Withdraw
        </Button>
      </div>

      {/* Settings */}
      <div className="bg-qp-card rounded-xl border border-qp-border overflow-hidden">
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-qp-bg transition-colors text-left border-b border-qp-border/50">
          <Settings className="w-4 h-4 text-qp-muted" />
          <span className="text-sm text-qp-text">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-qp-bg transition-colors text-left border-b border-qp-border/50">
          <Shield className="w-4 h-4 text-qp-muted" />
          <span className="text-sm text-qp-text">Security</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-qp-bg transition-colors text-left border-b border-qp-border/50">
          <Clock className="w-4 h-4 text-qp-muted" />
          <span className="text-sm text-qp-text">Game History</span>
        </button>
        <button 
          onClick={() => { logout(); setActiveTab('game'); }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">Logout</span>
        </button>
      </div>
    </div>
  );
};
