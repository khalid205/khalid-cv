import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { PlusCircle, PencilSquare, Trash, X } from 'react-bootstrap-icons';

interface Technology {
  id: string;
  year: string;
  title: string;
  description: string;
  category: 'left' | 'right';
  createdAt?: any;
}

export const TechnologiesTimeline: React.FC = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // حالة التحميل للأزرار

  // حالات نموذج الإضافة والتعديل
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [year, setYear] = useState('01');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'left' | 'right'>('left');

  // حالة تأكيد الحذف
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const techCollectionRef = collection(db, 'technologies_timeline');

  const fetchTechnologies = async () => {
    try {
      const q = query(techCollectionRef, orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(q);
      const list: Technology[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        list.push({
          id: docSnapshot.id,
          year: data.year || '01',
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'left',
          createdAt: data.createdAt
        });
      });

      if (list.length === 0) {
        const initialData = [
          { year: '01', title: 'HTML5', description: 'أحدث إصدار من لغة الهيكل الأساسية لبناء صفحات الويب، وتتضمن عناصر دلالية متطورة ودعم أفضل للوسائط المتعددة.', category: 'left' },
          { year: '01', title: 'CSS3', description: 'تقنية تنسيق وتصميم صفحات الويب عبر خصائص متقدمة مثل Flexbox و Grid والرسوم المتحركة والانتقالات السلسة.', category: 'right' },
          { year: '02', title: 'TypeScript', description: 'امتداد لغة JavaScript يضيف ميزة تحديد أنواع البيانات (Types) بشكل ساكن، مما يقلل الأخطاء ويسهل صيانة التطبيقات.', category: 'left' },
          { year: '02', title: 'Bootstrap', description: 'أشهر إطار عمل CSS لتطوير واجهات متجاوبة ومصممة خصيصاً لتناسب الهواتف المحمولة أولاً عبر مكونات جاهزة.', category: 'right' },
          { year: '03', title: 'Tailwind CSS', description: 'إطار عمل منخفض المستوى (Utility-first) يتيح لك بناء تصاميم مخصصة وعصرية مباشرة داخل ملفات الـ JSX.', category: 'left' },
          { year: '03', title: 'React Hooks', description: 'ميزات أساسية في React مثل useState و useEffect تتيح لك إدارة الحالة ودورة حياة المكونات بدون Classes.', category: 'right' }
        ];

        for (const item of initialData) {
          await addDoc(techCollectionRef, { ...item, createdAt: serverTimestamp() });
        }
        return fetchTechnologies();
      }

      setTechnologies(list);
    } catch (error) {
      console.error("خطأ في جلب التقنيات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setActionLoading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'technologies_timeline', editingId), {
          year,
          title: title.trim(),
          description: description.trim(),
          category
        });
      } else {
        await addDoc(techCollectionRef, {
          year,
          title: title.trim(),
          description: description.trim(),
          category,
          createdAt: serverTimestamp()
        });
      }
      resetForm();
      fetchTechnologies();
    } catch (error) {
      console.error("خطأ في الحفظ:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (tech: Technology) => {
    setEditingId(tech.id);
    setYear(tech.year);
    setTitle(tech.title);
    setDescription(tech.description);
    setCategory(tech.category);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      await deleteDoc(doc(db, 'technologies_timeline', id));
      setTechnologies(technologies.filter(t => t.id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("خطأ في الحذف:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingId(null);
    setYear('01');
    setTitle('');
    setDescription('');
    setCategory('left');
  };

  const groupedByYear = technologies.reduce((acc: { [key: string]: Technology[] }, tech) => {
    if (!acc[tech.year]) acc[tech.year] = [];
    acc[tech.year].push(tech);
    return acc;
  }, {});

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg shadow-gray-100 space-y-6" id="Companies">
      
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <p className="pragraph text-blue-600 font-bold text-xs uppercase tracking-wider">Technologies Roadmap</p>
          <h2 className="text-xl font-bold text-gray-950">تقنيات التطوير والأدوات</h2>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-200 cursor-pointer"
        >
          <PlusCircle size={16} /> إضافة تقنية
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-xs text-center py-12">جاري التحميل...</p>
      ) : (
        <div className="timeline">
          <div className="timeline-content">
            {Object.keys(groupedByYear).map((yearKey) => {
              const yearItems = groupedByYear[yearKey];
              const leftItem = yearItems.find(i => i.category === 'left');
              const rightItem = yearItems.find(i => i.category === 'right');

              return (
                <React.Fragment key={yearKey}>
                  <div className="year">{yearKey}</div>

                  {/* الجهة اليسرى */}
                  <div className="left">
                    {leftItem ? (
                      <div className="content">
                        <div className="flex justify-between items-center mb-1">
                          <h5 className="m-0">{leftItem.title}</h5>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleEdit(leftItem)} className="p-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer" title="تعديل">
                              <PencilSquare size={13} />
                            </button>
                            <button onClick={() => setDeleteConfirmId(leftItem.id)} className="p-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer" title="حذف">
                              <Trash size={13} />
                            </button>
                          </div>
                        </div>
                        <p>{leftItem.description}</p>
                      </div>
                    ) : (
                      <div className="content opacity-40 text-center text-xs text-gray-400">فارغ</div>
                    )}
                  </div>

                  <div className="clearfix"></div>

                  {/* الجهة اليمنى */}
                  <div className="right">
                    {rightItem ? (
                      <div className="content">
                        <div className="flex justify-between items-center mb-1">
                          <h5 className="m-0">{rightItem.title}</h5>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleEdit(rightItem)} className="p-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer" title="تعديل">
                              <PencilSquare size={13} />
                            </button>
                            <button onClick={() => setDeleteConfirmId(rightItem.id)} className="p-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer" title="حذف">
                              <Trash size={13} />
                            </button>
                          </div>
                        </div>
                        <p>{rightItem.description}</p>
                      </div>
                    ) : (
                      <div className="content opacity-40 text-center text-xs text-gray-400">فارغ</div>
                    )}
                  </div>

                  <div className="clearfix"></div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* نافذة الإضافة / التعديل */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-950">{editingId ? 'تعديل التقنية' : 'إضافة تقنية جديدة'}</h3>
              <button onClick={resetForm} disabled={actionLoading} className="text-gray-400 hover:text-gray-700 cursor-pointer"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">رقم السنة / المرحلة (مثال: 01, 02)</label>
                <input type="text" value={year} onChange={(e) => setYear(e.target.value)} required disabled={actionLoading} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">الجانب (يمين / يسار)</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as 'left' | 'right')} disabled={actionLoading} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs">
                  <option value="left">يسار (Left)</option>
                  <option value="right">يمين (Right)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">اسم التقنية</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={actionLoading} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">الشرح</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required disabled={actionLoading} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs resize-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} disabled={actionLoading} className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer">إلغاء</button>
                <button 
                  type="submit" 
                  disabled={actionLoading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center justify-center gap-2 min-w-[80px]"
                >
                  {actionLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    editingId ? 'حفظ التعديلات' : 'إضافة'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <h3 className="font-bold text-base text-gray-950">تأكيد الحذف</h3>
            <p className="text-gray-600 text-xs">هل أنت متأكد من رغبتك في حذف هذه التقنية نهائياً؟</p>
            <div className="flex justify-center gap-2 pt-2">
              <button onClick={() => setDeleteConfirmId(null)} disabled={actionLoading} className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer">إلغاء</button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)} 
                disabled={actionLoading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center justify-center gap-2 min-w-[80px]"
              >
                {actionLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'نعم، حذف'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};