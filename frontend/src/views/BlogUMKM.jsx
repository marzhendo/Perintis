import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Plus, Trash2, X, FileText, User } from 'lucide-react';
import { fetchApi } from '../services/apiClient';

export default function BlogUMKM({ user, onOpenAuth }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPostForm, setNewPostForm] = useState({ title: '', content: '' });

  const fetchPosts = () => {
    setLoading(true);
    fetchApi('/api/blog/posts')
      .then(data => {
        setPosts(data.map(p => ({
          id: p.id,
          title: p.title,
          content: p.content,
          author: p.author.name,
          date: new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostForm.title.trim() || !newPostForm.content.trim()) return;

    try {
      const res = await fetchApi('/api/blog/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: newPostForm.title,
          content: newPostForm.content
        })
      });
      const newPost = {
        id: res.id,
        title: res.title,
        content: res.content,
        author: res.author.name,
        date: 'Baru Saja'
      };
      setPosts([newPost, ...posts]);
      setModalOpen(false);
      setNewPostForm({ title: '', content: '' });
    } catch (e) {
      console.error(e);
      alert('Gagal mempublikasikan artikel: ' + (e.message || 'Error server'));
    }
  };

  const handleDeletePost = async (postId, title) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) return;
    try {
      await fetchApi(`/api/blog/posts/${postId}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p.id !== postId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left w-full relative z-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <h2 className="text-2xl font-extrabold text-[#171C38] tracking-tight">Blog & Edukasi UMKM</h2>
          <p className="text-sm text-[#6F7178] mt-1 font-semibold">Temukan tips bisnis, artikel edukasi, dan wawasan terbaru untuk pertumbuhan usaha Anda.</p>
        </div>
        {user && user.role === 'admin' && (
          <button
            onClick={() => setModalOpen(true)}
            className="cyber-btn text-sm px-6 py-3.5 flex items-center gap-2 rounded-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Tulis Artikel</span>
          </button>
        )}
      </header>

      <div className="absolute top-40 right-0 w-80 h-80 bg-[#FF6B1A]/5 rounded-full blur-3xl -z-10 animate-float" />

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh] w-full">
          <div className="w-8 h-8 border-4 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {posts.map((post, index) => (
            <div 
              key={post.id}
              className="glass-card rounded-[24px] p-6 flex flex-col justify-between text-left w-full hover:scale-[1.02] transition-transform duration-300 shadow-lg shadow-orange-500/5 relative border border-[#E8E8E8]"
            >
              {user && user.role === 'admin' && (
                <button
                  onClick={() => handleDeletePost(post.id, post.title)}
                  className="absolute top-4 right-4 text-[#6F7178] hover:text-rose-500 p-1.5 rounded-full hover:bg-[#171C38]/5 transition-colors cursor-pointer"
                  title="Hapus Artikel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] text-[#6F7178] font-bold uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-[#FF6B1A]" />
                  <span>Artikel Edukasi</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-[#171C38] leading-snug line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-[#6F7178] leading-relaxed font-semibold line-clamp-4 whitespace-pre-wrap">{post.content}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-[#FF6B1A]/10 mt-6 text-[10px] font-bold text-[#6F7178]">
                <div className="w-5 h-5 rounded-full bg-[#171C38]/5 flex items-center justify-center text-[#6F7178] border border-[#FF6B1A]/10">
                  <User className="w-3 h-3" />
                </div>
                <span className="truncate">{post.author}</span>
                <span className="ml-auto">{post.date}</span>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="col-span-full bg-[#171C38]/5 border border-[#FF6B1A]/10 border-dashed rounded-3xl py-16 text-center text-[#6F7178] w-full">
              <BookOpen className="w-12 h-12 mx-auto mb-2 stroke-[1.5] text-[#6F7178]" />
              <h4 className="font-bold text-sm text-[#171C38]">Belum Ada Artikel</h4>
              <p className="text-xs text-[#6F7178] mt-1 font-semibold">Nantikan tips-tips seputar keuangan dan bisnis UMKM yang akan segera hadir.</p>
            </div>
          )}
        </div>
      )}

      {/* CREATE POST MODAL */}
      {modalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#171C38]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-xl animate-scale-in text-left p-6 md:p-8 shadow-[0_8px_32px_rgba(23,28,56,0.12)] border border-[#FF6B1A]/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#171C38]">Publikasikan Artikel Baru</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-[#6F7178] hover:text-[#171C38] p-1 rounded-full hover:bg-[#171C38]/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Judul Artikel</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: 5 Strategi Manajemen Kas Agar Bisnis Kuliner Tetap Likuid"
                  value={newPostForm.title}
                  onChange={(e) => setNewPostForm({ ...newPostForm, title: e.target.value })}
                  className="w-full bg-[#171C38]/5 border border-[#FF6B1A]/20 focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-3 text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178] transition-all focus-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6F7178] mb-1.5">Konten Artikel</label>
                <textarea 
                  rows="10"
                  required
                  placeholder="Tulis materi edukasi, tips, atau wawasan bisnis yang bermanfaat untuk dibaca wirausaha..."
                  value={newPostForm.content}
                  onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
                  className="w-full bg-[#171C38]/5 border border-[#FF6B1A]/20 focus:outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/10 rounded-xl p-4 text-xs font-semibold text-[#171C38] placeholder:text-[#6F7178] resize-none transition-all focus-ring whitespace-pre-wrap"
                />
              </div>

              <button
                type="submit"
                className="w-full cyber-btn text-xs py-3.5 rounded-xl mt-2 cursor-pointer"
              >
                Publikasikan Artikel
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
