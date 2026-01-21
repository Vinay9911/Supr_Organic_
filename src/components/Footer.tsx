import React from 'react';
import { Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-brand-cream py-16 px-4 sm:px-6 lg:px-8 mt-auto border-t border-brand-brown/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand Column */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-brown rounded-lg flex items-center justify-center text-white font-bold text-sm">SM</div>
            <span className="text-xl font-serif font-bold text-white">Supr Mashroom</span>
          </div>
          <p className="text-sm leading-relaxed text-brand-cream/80">
            Revolutionizing agriculture through modern technology. From Delhi, for the world. Premium aeroponic saffron and scientifically farmed mushrooms.
          </p>
        </div>

        {/* Shop Column */}
        <div>
          <h4 className="text-white font-bold mb-6">Shop</h4>
          <ul className="space-y-3 text-sm text-brand-cream/80">
            <li><a href="#" className="hover:text-white hover:underline transition-colors">Fresh Mushrooms</a></li>
            <li><a href="#" className="hover:text-white hover:underline transition-colors">Saffron (Upcoming)</a></li>
          </ul>
        </div>

        {/* Connect Column */}
        <div>
          <h4 className="text-white font-bold mb-6">Contact Us</h4>
          <div className="flex flex-col gap-4">
             <a 
               href="https://wa.me/918826986127" 
               target="_blank" 
               rel="noreferrer"
               className="flex items-center gap-3 bg-black/20 hover:bg-brand-brown transition-colors p-3 rounded-xl text-white group border border-white/10"
             >
                <div className="bg-white/10 group-hover:bg-white/20 p-2 rounded-lg transition-colors">
                  <Phone size={18} />
                </div>
                <span className="text-sm font-medium">+91 8826986127</span>
             </a>

             <a 
               href="mailto:vinaycollege1531@gmail.com"
               className="flex items-center gap-3 bg-black/20 hover:bg-brand-brown transition-colors p-3 rounded-xl text-white group border border-white/10"
             >
                <div className="bg-white/10 group-hover:bg-white/20 p-2 rounded-lg transition-colors">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-medium">vinaycollege1531@gmail.com</span>
             </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex justify-center text-xs text-brand-cream/60">
        <p>© 2026 Supr Mashroom. All rights reserved.</p>
      </div>
    </footer>
  );
};