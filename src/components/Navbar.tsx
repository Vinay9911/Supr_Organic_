import React, { useContext } from 'react';
import { ShoppingCart, User, Heart, Search, Menu, X, LogOut, Settings, Package, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
  onCartClick: () => void;
  onAuthClick: () => void;
  currentView: string;
  onViewChange: (view: 'shop' | 'admin' | 'orders') => void;
  isMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onCartClick, onAuthClick, currentView, onViewChange, isMenuOpen }) => {
  const cartCtx = useContext(CartContext);
  const auth = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('shop')}>
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">SO</div>
            <span className="text-2xl font-serif font-bold tracking-tight text-slate-900">
              Supr <span className="text-emerald-600">Organic</span>
            </span>
          </div>

          {currentView === 'shop' && (
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600">Mushrooms</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600">Saffron</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600">Our Labs</a>
            </div>
          )}

          <div className="flex items-center space-x-5">
             {currentView === 'shop' && (
              <button onClick={onCartClick} className="p-2 text-slate-600 hover:text-emerald-600 relative">
                <ShoppingCart size={22} />
                {cartCtx && cartCtx.totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">{cartCtx.totalItems}</span>
                )}
              </button>
             )}
            
            {auth?.user ? (
               <div className="hidden md:flex items-center gap-3">
                  {auth.isAdmin && (
                    <button onClick={() => onViewChange(currentView === 'shop' ? 'admin' : 'shop')} className={`p-2 rounded-full ${currentView === 'admin' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'}`}>
                      {currentView === 'shop' ? <Settings size={18} /> : <ArrowRight size={18} />}
                    </button>
                  )}
                  {!auth.isAdmin && (
                    <button onClick={() => onViewChange(currentView === 'shop' ? 'orders' : 'shop')} className={`p-2 rounded-full ${currentView === 'orders' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'}`}>
                      {currentView === 'orders' ? <ArrowRight size={18} /> : <Package size={18} />}
                    </button>
                  )}
                  <div className="text-right hidden lg:block">
                    <p className="text-xs text-slate-400">Welcome,</p>
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[100px]">{auth.user.full_name || 'User'}</p>
                  </div>
                  <button onClick={() => auth.signOut()} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><LogOut size={18} className="text-slate-600" /></button>
               </div>
            ) : (
              <button onClick={onAuthClick} className="hidden md:flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-600 transition-all">
                <User size={18} /><span>Login</span>
              </button>
            )}
            <button onClick={onMenuClick} className="md:hidden p-2 text-slate-600">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </div>
    </nav>
  );
};