import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Cpu, Zap, ShieldCheck, Leaf, Plus, Loader2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { DataContext } from '../context/DataContext';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

import heroImg from '../assets/hero-image.png'; 

export const Home: React.FC = () => {
  const cartContext = useContext(CartContext);
  const dataContext = useContext(DataContext);
  const { products, loading } = dataContext!;
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-brown"><Loader2 className="animate-spin" size={48} /></div>;

  const visibleProducts = products.filter(p => !p.is_deleted && p.status !== 'hidden');

  return (
    <div className="pb-20 bg-brand-light">
      <SEO 
        title="Fresh Aeroponic Mushrooms" 
        description="Supr Mashroom brings you the freshest lab-grown mushrooms and aeroponic saffron in Delhi. 100% Soil-free, Pesticide-free."
      />

      {/* Hero Section - Cream Gradient Background */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-light via-brand-cream to-brand-darkCream pt-20">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-20 grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000 z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-brown/10 rounded-full border border-brand-brown/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-brown opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-brown"></span>
              </span>
              <span className="text-xs font-bold text-brand-brown uppercase tracking-widest">Premium Organic Harvest</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-text leading-[1.1]">
              Taste the <br />
              <span className="text-brand-brown italic">Earth's Magic.</span>
            </h1>
            
            <p className="text-lg text-brand-muted max-w-lg leading-relaxed">
              Experience the rich, earthy flavors of scientifically farmed mushrooms. Grown with care, delivered fresh within hours in Delhi NCR.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button onClick={() => document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'})} className="bg-brand-brown text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-brown/30 transition-all flex items-center gap-2 group">
                Shop Fresh <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-brand-brown/10">
              <div><div className="text-3xl font-serif font-bold text-brand-text">100%</div><div className="text-xs text-brand-muted uppercase tracking-wider font-bold">Organic</div></div>
              <div><div className="text-3xl font-serif font-bold text-brand-text">0%</div><div className="text-xs text-brand-muted uppercase tracking-wider font-bold">Soil Use</div></div>
              <div><div className="text-3xl font-serif font-bold text-brand-text">2h</div><div className="text-xs text-brand-muted uppercase tracking-wider font-bold">Delivery</div></div>
            </div>
          </div>

          <div className="relative z-10 hidden md:block animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
             <div className="absolute inset-0 bg-brand-cream/50 blur-[80px] rounded-full"></div>
             {/* Use uploaded image as requested */}
             <img 
               src={heroImg} 
               alt="Fresh Mushrooms" 
               className="relative w-full h-auto object-cover rounded-[2rem] shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-all duration-500"
             />
          </div>

        </div>
      </section>

      {/* Features Section - White Background */}
      <section id="labs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-brown uppercase tracking-widest mb-3">Our Process</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-text mb-6">Farming for the Future</h3>
            <p className="text-brand-muted max-w-2xl mx-auto">
              Our mushrooms are grown in clean-room environments using sterilized high-grade substrates. No pesticides. No heavy metals. Just pure nutrition.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-brand-light rounded-3xl border border-brand-cream hover:bg-brand-cream hover:shadow-xl transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><Cpu size={28} /></div>
              <h4 className="text-xl font-bold mb-4 text-brand-text">Precision Monitoring</h4>
              <p className="text-brand-muted text-sm leading-relaxed">IoT sensors monitor temperature and humidity 24/7 to mimic the perfect forest floor environment.</p>
            </div>
            <div className="p-8 bg-brand-light rounded-3xl border border-brand-cream hover:bg-brand-cream hover:shadow-xl transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><Zap size={28} /></div>
              <h4 className="text-xl font-bold mb-4 text-brand-text">Aeroponic Growth</h4>
              <p className="text-brand-muted text-sm leading-relaxed">Our upcoming saffron uses aeroponic mist technology, delivering nutrients directly to roots suspended in air.</p>
            </div>
            <div className="p-8 bg-brand-light rounded-3xl border border-brand-cream hover:bg-brand-cream hover:shadow-xl transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><ShieldCheck size={28} /></div>
              <h4 className="text-xl font-bold mb-4 text-brand-text">Zero Contamination</h4>
              <p className="text-brand-muted text-sm leading-relaxed">HEPA-filtered air and strict entry protocols mean our produce is cleaner than traditional soil farms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section - Cream Background */}
      <section id="shop" className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-sm font-bold text-brand-green uppercase tracking-widest mb-3">Fresh Harvest</h2>
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-text">Our Products</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleProducts.map(product => {
              const isOutOfStock = product.stock === 0;
              const isComingSoon = product.status === 'coming_soon';

              return (
              <div key={product.id} className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-brand-cream flex flex-col h-full relative ${isComingSoon ? 'opacity-90' : ''}`}>
                <Link to={isComingSoon ? '#' : `/product/${product.id}`} className={`block relative aspect-square overflow-hidden ${isComingSoon ? 'cursor-default' : 'cursor-pointer'}`}>
                  
                  {isOutOfStock && !isComingSoon && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center"><span className="bg-brand-text text-white px-4 py-2 rounded-full font-bold text-sm">Out of Stock</span></div>}
                  {isComingSoon && <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center"><span className="bg-white text-brand-text px-4 py-2 rounded-full font-bold text-sm uppercase tracking-widest">Coming Soon</span></div>}
                  
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* Badge: Green for Freshness/Discount */}
                  {product.discount_percentage && <div className="absolute top-4 left-4 bg-brand-green text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Save {product.discount_percentage}%</div>}
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <Link to={isComingSoon ? '#' : `/product/${product.id}`}>
                    <h4 className="text-lg font-bold text-brand-text mb-2 group-hover:text-brand-brown transition-colors">{product.name}</h4>
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-4">
                    <Leaf size={12} className="text-brand-green" />
                    <span>{product.farming_method}</span>
                    <span className="mx-1">•</span>
                    <span>{product.weight}</span>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                      {isComingSoon ? (
                        <div className="text-sm font-bold text-brand-muted">Launching Soon</div>
                      ) : (
                        <>
                          <span className="text-sm text-brand-muted font-medium">Price</span>
                          <div className="text-xl font-bold text-brand-brown">₹{product.price}</div>
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
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-brand-brown text-white hover:bg-brand-dark hover:-translate-y-1 shadow-lg shadow-brand-brown/20'}`}
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