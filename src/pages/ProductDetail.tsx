import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Leaf, Plus, Minus, ArrowLeft } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { CartContext } from '../context/CartContext';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useContext(DataContext)!;
  const cartContext = useContext(CartContext);
  const [qty, setQty] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);

  const product = products.find(p => p.id.toString() === id);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product]);

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!product) return <div className="pt-24 text-center">Product not found</div>;

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
  const price = selectedVariant ? selectedVariant.price : product.basePrice;

  const handleAddToCart = () => {
    if (selectedVariant) {
      cartContext?.addToCart(product, selectedVariant.id, qty);
      toast.success('Added to Cart!');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <SEO 
        title={product.name} 
        description={product.description} 
        image={product.images[0]} 
        url={`/product/${product.id}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2"/> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 relative">
               <img src={product.images[activeImage]} className="w-full h-full object-cover" alt={product.name} />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{product.farmingMethod}</span>
              <div className="flex items-center gap-1 text-amber-500 ml-auto">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-bold text-slate-700">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">{product.name}</h1>
            <p className="text-slate-500 leading-relaxed mb-8">{product.description}</p>

            <div className="space-y-6 mb-8 border-t border-b border-slate-100 py-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Select Weight</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${selectedVariantId === variant.id ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                      {variant.weight}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
               <div>
                 <p className="text-sm text-slate-400 font-medium mb-1">Total Price</p>
                 <p className="text-4xl font-bold text-slate-900">₹{price * qty}</p>
               </div>
               <div className="flex items-center gap-4 bg-slate-50 rounded-full p-2 border border-slate-200">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-100"><Minus size={16}/></button>
                  <span className="w-8 text-center font-bold text-lg">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-100"><Plus size={16}/></button>
               </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
            >
              <Plus size={24} /> Add to Cart
            </button>

            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className="flex items-center gap-3 text-sm text-slate-600 p-4 bg-slate-50 rounded-2xl"><Truck className="text-emerald-600"/> Express Delivery (Delhi)</div>
               <div className="flex items-center gap-3 text-sm text-slate-600 p-4 bg-slate-50 rounded-2xl"><ShieldCheck className="text-emerald-600"/> Lab Certified</div>
               <div className="flex items-center gap-3 text-sm text-slate-600 p-4 bg-slate-50 rounded-2xl"><Leaf className="text-emerald-600"/> 100% Organic</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};