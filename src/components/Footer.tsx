import React, { useState } from 'react';
import { Mail, Phone, X, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [showSaffronModal, setShowSaffronModal] = useState(false);
  const navigate = useNavigate();

  const handleShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <footer className="bg-brand-dark text-brand-cream py-16 px-4 sm:px-6 lg:px-8 mt-auto border-t border-brand-brown/30 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-brown rounded-lg flex items-center justify-center text-white font-bold text-sm">SM</div>
              <span className="text-xl font-serif font-bold text-white">Supr Mushrooms</span>
            </div>
            <p className="text-sm leading-relaxed text-brand-cream/80">
              Revolutionizing agriculture through modern technology. From Delhi, for the world. Premium aeroponic saffron and scientifically farmed mushrooms.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-white font-bold mb-6">Shop</h4>
            <ul className="space-y-3 text-sm text-brand-cream/80">
              <li>
                <a href="#shop" onClick={handleShopClick} className="hover:text-white hover:underline transition-colors">
                  Fresh Mushrooms
                </a>
              </li>
              <li>
                <button onClick={() => setShowSaffronModal(true)} className="hover:text-white hover:underline transition-colors text-left">
                  Saffron (Upcoming)
                </button>
              </li>
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
                 href="mailto:vinayaggarwal2711531@gmail.com"
                 className="flex items-center gap-3 bg-black/20 hover:bg-brand-brown transition-colors p-3 rounded-xl text-white group border border-white/10"
               >
                  <div className="bg-white/10 group-hover:bg-white/20 p-2 rounded-lg transition-colors">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm font-medium">vinayaggarwal271@gmail.com</span>
               </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex justify-center text-xs text-brand-cream/60">
          <p>© 2026 Supr Mushrooms. All rights reserved.</p>
        </div>
      </footer>

      {/* Saffron Popup Modal */}
      {showSaffronModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm" onClick={() => setShowSaffronModal(false)}></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 border-2 border-brand-cream text-center">
            
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Sprout className="text-brand-brown" size={32} />
            </div>

            <h3 className="text-2xl font-serif font-bold text-brand-text mb-3">Harvesting Soon!</h3>
            
            <p className="text-brand-muted leading-relaxed mb-8">
              Our team is working hard to bring you the world's finest <b>Aeroponic Saffron</b>. We are currently in the cultivation phase and will be launching soon. Stay tuned for the magic!
            </p>

            <button 
              onClick={() => setShowSaffronModal(false)}
              className="bg-brand-brown text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-dark transition-colors w-full"
            >
              Okay, I'll wait
            </button>

            <button 
              onClick={() => setShowSaffronModal(false)}
              className="absolute top-4 right-4 text-brand-muted hover:text-brand-text bg-brand-light p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};