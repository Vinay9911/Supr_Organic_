import React, { useContext, useEffect } from 'react'; // Added useEffect
import { Link, useLocation } from 'react-router-dom'; // Added useLocation
import { ArrowRight, Cpu, Zap, ShieldCheck, Star, Leaf, Plus, Loader2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { DataContext } from '../context/DataContext';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

import heroImg from '../assets/hero-image.png'; 

export const Home: React.FC = () => {
  const cartContext = useContext(CartContext);
  const dataContext = useContext(DataContext);
  const { products, loading } = dataContext!;
  const location = useLocation(); // New Hook

  // --- NEW SCROLL EFFECT ---
  // This fixes the "Admin -> Shop" link issue
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Small delay to ensure page is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // If no hash, force scroll to top (Fixes "Home" button issue)
      window.scrollTo(0, 0);
    }
  }, [location, loading]); // Run when URL changes or products finish loading

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-600"><Loader2 className="animate-spin" size={48} /></div>;

  const visibleProducts = products.filter(p => !p.is_deleted && p.status !== 'hidden');

  return (
    <div className="pb-20">
      <SEO 
        title="Fresh Aeroponic Mushrooms & Saffron" 
        description="Supr Organic brings you the freshest lab-grown mushrooms and aeroponic saffron in Delhi. 100% Soil-free, Pesticide-free."
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950 pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 opacity-90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-48 pb-20 grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000 z-10">
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
              <button onClick={() => document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'})} className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center gap-2 group">
                Shop Mushrooms <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div><div className="text-2xl font-bold text-white">100%</div><div className="text-xs text-slate-400 uppercase tracking-wider">Lab Tested</div></div>
              <div><div className="text-2xl font-bold text-white">0%</div><div className="text-xs text-slate-400 uppercase tracking-wider">Soil Contact</div></div>
              <div><div className="text-2xl font-bold text-white">2h</div><div className="text-xs text-slate-400 uppercase tracking-wider">Farm to Table</div></div>
            </div>
          </div>

          <div className="relative z-10 hidden md:block animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
             <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
             <img 
               src={heroImg} 
               alt="Modern Farming" 
               className="relative w-full h-auto object-cover rounded-3xl shadow-2xl border border-white/10 rotate-2 hover:rotate-0 transition-all duration-500"
             />
          </div>

        </div>
      </section>

      {/* Featured Labs Intro - ID Added for anchor link */}
      <section id="labs" className="py-24 bg-white">
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
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><Cpu size={28} /></div>
              <h4 className="text-xl font-bold mb-4">Precision Monitoring</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Every lab is equipped with IoT sensors monitoring temperature, humidity, and CO2 levels 24/7 to ensure optimal growth.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><Zap size={28} /></div>
              <h4 className="text-xl font-bold mb-4">Aeroponic Growth</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Our upcoming saffron uses aeroponic mist technology, delivering nutrients directly to roots suspended in air.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><ShieldCheck size={28} /></div>
              <h4 className="text-xl font-bold mb-4">Zero Contamination</h4>
              <p className="text-slate-500 text-sm leading-relaxed">HEPA-filtered air and strict entry protocols mean our produce is cleaner than what you'd find in traditional soil farms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section - ID confirmed here */}
      <section id="shop" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">Today's Harvest</h2>
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">Premium Mushrooms</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleProducts.map(product => {
              const isOutOfStock = product.stock === 0;
              const isComingSoon = product.status === 'coming_soon';

              return (
              <div key={product.id} className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full relative ${isComingSoon ? 'opacity-90' : ''}`}>
                <Link to={isComingSoon ? '#' : `/product/${product.id}`} className={`block relative aspect-square overflow-hidden ${isComingSoon ? 'cursor-default' : 'cursor-pointer'}`}>
                  
                  {isOutOfStock && !isComingSoon && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center"><span className="bg-slate-900 text-white px-4 py-2 rounded-full font-bold text-sm">Out of Stock</span></div>}
                  {isComingSoon && <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center"><span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-widest">Coming Soon</span></div>}
                  
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  {product.discount_percentage && <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Save {product.discount_percentage}%</div>}
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <Link to={isComingSoon ? '#' : `/product/${product.id}`}>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{product.name}</h4>
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                    <Leaf size={12} className="text-emerald-500" />
                    <span>{product.farming_method}</span>
                    <span className="mx-1">•</span>
                    <span>{product.weight}</span>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                      {isComingSoon ? (
                        <div className="text-sm font-bold text-slate-400">Launching Soon</div>
                      ) : (
                        <>
                          <span className="text-sm text-slate-400 font-medium">Price</span>
                          <div className="text-xl font-bold text-slate-900">₹{product.price}</div>
                        </>
                      )}
                    </div>
                    
                    {!isComingSoon && (
                      <button 
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isOutOfStock) {
                            cartContext?.addToCart(product, 1);
                            toast.success(`Added ${product.name} to cart`);
                          }
                        }}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-emerald-600 hover:-translate-y-1'}`}
                      >
                        <Plus size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
    </div>
  );
};