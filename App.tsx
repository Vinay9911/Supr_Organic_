
import React, { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingCart, User, Heart, Search, Menu, X, Plus, Minus, Trash2, ArrowRight, Star, Leaf, Cpu, ShieldCheck, Zap, MessageSquare } from 'lucide-react';
import { MOCK_PRODUCTS, SUPABASE_URL } from './constants';
import { Product, Category, CartItem, UserProfile } from './types';
import { supabase } from './supabase';

// Contexts
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, delta: number) => void;
  totalItems: number;
  totalPrice: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// App Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartContext = useContext(CartContext);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">SO</div>
              <span className="text-2xl font-serif font-bold tracking-tight text-slate-900">
                Supr <span className="text-emerald-600">Organic</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Mushrooms</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Saffron</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Our Labs</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">About Us</a>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-5">
              <button className="p-2 text-slate-600 hover:text-emerald-600 transition-colors"><Search size={22} /></button>
              <button className="p-2 text-slate-600 hover:text-emerald-600 transition-colors relative">
                <Heart size={22} />
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-slate-600 hover:text-emerald-600 transition-colors relative"
              >
                <ShoppingCart size={22} />
                {cartContext && cartContext.totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                    {cartContext.totalItems}
                  </span>
                )}
              </button>
              <button className="hidden md:flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-600 transition-all duration-300">
                <User size={18} />
                <span>Account</span>
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 py-4 px-6 space-y-4 shadow-xl">
            <a href="#" className="block text-lg font-medium text-slate-900">Mushrooms</a>
            <a href="#" className="block text-lg font-medium text-slate-900">Saffron</a>
            <a href="#" className="block text-lg font-medium text-slate-900">Our Labs</a>
            <a href="#" className="block text-lg font-medium text-slate-900">About Us</a>
            <hr className="border-slate-100" />
            <div className="flex items-center space-x-2 text-slate-900">
              <User size={20} />
              <span className="font-medium">My Account</span>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Shopping Cart</h2>
                  <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-500">
                    <X size={24} />
                  </button>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-slate-100">
                      {cartContext?.cart.length === 0 ? (
                        <div className="py-20 text-center text-slate-500">
                          <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
                          <p>Your cart is empty</p>
                          <button 
                            onClick={() => setIsCartOpen(false)}
                            className="mt-4 text-emerald-600 font-medium"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      ) : (
                        cartContext?.cart.map((item) => (
                          <li key={item.variantId} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-slate-200 rounded-md overflow-hidden">
                              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-center object-cover" />
                            </div>
                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-slate-900">
                                  <h3>{item.product.name}</h3>
                                  <p className="ml-4">₹{item.product.variants.find(v => v.id === item.variantId)?.price || 0}</p>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">{item.product.variants.find(v => v.id === item.variantId)?.weight}</p>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center border border-slate-200 rounded-full px-2 py-1">
                                  <button onClick={() => cartContext.updateQuantity(item.variantId, -1)} className="p-1"><Minus size={14} /></button>
                                  <span className="mx-3 font-medium">{item.quantity}</span>
                                  <button onClick={() => cartContext.updateQuantity(item.variantId, 1)} className="p-1"><Plus size={14} /></button>
                                </div>
                                <button 
                                  onClick={() => cartContext.removeFromCart(item.variantId)}
                                  className="font-medium text-emerald-600 hover:text-emerald-500"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {cartContext && cartContext.cart.length > 0 && (
                <div className="border-t border-slate-100 py-6 px-4 sm:px-6 bg-slate-50">
                  <div className="flex justify-between text-base font-medium text-slate-900">
                    <p>Subtotal</p>
                    <p>₹{cartContext.totalPrice}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <button className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                      Checkout Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
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
          <p>© 2024 Supr Organic Agriculture Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Shipping Policy</a>
          </div>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <Chatbot />
    </div>
  );
};

// Chatbot Component using Gemini
const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hi! I am the Supr Organic assistant. How can I help you today with our premium mushrooms or upcoming saffron?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Simulate Gemini API response (In production, replace with actual GoogleGenAI call)
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: `Thank you for your interest in Supr Organic! We use advanced modern farming for our mushrooms and our aeroponic saffron is launching soon in Delhi. Would you like to know more about our ${userMsg.toLowerCase().includes('mushroom') ? 'oyster mushrooms' : 'farming labs'}?` 
        }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col border border-slate-100 animate-in slide-in-from-bottom-5">
          <div className="p-4 bg-emerald-600 rounded-t-3xl text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Supr Assistant</h3>
                <p className="text-[10px] text-emerald-100">Online & Ready to Help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-2 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-100">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our labs..." 
                className="flex-1 bg-slate-50 border-none rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button type="submit" className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-600 hover:scale-110 transition-all duration-300"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

// Main Home Page Component
const HomePage: React.FC = () => {
  const cartContext = useContext(CartContext);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 opacity-40">
          <img src="https://picsum.photos/seed/farming/1920/1080" className="w-full h-full object-cover" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Next-Gen Organic Farming</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
              Eat Science.<br />
              <span className="text-emerald-500 italic">Live Organic.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
              We're redefining agriculture with modern aeroponic and climate-controlled farming. 100% pure, lab-monitored, and delivered fresh in Delhi.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center gap-2 group">
                Shop Mushrooms <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                The Aeroponic Lab
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Lab Tested</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">0%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Soil Contact</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">2h</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Farm to Table</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block relative animate-in zoom-in duration-1000 delay-200">
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <img 
              src="https://picsum.photos/seed/modern-food/800/800" 
              alt="Hero Product" 
              className="relative rounded-3xl shadow-2xl border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500" 
            />
          </div>
        </div>
      </section>

      {/* Featured Labs Intro */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">Our Technology</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Farming for the Future</h3>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Our mushrooms are grown in clean-room environments using sterilized high-grade substrates. No pesticides. No heavy metals. Just pure nutrition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4">Precision Monitoring</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Every lab is equipped with IoT sensors monitoring temperature, humidity, and CO2 levels 24/7 to ensure optimal growth.
              </p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4">Aeroponic Growth</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our upcoming saffron uses aeroponic mist technology, delivering nutrients directly to roots suspended in air.
              </p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4">Zero Contamination</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                HEPA-filtered air and strict entry protocols mean our produce is cleaner than what you'd find in traditional soil farms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Saffron Launch Highlight */}
      <section className="py-24 bg-emerald-950 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-900/50 skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="inline-block px-4 py-1 bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/30 text-xs font-bold uppercase tracking-widest mb-6">
              Exclusive Reveal
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">
              Aeroponic Saffron <br />
              <span className="text-amber-500">Launching Soon.</span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              We are currently in the final stages of our high-tech aeroponic saffron harvest. Grown without soil in Delhi, this will be the world's cleanest and most potent saffron ever produced.
            </p>
            <button className="bg-amber-500 text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-amber-400 transition-colors">
              Notify Me on Launch
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 blur-[100px] opacity-20"></div>
              <img 
                src="https://picsum.photos/seed/saffron-flower/600/600" 
                alt="Aeroponic Saffron" 
                className="relative w-80 h-80 md:w-[500px] md:h-[500px] object-cover rounded-full border-8 border-white/5 shadow-2xl" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mushroom Shop */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">Today's Harvest</h2>
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">Premium Mushrooms</h3>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-white rounded-full text-sm font-medium border border-slate-200 hover:bg-slate-900 hover:text-white transition-all">All Varieties</button>
              <button className="px-6 py-2 bg-white rounded-full text-sm font-medium border border-slate-200 hover:bg-slate-900 hover:text-white transition-all">Best Sellers</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_PRODUCTS.filter(p => !p.isLaunchingSoon).map(product => (
              <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full">
                <div className="relative aspect-square overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  {product.discountPercentage && (
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      Save {product.discountPercentage}%
                    </div>
                  )}
                  <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{product.rating} ({product.reviewsCount} reviews)</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{product.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                    <Leaf size={12} className="text-emerald-500" />
                    <span>{product.farmingMethod}</span>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-slate-400 font-medium">Starts at</span>
                      <div className="text-xl font-bold text-slate-900">₹{product.basePrice}</div>
                    </div>
                    <button 
                      onClick={() => cartContext?.addToCart(product, product.variants[0].id, 1)}
                      className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:-translate-y-1 transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
              <Zap size={24} />
            </div>
            <h5 className="font-bold text-sm mb-1">Fast Delivery</h5>
            <p className="text-xs text-slate-500">Same day in Delhi-NCR</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h5 className="font-bold text-sm mb-1">Lab Certified</h5>
            <p className="text-xs text-slate-500">Every batch is tested</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
              <Leaf size={24} />
            </div>
            <h5 className="font-bold text-sm mb-1">Truly Organic</h5>
            <p className="text-xs text-slate-500">No chemicals or soil</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
              <MessageSquare size={24} />
            </div>
            <h5 className="font-bold text-sm mb-1">Expert Support</h5>
            <p className="text-xs text-slate-500">24/7 agricultural chat</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Main App Wrapper
const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const addToCart = (product: Product, variantId: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.variantId === variantId);
      if (existing) {
        return prev.map(item => item.variantId === variantId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { id: Math.random().toString(36), productId: product.id, variantId, quantity, product }];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.variantId === variantId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => {
    const variant = item.product.variants.find(v => v.id === item.variantId);
    return acc + (variant ? variant.price * item.quantity : 0);
  }, 0);

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart }}>
      <Layout>
        <HomePage />
      </Layout>
    </CartContext.Provider>
  );
};

export default App;
