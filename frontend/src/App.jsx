import React, { Suspense, lazy } from 'react';
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
import { Bell, Sun, Moon } from 'lucide-react';

// Lazy load views for optimal code-splitting and performance
const LandingPage = lazy(() => import('./views/LandingPage'));
const HargaPangan = lazy(() => import('./views/HargaPangan'));
const Validator = lazy(() => import('./views/Validator'));
const Calculator = lazy(() => import('./views/Calculator'));
const ForumTerbuka = lazy(() => import('./views/ForumTerbuka'));
const ROIProjections = lazy(() => import('./views/ROIProjections'));
const Panduan = lazy(() => import('./views/Panduan'));
const LokasiPasar = lazy(() => import('./views/LokasiPasar'));
const Notifikasi = lazy(() => import('./views/Notifikasi'));
const ProfilSaya = lazy(() => import('./views/ProfilSaya'));
const KebijakanPrivasi = lazy(() => import('./views/KebijakanPrivasi'));
const KetentuanLayanan = lazy(() => import('./views/KetentuanLayanan'));
const SertifikasiEkspor = lazy(() => import('./views/SertifikasiEkspor'));
const AICopywriter = lazy(() => import('./views/AICopywriter'));
const BlogUMKM = lazy(() => import('./views/BlogUMKM'));


export default function App() {
  const { activeTab, handleTabChange } = useTabRouting();
  const { user, login, logout } = useUser();
  const { validationData, setValidationData, calculationData, setCalculationData, selectedRegion, setSelectedRegion } = useAppData();
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('perintis_theme') || 'light';
  });

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('perintis_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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
      case 'validator': return <Validator validationData={validationData} setValidationData={setValidationData} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />;
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
      case 'blog': return <BlogUMKM user={user} onOpenAuth={() => setAuthModalOpen(true)} />;
      default: return <LandingPage setActiveTab={handleTabChange} />;
    }
  };

  return (
    <ErrorBoundary>
    <ToastProvider>
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text-primary)] antialiased selection:bg-[#FF6B1A]/20 selection:text-[#171C38] relative overflow-x-hidden flex flex-col transition-colors duration-300">
      <FuturisticBackground />
      <Header activeTab={activeTab} setActiveTab={handleTabChange} user={user} unreadCount={unreadCount} onOpenAuth={() => setAuthModalOpen(true)} onLogout={logout} theme={theme} toggleTheme={toggleTheme} />
      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

      <header className="lg:hidden fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[500px] rounded-[24px] bg-white/95 backdrop-blur-md border-2 border-[#171C38] shadow-xl z-50 flex items-center justify-between px-4 py-2.5 transition-all duration-300">
        <button onClick={() => handleTabChange('home')} className="hover:opacity-80 active:scale-95 transition-all cursor-pointer">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-white shadow-sm border border-[#171C38]/10">
            <img src={logo} alt="Perintis" className="w-full h-full object-contain" />
          </div>
        </button>
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full transition-all text-[#171C38]/60 hover:text-[#171C38] dark:text-[#FAF6EE]/60 dark:hover:text-[#FAF6EE] hover:bg-[#171C38]/10 cursor-pointer"
            title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
          >
            {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>
          <button onClick={() => handleTabChange('notifikasi')} className={`relative p-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'notifikasi' ? 'text-[#FF6B1A] bg-[#FF6B1A]/10' : 'text-[#171C38]/60 hover:text-[#171C38] hover:bg-[#171C38]/10 dark:text-[#FAF6EE]/60 dark:hover:text-[#FAF6EE]'}`}>
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
            <button onClick={() => setAuthModalOpen(true)} className="text-xs font-bold bg-[#FF6B1A] text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
              Masuk
            </button>
          )}
        </div>
      </header>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none z-40" />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 pt-20 lg:pt-32 pb-32 lg:pb-16 max-w-[1200px] mx-auto box-border">
        <div key={activeTab} className="animate-fade-in">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[40vh] w-full">
              <div className="w-8 h-8 border-4 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            {renderView()}
          </Suspense>
        </div>
      </main>

      <Footer setActiveTab={handleTabChange} />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onLoginSuccess={login} />
    </div>
    </ToastProvider>
    </ErrorBoundary>
  );
}
