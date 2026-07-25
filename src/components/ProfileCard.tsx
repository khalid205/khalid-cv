import { Envelope, Telephone, Github, GeoAlt } from 'react-bootstrap-icons';
import profileImg from '../assets/Screenshot_20221010_204216.jpg'; // عدل المسار حسب مكان وجود الصورة الفعلي في مجلد src

export const ProfileCard = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg shadow-gray-100 text-center space-y-4">
      
      {/* الصورة الشخصية والاسم */}
      <div className="relative inline-block mx-auto">
        <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto shadow-md shadow-blue-200 border-2 border-white flex items-center justify-center bg-gray-50">
          <img 
            src={profileImg} 
            alt="صورة خالد" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white" title="متاح للعمل"></div>
      </div>

      <div className="space-y-1">
        <h1 className="font-bold text-lg text-gray-950">خالد</h1>
        <p className="text-blue-700 text-xs font-semibold">Frontend Developer</p>
        <p className="text-gray-400 text-[11px] flex items-center justify-center gap-1 pt-1">
          <GeoAlt size={12} /> السعودية
        </p>
      </div>

      {/* رابط GitHub الاجتماعي */}
      <div className="flex justify-center gap-2 pt-1">
        <a 
          href="https://github.com/khalid205" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-2.5 rounded-xl transition-colors border border-gray-100"
          title="GitHub"
        >
          <Github size={16} />
        </a>
      </div>

      {/* أزرار التواصل (الإيميل ورقم الهاتف) */}
      <div className="space-y-2 pt-2">
        <a 
          href="mailto:khalid.altaj.94@gmail.com"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 cursor-pointer"
        >
          <Envelope size={15} /> تواصل معي (الإيميل)
        </a>
        
        <a 
          href="tel:+966551540183"
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Telephone size={15} className="text-blue-600" /> +966 55 154 0183
        </a>
      </div>

    </div>
  );
};