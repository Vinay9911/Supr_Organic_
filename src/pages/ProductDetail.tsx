import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, ShieldCheck, Plus, Minus, ArrowLeft, Heart } from 'lucide-react';
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

  const product = products.find(p => p.id.toString() === id);

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!product || product.is_deleted || product.status === 'hidden') {
    return <div className="pt-24 text-center">Product not found</div>;
  }

  const handleAddToCart = () => {
    if (product.status === 'coming_soon') {
      toast('This product is launching soon!', { icon: '🚀' });
      return;
    }
    // Context will handle the stock check, but we can also prevent calling it
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

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <SEO title={product.name} description={product.description} image={product.images[0]} url={`/product/${product.id}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2"/> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 relative">
               <img src={product.images[activeImage]} className="w-full h-full object-cover" alt={product.name} />
               {product.status === 'coming_soon' && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                   <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold text-lg uppercase tracking-widest">Coming Soon</span>
                 </div>
               )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-emerald-600' : 'border-transparent'}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex gap-2 mb-4">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">{product.farming_method}</span>
              {product.stock < 5 && product.stock > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase animate-pulse">
                  Only {product.stock} left!
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">{product.name}</h1>
            <p className="text-slate-500 leading-relaxed mb-8">{product.description}</p>

            {product.status === 'coming_soon' ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                <h3 className="text-amber-800 font-bold text-lg mb-2">Launching Soon!</h3>
                <p className="text-amber-600 text-sm">We are finalizing the harvest. Stay tuned.</p>
              </div>
            ) : (
              <>
                <div className="space-y-6 mb-8 border-t border-b border-slate-100 py-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Weight</label>
                    <div className="px-6 py-3 rounded-xl border border-emerald-600 bg-emerald-50 text-emerald-900 w-fit font-bold">{product.weight}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-slate-400 font-medium mb-1">Total Price</p>
                    <p className="text-4xl font-bold text-slate-900">₹{product.price * qty}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 rounded-full p-2 border border-slate-200">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-100"><Minus size={16}/></button>
                      <span className="w-8 text-center font-bold text-lg">{qty}</span>
                      <button 
                        onClick={increaseQty} 
                        disabled={qty >= product.stock}
                        className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-colors ${qty >= product.stock ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white hover:bg-slate-100 text-slate-900'}`}
                      >
                        <Plus size={16}/>
                      </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleAddToCart} className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                    <Plus size={24} /> Add to Cart
                  </button>
                  <button onClick={toggleWishlist} className={`w-20 rounded-2xl border-2 flex items-center justify-center transition-all ${isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-400'}`}>
                    <Heart size={28} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className="flex items-center gap-3 text-sm text-slate-600 p-4 bg-slate-50 rounded-2xl"><Truck className="text-emerald-600"/> Express Delivery</div>
               <div className="flex items-center gap-3 text-sm text-slate-600 p-4 bg-slate-50 rounded-2xl"><ShieldCheck className="text-emerald-600"/> Lab Certified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};