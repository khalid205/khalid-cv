import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import type { Post } from '../types';
import { ChatSquareText, Send, Trash, Image as ImageIcon } from 'react-bootstrap-icons';
import profileImg from '../assets/Screenshot_20221010_204216.jpg';

interface FeedProps {
  searchTerm: string;
}

export const FeedSection = ({ searchTerm }: FeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const postsCollectionRef = collection(db, 'posts');

  const fetchPosts = async () => {
    try {
      const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list: Post[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        list.push({
          id: docSnapshot.id,
          content: data.content || '',
          author: data.author || 'خالد',
          createdAt: data.createdAt
        });
      });
      setPosts(list);
    } catch (error) {
      console.error("خطأ في جلب المناشير:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(postsCollectionRef, {
        content: newPostContent.trim(),
        author: 'خالد',
        createdAt: serverTimestamp()
      });
      setNewPostContent('');
      await fetchPosts();
    } catch (error) {
      console.error("خطأ في نشر المنشور:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error("خطأ في حذف المنشور:", error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* خانة كتابة منشور جديد */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-lg shadow-gray-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-gray-50 flex items-center justify-center">
            <img src={profileImg} alt="خالد" className="w-full h-full object-cover object-center" />
          </div>
          <span className="font-bold text-sm text-gray-900">ماذا يدور في ذهنك اليوم يا خالد؟</span>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea 
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="اكتب منشوراً تقنياً، فكرة مشروع، أو تحديثاً..." 
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300 transition-all resize-none"
          />

          <div className="flex justify-between items-center pt-1">
            <div className="text-gray-400 text-[11px] flex items-center gap-1">
              <ImageIcon size={14} /> شارك أحدث أفكارك البرمجية
            </div>
            <button 
              type="submit"
              disabled={submitting || !newPostContent.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold px-5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-200 cursor-pointer disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span>جاري النشر...</span>
              ) : (
                <>
                  <Send size={14} /> نشر
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* قائمة المناشير */}
      <div className="space-y-4">
        <h2 className="font-bold text-base text-gray-950 flex items-center gap-2 px-1">
          <ChatSquareText className="text-blue-600" size={18} /> المنشورات والنشاطات
        </h2>

        {loading ? (
          <p className="text-gray-400 text-xs text-center py-8">جاري تحميل المنشورات...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-8">لا توجد منشورات مطابقة حالياً.</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-lg shadow-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <img src={profileImg} alt={post.author} className="w-full h-full object-cover object-center" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{post.author}</h3>
                    <p className="text-[10px] text-gray-400">منشور عام</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleDeletePost(post.id)}
                  className="text-gray-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                  title="حذف المنشور"
                >
                  <Trash size={15} />
                </button>
              </div>

              <p className="text-gray-700 text-xs leading-relaxed bg-gray-50/60 p-3.5 rounded-xl border border-gray-100 whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};