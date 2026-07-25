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
import type { Skill } from '../types';
import { Lightbulb, PlusCircle, PencilSquare, Trash, Check, X, ExclamationTriangle, CodeSlash } from 'react-bootstrap-icons';

interface SkillsProps {
  onSkillsUpdate?: (skills: string[]) => void;
}

export const SkillsSection = ({ onSkillsUpdate }: SkillsProps) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // حالات نافذة الإضافة والتعديل
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [skillName, setSkillName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // حالات نافذة تأكيد الحذف
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const skillsCollectionRef = collection(db, 'skills');

  // جلب المهارات من Firebase
  const fetchSkills = async () => {
    try {
      const querySnapshot = await getDocs(skillsCollectionRef);
      const list: Skill[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        list.push({
          id: docSnapshot.id,
          name: data.name || ''
        });
      });
      setSkills(list);
      if (onSkillsUpdate) {
        onSkillsUpdate(list.map(s => s.name));
      }
    } catch (error) {
      console.error("خطأ في جلب المهارات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSkillName('');
    setShowModal(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setIsEditing(true);
    setCurrentId(skill.id);
    setSkillName(skill.name);
    setShowModal(true);
  };

  // إضافة أو تعديل مهارة
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setSubmitting(true);
    try {
      if (isEditing && currentId) {
        const docRef = doc(db, 'skills', currentId);
        await updateDoc(docRef, { name: skillName.trim() });
      } else {
        await addDoc(skillsCollectionRef, { name: skillName.trim() });
      }
      setShowModal(false);
      await fetchSkills();
    } catch (error) {
      console.error("خطأ في حفظ المهارة:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: string) => {
    setSkillToDelete(id);
    setShowDeleteModal(true);
  };

  // حذف مهارة نهائياً
  const handleDelete = async () => {
    if (!skillToDelete) return;

    setDeleting(true);
    try {
      const docRef = doc(db, 'skills', skillToDelete);
      await deleteDoc(docRef);
      const updatedList = skills.filter(item => item.id !== skillToDelete);
      setSkills(updatedList);
      if (onSkillsUpdate) {
        onSkillsUpdate(updatedList.map(s => s.name));
      }
      setShowDeleteModal(false);
      setSkillToDelete(null);
    } catch (error) {
      console.error("خطأ في حذف المهارة:", error);
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
            <Lightbulb className="text-blue-600" size={24} /> إدارة المهارات التقنية
          </h2>
          <p className="text-gray-500 text-xs mt-1">إضافة، تعديل، وحذف المهارات لتظهر مباشرة في القائمة الجانبية</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-200 cursor-pointer"
        >
          <PlusCircle size={16} /> إضافة مهارة
        </button>
      </div>

      {/* قائمة المهارات */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg shadow-gray-100">
        {loading ? (
          <p className="text-gray-400 text-xs text-center py-6">جاري تحميل المهارات...</p>
        ) : skills.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-6">لا توجد مهارات مسجلة حالياً.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="border border-gray-100 bg-gray-50/50 hover:bg-white rounded-xl p-3.5 flex justify-between items-center transition-all group">
                <div className="flex items-center gap-2.5">
                  <CodeSlash className="text-blue-600" size={18} />
                  <span className="font-bold text-sm text-gray-800">{skill.name}</span>
                </div>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenEdit(skill)}
                    className="text-gray-400 hover:text-blue-600 p-1.5 transition-colors cursor-pointer"
                    title="تعديل"
                  >
                    <PencilSquare size={15} />
                  </button>
                  <button 
                    onClick={() => confirmDelete(skill.id)}
                    className="text-gray-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* نافذة منبثقة لإضافة أو تعديل مهارة */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-950">
                {isEditing ? 'تعديل المهارة' : 'إضافة مهارة جديدة'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">اسم المهارة</label>
                <input 
                  type="text" 
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="مثال: Next.js" 
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
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

      {/* نافذة منبثقة لتأكيد الحذف */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="bg-red-50 p-3 rounded-full">
                <ExclamationTriangle size={24} />
              </div>
              <h3 className="font-bold text-base text-gray-900">تأكيد حذف المهارة</h3>
            </div>
            
            <p className="text-gray-600 text-xs leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذه المهارة؟ سيتم إزالتها نهائياً من القائمة الجانبية وقاعدة البيانات.
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