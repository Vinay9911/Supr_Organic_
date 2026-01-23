import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Cpu, ShieldCheck, Leaf, Plus, Minus, Loader2, Truck, Sparkles, DollarSign, Phone, Mail } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { DataContext } from '../context/DataContext';
import { SEO } from '../components/SEO';
import { motion } from 'framer-motion'; // Import Framer Motion

// --- IMPORT YOUR GIF HERE ---
import heroGif from '../assets/hero-animation.gif'; 

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Supr Mushrooms",
    "url": window.location.origin,
    "logo": "https://suprmushrooms.com/logo.png",
    "description": "Scientifically farmed premium mushrooms in Delhi NCR. 100% Natural, Chemical-free, and delivered fresh.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8826986127",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": "en"
    },
    "sameAs": [
      "https://instagram.com/suprmushrooms",
      "https://facebook.com/suprmushrooms"
    ]
  };

  return (
    <div className="pb-0 bg-brand-light">
      <SEO 
        title="Fresh Lab-Grown Mushrooms Delhi" 
        description="Buy fresh Oyster and Shiitake mushrooms in Delhi NCR. Grown in sterile environments, chemical-free, and delivered farm-to-table in 24 hours."
        schema={organizationSchema}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-light via-brand-cream to-brand-darkCream pt-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-20 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Animated Text Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8 z-10"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-brown/10 rounded-full border border-brand-brown/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-brown opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-brown"></span>
              </span>
              <span className="text-xs font-bold text-brand-brown uppercase tracking-widest">Premium Fresh Harvest</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif font-bold text-brand-text leading-[1.1]">
              Pure Nutrition. <br />
              <span className="text-brand-brown italic">Untouched by Toxins.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg text-brand-muted max-w-lg leading-relaxed">
              Forget store-bought. Eat mushrooms as nature intended—grown in sterile environments without heavy metals or chemicals. Fresh from our farms to your plates.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <button onClick={() => document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'})} className="bg-brand-brown text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-brown/30 transition-all flex items-center gap-2 group">
                Shop Fresh <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8 pt-8 border-t border-brand-brown/10">
              <div><div className="text-3xl font-serif font-bold text-brand-text">100%</div><div className="text-xs text-brand-muted uppercase tracking-wider font-bold">Natural</div></div>
              <div><div className="text-3xl font-serif font-bold text-brand-text">0%</div><div className="text-xs text-brand-muted uppercase tracking-wider font-bold">Soil Use</div></div>
              <div><div className="text-3xl font-serif font-bold text-brand-text">0%</div><div className="text-xs text-brand-muted uppercase tracking-wider font-bold">Pesticides</div></div>
            </motion.div>
          </motion.div>

          {/* Animated GIF Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 hidden md:block"
          >
             <div className="absolute inset-0 bg-brand-cream/40 blur-[90px] rounded-full transform translate-x-10"></div>
             <img 
               src={heroGif} 
               alt="Fresh Mushrooms Animation" 
               className="relative w-[115%] h-auto max-w-none object-contain scale-125 translate-x-10 drop-shadow-2xl"
             />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="labs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeInUp}
             className="text-center mb-16"
           >
            <h2 className="text-sm font-bold text-brand-brown uppercase tracking-widest mb-3">Our Process</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-text mb-6">Farming for the Future</h3>
            <p className="text-brand-muted max-w-2xl mx-auto">
              Our mushrooms are grown in clean-room environments using sterilized high-grade substrates. No pesticides. No heavy metals. Just pure nutrition.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: Cpu, title: "Precision Monitoring", desc: "IoT sensors monitor temperature and humidity 24/7 to mimic the perfect forest floor environment." },
              { icon: ShieldCheck, title: "Zero Contamination", desc: "HEPA-filtered air and strict entry protocols mean our produce is cleaner than traditional soil farms." },
              { icon: Truck, title: "Fast Delivery", desc: "Fresh mushrooms delivered within 24-48 hours to ensure maximum freshness." },
              { icon: Sparkles, title: "Premium Quality", desc: "Hand-picked, farm-fresh mushrooms meeting the highest quality standards." },
              { icon: Leaf, title: "100% Natural", desc: "Grown naturally without harmful chemicals or pesticides." },
              { icon: DollarSign, title: "Best Prices", desc: "Competitive pricing with regular discounts and offers." }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="p-8 bg-brand-light rounded-3xl border border-brand-cream hover:bg-brand-cream hover:shadow-xl transition-all duration-300 group cursor-default">
                <div className="w-14 h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><feature.icon size={28} /></div>
                <h4 className="text-xl font-bold mb-4 text-brand-text">{feature.title}</h4>
                <p className="text-brand-muted text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="pt-24 pb-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp} 
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          >
            <div>
              <h2 className="text-sm font-bold text-brand-green uppercase tracking-widest mb-3">Fresh Harvest</h2>
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-text">Our Products</h3>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {visibleProducts.map(product => {
              const isOutOfStock = product.stock === 0;
              const isComingSoon = product.status === 'coming_soon';
              const cartItem = cartContext?.cart.find(item => item.productId === product.id);
              const quantityInCart = cartItem ? cartItem.quantity : 0;

              return (
              <motion.div variants={fadeInUp} key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-brand-cream flex flex-col h-full relative">
                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden cursor-pointer">
                  
                  {isOutOfStock && !isComingSoon && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center"><span className="bg-brand-text text-white px-4 py-2 rounded-full font-bold text-sm">Out of Stock</span></div>}
                  
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  
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
                      <span className="text-sm text-brand-muted font-medium">
                        {isComingSoon ? "Expected Price" : "Price"}
                      </span>
                      <div className="text-xl font-bold text-brand-brown">₹{product.price}</div>
                    </div>
                    
                    {!isComingSoon && (
                      quantityInCart > 0 ? (
                        <div className="flex items-center gap-2 bg-brand-brown text-white rounded-xl p-1 shadow-lg shadow-brand-brown/20" onClick={(e) => e.preventDefault()}>
                           <button 
                             onClick={(e) => { e.preventDefault(); e.stopPropagation(); cartContext?.updateQuantity(product.id, quantityInCart - 1); }} 
                             className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"
                           >
                             <Minus size={16}/>
                           </button>
                           <span className="font-bold text-sm w-4 text-center">{quantityInCart}</span>
                           <button 
                             onClick={(e) => { e.preventDefault(); e.stopPropagation(); cartContext?.updateQuantity(product.id, quantityInCart + 1); }} 
                             className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"
                           >
                             <Plus size={16}/>
                           </button>
                        </div>
                      ) : (
                        <button 
                          disabled={isOutOfStock}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!isOutOfStock) {
                              cartContext?.addToCart(product, 1);
                              // NO TOAST HERE - Handled by Context
                            }
                          }}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-brand-brown text-white hover:bg-brand-dark hover:-translate-y-1 shadow-lg shadow-brand-brown/20'}`}
                        >
                          <Plus size={20} />
                        </button>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            )})}
          </motion.div>
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
            <a href="tel:+918826986127" className="flex items-center gap-4 group no-underline transition-transform hover:scale-105 duration-300">
              <Phone className="w-8 h-8 md:w-10 md:h-10 text-black group-hover:text-[#8b4513] transition-colors duration-300" strokeWidth={2.5} />
              <span className="font-sans font-bold text-2xl md:text-4xl text-black group-hover:text-[#8b4513] transition-colors duration-300">
                +91-8826986127
              </span>
            </a>

            <a href="mailto:vinayaggarwal271@gmail.com" className="flex items-center gap-4 group no-underline transition-transform hover:scale-105 duration-300">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-black group-hover:text-[#8b4513] transition-colors duration-300" strokeWidth={2.5} />
              <span className="font-sans font-bold text-2xl md:text-4xl text-black group-hover:text-[#8b4513] transition-colors duration-300 uppercase">
                VINAYAGGARWAL271@GMAIL.COM
              </span>
            </a>
          </div>

        </div>
      </section>
    </div>
  );
};