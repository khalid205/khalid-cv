import { Search, House, Briefcase, Lightbulb, CodeSlash } from 'react-bootstrap-icons';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar = ({ searchTerm, setSearchTerm, activeTab, setActiveTab }: NavbarProps) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-xs w-full">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* الشعار */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setActiveTab('home')}>
          <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md shadow-blue-200 flex items-center justify-center">
            <CodeSlash size={18} />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-sm text-gray-950 block leading-tight">محفظة خالد</span>
            <span className="text-[10px] text-gray-400 font-medium">Frontend Developer</span>
          </div>
        </div>

        {/* أزرار التنقل (التبويبات) */}
        <nav className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'home' 
                ? 'bg-white text-blue-600 shadow-xs border border-gray-100' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <House size={14} /> <span className="hidden md:inline">الرئيسية</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('experiences')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'experiences' 
                ? 'bg-white text-blue-600 shadow-xs border border-gray-100' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase size={14} /> <span className="hidden md:inline">الخبرات</span>
          </button>

          <button 
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'skills' 
                ? 'bg-white text-blue-600 shadow-xs border border-gray-100' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lightbulb size={14} /> <span className="hidden md:inline">المهارات</span>
          </button>

          {/* تبويب التقنيات الجديد */}
          <button 
            onClick={() => setActiveTab('technologies')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'technologies' 
                ? 'bg-white text-blue-600 shadow-xs border border-gray-100' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CodeSlash size={14} /> <span className="hidden md:inline">التقنيات</span>
          </button>
        </nav>

        {/* حقل البحث */}
        <div className="relative max-w-[140px] sm:max-w-xs w-full">
          <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-400">
            <Search size={13} />
          </span>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-8 pl-3 py-1.5 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300 transition-all"
          />
        </div>

      </div>
    </header>
  );
};