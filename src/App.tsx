import React, { useState, useContext } from 'react';
import { ShoppingCart, Menu, X, Minus, Plus } from 'lucide-react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { CartProvider, CartContext } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer'; 
import { Chatbot } from './components/Chatbot'; 
import { AuthModal } from './components/AuthModal'; 
import { CheckoutModal } from './components/CheckoutModal'; 

// Pages
import { Home } from './pages/Home';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserOrders } from './pages/UserOrders';

const AppContent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [view, setView] = useState<'shop' | 'admin' | 'orders'>('shop');
  
  const auth = useContext(AuthContext);
  const cartCtx = useContext(CartContext);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (!auth?.user) {
      setIsAuthOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      <Navbar 
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        currentView={view}
        onViewChange={setView}
        isMenuOpen={isMenuOpen}
      />

      <main className="flex-grow">
        {view === 'admin' && auth?.isAdmin ? <AdminDashboard /> 
         : view === 'orders' ? <UserOrders /> 
         : <Home />}
      </main>

      {/* Cart Drawer Logic Here (or extract to a Component) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
               {/* Cart UI Content - You can extract this to src/components/CartDrawer.tsx */}
               <div className="flex-1 py-6 px-4">
                 <div className="flex justify-between">
                    <h2 className="text-xl font-bold">Shopping Cart</h2>
                    <button onClick={() => setIsCartOpen(false)}><X/></button>
                 </div>
                 {/* ... (Cart Items Map) ... */}
                 {cartCtx?.cart.length === 0 ? <p className="mt-10 text-center text-slate-500">Cart is empty</p> : (
                   <div className="mt-8">
                     {cartCtx?.cart.map(item => (
                       <div key={item.variantId} className="flex justify-between py-4 border-b">
                         <div>{item.product.name} ({item.product.variants.find(v=>v.id===item.variantId)?.weight})</div>
                         <div className="flex items-center gap-2">
                            <button onClick={()=>cartCtx.updateQuantity(item.variantId, -1)}><Minus size={14}/></button>
                            {item.quantity}
                            <button onClick={()=>cartCtx.updateQuantity(item.variantId, 1)}><Plus size={14}/></button>
                         </div>
                       </div>
                     ))}
                     <div className="mt-4 pt-4 border-t">
                       <div className="flex justify-between font-bold text-lg mb-4"><span>Total</span><span>₹{cartCtx?.totalPrice}</span></div>
                       <button onClick={handleCheckoutClick} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">Checkout</button>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}

      {view === 'shop' && <Footer />}
      <Chatbot />
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