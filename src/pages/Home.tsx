import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Cpu, ShieldCheck, Leaf, Plus, Loader2, Truck, Sparkles, DollarSign, Phone, Mail } from 'lucide-react';
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

  // AI SEO: Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Supr Mushrooms",
    "url": window.location.origin,
    "logo": "https://suprmushrooms.com/logo.png", // Replace with your actual logo URL hosted online
    "description": "Premium aeroponic saffron and scientifically farmed organic mushrooms in Delhi NCR.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8826986127",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": "en"
    },
    "sameAs": [
      "https://instagram.com/suprmushrooms", // Replace with real links if available
      "https://facebook.com/suprmushrooms"
    ]
  };

  return (
    <div className="pb-0 bg-brand-light">
      <SEO 
        title="Fresh Aeroponic Mushrooms & Saffron Delhi" 
        description="Buy fresh Oyster, Shiitake mushrooms and Aeroponic Saffron in Delhi NCR. 100% Organic, Chemical-free, and delivered farm-to-table in 24 hours."
        schema={organizationSchema}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-light via-brand-cream to-brand-darkCream pt-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000 z-10">
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
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-brand-brown/10">
              <div><div className="text-3xl font-serif font-bold text-brand-text">100%</div><div className="text-xs text-brand-muted uppercase tracking-wider font-bold">Organic</div></div>
              <div><div className="text-3xl font-serif font-bold text-brand-text">0%</div><div className="text-xs text-brand-muted uppercase tracking-wider font-bold">Soil Use</div></div>
              <div><div className="text-3xl font-serif font-bold text-brand-text">2h</div><div className="text-xs text-brand-muted uppercase tracking-wider font-bold">Delivery</div></div>
            </div>
          </div>

          <div className="relative z-10 hidden md:block animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
             <div className="absolute inset-0 bg-brand-cream/50 blur-[80px] rounded-full"></div>
             <img 
               src={heroImg} 
               alt="Fresh Mushrooms" 
               className="relative w-full h-auto object-cover rounded-[2rem] shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-all duration-500"
             />
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              <div className="w-14 h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><ShieldCheck size={28} /></div>
              <h4 className="text-xl font-bold mb-4 text-brand-text">Zero Contamination</h4>
              <p className="text-brand-muted text-sm leading-relaxed">HEPA-filtered air and strict entry protocols mean our produce is cleaner than traditional soil farms.</p>
            </div>

            <div className="p-8 bg-brand-light rounded-3xl border border-brand-cream hover:bg-brand-cream hover:shadow-xl transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><Truck size={28} /></div>
              <h4 className="text-xl font-bold mb-4 text-brand-text">Fast Delivery</h4>
              <p className="text-brand-muted text-sm leading-relaxed">Fresh mushrooms delivered within 24-48 hours to ensure maximum freshness.</p>
            </div>

            <div className="p-8 bg-brand-light rounded-3xl border border-brand-cream hover:bg-brand-cream hover:shadow-xl transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><Sparkles size={28} /></div>
              <h4 className="text-xl font-bold mb-4 text-brand-text">Premium Quality</h4>
              <p className="text-brand-muted text-sm leading-relaxed">Hand-picked, farm-fresh mushrooms meeting the highest quality standards.</p>
            </div>

            <div className="p-8 bg-brand-light rounded-3xl border border-brand-cream hover:bg-brand-cream hover:shadow-xl transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><Leaf size={28} /></div>
              <h4 className="text-xl font-bold mb-4 text-brand-text">100% Organic</h4>
              <p className="text-brand-muted text-sm leading-relaxed">Grown naturally without harmful chemicals or pesticides.</p>
            </div>

            <div className="p-8 bg-brand-light rounded-3xl border border-brand-cream hover:bg-brand-cream hover:shadow-xl transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><DollarSign size={28} /></div>
              <h4 className="text-xl font-bold mb-4 text-brand-text">Best Prices</h4>
              <p className="text-brand-muted text-sm leading-relaxed">Competitive pricing with regular discounts and offers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="pt-24 pb-24 bg-brand-light">
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
              <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-brand-cream flex flex-col h-full relative">
                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden cursor-pointer">
                  
                  {isOutOfStock && !isComingSoon && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center"><span className="bg-brand-text text-white px-4 py-2 rounded-full font-bold text-sm">Out of Stock</span></div>}
                  
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                     {isComingSoon && (
                       <div className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider w-fit shadow-md border border-white/20">
                         Coming Soon
                       </div>
                     )}
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <Link to={`/product/${product.id}`}>
                    <h4 className="text-lg font-bold text-brand-text mb-2 group-hover:text-brand-brown transition-colors">{product.name}</h4>
                  </Link>
                  
                  <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-4">
                    <span>{product.weight}</span>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                      {/* Price / Expected Price */}
                      <span className="text-sm text-brand-muted font-medium">
                        {isComingSoon ? "Expected Price" : "Price"}
                      </span>
                      <div className="text-xl font-bold text-brand-brown">₹{product.price}</div>
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

      {/* CONTACT BANNER SECTION */}
      <section className="py-20 px-4 bg-brand-light">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[400px]">
          
          <h2 className="flex flex-col items-center font-sans font-black leading-[0.9] text-[#8b4513] uppercase mb-8 tracking-normal">
            <span className="text-6xl md:text-[6.5rem]">Want to</span>
            <span className="text-7xl md:text-[8.5rem] mt-2">Connect?</span>
          </h2>
          
          <p className="font-sans font-medium text-lg md:text-2xl text-[#8b4513] uppercase mb-12 tracking-wide max-w-3xl">
            Call us, or just pop our notification up on WhatsApp or email.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 w-full">
            {/* Phone */}
            <a href="tel:+918826986127" className="flex items-center gap-4 group no-underline transition-transform hover:scale-105 duration-300">
              <Phone className="w-8 h-8 md:w-10 md:h-10 text-black group-hover:text-[#8b4513] transition-colors duration-300" strokeWidth={2.5} />
              <span className="font-sans font-bold text-2xl md:text-4xl text-black group-hover:text-[#8b4513] transition-colors duration-300">
                +91-8826986127
              </span>
            </a>

            {/* Email */}
            <a href="mailto:vinaycollege15331@gmail.com" className="flex items-center gap-4 group no-underline transition-transform hover:scale-105 duration-300">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-black group-hover:text-[#8b4513] transition-colors duration-300" strokeWidth={2.5} />
              <span className="font-sans font-bold text-2xl md:text-4xl text-black group-hover:text-[#8b4513] transition-colors duration-300 uppercase">
                VINAYCOLLEGE15331@GMAIL.COM
              </span>
            </a>
          </div>

        </div>
      </section>
    </div>
  );
};