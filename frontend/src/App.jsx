import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AuthModal from './components/AuthModal';
import LandingPage from './views/LandingPage';
import HargaPangan from './views/HargaPangan';
import Validator from './views/Validator';
import Calculator from './views/Calculator';
import ROIProjections from './views/ROIProjections';
import Panduan from './views/Panduan';
import logo from './assets/images/Perintis_OLD.svg';
import { User, LogOut } from 'lucide-react';

export default function App() {
  // Sync tab with URL search parameter
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'home';
  });

  const [validationData, setValidationData] = useState(null);
  const [calculationData, setCalculationData] = useState(null);

  // Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('perintis_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const url = new URL(window.location);
    url.searchParams.set('tab', tab);
    window.history.pushState(null, '', url.toString());
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get('tab') || 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('perintis_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('perintis_user');
    setMobileDropdownOpen(false);
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage setActiveTab={handleTabChange} />;
      case 'harga':
        return <HargaPangan />;
      case 'validator':
        return <Validator validationData={validationData} setValidationData={setValidationData} />;
      case 'calculator':
        return <Calculator calculationData={calculationData} setCalculationData={setCalculationData} />;
      case 'roi':
        return <ROIProjections calculationData={calculationData} />;
      case 'guide':
        return <Panduan />;
      default:
        return <LandingPage setActiveTab={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-500/10 selection:text-blue-600 relative overflow-x-hidden">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-slate-100/50 opacity-70"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-blue-200/20 blur-[120px] mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-200/20 blur-[100px] mix-blend-multiply animate-pulse"></div>
      </div>

      {/* Header (Desktop Floating Nav) */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      
      {/* Bottom Nav (Mobile) */}
      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden p-0.5">
            <img src={logo} alt="Perintis Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-base bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Perintis
          </span>
        </div>

        {/* Mobile Profile Actions */}
        <div className="flex items-center gap-2 relative">
          {user ? (
            <div>
              <button 
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-inner border border-white"
              >
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </button>
              {mobileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 z-50 text-left animate-scale-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-xs text-slate-800 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-1.5 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-full border border-blue-500/20 active:scale-95 transition-all"
            >
              Masuk
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="min-h-screen px-4 md:px-10 pt-24 md:pt-36 pb-28 md:pb-12 max-w-[1280px] mx-auto">
        {renderView()}
      </main>

      {/* Authenticator Login Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
