import { useUIStore } from '@/stores/uiStore';
import { Gamepad2, Wallet, User } from 'lucide-react';

export const MobileNav = () => {
  const { activeTab, setActiveTab } = useUIStore();
  const tabs = [
    { id: 'game' as const, label: 'Game', icon: Gamepad2 },
    { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-md border-t border-dark-border" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-5 transition-colors ${isActive ? 'text-brand-green' : 'text-gray-600'}`}>
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium mt-0.5">{tab.label}</span>
              {isActive && <span className="w-1 h-1 bg-brand-green rounded-full mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
