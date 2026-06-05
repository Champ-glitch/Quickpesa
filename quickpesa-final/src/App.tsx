import { useUIStore } from '@/stores/uiStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { Toast } from '@/components/common/Toast';
import { GamePage } from '@/pages/GamePage';
import { WalletPage } from '@/pages/WalletPage';
import { ProfilePage } from '@/pages/ProfilePage';

function App() {
  const { activeTab } = useUIStore();

  const renderPage = () => {
    switch (activeTab) {
      case 'game': return <GamePage />;
      case 'wallet': return <WalletPage />;
      case 'profile': return <ProfilePage />;
      default: return <GamePage />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="max-w-md mx-auto px-3 pt-3">{renderPage()}</main>
      <Footer />
      <MobileNav />
      <Toast />
    </div>
  );
}

export default App;
