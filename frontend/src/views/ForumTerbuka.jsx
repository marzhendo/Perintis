import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Plus, Search, MessageCircle, User, ArrowLeft, X } from 'lucide-react';

const INITIAL_THREADS = [
  {
    id: 1,
    title: 'Bagaimana cara menentukan HPP Kedai Kopi Susu di pinggir jalan?',
    author: 'Andi Saputra',
    authorBadge: 'Pendiri UMKM',
    category: 'Kuliner',
    date: '10 Juli 2026',
    snippet: 'Saya baru memulai bisnis kopi susu di Jakarta Selatan. Biaya sewa kios bulanan lumayan tinggi, sekitar 2 juta. Saya bingung membagi biaya sewa ini ke HPP per cup kopi susu. Ada yang punya saran?',
    likes: 18,
    replies: [
      { id: 1, author: 'Budi Santoso', badge: 'Ahli Finansial', text: 'Saran saya, hitung target penjualan cup per bulan dulu. Misalnya target 1.000 cup. Maka biaya sewa per cup adalah Rp 2.000. Jumlahkan ini dengan bahan baku per porsi.', date: '10 Juli 2026' },
      { id: 2, author: 'AI Advisor', badge: 'Asisten Perintis', text: 'Berdasarkan data harga susu dan kopi terbaru di Dashboard Harga Pangan, rata-rata HPP bahan baku per cup berkisar Rp 6.500 - Rp 7.500. Ditambah sewa Rp 2.000, HPP total Anda sekitar Rp 9.000.', date: '11 Juli 2026' }
    ]
  },
  {
    id: 2,
    title: 'Fluktuasi harga cabai rawit merah hari ini, apa alternatif penggantinya?',
    author: 'Siti Rahma',
    authorBadge: 'Sangat Aktif',
    category: 'Bahan Baku',
    date: '9 Juli 2026',
    snippet: 'Harga cabai rawit melesat tajam hari ini menjadi Rp 45.000/kg. Untuk usaha warung geprek saya, ini sangat menekan margin keuntungan. Adakah trik agar rasa pedas tetap khas tanpa boncos?',
    likes: 12,
    replies: [
      { id: 1, author: 'Chef Rian', badge: 'Kuliner Pro', text: 'Bisa dicampur dengan cabai kering kering giling mas. Rasa pedasnya tetap kuat, dan harganya jauh lebih stabil.', date: '9 Juli 2026' }
    ]
  },
  {
    id: 3,
    title: 'Rekomendasi platform pinjaman modal awal UMKM bunga rendah',
    author: 'Rico Wijaya',
    authorBadge: 'Pendiri Baru',
    category: 'Pendanaan',
    date: '8 Juli 2026',
    snippet: 'Saya sedang membutuhkan modal tambahan sekitar 15 juta untuk ekspansi waralaba gerobak martabak saya. Apakah KUR dari Bank Mandiri/BRI saat ini paling recommended?',
    likes: 9,
    replies: []
  }
];

