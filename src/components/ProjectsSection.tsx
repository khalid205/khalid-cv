import { useState, useEffect } from 'react';
import { Folder2, BoxArrowUpRight, Star, Git, CodeSlash } from 'react-bootstrap-icons';

interface ProjectsProps {
  searchTerm: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

export const ProjectsSection = ({ searchTerm }: ProjectsProps) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // اسم المستخدم الصحيح على GitHub
  const githubUsername = 'khalid205';

  useEffect(() => {
    const fetchGitHubRepos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=10`);
        
        if (!response.ok) {
          throw new Error('فشل في جلب المشاريع من GitHub');
        }

        const data = await response.json();
        setRepos(data);
      } catch (err) {
        console.error(err);
        setError('تعذر تحميل المشاريع من GitHub حالياً.');
      } finally {
        setLoading(false);
      }
    };

    if (githubUsername) {
      fetchGitHubRepos();
    }
  }, []);

  // تصفية المشاريع بناءً على شريط البحث العلوي
  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (repo.language && repo.language.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-lg shadow-gray-100 space-y-4">
        <h2 className="font-bold text-base text-gray-950 flex items-center gap-2">
          <Folder2 className="text-blue-600" size={18} /> مشاريع GitHub
        </h2>

        {loading ? (
          <p className="text-gray-400 text-xs text-center py-6">جاري جلب المشاريع من GitHub...</p>
        ) : error ? (
          <p className="text-red-500 text-xs text-center py-6">{error}</p>
        ) : filteredRepos.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-6">لا توجد مشاريع تطابق بحثك.</p>
        ) : (
          <div className="space-y-3">
            {filteredRepos.map((repo) => (
              <div key={repo.id} className="border border-gray-100 bg-gray-50/50 hover:bg-white rounded-xl p-3.5 transition-all space-y-2 group">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                    {repo.name}
                  </h3>
                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 p-1 transition-colors"
                    title="عرض المستودع على GitHub"
                  >
                    <BoxArrowUpRight size={14} />
                  </a>
                </div>

                <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                  {repo.description || 'لا يوجد وصف متاح لهذا المستودع.'}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
                  {repo.language && (
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                      <CodeSlash size={12} /> {repo.language}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1" title="النجوم">
                      <Star size={12} className="text-amber-500" /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1" title="التفريعات">
                      <Git size={12} className="text-gray-400" /> {repo.forks_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};