import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Experience } from '../types';

export const ExperienceSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'experiences'));
        const expList: Experience[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          expList.push({
            id: doc.id,
            role: data.role || '',
            company: data.company || '',
            period: data.period || '',
            description: data.description || []
          });
        });
        setExperiences(expList);
      } catch (error) {
        console.error("خطأ في جلب الخبرات من Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <h2 className="font-bold text-base text-gray-900 mb-4">الخبرات المهنية (Firebase)</h2>
      
      {loading ? (
        <p className="text-gray-400 text-xs">جاري تحميل الخبرات...</p>
      ) : experiences.length === 0 ? (
        <p className="text-gray-500 text-xs">لا توجد خبرات مضافة في قاعدة البيانات حالياً.</p>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="border-b border-gray-100 pb-4 last:border-none last:pb-0">
              <h3 className="font-bold text-sm text-gray-900">{exp.role}</h3>
              <p className="text-gray-600 text-xs mt-0.5">{exp.company} • {exp.period}</p>
              <ul className="text-gray-600 text-xs list-disc list-inside space-y-1 mt-2.5">
                {exp.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};