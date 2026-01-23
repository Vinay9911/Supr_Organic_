import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { X, Minus, Plus, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { CartProvider, CartContext } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer'; 
import { Chatbot } from './components/Chatbot'; 
import { AuthModal } from './components/AuthModal'; 
import { CheckoutModal } from './components/CheckoutModal'; 
import { ResetPassword } from './pages/ResetPassword';

// Pages
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserOrders } from './pages/UserOrders';
import { AIChef } from './pages/AIChef';
import { Wishlist } from './pages/Wishlist';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const auth = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const location = useLocation();

  useEffect(() => { setIsMenuOpen(false); }, [location]);

  const handleCheckoutClick = () => {
    cartCtx?.setIsCartOpen(false);
    if (!auth?.user) setIsAuthOpen(true);
    else setIsCheckoutOpen(true);
  };

  if (auth?.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-brand-brown" size={48} />
          <p className="text-brand-muted font-serif animate-pulse">Loading Supr Organic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-light font-sans text-brand-text">
      <ScrollToTop />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/wishlist" element={<Wishlist />} /> 
          <Route path="/chef" element={<AIChef />} />
          <Route path="/admin" element={auth?.isAdmin ? <AdminDashboard /> : <Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>

      <Footer />
      <Chatbot />

      {/* --- NON-BLOCKING CART DRAWER --- */}
      <div 
        className={`fixed inset-y-0 right-0 z-[90] w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-brand-cream ${
          cartCtx?.isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col pt-24 pb-6 px-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-cream">
            <h2 className="text-xl font-serif font-bold text-brand-text flex items-center gap-2">
              <ShoppingBag size={24}/> Your Cart
            </h2>
            <button onClick={() => cartCtx?.setIsCartOpen(false)} className="p-2 hover:bg-brand-light rounded-full text-brand-muted transition-colors">
              <X size={24}/>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {cartCtx?.cart.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                 <ShoppingBag size={48} className="text-brand-cream mb-4"/>
                 <p className="text-brand-muted font-medium">Your cart is empty</p>
                 <button onClick={() => cartCtx.setIsCartOpen(false)} className="mt-4 text-brand-brown font-bold text-sm hover:underline">Continue Shopping</button>
              </div>
            ) : (
              cartCtx?.cart.map(item => (
                <div key={item.productId} className="flex gap-4 p-3 bg-brand-light/50 rounded-xl border border-brand-cream">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-white" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-brand-text line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-brand-muted mb-2">{item.product.weight}</p>
                    <div className="flex items-center gap-3">
                       <button onClick={()=>cartCtx.updateQuantity(item.productId, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-white border border-brand-cream rounded hover:border-brand-brown transition-colors"><Minus size={12}/></button>
                       <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                       <button onClick={()=>cartCtx.updateQuantity(item.productId, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-white border border-brand-cream rounded hover:border-brand-brown transition-colors"><Plus size={12}/></button>
                    </div>
                  </div>
                  <div className="font-bold text-sm text-brand-brown">₹{item.product.price * item.quantity}</div>
                </div>
              ))
            )}
          </div>

          {cartCtx && cartCtx.cart.length > 0 && (
            <div className="pt-6 border-t border-brand-cream bg-white mt-auto">
              <div className="flex justify-between font-bold text-lg mb-6 text-brand-text">
                <span>Subtotal</span>
                <span>₹{cartCtx.total}</span>
              </div>
              <button 
                onClick={handleCheckoutClick} 
                className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold hover:bg-brand-dark transition-all transform hover:translate-y-[-2px] shadow-lg shadow-brand-brown/20 flex items-center justify-center gap-2"
              >
                Checkout <ArrowRight size={18}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <WishlistProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </WishlistProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;