import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Plus, Search, Filter, MessageCircle, User, Calendar, Tag, ArrowLeft } from 'lucide-react';

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
  const [activeThread, setActiveThread] = useState(null); // Selected thread for details
  const [newComment, setNewComment] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  
  // New Thread Form State
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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Forum Terbuka UMKM</h2>
          <p className="text-sm text-slate-500 mt-1">Diskusikan ide bisnis Anda, harga komoditas pokok, dan strategi finansial bersama pelaku usaha lain.</p>
        </div>
        {!activeThread && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Mulai Diskusi</span>
          </button>
        )}
      </header>

      {activeThread ? (
        /* THREAD DETAIL VIEW */
        <div className="space-y-6 w-full animate-scale-in">
          <button 
            onClick={() => setActiveThread(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Forum</span>
          </button>

          <div className="apple-glass rounded-3xl p-6 md:p-8 border border-white/50 shadow-sm space-y-6 w-full">
            {/* Thread Owner */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">{activeThread.author}</span>
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase border border-blue-100">{activeThread.authorBadge}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{activeThread.date}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border px-3 py-1 rounded-full">{activeThread.category}</span>
            </div>

            {/* Thread Title & Content */}
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug">{activeThread.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{activeThread.snippet}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-200/50">
              <button 
                onClick={(e) => handleLike(activeThread.id, e)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors text-xs font-bold"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{activeThread.likes} Suka</span>
              </button>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                <MessageCircle className="w-4 h-4" />
                <span>{activeThread.replies.length} Komentar</span>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4 w-full">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider pl-1">Tanggapan ({activeThread.replies.length})</h4>
            
            {activeThread.replies.map((reply) => (
              <div key={reply.id} className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200/50 shadow-sm flex items-start gap-4 text-left w-full">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{reply.author}</span>
                    <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">{reply.badge}</span>
                    <span className="text-[10px] text-slate-400 ml-auto">{reply.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{reply.text}</p>
                </div>
              </div>
            ))}

            {/* Post Comment Input */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/50 shadow-sm flex gap-4 items-center w-full">
              <input 
                type="text"
                placeholder="Tulis tanggapan atau saran finansial..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 rounded-xl p-3 text-xs font-medium"
              />
              <button 
                onClick={handleAddComment}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl active:scale-95 transition-all"
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
            <div className="apple-glass rounded-2xl p-5 border border-white/50 shadow-sm space-y-4 text-left w-full">
              <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Cari & Saring</h3>
              
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Cari topik..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 focus:outline-none focus:border-blue-600 rounded-xl text-xs font-semibold placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Kategori</label>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      category === cat
                        ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                        : 'text-slate-500 hover:bg-slate-50'
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
            {filteredThreads.map((thread) => (
              <div 
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                className="apple-glass rounded-2xl p-6 border border-white/50 shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col gap-4 text-left w-full group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{thread.author}</span>
                    <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{thread.authorBadge}</span>
                    <span className="text-[10px] text-slate-400 font-medium ml-2">{thread.date}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border px-2.5 py-0.5 rounded-full">{thread.category}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm md:text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">{thread.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{thread.snippet}</p>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-slate-200/40 text-[11px] font-bold text-slate-500">
                  <button 
                    onClick={(e) => handleLike(thread.id, e)}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
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
              <div className="bg-slate-100/50 border border-slate-200 border-dashed rounded-3xl py-12 text-center text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 stroke-[1.5]" />
                <h4 className="font-bold text-sm text-slate-700">Diskusi Tidak Ditemukan</h4>
                <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE THREAD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white/80 border border-white/60 shadow-2xl rounded-3xl p-6 md:p-8 backdrop-blur-2xl w-full max-w-lg animate-scale-in text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Mulai Diskusi Baru</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Judul Diskusi</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Bagaimana tips menjaga kualitas bahan baku sayur agar tidak layu?"
                  value={newThreadForm.title}
                  onChange={(e) => setNewThreadForm({ ...newThreadForm, title: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-600 rounded-xl p-3 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Kategori</label>
                <select
                  value={newThreadForm.category}
                  onChange={(e) => setNewThreadForm({ ...newThreadForm, category: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-600 rounded-xl p-3 text-xs font-semibold"
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Deskripsi Lengkap Pertanyaan/Ide</label>
                <textarea 
                  rows="5"
                  required
                  placeholder="Ceritakan permasalahan, konteks usaha Anda, atau informasi detail yang ingin Anda tanyakan..."
                  value={newThreadForm.snippet}
                  onChange={(e) => setNewThreadForm({ ...newThreadForm, snippet: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-600 rounded-xl p-4 text-xs font-semibold resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold text-xs hover:shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 active:scale-98 transition-all duration-300"
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

// Simple Helper Component to close Modal
function X({ className, ...props }) {
  return (
    <svg 
      className={className} 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
