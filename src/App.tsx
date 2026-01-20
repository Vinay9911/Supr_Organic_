import React, { useState, useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { X, Minus, Plus } from 'lucide-react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { CartProvider, CartContext } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer'; 
import { Chatbot } from './components/Chatbot'; 
import { AuthModal } from './components/AuthModal'; 
import { CheckoutModal } from './components/CheckoutModal'; 
import { AIChef } from './pages/AIChef';

// Pages
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserOrders } from './pages/UserOrders';

const AppContent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const auth = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const location = useLocation();

  // Close menu on route change
  React.useEffect(() => { setIsMenuOpen(false); }, [location]);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (!auth?.user) setIsAuthOpen(true);
    else setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      <Navbar 
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        isMenuOpen={isMenuOpen}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/orders" element={<UserOrders />} />
          {/* Protected Admin Route */}
          <Route path="/chef" element={<AIChef />} />
          <Route path="/admin" element={auth?.isAdmin ? <AdminDashboard /> : <Home />} />
        </Routes>
      </main>

      <Footer />
      <Chatbot />

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
               <div className="flex-1 py-6 px-4 overflow-y-auto">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-serif font-bold">Your Cart</h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
                 </div>
                 {cartCtx?.cart.length === 0 ? <div className="text-center py-20 text-slate-400">Your cart is empty</div> : (
                   <div className="space-y-6">
                     {cartCtx?.cart.map(item => (
                       <div key={item.variantId} className="flex gap-4 py-4 border-b border-slate-50">
                         <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                         <div className="flex-1">
                           <h4 className="font-bold text-sm">{item.product.name}</h4>
                           <p className="text-xs text-slate-500 mb-2">{item.product.variants.find(v=>v.id===item.variantId)?.weight}</p>
                           <div className="flex items-center gap-3">
                              <button onClick={()=>cartCtx.updateQuantity(item.variantId, -1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200"><Minus size={12}/></button>
                              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={()=>cartCtx.updateQuantity(item.variantId, 1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200"><Plus size={12}/></button>
                           </div>
                         </div>
                         <div className="font-bold text-sm">₹{(item.product.variants.find(v=>v.id===item.variantId)?.price || 0) * item.quantity}</div>
                       </div>
                     ))}
                     <div className="pt-4">
                       <div className="flex justify-between font-bold text-lg mb-6"><span>Total</span><span>₹{cartCtx?.totalPrice}</span></div>
                       <button onClick={handleCheckoutClick} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">Proceed to Checkout</button>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;