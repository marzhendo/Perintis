import React from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import FuturisticBackground from './components/FuturisticBackground';
import ErrorBoundary from './components/ErrorBoundary';
import MobileProfileDropdown from './components/MobileProfileDropdown';
import { ToastProvider } from './components/Toast';
import useTabRouting from './hooks/useTabRouting';
import useUser from './hooks/useUser';
import useAppData from './hooks/useAppData';
import { fetchApi } from './services/apiClient';
import logo from './assets/images/Perintis.svg';
import { Bell } from 'lucide-react';
import LandingPage from './views/LandingPage';
import HargaPangan from './views/HargaPangan';
import Validator from './views/Validator';
import Calculator from './views/Calculator';
import ForumTerbuka from './views/ForumTerbuka';
import ROIProjections from './views/ROIProjections';
import Panduan from './views/Panduan';
import LokasiPasar from './views/LokasiPasar';
import Notifikasi from './views/Notifikasi';
import ProfilSaya from './views/ProfilSaya';
import KebijakanPrivasi from './views/KebijakanPrivasi';
import KetentuanLayanan from './views/KetentuanLayanan';
import SertifikasiEkspor from './views/SertifikasiEkspor';
import AICopywriter from './views/AICopywriter';

export default function App() {
  const { activeTab, handleTabChange } = useTabRouting();
  const { user, login, logout } = useUser();
  const { validationData, setValidationData, calculationData, setCalculationData, selectedRegion, setSelectedRegion } = useAppData();
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  // Auto-logout on token expiration
  React.useEffect(() => {
    const handleAuthExpired = () => {
      logout();
      setAuthModalOpen(true);
    };
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, [logout]);

  // Fetch unread count when user changes or notification tab is opened
  React.useEffect(() => {
    if (user) {
      fetchApi('/api/notifications/unread-count')
        .then(res => setUnreadCount(res.count))
        .catch(() => {});
    } else {
      setUnreadCount(0);
    }
  }, [user, activeTab]);

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <LandingPage setActiveTab={handleTabChange} />;
      case 'harga': return <HargaPangan region={selectedRegion} />;
      case 'lokasi': return <LokasiPasar setSelectedRegion={setSelectedRegion} onNavigate={handleTabChange} />;
      case 'validator': return <Validator validationData={validationData} setValidationData={setValidationData} />;
      case 'calculator': return <Calculator calculationData={calculationData} setCalculationData={setCalculationData} />;
      case 'forum': return <ForumTerbuka user={user} onOpenAuth={() => setAuthModalOpen(true)} />;
      case 'roi': return <ROIProjections calculationData={calculationData} />;
      case 'guide': case 'bantuan': return <Panduan />;
      case 'notifikasi': return <Notifikasi user={user} onOpenAuth={() => setAuthModalOpen(true)} />;
      case 'profile': return <ProfilSaya user={user} onLogout={logout} onOpenAuth={() => setAuthModalOpen(true)} />;
      case 'privacy': return <KebijakanPrivasi />;
      case 'terms': return <KetentuanLayanan />;
      case 'legalitas': return <SertifikasiEkspor />;
      case 'marketing': return <AICopywriter />;
      default: return <LandingPage setActiveTab={handleTabChange} />;
    }
  };

  return (
    <ErrorBoundary>
    <ToastProvider>
    <div className="min-h-screen bg-[#FAF6EE] text-[#171C38] antialiased selection:bg-[#FF6B1A]/20 selection:text-[#171C38] relative overflow-x-hidden flex flex-col justify-between">
      <FuturisticBackground />
      <Header activeTab={activeTab} setActiveTab={handleTabChange} user={user} unreadCount={unreadCount} onOpenAuth={() => setAuthModalOpen(true)} onLogout={logout} />
      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E8E8] px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <button onClick={() => handleTabChange('home')} className="hover:opacity-80 active:scale-95 transition-all">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-white shadow-sm">
            <img src={logo} alt="Perintis" className="w-full h-full object-contain" />
          </div>
        </button>
        <div className="flex items-center gap-1.5 relative">
          <button onClick={() => handleTabChange('notifikasi')} className={`relative p-1.5 rounded-full transition-all ${activeTab === 'notifikasi' ? 'text-[#FF6B1A] bg-[#FF6B1A]/10' : 'text-[#171C38]/60 hover:text-[#171C38] hover:bg-[#171C38]/10'}`}>
            <Bell className="w-4.5 h-4.5" />
            {user && unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#FF6B1A] text-[#171C38] text-[7px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {user ? (
            <MobileProfileDropdown user={user} onLogout={logout} onNavigate={handleTabChange} />
          ) : (
            <button onClick={() => setAuthModalOpen(true)} className="text-[10px] font-bold bg-[#FF6B1A] text-white px-3.5 py-1.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Masuk
            </button>
          )}
        </div>
      </header>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF6EE] to-transparent pointer-events-none z-40" />

      <main className="flex-grow w-full px-4 sm:px-6 lg:px-10 pt-20 lg:pt-32 pb-32 lg:pb-16 max-w-[1200px] mx-auto box-border">
        <div key={activeTab} className="animate-fade-in">
          {renderView()}
        </div>
      </main>

      <Footer setActiveTab={handleTabChange} />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onLoginSuccess={login} />
    </div>
    </ToastProvider>
    </ErrorBoundary>
  );
}