export default function ForumTerbuka() {
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [activeThread, setActiveThread] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  
  const [newThreadForm, setNewThreadForm] = useState({
    title: '',
    category: 'Kuliner',
    snippet: ''
  });

  const categories = ['Semua', 'Kuliner', 'Bahan Baku', 'Pendanaan', 'Operasional'];

  const filteredThreads = threads.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.snippet.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'Semua' || t.category === category;
    return matchesSearch && matchesCat;
  });

  const handleLike = (id, e) => {
    e.stopPropagation();
    setThreads(threads.map((t) => t.id === id ? { ...t, likes: t.likes + 1 } : t));
    if (activeThread && activeThread.id === id) {
      setActiveThread({ ...activeThread, likes: activeThread.likes + 1 });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newReply = {
      id: Date.now(),
      author: 'Pengguna Perintis',
      badge: 'Pendiri Baru',
      text: newComment,
      date: 'Hari Ini'
    };
    
    const updatedThreads = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          replies: [...t.replies, newReply]
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    setActiveThread({
      ...activeThread,
      replies: [...activeThread.replies, newReply]
    });
    setNewComment('');
  };

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!newThreadForm.title.trim() || !newThreadForm.snippet.trim()) return;

    const newThread = {
      id: Date.now(),
      title: newThreadForm.title,
      author: 'Pengguna Perintis',
      authorBadge: 'Pendiri Baru',
      category: newThreadForm.category,
      date: 'Baru Saja',
      snippet: newThreadForm.snippet,
      likes: 0,
      replies: []
    };

    setThreads([newThread, ...threads]);
    setModalOpen(false);
    setNewThreadForm({ title: '', category: 'Kuliner', snippet: '' });
  };

  return (
    <div className="space-y-8 animate-fade-in text-left w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Forum Terbuka UMKM</h2>
          <p className="text-sm text-[#6F7178] mt-1">Diskusikan ide bisnis Anda, harga komoditas pokok, dan strategi finansial bersama pelaku usaha lain.</p>
        </div>
        {!activeThread && (
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-sm px-6 py-3.5 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Mulai Diskusi</span>
          </button>
        )}
      </header>

      <div className="absolute top-40 left-0 w-80 h-80 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10 animate-float" />

      {activeThread ? (
        /* THREAD DETAIL VIEW */
        <div className="space-y-6 w-full animate-scale-in">
          <button 
            onClick={() => setActiveThread(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6F7178] hover:text-[#FF6B1A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Forum</span>
          </button>

          <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 md:p-8 space-y-6 w-full">
            {/* Thread Owner */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B1A]/10 flex items-center justify-center text-[#FF6B1A] border border-[#FF6B1A]/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#171C38]">{activeThread.author}</span>
                    <span className="text-[9px] font-bold text-[#FF6B1A] bg-[#FF6B1A]/10 px-2 py-0.5 rounded-full uppercase border border-[#FF6B1A]/20">{activeThread.authorBadge}</span>
                  </div>
                  <span className="text-[10px] text-[#6F7178] font-semibold">{activeThread.date}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#6F7178] bg-[#F8ECD2]/50 border border-[#E8E8E8] px-3 py-1 rounded-full">{activeThread.category}</span>
            </div>

            {/* Thread Title & Content */}
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-extrabold text-[#171C38] leading-snug">{activeThread.title}</h3>
              <p className="text-sm text-[#6F7178] leading-relaxed">{activeThread.snippet}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#E8E8E8]/50">
              <button 
                onClick={(e) => handleLike(activeThread.id, e)}
                className="flex items-center gap-1.5 text-[#6F7178] hover:text-[#FF6B1A] transition-colors text-xs font-bold"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{activeThread.likes} Suka</span>
              </button>
              <div className="flex items-center gap-1.5 text-[#6F7178] text-xs font-bold">
                <MessageCircle className="w-4 h-4" />
                <span>{activeThread.replies.length} Komentar</span>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4 w-full">
            <h4 className="text-sm font-bold text-[#171C38] uppercase tracking-wider pl-1">Tanggapan ({activeThread.replies.length})</h4>
            
            {activeThread.replies.map((reply) => (
              <div key={reply.id} className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-5 flex items-start gap-4 text-left w-full">
                <div className="w-8 h-8 rounded-full bg-[#F8ECD2]/50 flex items-center justify-center text-[#6F7178] border border-[#E8E8E8] flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#171C38]">{reply.author}</span>
                    <span className="text-[8px] font-bold text-[#FF6B1A] bg-[#FF6B1A]/10 px-2 py-0.5 rounded-full uppercase">{reply.badge}</span>
                    <span className="text-[10px] text-[#6F7178] ml-auto">{reply.date}</span>
                  </div>
                  <p className="text-xs text-[#6F7178] leading-relaxed">{reply.text}</p>
                </div>
              </div>
            ))}

            {/* Post Comment Input */}
            <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-4 flex gap-4 items-center w-full">
              <input 
                type="text"
                placeholder="Tulis tanggapan atau saran finansial..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-3 text-xs font-medium focus-ring"
              />
              <button 
                onClick={handleAddComment}
                className="btn-primary text-xs px-5 py-3"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN LIST VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Left Side: Filter and Search */}
          <div className="lg:col-span-3 space-y-6 w-full">
            <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-5 space-y-4 text-left w-full">
              <h3 className="font-bold text-xs text-[#6F7178] uppercase tracking-wider">Cari & Saring</h3>
              
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7178]" />
                <input 
                  type="text"
                  placeholder="Cari topik..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl text-xs font-semibold placeholder:text-[#6F7178] focus-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#6F7178] uppercase mb-2">Kategori</label>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all press-sm ${
                      category === cat
                        ? 'bg-[#FF6B1A]/10 text-[#FF6B1A] font-bold border-l-2 border-[#FF6B1A]'
                        : 'text-[#6F7178] hover:bg-[#F8ECD2]/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Threads List */}
          <div className="lg:col-span-9 space-y-4 w-full">
            {filteredThreads.map((thread, i) => (
              <div 
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                className={`bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col gap-4 text-left w-full group card-lift press animate-slide-up delay-${Math.min(i + 1, 8)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#171C38]">{thread.author}</span>
                    <span className="text-[9px] font-semibold text-[#FF6B1A] bg-[#FF6B1A]/10 px-2 py-0.5 rounded-full">{thread.authorBadge}</span>
                    <span className="text-[10px] text-[#6F7178] font-medium ml-2">{thread.date}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#6F7178] bg-[#F8ECD2]/50 border border-[#E8E8E8] px-2.5 py-0.5 rounded-full">{thread.category}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm md:text-base text-[#171C38] group-hover:text-[#FF6B1A] transition-colors leading-snug">{thread.title}</h3>
                  <p className="text-xs text-[#6F7178] line-clamp-2 leading-relaxed">{thread.snippet}</p>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-[#E8E8E8]/40 text-[11px] font-bold text-[#6F7178]">
                  <button 
                    onClick={(e) => handleLike(thread.id, e)}
                    className="flex items-center gap-1 hover:text-[#FF6B1A] transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{thread.likes} Suka</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{thread.replies.length} Tanggapan</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredThreads.length === 0 && (
              <div className="bg-[#F8ECD2]/30 border border-[#E8E8E8] border-dashed rounded-3xl py-12 text-center text-[#6F7178]">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 stroke-[1.5]" />
                <h4 className="font-bold text-sm text-[#171C38]">Diskusi Tidak Ditemukan</h4>
                <p className="text-xs text-[#6F7178] mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE THREAD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171C38]/60 animate-fade-in">
          <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-xl w-full max-w-lg animate-scale-in text-left p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#171C38]">Mulai Diskusi Baru</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-[#6F7178] hover:text-[#171C38] p-1 rounded-full hover:bg-[#F8ECD2]/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Judul Diskusi</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Bagaimana tips menjaga kualitas bahan baku sayur agar tidak layu?"
                  value={newThreadForm.title}
                  onChange={(e) => setNewThreadForm({ ...newThreadForm, title: e.target.value })}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-3 text-xs font-semibold focus-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Kategori</label>
                <select
                  value={newThreadForm.category}
                  onChange={(e) => setNewThreadForm({ ...newThreadForm, category: e.target.value })}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-3 text-xs font-semibold focus-ring"
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Deskripsi Lengkap Pertanyaan/Ide</label>
                <textarea 
                  rows="5"
                  required
                  placeholder="Ceritakan permasalahan, konteks usaha Anda, atau informasi detail yang ingin Anda tanyakan..."
                  value={newThreadForm.snippet}
                  onChange={(e) => setNewThreadForm({ ...newThreadForm, snippet: e.target.value })}
                  className="w-full bg-white border border-[#E8E8E8] focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-4 text-xs font-semibold resize-none focus-ring"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary text-xs py-3"
              >
                Publikasikan Topik Diskusi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


