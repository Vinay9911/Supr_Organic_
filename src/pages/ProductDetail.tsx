import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, ShieldCheck, Plus, Minus, ArrowLeft, Heart, Clock } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useContext(DataContext)!;
  const cartContext = useContext(CartContext);
  const wishlistCtx = useContext(WishlistContext);
  
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = products.find(p => p.id.toString() === id);

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!product || product.is_deleted || product.status === 'hidden') {
    return <div className="pt-24 text-center">Product not found</div>;
  }

  const isComingSoon = product.status === 'coming_soon';

  const handleAddToCart = () => {
    if (isComingSoon) {
      toast('This product is launching soon!', { icon: '🚀' });
      return;
    }
    if (qty > product.stock) {
      toast.error(`Only ${product.stock} available`);
      return;
    }
    cartContext?.addToCart(product, qty);
  };

  const isWishlisted = wishlistCtx?.isInWishlist(product.id) || false;
  const toggleWishlist = () => {
    if (isWishlisted) wishlistCtx?.removeFromWishlist(product.id);
    else wishlistCtx?.addToWishlist(product.id);
  };

  const increaseQty = () => {
    if (qty < product.stock) setQty(qty + 1);
    else toast.error("Max stock reached");
  };

  // AI SEO: Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Supr Mushrooms"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": isComingSoon || product.stock === 0 
        ? "https://schema.org/OutOfStock" 
        : "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <SEO 
        title={product.name} 
        description={product.description.substring(0, 160)} 
        image={product.images[0]} 
        url={`/product/${product.id}`}
        schema={productSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-brand-muted hover:text-brand-brown mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2"/> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-[2rem] overflow-hidden bg-brand-light border border-brand-cream relative">
               <img src={product.images[activeImage]} className="w-full h-full object-cover" alt={product.name} />
               
               {isComingSoon && (
                 <div className="absolute top-6 left-6 bg-slate-800/90 text-white px-4 py-2 rounded-full font-bold text-sm uppercase tracking-widest backdrop-blur-sm border border-white/10 shadow-lg">
                   Coming Soon
                 </div>
               )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-brand-brown' : 'border-transparent'}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex gap-2 mb-4">
              {product.stock < 5 && product.stock > 0 && !isComingSoon && (
                <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase animate-pulse">
                  Only {product.stock} left!
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-serif font-bold text-brand-text mb-4">{product.name}</h1>
            <p className="text-brand-muted leading-relaxed mb-8">{product.description}</p>
            
            <div className="space-y-6 mb-8 border-t border-b border-brand-cream py-6">
               <div>
                  <label className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-3 block">Weight</label>
                  <div className="px-6 py-3 rounded-xl border border-brand-brown bg-brand-light text-brand-brown w-fit font-bold">{product.weight}</div>
               </div>
               
               <div>
                 <p className="text-sm text-brand-muted font-medium mb-1">
                   {isComingSoon ? "Expected Price" : "Price"}
                 </p>
                 <p className="text-4xl font-bold text-brand-text">₹{product.price * qty}</p>
               </div>
            </div>

            {isComingSoon ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-4">
                   <Clock className="text-slate-400" size={24} />
                   <h3 className="text-slate-800 font-bold text-lg">Harvest In Progress</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We are currently cultivating this batch to ensure premium quality. You can't order it just yet, but stay tuned!
                </p>
                <div className="mt-6 flex gap-4">
                   <button onClick={toggleWishlist} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                      <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} /> 
                      {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                   </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4 bg-brand-light rounded-full p-2 border border-brand-cream">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-brand-cream"><Minus size={16}/></button>
                      <span className="w-8 text-center font-bold text-lg text-brand-text">{qty}</span>
                      <button 
                        onClick={increaseQty} 
                        disabled={qty >= product.stock}
                        className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-colors ${qty >= product.stock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-brand-cream text-brand-text'}`}
                      >
                        <Plus size={16}/>
                      </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleAddToCart} className="flex-1 bg-brand-brown text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-dark transition-colors shadow-xl shadow-brand-brown/20 flex items-center justify-center gap-2">
                    <Plus size={24} /> Add to Cart
                  </button>
                  <button onClick={toggleWishlist} className={`w-20 rounded-2xl border-2 flex items-center justify-center transition-all ${isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-brand-cream text-brand-muted hover:border-red-400'}`}>
                    <Heart size={28} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className="flex items-center gap-3 text-sm text-brand-muted p-4 bg-brand-light rounded-2xl"><Truck className="text-brand-brown"/> Express Delivery</div>
               <div className="flex items-center gap-3 text-sm text-brand-muted p-4 bg-brand-light rounded-2xl"><ShieldCheck className="text-brand-brown"/> Lab Certified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};