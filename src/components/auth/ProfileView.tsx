import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { formatKES } from '@/utils/formatters';
import { Button } from '@/components/common/Button';
import { User, Wallet, Trophy, Settings, LogOut, Shield, Clock, Phone, Mail } from 'lucide-react';

export const ProfileView = () => {
  const { user, logout } = useUserStore();
  const { setActiveTab, setShowDepositModal, setShowWithdrawModal } = useUIStore();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center"><User className="w-8 h-8 text-gray-600" /></div>
        <p className="text-gray-500 text-sm">Login to view your profile</p>
      </div>
    );
  }

  const net = user.totalWon - user.totalWagered;

  return (
    <div className="space-y-4">
      {/* Profile header */}
      <div className="bg-dark-800 rounded-xl border border-dark-border p-5 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-green to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-bold text-white">{user.username[0]}</span>
        </div>
        <h2 className="text-lg font-bold text-white">{user.username}</h2>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-[11px] text-gray-500"><Phone className="w-3 h-3" /> {user.phone}</span>
          <span className="flex items-center gap-1 text-[11px] text-gray-500"><Mail className="w-3 h-3" /> {user.email}</span>
        </div>
        <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${user.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
          {user.isVerified ? 'Verified Account' : 'Unverified'}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Balance', value: formatKES(user.balance), icon: Wallet, color: 'text-brand-green' },
          { label: 'Wagered', value: formatKES(user.totalWagered), icon: Trophy, color: 'text-brand-orange' },
          { label: 'Won', value: formatKES(user.totalWon), icon: Trophy, color: 'text-green-400' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-dark-800 rounded-xl border border-dark-border p-3 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-[10px] text-gray-500">{stat.label}</p>
              <p className="text-sm font-bold font-mono text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Net profit */}
      <div className={`bg-dark-800 rounded-xl border border-dark-border p-3 flex items-center justify-between ${net >= 0 ? 'border-green-500/20' : 'border-red-500/20'}`}>
        <span className="text-xs text-gray-400">Net Profit</span>
        <span className={`text-sm font-bold font-mono ${net >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>{net >= 0 ? '+' : ''}{formatKES(net)}</span>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="primary" onClick={() => setShowDepositModal(true)}><Wallet className="w-4 h-4 mr-1.5" /> Deposit</Button>
        <Button variant="secondary" onClick={() => setShowWithdrawModal(true)}><Wallet className="w-4 h-4 mr-1.5" /> Withdraw</Button>
      </div>

      {/* Settings */}
      <div className="bg-dark-800 rounded-xl border border-dark-border overflow-hidden">
        {[
          { icon: Settings, label: 'Account Settings', color: 'text-gray-500' },
          { icon: Shield, label: 'Security', color: 'text-gray-500' },
          { icon: Clock, label: 'Game History', color: 'text-gray-500' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-900 transition-colors text-left border-b border-dark-border/40 last:border-0">
              <Icon className={`w-4 h-4 ${item.color}`} /><span className="text-sm text-gray-300">{item.label}</span>
            </button>
          );
        })}
        <button onClick={() => { logout(); setActiveTab('game'); }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-left">
          <LogOut className="w-4 h-4 text-red-400" /><span className="text-sm text-red-400">Logout</span>
        </button>
      </div>
    </div>
  );
};
