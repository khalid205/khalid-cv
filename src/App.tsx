import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProfileCard } from './components/ProfileCard';
import { ProjectsSection } from './components/ProjectsSection';
import { FeedSection } from './components/FeedSection';
import { ExperienceFullSection } from './components/ExperienceFullSection';
import { SkillsSection } from './components/SkillsSection';
import { TechnologiesTimeline } from './components/TechnologiesTimeline';
import { Lightbulb, PersonBadge } from 'react-bootstrap-icons';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home'); // home, experiences, skills, technologies
  const [skills, setSkills] = useState<string[]>([]); // المهارات المتزامنة مع Firebase للعمود الأيمن

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12" dir="rtl">
      {/* شريط التنقل العلوي */}
      <Navbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* العمود الأول (يمين): البطاقة الشخصية والمهارات المحدثة تلقائياً من Firebase */}
          <div className="lg:col-span-3 space-y-6">
            <ProfileCard />
            
            <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-lg shadow-gray-100">
              <h2 className="font-bold text-base text-gray-950 mb-4 flex items-center gap-2">
                <Lightbulb className="text-blue-600" size={18} /> المهارات التقنية
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <p className="text-gray-400 text-xs">لا توجد مهارات مضافة.</p>
                ) : (
                  skills.map((skill, index) => (
                    <span key={index} className="bg-blue-50 text-blue-800 text-xs px-3 py-1.5 rounded-full font-semibold border border-blue-100">
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* العمود الثاني (الوسط): المحتوى حسب التبويب النشط */}
          <div className="lg:col-span-6 space-y-6">
            
            {activeTab === 'home' && (
              <>
                {/* نبذة عني */}
                <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg shadow-gray-100">
                  <h2 className="font-bold text-lg text-gray-950 mb-3 flex items-center gap-2.5">
                    <PersonBadge className="text-blue-600" size={20} /> نبذة تعريفيّة
                  </h2>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    مطور واجهات أمامية (Frontend Developer) شغوف ببناء وتطوير تطبيقات ويب حديثة وعالية الأداء باستخدام React و TypeScript و Tailwind CSS.
                  </p>
                </section>

                {/* نظام المناشير التفاعلي */}
                <FeedSection searchTerm={searchTerm} />
              </>
            )}

            {activeTab === 'experiences' && (
              <ExperienceFullSection />
            )}

            {activeTab === 'skills' && (
              <SkillsSection onSkillsUpdate={setSkills} />
            )}

            {/* صفحة التقنيات الجديدة */}
            {activeTab === 'technologies' && (
              <TechnologiesTimeline />
            )}

          </div>

          {/* العمود الثالث (يسار): مشاريع GitHub مع تصفية البحث */}
          <div className="lg:col-span-3 space-y-6">
            <ProjectsSection searchTerm={searchTerm} />
          </div>

        </div>
      </main>
    </div>
  );
}