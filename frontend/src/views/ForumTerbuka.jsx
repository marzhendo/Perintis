import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare, ThumbsUp, Plus, Search, MessageCircle, User, ArrowLeft, X, Edit2, Trash2, Flag } from 'lucide-react';
import { fetchApi } from '../services/apiClient';

export default function ForumTerbuka({ user, onOpenAuth }) {
  const [threads, setThreads] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [activeThread, setActiveThread] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingThread, setEditingThread] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  
  const [newThreadForm, setNewThreadForm] = useState({
    title: '',
    category: 'Kuliner',
    snippet: ''
  });

  const categories = ['Semua', 'Kuliner', 'Bahan Baku', 'Pendanaan', 'Operasional'];

  // Load threads
  React.useEffect(() => {
    fetchApi('/api/forum/threads')
      .then(data => {
        // Map backend keys to frontend keys
        setThreads(data.map(t => ({
          id: t.id,
          title: t.title,
          author: t.author.name,
          authorId: t.author.id,
          authorBadge: t.author.badge,
          category: t.category,
          date: new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          snippet: t.content,
          likes: t.likes_count,
          repliesCount: t.comments_count,
          is_liked: t.is_liked_by_me,
          report_count: t.report_count || 0,
          replies: [] // will fetch on open
        })));
      })
      .catch(console.error);
  }, [user]);

  // Handle open thread
  const handleOpenThread = async (thread) => {
    setActiveThread(thread);
    try {
      const comments = await fetchApi(`/api/forum/threads/${thread.id}/comments`);
      const mappedComments = comments.map(c => ({
        id: c.id,
        author: c.author.name,
        authorId: c.author.id,
        badge: c.author.badge,
        text: c.content,
        date: new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        report_count: c.report_count || 0
      }));
      setActiveThread(prev => prev && prev.id === thread.id ? { ...prev, replies: mappedComments } : prev);
      setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, replies: mappedComments } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredThreads = threads.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                           t.snippet.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'Semua' || t.category === category;
    return matchesSearch && matchesCat;
  });

  const handleLike = async (id, e) => {
    e.stopPropagation();
    if (!user) return onOpenAuth();

    // Optimistic UI
    const thread = threads.find(t => t.id === id);
    const isLiking = !thread.is_liked;
    
    setThreads(threads.map((t) => t.id === id ? { ...t, likes: isLiking ? t.likes + 1 : t.likes - 1, is_liked: isLiking } : t));
    if (activeThread && activeThread.id === id) {
      setActiveThread(prev => ({ ...prev, likes: isLiking ? prev.likes + 1 : prev.likes - 1, is_liked: isLiking }));
    }

    try {
      await fetchApi(`/api/forum/threads/${id}/like`, { method: 'POST' });
    } catch (err) {
      // Revert if error
      setThreads(threads.map((t) => t.id === id ? { ...t, likes: isLiking ? t.likes - 1 : t.likes + 1, is_liked: !isLiking } : t));
      if (activeThread && activeThread.id === id) {
        setActiveThread(prev => ({ ...prev, likes: isLiking ? prev.likes - 1 : prev.likes + 1, is_liked: !isLiking }));
      }
    }
  };

  const handleAddComment = async () => {
    if (!user) return onOpenAuth();
    if (!newComment.trim()) return;

    try {
      const res = await fetchApi(`/api/forum/threads/${activeThread.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment })
      });
      
      const newReply = {
        id: res.id,
        author: res.author.name,
        authorId: res.author.id,
        badge: res.author.badge,
        text: res.content,
        date: new Date(res.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        report_count: 0
      };
      
      const updatedThreads = threads.map((t) => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            replies: [...(t.replies || []), newReply],
            repliesCount: t.repliesCount + 1
          };
        }
        return t;
      });

      setThreads(updatedThreads);
      setActiveThread(prev => ({
        ...prev,
        replies: [...(prev.replies || []), newReply],
        repliesCount: prev.repliesCount + 1
      }));
      setNewComment('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveThread = async (e) => {
    e.preventDefault();
    if (!user) return onOpenAuth();
    if (!newThreadForm.title.trim() || !newThreadForm.snippet.trim()) return;

    try {
      if (editingThread) {
        // Edit Thread
        const res = await fetchApi(`/api/forum/threads/${editingThread.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: newThreadForm.title,
            category: newThreadForm.category,
            content: newThreadForm.snippet
          })
        });
        
        const updatedThreads = threads.map(t => t.id === editingThread.id ? { 
          ...t, 
          title: res.title, 
          category: res.category, 
          snippet: res.content 
        } : t);
        
        setThreads(updatedThreads);
        if (activeThread && activeThread.id === editingThread.id) {
          setActiveThread(prev => ({ 
            ...prev, 
            title: res.title, 
            category: res.category, 
            snippet: res.content 
          }));
        }
      } else {
        // Create Thread
        const res = await fetchApi('/api/forum/threads', {
          method: 'POST',
          body: JSON.stringify({
            title: newThreadForm.title,
            category: newThreadForm.category,
            content: newThreadForm.snippet
          })
        });

        const newThread = {
          id: res.id,
          title: res.title,
          author: res.author.name,
          authorId: res.author.id,
          authorBadge: res.author.badge,
          category: res.category,
          date: 'Baru Saja',
          snippet: res.content,
          likes: 0,
          repliesCount: 0,
          is_liked: false,
          report_count: 0,
          replies: []
        };

        setThreads([newThread, ...threads]);
      }
      setModalOpen(false);
      setEditingThread(null);
      setNewThreadForm({ title: '', category: 'Kuliner', snippet: '' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteThread = async (threadId, e) => {
    if (e) e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin menghapus diskusi ini?')) return;
    try {
      await fetchApi(`/api/forum/threads/${threadId}`, { method: 'DELETE' });
      setThreads(threads.filter(t => t.id !== threadId));
      if (activeThread && activeThread.id === threadId) {
        setActiveThread(null);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus diskusi: ' + (err.message || 'Terjadi kesalahan pada server'));
    }
  };

  const handleReportThread = async (threadId, e) => {
    if (e) e.stopPropagation();
    try {
      await fetchApi(`/api/forum/threads/${threadId}/report`, { method: 'POST' });
      alert('Terima kasih. Diskusi ini telah dilaporkan kepada admin.');
      setThreads(threads.map(t => t.id === threadId ? { ...t, report_count: (t.report_count || 0) + 1 } : t));
      if (activeThread && activeThread.id === threadId) {
        setActiveThread(prev => ({ ...prev, report_count: (prev.report_count || 0) + 1 }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = (reply) => {
    setEditingCommentId(reply.id);
    setEditCommentText(reply.text);
  };

  const handleSaveComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      const res = await fetchApi(`/api/forum/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editCommentText })
      });
      
      const updatedReplies = activeThread.replies.map(r => r.id === commentId ? { ...r, text: res.content } : r);
      setActiveThread(prev => ({ ...prev, replies: updatedReplies }));
      setThreads(threads.map(t => t.id === activeThread.id ? { ...t, replies: updatedReplies } : t));
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tanggapan ini?')) return;
    try {
      await fetchApi(`/api/forum/comments/${commentId}`, { method: 'DELETE' });
      const updatedReplies = activeThread.replies.filter(r => r.id !== commentId);
      setActiveThread(prev => ({ 
        ...prev, 
        replies: updatedReplies,
        repliesCount: prev.repliesCount - 1
      }));
      setThreads(threads.map(t => t.id === activeThread.id ? { 
        ...t, 
        replies: updatedReplies,
        repliesCount: t.repliesCount - 1
      } : t));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus tanggapan: ' + (err.message || 'Terjadi kesalahan pada server'));
    }
  };

  const handleReportComment = async (commentId) => {
    try {
      await fetchApi(`/api/forum/comments/${commentId}/report`, { method: 'POST' });
      alert('Terima kasih. Tanggapan ini telah dilaporkan kepada admin.');
      const updatedReplies = activeThread.replies.map(r => r.id === commentId ? { ...r, report_count: (r.report_count || 0) + 1 } : r);
      setActiveThread(prev => ({ ...prev, replies: updatedReplies }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left w-full relative z-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Forum Terbuka UMKM</h2>
          <p className="text-sm text-[#6F7178] mt-1 font-semibold">Diskusikan ide bisnis Anda, harga komoditas pokok, dan strategi finansial bersama pelaku usaha lain.</p>
        </div>
        {!activeThread && (
          <button
            onClick={() => {
              if (!user) return onOpenAuth();
              setModalOpen(true);
            }}
            className="cyber-btn text-sm px-6 py-3.5 flex items-center gap-2 rounded-xl"
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

          <div className="glass-card rounded-[20px] p-6 md:p-8 space-y-6 w-full shadow-lg shadow-orange-500/5">
            {/* Thread Owner */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B1A]/10 flex items-center justify-center text-[#FF6B1A] border border-[#FF6B1A]/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#171C38]">{activeThread.author}</span>
                    <span className="text-[9px] font-bold text-[#FF6B1A] bg-[#FF6B1A]/10 px-2 py-0.5 rounded-full uppercase border border-[#FF6B1A]/20">{activeThread.authorBadge}</span>
                    {user && user.role === 'admin' && activeThread.report_count > 0 && (
                      <span className="text-[8px] font-extrabold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">⚠️ Dilaporkan {activeThread.report_count}x</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#6F7178] font-semibold">{activeThread.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#6F7178] bg-[#171C38]/5 border border-[#FF6B1A]/20 px-3 py-1 rounded-full">{activeThread.category}</span>
                
                {user && user.id === activeThread.authorId && (
                  <button
                    onClick={() => {
                      setEditingThread(activeThread);
                      setNewThreadForm({ title: activeThread.title, category: activeThread.category, snippet: activeThread.snippet });
                      setModalOpen(true);
                    }}
                    className="p-1 text-[#6F7178] hover:text-[#FF6B1A] transition-colors cursor-pointer"
                    title="Edit Diskusi"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                
                {user && (user.id === activeThread.authorId || user.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteThread(activeThread.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Hapus Diskusi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {user && user.id !== activeThread.authorId && (
                  <button
                    onClick={() => handleReportThread(activeThread.id)}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                    title="Laporkan Diskusi"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Thread Title & Content */}
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-extrabold text-[#171C38] leading-snug">{activeThread.title}</h3>
              <p className="text-sm text-[#6F7178] leading-relaxed font-medium">{activeThread.snippet}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#FF6B1A]/10">
              <button 
                onClick={(e) => handleLike(activeThread.id, e)}
                className={`flex items-center gap-1.5 transition-colors text-xs font-bold ${activeThread.is_liked ? 'text-[#FF6B1A]' : 'text-[#6F7178] hover:text-[#FF6B1A]'}`}
              >
                <ThumbsUp className={`w-4 h-4 ${activeThread.is_liked ? 'fill-current' : ''}`} />
                <span>{activeThread.likes} Suka</span>
              </button>
              <div className="flex items-center gap-1.5 text-[#6F7178] text-xs font-bold">
                <MessageCircle className="w-4 h-4" />
                <span>{activeThread.repliesCount} Komentar</span>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4 w-full">
            <h4 className="text-sm font-bold text-[#171C38] uppercase tracking-wider pl-1">Tanggapan ({activeThread.repliesCount})</h4>
            
            {(activeThread.replies || []).map((reply) => (
              <div key={reply.id} className="glass-card rounded-[20px] p-5 flex items-start gap-4 text-left w-full">
                <div className="w-8 h-8 rounded-full bg-[#171C38]/5 flex items-center justify-center text-[#6F7178] border border-[#FF6B1A]/10 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-[#171C38]">{reply.author}</span>
                    <span className="text-[8px] font-bold text-[#FF6B1A] bg-[#FF6B1A]/10 px-2 py-0.5 rounded-full uppercase">{reply.badge}</span>
                    {user && user.role === 'admin' && reply.report_count > 0 && (
                      <span className="text-[8px] font-extrabold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">⚠️ Dilaporkan {reply.report_count}x</span>
                    )}
                    <span className="text-[10px] text-[#6F7178] ml-auto">{reply.date}</span>

                    {/* Comment action buttons */}
                    <div className="flex items-center gap-1.5 ml-2">
                      {user && user.id === reply.authorId && editingCommentId !== reply.id && (
                        <button
                          onClick={() => handleEditComment(reply)}
                          className="p-0.5 text-slate-400 hover:text-[#FF6B1A] transition-colors cursor-pointer"
                          title="Edit Tanggapan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      {user && (user.id === reply.authorId || user.role === 'admin') && (
                        <button
                          onClick={() => handleDeleteComment(reply.id)}
                          className="p-0.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Hapus Tanggapan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {user && user.id !== reply.authorId && (
                        <button
                          onClick={() => handleReportComment(reply.id)}
                          className="p-0.5 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                          title="Laporkan Tanggapan"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {editingCommentId === reply.id ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full bg-[#171C38]/5 border border-[#FF6B1A]/20 focus:outline-none focus:border-[#FF6B1A] rounded-xl p-3 text-xs font-semibold text-[#171C38] resize-none"
                        rows="3"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1.5 rounded-lg border border-[#E8E8E8] text-[#6F7178] hover:text-[#171C38] text-[10px] font-bold cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleSaveComment(reply.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#FF6B1A] hover:bg-[#FF8A3D] text-white text-[10px] font-bold cursor-pointer"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#6F7178] leading-relaxed font-medium">{reply.text}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Post Comment Input */}
            <div className="glass-card rounded-[20px] p-4 flex gap-4 items-center w-full">
              <input 
                type="text"
                placeholder="Tulis tanggapan atau saran finansial..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow bg-[#171C38]/5 border border-[#FF6B1A]/20 focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-3 text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178] transition-all focus-ring"
              />
              <button 
                onClick={handleAddComment}
                className="cyber-btn text-xs px-5 py-3 rounded-xl cursor-pointer"
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
            <div className="glass-card rounded-[20px] p-5 space-y-4 text-left w-full shadow-lg shadow-orange-500/5">
              <h3 className="font-bold text-xs text-[#6F7178] uppercase tracking-wider">Cari & Saring</h3>
              
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7178]" />
                <input 
                  type="text"
                  placeholder="Cari topik..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#171C38]/5 border border-[#FF6B1A]/20 focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178] transition-all focus-ring"
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
                        ? 'bg-[#FF6B1A]/10 text-[#FF6B1A] border-l-2 border-[#FF6B1A]'
                        : 'text-[#6F7178] hover:bg-[#171C38]/5'
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
                onClick={() => handleOpenThread(thread)}
                className="glass-card rounded-[20px] p-6 cursor-pointer flex flex-col gap-4 text-left w-full group card-lift animate-slide-up shadow-lg shadow-orange-500/5 border border-transparent hover:border-[#FF6B1A]/10"
                style={{ animationDelay: `${Math.min((i + 1) * 0.1, 0.8)}s` }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-[#171C38]">{thread.author}</span>
                    <span className="text-[9px] font-bold text-[#FF6B1A] bg-[#FF6B1A]/10 px-2 py-0.5 rounded-full">{thread.authorBadge}</span>
                    <span className="text-[10px] text-[#6F7178] font-semibold ml-2">{thread.date}</span>
                    {user && user.role === 'admin' && thread.report_count > 0 && (
                      <span className="text-[8px] font-extrabold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full animate-pulse-soft">⚠️ Dilaporkan {thread.report_count}x</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] font-bold text-[#6F7178] bg-[#171C38]/5 border border-[#FF6B1A]/20 px-2.5 py-0.5 rounded-full">{thread.category}</span>
                    
                    {user && user.id === thread.authorId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingThread(thread);
                          setNewThreadForm({ title: thread.title, category: thread.category, snippet: thread.snippet });
                          setModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-[#FF6B1A] transition-colors cursor-pointer"
                        title="Edit Diskusi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    
                    {user && (user.id === thread.authorId || user.role === 'admin') && (
                      <button
                        onClick={(e) => handleDeleteThread(thread.id, e)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Hapus Diskusi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {user && user.id !== thread.authorId && (
                      <button
                        onClick={(e) => handleReportThread(thread.id, e)}
                        className="p-1 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                        title="Laporkan Diskusi"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm md:text-base text-[#171C38] group-hover:text-[#FF6B1A] transition-colors leading-snug font-sans">{thread.title}</h3>
                  <p className="text-xs text-[#6F7178] line-clamp-2 leading-relaxed font-medium">{thread.snippet}</p>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-[#FF6B1A]/10 text-[11px] font-bold text-[#6F7178]">
                  <button 
                    onClick={(e) => handleLike(thread.id, e)}
                    className={`flex items-center gap-1 transition-colors ${thread.is_liked ? 'text-[#FF6B1A]' : 'hover:text-[#FF6B1A]'}`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${thread.is_liked ? 'fill-current' : ''}`} />
                    <span>{thread.likes} Suka</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{thread.repliesCount} Tanggapan</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredThreads.length === 0 && (
              <div className="bg-[#171C38]/5 border border-[#FF6B1A]/10 border-dashed rounded-3xl py-12 text-center text-[#6F7178] w-full">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 stroke-[1.5] text-[#6F7178]" />
                <h4 className="font-bold text-sm text-[#171C38]">Diskusi Tidak Ditemukan</h4>
                <p className="text-xs text-[#6F7178] mt-1 font-semibold">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE/EDIT THREAD MODAL */}
      {modalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#171C38]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-lg animate-scale-in text-left p-6 md:p-8 shadow-[0_8px_32px_rgba(23,28,56,0.12)] border border-[#FF6B1A]/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#171C38]">{editingThread ? 'Ubah Diskusi' : 'Mulai Diskusi Baru'}</h3>
              <button 
                onClick={() => {
                  setModalOpen(false);
                  setEditingThread(null);
                  setNewThreadForm({ title: '', category: 'Kuliner', snippet: '' });
                }}
                className="text-[#6F7178] hover:text-[#171C38] p-1 rounded-full hover:bg-[#171C38]/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveThread} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Judul Diskusi</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Bagaimana tips menjaga kualitas bahan baku sayur agar tidak layu?"
                  value={newThreadForm.title}
                  onChange={(e) => setNewThreadForm({ ...newThreadForm, title: e.target.value })}
                  className="w-full bg-[#171C38]/5 border border-[#FF6B1A]/20 focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-3 text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178] transition-all focus-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Kategori</label>
                <select
                  value={newThreadForm.category}
                  onChange={(e) => setNewThreadForm({ ...newThreadForm, category: e.target.value })}
                  className="w-full bg-[#171C38]/5 border border-[#FF6B1A]/20 focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-3 text-xs font-semibold text-[#6F7178] transition-all focus-ring"
                  style={{ colorScheme: 'dark' }}
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat} className="bg-[#171C38] text-[#171C38]">{cat}</option>
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
                  className="w-full bg-[#171C38]/5 border border-[#FF6B1A]/20 focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-4 text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178] resize-none transition-all focus-ring"
                />
              </div>

              <button
                type="submit"
                className="w-full cyber-btn text-xs py-3.5 rounded-xl mt-2 cursor-pointer"
              >
                {editingThread ? 'Simpan Perubahan' : 'Publikasikan Topik Diskusi'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
