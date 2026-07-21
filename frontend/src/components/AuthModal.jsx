import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User, CheckCircle, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { fetchApi } from '../services/apiClient';
import { auth, googleProvider } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signInWithPopup 
} from 'firebase/auth';

const hasMinLength = (pw) => pw.length >= 8;
const hasLetterAndNumber = (pw) => /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw);

function validate(form, mode) {
  const errors = {};
  if (!form.email.trim()) {
    errors.email = 'Email wajib diisi';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid';
  }

  if (mode === 'login') {
    if (!form.password) {
      errors.password = 'Password wajib diisi';
    }
  }

  if (mode === 'register') {
    if (!form.name.trim()) {
      errors.name = 'Nama lengkap wajib diisi';
    }
    if (!form.password) {
      errors.password = 'Password wajib diisi';
    } else if (!hasMinLength(form.password) || !hasLetterAndNumber(form.password)) {
      errors.password = 'Password minimal 8 karakter dan harus mengandung kombinasi huruf serta angka';
    }
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Password tidak sama';
    }
  }

  if (mode === 'reset') {
    if (!form.resetCode.trim()) {
      errors.resetCode = 'Kode verifikasi wajib diisi';
    }
    if (!form.newPassword) {
      errors.newPassword = 'Password baru wajib diisi';
    } else if (!hasMinLength(form.newPassword) || !hasLetterAndNumber(form.newPassword)) {
      errors.newPassword = 'Password minimal 8 karakter dan harus mengandung kombinasi huruf serta angka';
    }
    if (form.newPassword !== form.confirmNewPassword) {
      errors.confirmNewPassword = 'Password tidak sama';
    }
  }
  return errors;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    resetCode: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      resetForm();
      setMode('login');
      setSuccessMessage('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      resetCode: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setErrors({});
    setSuccess(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setSuccess(false);
    // Keep email when switching to reset mode
    if (newMode !== 'reset') {
      setForm(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
        resetCode: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrors({});
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();
      
      const res = await fetchApi('/api/auth/firebase', {
        method: 'POST',
        body: JSON.stringify({ id_token: idToken })
      });
      
      localStorage.setItem('perintis_token', res.token.access_token);
      localStorage.setItem('perintis_user', JSON.stringify(res.user));
      
      setSuccess(true);
      await new Promise(r => setTimeout(r, 1200));
      onLoginSuccess(res.user);
      onClose();
    } catch (error) {
      console.error("Google Auth error:", error);
      setErrors({ general: error.message || 'Login dengan Google gagal.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    const v = validate(form, mode);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    try {
      if (mode === 'forgot') {
        const res = await fetchApi('/api/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email: form.email })
        });
        
        let successMsg = 'Kode verifikasi telah dikirim ke email Anda. Silakan periksa kotak masuk.';
        if (res.demo_code) {
          successMsg = `[DEV MODE] Kode OTP Anda: ${res.demo_code}. Silakan masukkan kode ini di halaman berikutnya.`;
        }
        
        setSuccessMessage(successMsg);
        setSuccess(true);
        await new Promise(r => setTimeout(r, 3000));
        setSuccess(false);
        setSuccessMessage('');
        switchMode('reset');
      } else if (mode === 'reset') {
        await fetchApi('/api/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({
            email: form.email,
            code: form.resetCode,
            new_password: form.newPassword
          })
        });
        
        setSuccessMessage('Password Anda berhasil diperbarui. Mengalihkan ke halaman masuk...');
        setSuccess(true);
        await new Promise(r => setTimeout(r, 2000));
        setSuccess(false);
        setSuccessMessage('');
        switchMode('login');
      } else if (mode === 'register') {
        const res = await fetchApi('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            name: form.name
          })
        });
        
        localStorage.setItem('perintis_token', res.token.access_token);
        localStorage.setItem('perintis_user', JSON.stringify(res.user));
        
        setSuccessMessage('Pendaftaran berhasil! Akun Anda siap digunakan.');
        setSuccess(true);
        await new Promise(r => setTimeout(r, 1500));
        setSuccess(false);
        setSuccessMessage('');
        onLoginSuccess(res.user);
        onClose();
      } else if (mode === 'login') {
        const res = await fetchApi('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: form.email,
            password: form.password
          })
        });
        
        localStorage.setItem('perintis_token', res.token.access_token);
        localStorage.setItem('perintis_user', JSON.stringify(res.user));
        
        setSuccessMessage('Masuk berhasil. Selamat datang kembali!');
        setSuccess(true);
        await new Promise(r => setTimeout(r, 1200));
        setSuccess(false);
        setSuccessMessage('');
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (error) {
      console.error("Auth error:", error);
      let errorMsg = error.message || 'Terjadi kesalahan pada server.';
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const update = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const inputClass = (key) =>
    `w-full bg-[#171C38]/5 border ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-[#FF6B1A]/20 focus:border-[#FF6B1A] focus:ring-[#FF6B1A]/10'} focus:outline-none focus:ring-2 rounded-[18px] py-2.5 pl-10 pr-10 text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178] transition-all focus-ring`;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#171C38]/85 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" />
      <div className="relative w-full max-w-md bg-[#FAF6EE]/95 border border-[#FF6B1A]/20 shadow-2xl shadow-orange-500/10 rounded-[24px] p-6 md:p-8 animate-scale-in text-left">
        <button
          onClick={() => { onClose(); resetForm(); }}
          className="absolute right-4 top-4 text-[#6F7178] hover:text-[#171C38] p-1.5 rounded-full hover:bg-[#171C38]/10 transition-colors focus-ring"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-bounce-in">
            <div className="w-16 h-16 rounded-full bg-[#FF6B1A]/10 flex items-center justify-center mb-4 border border-[#FF6B1A]/20 shadow-[0_0_10px_rgba(0,242,254,0.2)]">
              {mode === 'reset' ? (
                <ShieldCheck className="w-10 h-10 text-[#FF6B1A]" />
              ) : (
                <CheckCircle className="w-10 h-10 text-[#FF6B1A]" />
              )}
            </div>
            <h3 className="text-xl font-extrabold text-[#171C38] mb-1">
              {mode === 'login' && 'Masuk Berhasil!'}
              {mode === 'register' && 'Akun Berhasil Dibuat!'}
              {mode === 'forgot' && 'Kode OTP Terkirim!'}
              {mode === 'reset' && 'Password Diperbarui!'}
            </h3>
            <p className="text-xs text-[#6F7178] font-semibold max-w-[280px] mx-auto leading-relaxed">
              {successMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-extrabold text-[#171C38]">
                {mode === 'login' && 'Masuk ke Perintis'}
                {mode === 'register' && 'Buat Akun Perintis'}
                {mode === 'forgot' && 'Lupa Password'}
                {mode === 'reset' && 'Reset Password Baru'}
              </h3>
              <p className="text-xs text-[#6F7178] mt-1 font-medium">
                {mode === 'login' && 'Akses semua fitur dan riwayat analisis bisnis Anda.'}
                {mode === 'register' && 'Mulai perjalanan bisnis UMKM Anda dengan bantuan AI.'}
                {mode === 'forgot' && 'Masukkan email terdaftar Anda untuk memproses pemulihan akun.'}
                {mode === 'reset' && 'Masukkan kode verifikasi reset 6-digit dan password baru Anda.'}
              </p>
            </div>

            {/* Mode Toggle */}
            {['login', 'register'].includes(mode) && (
              <div className="flex bg-[#171C38]/5 border border-[#E8E8E8] rounded-2xl p-1">
                {['login', 'register'].map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all press-sm ${
                      mode === m ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/30 shadow-[0_0_10px_rgba(255,107,26,0.1)]' : 'text-[#6F7178] hover:text-[#171C38] border border-transparent'
                    }`}
                  >
                    {m === 'login' ? 'Masuk' : 'Daftar'}
                  </button>
                ))}
              </div>
            )}

            {/* General Alert (Error / Info) */}
            {errors.general && (
              <div className={`flex items-start gap-2 border rounded-2xl p-3 ${errors.general.includes('123456') ? 'bg-[#FF6B1A]/10 border-[#FF6B1A]/35 text-[#FF6B1A]' : 'bg-red-950/20 border-red-500/25 text-red-400'}`}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-relaxed">{errors.general}</p>
              </div>
            )}

            {/* Google OAuth (only for login/register) */}
            {['login', 'register'].includes(mode) && (
              <>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  type="button"
                  className="w-full bg-[#171C38]/5 hover:bg-[#171C38]/10 text-[#171C38] font-semibold text-sm border border-[#FF6B1A]/20 hover:border-[#FF6B1A]/40 rounded-[18px] py-3 px-4 shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{mode === 'login' ? 'Masuk dengan Google' : 'Daftar dengan Google'}</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[#E8E8E8]" />
                  <span className="flex-shrink mx-4 text-[#6F7178] text-[10px] uppercase font-bold tracking-wider">atau</span>
                  <div className="flex-grow border-t border-[#E8E8E8]" />
                </div>
              </>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4" noValidate>
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6F7178] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Contoh: Fatir Gibran"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={inputClass('name')}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && <p className="text-[10px] font-semibold text-red-400 mt-1 ml-1">{errors.name}</p>}
                </div>
              )}

              {/* Email (Shown in login, register, forgot, and read-only in reset) */}
              <div>
                <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6F7178] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={mode === 'forgot' ? inputRef : null}
                    type="email"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={inputClass('email')}
                    disabled={mode === 'reset'}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-[10px] font-semibold text-red-500 mt-1 ml-1">{errors.email}</p>}
              </div>

              {/* Password for Login & Register */}
              {['login', 'register'].includes(mode) && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-[#6F7178]">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-[10px] font-bold text-[#FF6B1A] hover:underline transition-all"
                      >
                        Lupa Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6F7178] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder={mode === 'register' ? "Buat password" : "Masukkan password"}
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      onFocus={() => mode === 'register' && setShowPasswordHint(true)}
                      onBlur={() => setShowPasswordHint(false)}
                      className={inputClass('password')}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F7178] hover:text-[#171C38] transition-colors focus-ring"
                      tabIndex={-1}
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    {mode === 'register' && showPasswordHint && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-white border border-[#E8E8E8] shadow-[0_4px_12px_rgba(23,28,56,0.08)] rounded-xl p-3 z-50 animate-scale-in pointer-events-none">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className={`w-4 h-4 flex-shrink-0 transition-colors ${hasMinLength(form.password) ? 'text-green-500' : 'text-[#D1D1D1]'}`} />
                          <span className={`text-xs font-semibold transition-colors ${hasMinLength(form.password) ? 'text-[#171C38]' : 'text-[#6F7178]'}`}>
                            Minimal 8 karakter
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 flex-shrink-0 transition-colors ${hasLetterAndNumber(form.password) ? 'text-green-500' : 'text-[#D1D1D1]'}`} />
                          <span className={`text-xs font-semibold transition-colors ${hasLetterAndNumber(form.password) ? 'text-[#171C38]' : 'text-[#6F7178]'}`}>
                            Kombinasi huruf & angka
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.password && <p className="text-[10px] font-semibold text-red-500 mt-1 ml-1">{errors.password}</p>}
                </div>
              )}

              {/* Confirm Password for Register */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Konfirmasi Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6F7178] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      placeholder="Ulangi password"
                      value={form.confirmPassword}
                      onChange={(e) => update('confirmPassword', e.target.value)}
                      className={inputClass('confirmPassword')}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F7178] hover:text-[#171C38] transition-colors focus-ring"
                      tabIndex={-1}
                    >
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[10px] font-semibold text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Reset Code & New Passwords for Reset Mode */}
              {mode === 'reset' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Kode Verifikasi (OTP)</label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-[#6F7178] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Contoh: 123456"
                        value={form.resetCode}
                        onChange={(e) => update('resetCode', e.target.value)}
                        className={inputClass('resetCode')}
                        maxLength={6}
                      />
                    </div>
                    {errors.resetCode && <p className="text-[10px] font-semibold text-red-500 mt-1 ml-1">{errors.resetCode}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Password Baru</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#6F7178] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        placeholder="Buat password baru"
                        value={form.newPassword}
                        onChange={(e) => update('newPassword', e.target.value)}
                        onFocus={() => setShowPasswordHint(true)}
                        onBlur={() => setShowPasswordHint(false)}
                        className={inputClass('newPassword')}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F7178] hover:text-[#171C38] transition-colors focus-ring"
                        tabIndex={-1}
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      {showPasswordHint && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-[#E8E8E8] shadow-[0_4px_12px_rgba(23,28,56,0.08)] rounded-xl p-3 z-50 animate-scale-in pointer-events-none">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className={`w-4 h-4 flex-shrink-0 transition-colors ${hasMinLength(form.newPassword) ? 'text-green-500' : 'text-[#D1D1D1]'}`} />
                            <span className={`text-xs font-semibold transition-colors ${hasMinLength(form.newPassword) ? 'text-[#171C38]' : 'text-[#6F7178]'}`}>
                              Minimal 8 karakter
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 flex-shrink-0 transition-colors ${hasLetterAndNumber(form.newPassword) ? 'text-green-500' : 'text-[#D1D1D1]'}`} />
                            <span className={`text-xs font-semibold transition-colors ${hasLetterAndNumber(form.newPassword) ? 'text-[#171C38]' : 'text-[#6F7178]'}`}>
                              Kombinasi huruf & angka
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.newPassword && <p className="text-[10px] font-semibold text-red-500 mt-1 ml-1">{errors.newPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Konfirmasi Password Baru</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#6F7178] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        placeholder="Ulangi password baru"
                        value={form.confirmNewPassword}
                        onChange={(e) => update('confirmNewPassword', e.target.value)}
                        className={inputClass('confirmNewPassword')}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F7178] hover:text-[#171C38] transition-colors focus-ring"
                        tabIndex={-1}
                      >
                        {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmNewPassword && <p className="text-[10px] font-semibold text-red-500 mt-1 ml-1">{errors.confirmNewPassword}</p>}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 cyber-btn rounded-[18px] py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#050714] border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>
                    {mode === 'login' && 'Masuk Sekarang'}
                    {mode === 'register' && 'Daftar Akun Baru'}
                    {mode === 'forgot' && 'Kirim Kode Reset'}
                    {mode === 'reset' && 'Reset Password Sekarang'}
                  </span>
                )}
              </button>

              {/* Back to Login Links */}
              {['forgot', 'reset'].includes(mode) && (
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="w-full text-center text-xs font-bold text-[#6F7178] hover:text-[#171C38] hover:underline transition-colors mt-2"
                >
                  Kembali ke Halaman Masuk
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
