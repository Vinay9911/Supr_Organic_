import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Star, Truck, ShieldCheck, Leaf } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { CartContext } from '../context/CartContext';
import { SEO } from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dataContext = useContext(DataContext);
  const cartContext = useContext(CartContext);
  const { products, loading } = dataContext!;
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  // Sticky Bar Logic
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled down 400px (past the hero image/main button usually)
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-brown">Loading...</div>;

  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const isOutOfStock = product.stock === 0;
  const isComingSoon = product.status === 'coming_soon';

  const handleAddToCart = () => {
    if (!isOutOfStock && !isComingSoon) {
      cartContext?.addToCart(product, quantity);
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Supr Mushrooms"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.price,
      "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
    }
  };

  return (
    <div className="pt-24 pb-24 md:pb-12 bg-white min-h-screen">
      <SEO 
        title={`${product.name} - Buy Fresh Organic Mushrooms`}
        description={product.description}
        schema={productSchema}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-brown font-medium mb-6 md:mb-8 hover:underline">
          <ArrowLeft size={20} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4 md:space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-brand-light border border-brand-cream relative group shadow-sm"
            >
              {isOutOfStock && !isComingSoon && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                  <span className="bg-brand-text text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl">Out of Stock</span>
                </div>
              )}
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
            
            {/* Thumbnails - Scrollbar Hidden via CSS */}
            {product.images.length > 1 && (
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all snap-start ${activeImage === idx ? 'border-brand-brown ring-2 ring-brand-brown/20' : 'border-transparent hover:border-brand-cream'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-center gap-2">
               {isComingSoon ? (
                 <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Coming Soon</span>
               ) : (
                 <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">In Stock</span>
               )}
               <div className="flex items-center text-yellow-500 gap-1 text-sm font-bold">
                 <Star fill="currentColor" size={14} /> <span>4.9</span> <span className="text-gray-400 font-normal">(120+ reviews)</span>
               </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-text mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-6 md:mb-8">
              <span className="text-3xl md:text-4xl font-bold text-brand-brown">₹{product.price}</span>
              <span className="text-brand-muted mb-1.5 text-lg">{product.weight}</span>
            </div>

            <p className="text-brand-muted text-base md:text-lg leading-relaxed mb-8 border-b border-brand-cream pb-8">
              {product.description}
            </p>

            {/* Desktop Add to Cart Section */}
            <div className="hidden md:block space-y-6 mb-8">
               {!isComingSoon && (
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-brand-text uppercase tracking-widest">Quantity</span>
                  <div className="flex items-center gap-3 bg-brand-light rounded-full p-1 border border-brand-cream">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white transition-colors shadow-sm"
                      disabled={isOutOfStock}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white transition-colors shadow-sm"
                      disabled={isOutOfStock}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock || isComingSoon}
                className={`w-full max-w-md py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${
                  isOutOfStock || isComingSoon
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-brand-brown text-white hover:bg-brand-dark hover:shadow-2xl hover:-translate-y-1'
                }`}
              >
                <ShoppingBag size={22} />
                {isComingSoon ? "Notify Me" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {/* Mobile Quantity Selector (Visible above features on mobile) */}
            <div className="md:hidden mb-8">
              {!isComingSoon && !isOutOfStock && (
                 <div className="flex items-center justify-between bg-brand-light p-4 rounded-2xl border border-brand-cream mb-4">
                    <span className="font-bold text-brand-text">Quantity</span>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-brand-brown"><Minus size={16}/></button>
                      <span className="font-bold text-lg">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-brand-brown"><Plus size={16}/></button>
                    </div>
                 </div>
              )}
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
               <div className="flex items-center gap-3 p-3 md:p-4 bg-brand-light rounded-2xl border border-brand-cream/50">
                 <Truck className="text-brand-brown min-w-[24px]" size={24} />
                 <div>
                   <div className="font-bold text-sm text-brand-text leading-tight">Next Day</div>
                   <div className="text-[10px] md:text-xs text-brand-muted">Delivery</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-3 md:p-4 bg-brand-light rounded-2xl border border-brand-cream/50">
                 <Leaf className="text-brand-brown min-w-[24px]" size={24} />
                 <div>
                   <div className="font-bold text-sm text-brand-text leading-tight">100% Organic</div>
                   <div className="text-[10px] md:text-xs text-brand-muted">Certified</div>
                 </div>
               </div>
               <div className="col-span-2 flex items-center gap-3 p-3 md:p-4 bg-brand-light rounded-2xl border border-brand-cream/50">
                 <ShieldCheck className="text-brand-brown min-w-[24px]" size={24} />
                 <div>
                   <div className="font-bold text-sm text-brand-text leading-tight">Chemical Free</div>
                   <div className="text-[10px] md:text-xs text-brand-muted">Lab Tested Quality</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FLOATING STICKY BAR (Mobile Only) --- */}
      <AnimatePresence>
        {showStickyBar && !isComingSoon && !isOutOfStock && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-brand-cream p-4 z-50 md:hidden shadow-[0_-5px_30px_rgba(0,0,0,0.15)] pb-8"
          >
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
              <div className="flex flex-col">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Total</span>
                <span className="text-xl font-bold text-brand-text">₹{product.price * quantity}</span>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-brand-brown text-white py-3.5 rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};