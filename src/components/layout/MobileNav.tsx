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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-qp-bg/90 backdrop-blur-md border-t border-qp-border safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 transition-colors ${
                isActive ? 'text-qp-primary' : 'text-qp-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-qp-primary rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
