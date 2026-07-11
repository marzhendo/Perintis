import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-500' },
    error: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: 'text-red-500' },
    info: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' },
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(t => {
          const Icon = icons[t.type];
          const c = colors[t.type];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto animate-slide-up ${c.bg} border rounded-2xl p-4 shadow-lg flex items-start gap-3`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${c.icon}`} />
              <p className={`text-xs font-semibold flex-1 ${c.text}`}>{t.message}</p>
              <button onClick={() => removeToast(t.id)} className={`${c.text} hover:opacity-70 transition-opacity flex-shrink-0`}>
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
