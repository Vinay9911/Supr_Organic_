import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LayoutDashboard, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const cartContext = useContext(CartContext);
  const { user, isAdmin, signOut } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  const handleCartClick = () => {
    cartContext?.setIsCartOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
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
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-brand-cream/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <button onClick={scrollToTop} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand-brown rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-brown/20 group-hover:bg-brand-dark transition-colors">
                SM
              </div>
              <span className="text-2xl font-serif font-bold text-brand-text tracking-tight">Supr Mushrooms</span>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={scrollToTop} className="text-sm font-medium text-brand-muted hover:text-brand-brown transition-colors">Home</button>
              <button onClick={() => scrollToSection('shop')} className="text-sm font-medium text-brand-muted hover:text-brand-brown transition-colors">Shop</button>
              
              {user ? (
                 <div className="flex items-center gap-4">
                    <Link to="/orders" className="text-sm font-bold text-brand-text hover:text-brand-brown">My Orders</Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-1 text-sm font-bold text-brand-brown hover:text-brand-dark bg-brand-light px-3 py-1 rounded-full border border-brand-brown/20">
                        <LayoutDashboard size={14}/> Admin
                      </Link>
                    )}
                    <button onClick={() => signOut()} className="text-sm font-medium text-red-500 hover:text-red-600">Logout</button>
                 </div>
              ) : (
                <button onClick={() => setIsAuthOpen(true)} className="flex items-center gap-2 text-sm font-bold text-brand-text hover:text-brand-brown">
                  <User size={18}/> Login
                </button>
              )}

              {/* Wishlist Button */}
              <Link 
                to="/wishlist" 
                className="relative p-3 bg-brand-light rounded-full hover:bg-brand-cream text-brand-brown transition-all hover:scale-105"
              >
                <Heart size={20} />
              </Link>

              {/* Cart Button */}
              <button 
                onClick={handleCartClick}
                className="relative p-3 bg-brand-light rounded-full hover:bg-brand-cream text-brand-brown transition-all hover:scale-105"
              >
                <ShoppingBag size={20} />
                {cartContext && cartContext.cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-brand-green text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {cartContext.cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
               <button onClick={handleCartClick} className="relative p-2 text-brand-text">
                <ShoppingBag size={24} />
                {cartContext && cartContext.cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-green text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {cartContext.cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-text">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-light border-t border-brand-cream p-4 space-y-4 animate-in slide-in-from-top-5">
            <button onClick={scrollToTop} className="block py-2 text-brand-muted font-medium w-full text-left hover:text-brand-brown">Home</button>
            <button onClick={() => scrollToSection('shop')} className="block py-2 text-brand-muted font-medium w-full text-left hover:text-brand-brown">Shop</button>
            <Link to="/wishlist" onClick={()=>setIsMenuOpen(false)} className="block py-2 text-brand-muted font-medium w-full text-left hover:text-brand-brown">Wishlist</Link>
            {user ? (
               <>
                 <Link to="/orders" onClick={()=>setIsMenuOpen(false)} className="block py-2 text-brand-text font-bold">My Orders</Link>
                 {isAdmin && <Link to="/admin" onClick={()=>setIsMenuOpen(false)} className="block py-2 text-brand-brown font-bold">Admin Dashboard</Link>}
                 <button onClick={()=>{signOut(); setIsMenuOpen(false)}} className="block py-2 text-red-500 font-medium w-full text-left">Logout</button>
               </>
            ) : (
               <button onClick={()=>{setIsAuthOpen(true); setIsMenuOpen(false)}} className="block py-2 text-brand-brown font-bold w-full text-left">Login / Signup</button>
            )}
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};