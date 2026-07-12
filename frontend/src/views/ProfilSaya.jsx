import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, Edit2, Save, X, Clock, TrendingUp, Award, MessageSquare, LogOut, Camera, Bell } from 'lucide-react';

import { fetchApi } from '../services/apiClient';

export default function ProfilSaya({ user, onLogout, onOpenAuth }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statsData, setStatsData] = useState(null);
  
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  React.useEffect(() => {
    if (user) {
      fetchApi('/api/profile/stats')
        .then(data => {
          setStatsData(data);
          setForm({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || ''
          });
        })
        .catch(console.error);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-12 text-center animate-fade-in">
        <User className="w-12 h-12 text-[#6F7178] mx-auto mb-3 stroke-[1.5]" />
        <h3 className="font-bold text-[#171C38] text-sm">Belum Masuk</h3>
        <p className="text-xs text-[#6F7178] mt-1 mb-6">Silakan masuk untuk melihat profil Anda.</p>
        <button onClick={onOpenAuth} className="btn-primary text-sm px-8 py-3">
          Masuk / Daftar
        </button>
      </div>
    );
  }

  const getInitials = (name) =>
    (name || '').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchApi('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify({ phone: form.phone, bio: form.bio })
      });
      
      // Update local storage user data
      const stored = JSON.parse(localStorage.getItem('perintis_user') || '{}');
      stored.phone = form.phone;
      stored.bio = form.bio;
      localStorage.setItem('perintis_user', JSON.stringify(stored));
      
      setEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Baru saja';
  
  const stats = [
    { label: 'Analisis Validasi', value: statsData?.validasi_count || 0, icon: Award, color: '#FF6B1A' },
    { label: 'Simulasi BEP', value: statsData?.simulasi_count || 0, icon: TrendingUp, color: '#10B981' },
    { label: 'Diskusi Forum', value: statsData?.forum_count || 0, icon: MessageSquare, color: '#3B82F6' },
    { label: 'Hari Aktif', value: statsData?.hari_aktif || 1, icon: Clock, color: '#8B5CF6' },
  ];

  const activities = (statsData?.recent_activities || []).map(a => {
    let color = '#3B82F6';
    if (a.type === 'validasi') color = '#FF6B1A';
    else if (a.type === 'simulasi') color = '#10B981';
    
    return {
      action: a.description,
      time: new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      color
    };
  });

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <header className="max-w-3xl">
        <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Profil Saya</h2>
        <p className="text-sm text-[#6F7178] mt-1">Kelola data diri dan pantau aktivitas Anda di Perintis.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="absolute top-40 left-0 w-72 h-72 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10 animate-float" />
        {/* Left Column — Profile Card + Stats */}
        <div className="lg:col-span-5 space-y-6 animate-slide-up delay-1">
          {/* Profile Card */}
          <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 md:p-8 text-center card-hover">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF6B1A] to-[#FF8A3D] text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
                {getInitials(user.name)}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-[#E8E8E8] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F8ECD2]/50 transition-colors">
                <Camera className="w-3.5 h-3.5 text-[#6F7178]" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-[#171C38] mt-4">{statsData?.name || user.name}</h3>
            <p className="text-xs text-[#6F7178]">{statsData?.email || user.email}</p>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Calendar className="w-3.5 h-3.5 text-[#6F7178]" />
              <span className="text-[10px] text-[#6F7178] font-medium">Bergabung sejak {joinedDate}</span>
            </div>
            <div className="mt-5 pt-5 border-t border-[#E8E8E8] flex justify-center gap-6">
              <div className="text-center">
                <p className="text-lg font-extrabold text-[#171C38]">{statsData?.validasi_count || 0}</p>
                <p className="text-[9px] text-[#6F7178] font-semibold uppercase tracking-wider">Validasi</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-[#171C38]">{statsData?.simulasi_count || 0}</p>
                <p className="text-[9px] text-[#6F7178] font-semibold uppercase tracking-wider">Simulasi</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-[#171C38]">{statsData?.forum_count || 0}</p>
                <p className="text-[9px] text-[#6F7178] font-semibold uppercase tracking-wider">Forum</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-5 text-left card-lift animate-slide-up delay-${Math.min(i + 2, 8)}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: s.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-[#171C38]">{s.value}</p>
                  <p className="text-[10px] text-[#6F7178] font-semibold mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column — Edit Form + Activity */}
        <div className="lg:col-span-7 space-y-6 animate-slide-up delay-3">
          {/* Edit Profile Form */}
          <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 md:p-8 card-lift">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#171C38] text-sm">Informasi Pribadi</h3>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B1A] hover:text-[#E85D0E] transition-colors press-sm">
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditing(false)} className="text-xs font-semibold text-[#6F7178] hover:text-[#171C38] px-3 py-1.5 rounded-xl hover:bg-[#F8ECD2]/50 transition-all press-sm">
                    <X className="w-3.5 h-3.5 inline mr-1" />
                    Batal
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 text-xs font-bold text-white bg-[#FF6B1A] px-4 py-1.5 rounded-xl hover:bg-[#E85D0E] transition-all disabled:opacity-50 press-sm">
                    {saving ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Simpan
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#171C38] mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6F7178] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={!editing}
                    className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178] disabled:bg-[#F8ECD2]/30 disabled:cursor-not-allowed focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 transition-all focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171C38] mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6F7178] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={!editing}
                    className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178] disabled:bg-[#F8ECD2]/30 disabled:cursor-not-allowed focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 transition-all focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171C38] mb-1.5">No. Telepon</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#6F7178] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    disabled={!editing}
                    className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178] disabled:bg-[#F8ECD2]/30 disabled:cursor-not-allowed focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 transition-all focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171C38] mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  disabled={!editing}
                  className="w-full bg-white border border-[#E8E8E8] rounded-xl py-2.5 px-4 text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178] disabled:bg-[#F8ECD2]/30 disabled:cursor-not-allowed focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 transition-all resize-none focus-ring"
                />
              </div>
            </div>
          </div>

          {/* Aktivitas Terbaru */}
          <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 md:p-8 card-lift">
            <h3 className="font-bold text-[#171C38] text-sm mb-5">Aktivitas Terbaru</h3>
            <div className="space-y-0">
              {activities.length > 0 ? activities.map((a, i) => (
                <div key={i} className={`flex gap-4 py-3 border-b border-[#E8E8E8] last:border-0 last:pb-0 animate-slide-up delay-${Math.min(i + 1, 8)}`}>
                  <div className="relative flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full mt-1.5" style={{ backgroundColor: a.color }} />
                    {i < activities.length - 1 && <div className="w-px flex-1 bg-[#E8E8E8] mt-1" />}
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-xs font-semibold text-[#171C38]">{a.action}</p>
                    <p className="text-[10px] text-[#6F7178] font-medium mt-0.5">{a.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-[#6F7178] py-4 text-center">Belum ada aktivitas tercatat.</p>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 md:p-8 text-left card-lift">
            <h3 className="font-bold text-[#171C38] text-sm mb-4">Pengaturan Akun</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8ECD2]/50 transition-colors text-left press">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-[#6F7178]" />
                  <div>
                    <p className="text-xs font-semibold text-[#171C38]">Ubah Password</p>
                    <p className="text-[10px] text-[#6F7178]">Perbarui kata sandi akun Anda</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-[#6F7178]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8ECD2]/50 transition-colors text-left press">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-[#6F7178]" />
                  <div>
                    <p className="text-xs font-semibold text-[#171C38]">Preferensi Notifikasi</p>
                    <p className="text-[10px] text-[#6F7178]">Atur notifikasi yang ingin Anda terima</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-[#6F7178]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button onClick={onLogout} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-50 transition-colors text-left press">
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <div>
                    <p className="text-xs font-bold text-rose-600">Keluar Akun</p>
                    <p className="text-[10px] text-[#6F7178]">Logout dari sesi saat ini</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
