import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Settings, Package, Sparkles, Leaf } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
  onCartClick: () => void;
  onAuthClick: () => void;
  isMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onCartClick, onAuthClick, isMenuOpen }) => {
  const cartCtx = useContext(CartContext);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check if link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-emerald-700 transition-colors">SO</div>
            <span className="text-2xl font-serif font-bold tracking-tight text-slate-900">
              Supr <span className="text-emerald-600">Organic</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-emerald-600'}`}
            >
              Mushrooms
            </Link>
            
            <Link 
              to="/chef" 
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${isActive('/chef') ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-emerald-600'}`}
            >
               <Sparkles size={16} className={isActive('/chef') ? 'text-emerald-600' : 'text-amber-500'}/> AI Chef
            </Link>

            <span className="text-sm font-medium text-slate-400 cursor-not-allowed" title="Harvesting Soon">Saffron (Soon)</span>
            
            <a href="#labs" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Our Labs</a>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button onClick={onCartClick} className="p-2 text-slate-600 hover:text-emerald-600 relative transition-colors">
              <ShoppingCart size={22} />
              {cartCtx && cartCtx.totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white animate-bounce-short">
                  {cartCtx.totalItems}
                </span>
              )}
            </button>
            
            {/* Desktop Auth Buttons */}
            {auth?.user ? (
               <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200">
                  {auth.isAdmin ? (
                    <Link 
                      to="/admin" 
                      className={`p-2 rounded-full transition-colors ${isActive('/admin') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                      title="Admin Dashboard"
                    >
                      <Settings size={18} />
                    </Link>
                  ) : (
                    <Link 
                      to="/orders" 
                      className={`p-2 rounded-full transition-colors ${isActive('/orders') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                      title="My Orders"
                    >
                      <Package size={18} />
                    </Link>
                  )}
                  <div className="text-right hidden lg:block mr-2">
                    <p className="text-xs text-slate-400">Welcome,</p>
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[100px]">{auth.user.full_name || 'User'}</p>
                  </div>
                  <button 
                    onClick={() => { auth.signOut(); navigate('/'); }} 
                    className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
               </div>
            ) : (
              <button 
                onClick={onAuthClick} 
                className="hidden md:flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200"
              >
                <User size={18} /><span>Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={onMenuClick} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white absolute w-full left-0 shadow-xl animate-in slide-in-from-top-5 z-40">
          <div className="px-4 py-6 space-y-4">
            <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium">
              <Leaf size={18} className="text-emerald-600"/> Mushrooms
            </Link>
            <Link to="/chef" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium">
              <Sparkles size={18} className="text-amber-500"/> AI Chef
            </Link>
            <div className="flex items-center gap-3 p-3 rounded-xl text-slate-400 font-medium cursor-not-allowed">
              <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div> Saffron (Soon)
            </div>
            
            <div className="border-t border-slate-100 my-4 pt-4">
              {auth?.user ? (
                <>
                  <div className="px-3 mb-4">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="font-bold text-slate-900">{auth.user.email}</p>
                  </div>
                  {auth.isAdmin ? (
                    <Link to="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 text-emerald-700 font-bold bg-emerald-50/50 mb-2">
                      <Settings size={18}/> Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 text-emerald-700 font-bold bg-emerald-50/50 mb-2">
                      <Package size={18}/> My Orders
                    </Link>
                  )}
                  <button onClick={() => auth.signOut()} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition-colors">
                    <LogOut size={18}/> Sign Out
                  </button>
                </>
              ) : (
                <button onClick={onAuthClick} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2">
                  <User size={18} /> Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};