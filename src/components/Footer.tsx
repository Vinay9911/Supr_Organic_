import React from 'react';
import { Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand Column */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">SO</div>
            <span className="text-xl font-serif font-bold text-white">Supr Organic</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Revolutionizing agriculture through modern technology. From Delhi, for the world. Premium aeroponic saffron and scientifically farmed mushrooms.
          </p>
        </div>

        {/* Shop Column (Updated) */}
        <div>
          <h4 className="text-white font-bold mb-6">Shop</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Mushrooms</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Saffron (Upcoming)</a></li>
          </ul>
        </div>

        {/* Connect Column (Updated) */}
        <div>
          <h4 className="text-white font-bold mb-6">Want to know more?</h4>
          <div className="flex flex-col gap-4">
             <a 
               href="https://wa.me/918826986127" 
               target="_blank" 
               rel="noreferrer"
               className="flex items-center gap-3 bg-slate-800 hover:bg-emerald-600 transition-colors p-3 rounded-xl text-white group"
             >
                <div className="bg-slate-700 group-hover:bg-emerald-500 p-2 rounded-lg transition-colors">
                  <Phone size={18} />
                </div>
                <span className="text-sm font-medium">+91 8826986127</span>
             </a>

             <a 
               href="mailto:vinaycollege1531@gmail.com"
               className="flex items-center gap-3 bg-slate-800 hover:bg-blue-600 transition-colors p-3 rounded-xl text-white group"
             >
                <div className="bg-slate-700 group-hover:bg-blue-500 p-2 rounded-lg transition-colors">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-medium">vinaycollege1531@gmail.com</span>
             </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex justify-center text-xs text-slate-500">
        <p>© 2026 Supr Organic Agriculture Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
};