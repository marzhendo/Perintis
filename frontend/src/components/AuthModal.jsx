import React, { useState } from 'react';
import { X, Mail, Lock, User, CheckCircle, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate Google Login
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onLoginSuccess({
          name: 'Fatir Gibran',
          email: 'fatir@gmail.com',
          avatarUrl: 'https://lh3.googleusercontent.com/a',
        });
        onClose();
      }, 1200);
    }, 1500);
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    if (mode === 'register' && form.password !== form.confirmPassword) {
      alert('Password tidak sama!');
      return;
    }
    setLoading(true);
    // Simulate Auth
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onLoginSuccess({
          name: form.name || form.email.split('@')[0],
          email: form.email,
        });
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white/80 border border-white/60 shadow-2xl rounded-3xl p-6 md:p-8 backdrop-blur-2xl animate-scale-in text-left">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          /* SUCCESS SCREEN */
          <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25 mb-4 text-emerald-600 animate-bounce">
              <CheckCircle className="w-10 h-10 fill-emerald-500/10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Autentikasi Sukses!</h3>
            <p className="text-sm text-slate-500">Selamat datang kembali di Platform Perintis.</p>
          </div>
        ) : (
          /* AUTH FORM */
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-extrabold text-slate-900 font-display">
                {mode === 'login' ? 'Masuk ke Perintis' : 'Buat Akun Perintis'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'login' ? 'Kelola analisis kelayakan bisnis Anda secara teratur.' : 'Mulai perjalanan bisnis UMKM Anda dengan bantuan kecerdasan buatan.'}
              </p>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 rounded-2xl py-3 px-4 shadow-sm hover:shadow active:scale-98 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Masuk dengan Google</span>
            </button>

            {/* Separator */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-wider">atau</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Fatir Gibran"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Konfirmasi Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl py-3 font-bold text-xs hover:shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 active:scale-98 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Baru'}</span>
                )}
              </button>
            </form>

            {/* Toggle mode */}
            <div className="text-center text-xs">
              <span className="text-slate-500">
                {mode === 'login' ? 'Belum punya akun? ' : 'Sudah memiliki akun? '}
              </span>
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-blue-600 font-bold hover:underline"
              >
                {mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
