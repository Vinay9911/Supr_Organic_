import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">SO</div>
            <span className="text-xl font-serif font-bold text-white">Supr Organic</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Revolutionizing agriculture through modern technology. From Delhi, for the world. Premium aeroponic saffron and scientifically farmed mushrooms.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Shop</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Mushrooms</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Saffron (Upcoming)</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Organic Salts</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Starter Kits</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Our Labs</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Sustainability</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Press</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Join the Revolution</h4>
          <p className="text-sm text-slate-400 mb-4">Subscribe for updates on our Aeroponic Saffron launch.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email address" className="bg-slate-800 border-none rounded-full px-4 py-2 text-sm w-full focus:ring-2 focus:ring-emerald-500 outline-none" />
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-emerald-500 transition-colors">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2026 Supr Organic Agriculture Pvt. Ltd. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Shipping Policy</a>
        </div>
      </div>
    </footer>
  );
};