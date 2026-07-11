import React, { useState } from 'react';
import { Bell, CheckCheck, MessageSquare, TrendingUp, Award, AlertTriangle, Sparkles } from 'lucide-react';

const initialNotifs = [
  { id: 1, icon: Award, title: 'Hasil Validasi Ide Siap', desc: 'Hasil analisis kelayakan ide bisnis "Kuliner Sehat" sudah tersedia. Cek skor dan rekomendasinya sekarang.', time: '5 menit lalu', read: false, color: '#FF6B1A' },
  { id: 2, icon: TrendingUp, title: 'Proyeksi ROI Diperbarui', desc: 'Simulasi BEP terbaru menunjukkan potensi balik modal dalam 4 bulan dengan skenario optimis.', time: '1 jam lalu', read: false, color: '#10B981' },
  { id: 3, icon: MessageSquare, title: 'Diskusi Baru di Forum', desc: 'Anggota @andi_bakso membalas thread "Cara memilih lokasi usaha kuliner pinggir jalan".', time: '3 jam lalu', read: true, color: '#3B82F6' },
  { id: 4, icon: AlertTriangle, title: 'Kenaikan Harga Beras', desc: 'Harga beras premium naik 5% dalam sepekan terakhir. Sesuaikan HPP produksi Anda.', time: '1 hari lalu', read: true, color: '#EF4444' },
  { id: 5, icon: Sparkles, title: 'Tips Bisnis: Manajemen Modal', desc: 'Panduan baru: cara mengelola modal awal UMKM agar tidak bangkrut di 3 bulan pertama.', time: '2 hari lalu', read: true, color: '#8B5CF6' },
];

function NotifItem({ notif, onMarkRead }) {
  const Icon = notif.icon;
  return (
    <div className={`bg-white rounded-[20px] border ${notif.read ? 'border-[#E8E8E8]' : 'border-[#FF6B1A]/30 bg-[#FF6B1A]/[0.02]'} shadow-sm p-5 flex items-start gap-4 transition-all hover:shadow-md press`}>
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${notif.color}15` }}>
        <Icon className="w-5 h-5" style={{ color: notif.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={`text-sm ${notif.read ? 'text-[#171C38]' : 'text-[#171C38] font-bold'}`}>{notif.title}</h4>
          {!notif.read && (
            <button onClick={() => onMarkRead(notif.id)} className="flex-shrink-0 p-1.5 rounded-full hover:bg-[#FF6B1A]/10 transition-colors" title="Tandai sudah dibaca">
              <CheckCheck className="w-4 h-4 text-[#FF6B1A]" />
            </button>
          )}
        </div>
        <p className="text-xs text-[#6F7178] mt-1 leading-relaxed">{notif.desc}</p>
        <p className="text-[10px] text-[#6F7178] font-medium mt-2">{notif.time}</p>
      </div>
    </div>
  );
}

export default function Notifikasi() {
  const [notifs, setNotifs] = useState(initialNotifs);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10 animate-float" />
      <header className="max-w-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Notifikasi</h2>
          <p className="text-sm text-[#6F7178] mt-1">Pantau aktivitas, hasil analisis, dan pengingat penting.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B1A] hover:text-[#E85D0E] transition-colors flex-shrink-0">
            <CheckCheck className="w-4 h-4" />
            Tandai Semua Dibaca
          </button>
        )}
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: `Semua (${notifs.length})` },
          { id: 'unread', label: `Belum Dibaca (${unreadCount})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all press-sm ${
              filter === tab.id
                ? 'bg-[#FF6B1A] text-white shadow-md shadow-orange-500/20'
                : 'bg-white border border-[#E8E8E8] text-[#6F7178] hover:bg-[#F8ECD2]/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notif List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((notif, i) => (
            <div key={notif.id} className={`animate-slide-up delay-${Math.min(i + 1, 8)}`}>
              <NotifItem notif={notif} onMarkRead={markAsRead} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-12 text-center">
          <Bell className="w-12 h-12 text-[#6F7178] mx-auto mb-3 stroke-[1.5]" />
          <h3 className="font-bold text-[#171C38] text-sm">Tidak Ada Notifikasi</h3>
          <p className="text-xs text-[#6F7178] mt-1 max-w-xs mx-auto">
            {filter === 'unread' ? 'Semua notifikasi sudah dibaca. Kembali lagi nanti untuk informasi terbaru.' : 'Belum ada notifikasi masuk. Kami akan memberitahu Anda jika ada aktivitas penting.'}
          </p>
        </div>
      )}
    </div>
  );
}
