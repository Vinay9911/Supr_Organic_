import React, { useContext } from 'react';
import { ArrowRight, Cpu, Zap, ShieldCheck, Heart, Star, Leaf, Plus, Loader2, MessageSquare } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { DataContext } from '../context/DataContext';

export const Home: React.FC = () => {
  const cartContext = useContext(CartContext);
  const dataContext = useContext(DataContext);
  const { products, loading } = dataContext!;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-600"><Loader2 className="animate-spin" size={48} /></div>;

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
            {products.filter(p => !p.isLaunchingSoon).map(product => {
              const defaultVariant = product.variants?.[0];
              const isOutOfStock = defaultVariant?.stock === 0;

              return (
              <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full relative">
                {isOutOfStock && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center"><span className="bg-slate-900 text-white px-4 py-2 rounded-full font-bold text-sm">Out of Stock</span></div>}
                
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
                    {/* Add to Cart with Stock Check */}
                    <button 
                      disabled={isOutOfStock}
                      onClick={() => {
                        if (defaultVariant && !isOutOfStock) {
                          cartContext?.addToCart(product, defaultVariant.id, 1);
                        }
                      }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-emerald-600 hover:-translate-y-1'}`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )})}
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