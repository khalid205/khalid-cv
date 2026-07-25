import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import type { Experience } from '../types';
import { Briefcase, Building, PlusCircle, PencilSquare, Trash, Check, X, ExclamationTriangle } from 'react-bootstrap-icons';

export const ExperienceFullSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // حالات نموذج الإضافة أو التعديل
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [period, setPeriod] = useState('');
  const [descriptionText, setDescriptionText] = useState(''); // سيفصل بين الأسطر بفاصل أو Enter
  const [submitting, setSubmitting] = useState(false);

  // حالات نافذة تأكيد الحذف (Modal)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expToDelete, setExpToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const expCollectionRef = collection(db, 'experiences');

  // 1. Read (جلب الخبرات)
  const fetchExperiences = async () => {
    try {
      const querySnapshot = await getDocs(expCollectionRef);
      const list: Experience[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        list.push({
          id: docSnapshot.id,
          role: data.role || '',
          company: data.company || '',
          period: data.period || '',
          description: data.description || []
        });
      });
      setExperiences(list);
    } catch (error) {
      console.error("خطأ في جلب الخبرات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // فتح نافذة الإضافة
  const handleOpenAdd = () => {
    setIsEditing(false);
    setRole('');
    setCompany('');
    setPeriod('');
    setDescriptionText('');
    setShowModal(true);
  };

  // فتح نافذة التعديل
  const handleOpenEdit = (exp: Experience) => {
    setIsEditing(true);
    setCurrentId(exp.id);
    setRole(exp.role);
    setCompany(exp.company);
    setPeriod(exp.period);
    setDescriptionText(exp.description.join('\n'));
    setShowModal(true);
  };

  // 2 & 3. Create / Update (إنشاء أو تحديث الخبرة)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !company.trim()) return;

    setSubmitting(true);
    const descArray = descriptionText.split('\n').filter(item => item.trim() !== '');

    try {
      if (isEditing && currentId) {
        // تحديث
        const docRef = doc(db, 'experiences', currentId);
        await updateDoc(docRef, {
          role,
          company,
          period,
          description: descArray
        });
      } else {
        // إنشاء جديد
        await addDoc(expCollectionRef, {
          role,
          company,
          period,
          description: descArray
        });
      }
      setShowModal(false);
      await fetchExperiences();
    } catch (error) {
      console.error("خطأ في حفظ الخبرة:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // فتح نافذة تأكيد الحذف
  const confirmDelete = (id: string) => {
    setExpToDelete(id);
    setShowDeleteModal(true);
  };

  // 4. Delete (الحذف النهائي من Firebase)
  const handleDelete = async () => {
    if (!expToDelete) return;

    setDeleting(true);
    try {
      const docRef = doc(db, 'experiences', expToDelete);
      await deleteDoc(docRef);
      setExperiences(experiences.filter(item => item.id !== expToDelete));
      setShowDeleteModal(false);
      setExpToDelete(null);
    } catch (error) {
      console.error("خطأ في حذف الخبرة:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* رأس القسم مع زر الإضافة */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg shadow-gray-100 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-xl text-gray-950 flex items-center gap-2.5">
            <Briefcase className="text-blue-600" size={24} /> الخبرات المهنية
          </h2>
          <p className="text-gray-500 text-xs mt-1">إدارة السجل المهني والخبرات العملية</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-200 cursor-pointer"
        >
          <PlusCircle size={16} /> إضافة خبرة
        </button>
      </div>

      {/* عرض الخبرات */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg shadow-gray-100">
        {loading ? (
          <p className="text-gray-400 text-xs text-center py-6">جاري تحميل سجل الخبرات...</p>
        ) : experiences.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-6">لا توجد خبرات مسجلة حالياً. أضف خبرتك الأولى!</p>
        ) : (
          <div className="space-y-6 border-r-2 border-blue-100 pr-4 mr-2">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative space-y-2 group">
                <div className="absolute -right-[23px] top-1.5 bg-blue-600 w-3 h-3 rounded-full border-2 border-white"></div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">{exp.role}</h3>
                    <p className="text-blue-700 text-xs font-semibold flex items-center gap-1.5 mt-0.5">
                      <Building size={13} /> {exp.company} • <span className="text-gray-400 font-normal">{exp.period}</span>
                    </p>
                  </div>

                  {/* أزرار التعديل والحذف للخبرة */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleOpenEdit(exp)}
                      className="text-gray-400 hover:text-blue-600 p-1.5 transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <PencilSquare size={16} />
                    </button>
                    <button 
                      onClick={() => confirmDelete(exp.id)}
                      className="text-gray-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>

                <ul className="text-gray-600 text-xs list-disc list-inside space-y-1.5 pt-1">
                  {exp.description.map((desc, idx) => (
                    <li key={idx} className="leading-relaxed">{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* نافذة منبثقة (Modal) لإضافة أو تعديل خبرة */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-950">
                {isEditing ? 'تعديل الخبرة المهنية' : 'إضافة خبرة مهنية جديدة'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">المسمى الوظيفي</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="مثال: Frontend Developer" 
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">الشركة / جهة العمل</label>
                <input 
                  type="text" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="مثال: Tech Company" 
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">فترة العمل</label>
                <input 
                  type="text" 
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="مثال: 2024 - حتى الآن" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">المهام والإنجازات (كل سطر يعتبر نقطة)</label>
                <textarea 
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                  placeholder="اكتب كل مهمة في سطر مستقل..." 
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-200 cursor-pointer disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} /> حفظ
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* قائمة منبثقة (Modal) لتأكيد عملية الحذف مع UX احترافي */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="bg-red-50 p-3 rounded-full">
                <ExclamationTriangle size={24} />
              </div>
              <h3 className="font-bold text-base text-gray-900">تأكيد حذف الخبرة</h3>
            </div>
            
            <p className="text-gray-600 text-xs leading-relaxed">
              هل أنت متأكد من رغبتك في حذف سجل هذه الخبرة المهنية؟ سيتم إزالتها نهائياً من قاعدة البيانات.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button 
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-semibold px-5 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-red-200 cursor-pointer disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <span>حذف نهائي</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};