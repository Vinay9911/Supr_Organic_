import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { CheckoutModal } from './CheckoutModal';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const cartContext = useContext(CartContext);
  const { user, signOut } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  const handleCartClick = () => {
    if (cartContext?.cartCount === 0) return;
    setIsCheckoutOpen(true);
  };

  // --- NEW SCROLL HANDLER ---
  const scrollToSection = (sectionId: string) => {
    // 1. If we are not on Home page, go there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation, then scroll (handled by Home.tsx useEffect)
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // 2. If already on Home, just scroll
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Also scrolls to top */}
            <button onClick={scrollToTop} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                SO
              </div>
              <span className="text-2xl font-serif font-bold text-slate-900 tracking-tight">Supr Organic</span>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={scrollToTop} className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Home</button>
              
              <button onClick={() => scrollToSection('shop')} className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Shop</button>
              
              <button onClick={() => scrollToSection('labs')} className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Technology</button>
              
              {user ? (
                 <div className="flex items-center gap-4">
                    <Link to="/orders" className="text-sm font-bold text-slate-900 hover:text-emerald-600">My Orders</Link>
                    {user.email === 'vinaycollege1531@gmail.com' && (
                      <Link to="/admin" className="text-sm font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1 rounded-full">Admin</Link>
                    )}
                    <button onClick={signOut} className="text-sm font-medium text-red-500 hover:text-red-600">Logout</button>
                 </div>
              ) : (
                <button onClick={() => setIsAuthOpen(true)} className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-emerald-600">
                  <User size={18}/> Login
                </button>
              )}

              {/* Cart Button */}
              <button 
                onClick={handleCartClick}
                className="relative p-3 bg-slate-50 rounded-full hover:bg-emerald-50 text-slate-900 hover:text-emerald-600 transition-all hover:scale-105"
              >
                <ShoppingBag size={20} />
                {cartContext && cartContext.cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {cartContext.cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
               <button onClick={handleCartClick} className="relative p-2 text-slate-900">
                <ShoppingBag size={24} />
                {cartContext && cartContext.cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {cartContext.cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 animate-in slide-in-from-top-5">
            <button onClick={scrollToTop} className="block py-2 text-slate-600 font-medium w-full text-left">Home</button>
            <button onClick={() => scrollToSection('shop')} className="block py-2 text-slate-600 font-medium w-full text-left">Shop</button>
            <button onClick={() => scrollToSection('labs')} className="block py-2 text-slate-600 font-medium w-full text-left">Technology</button>
            {user ? (
               <>
                 <Link to="/orders" onClick={()=>setIsMenuOpen(false)} className="block py-2 text-slate-900 font-bold">My Orders</Link>
                 <button onClick={()=>{signOut(); setIsMenuOpen(false)}} className="block py-2 text-red-500 font-medium w-full text-left">Logout</button>
               </>
            ) : (
               <button onClick={()=>{setIsAuthOpen(true); setIsMenuOpen(false)}} className="block py-2 text-emerald-600 font-bold w-full text-left">Login / Signup</button>
            )}
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
};