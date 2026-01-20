import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { DataContext } from '../context/DataContext';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext)!;
  const { products } = useContext(DataContext)!;
  const cartCtx = useContext(CartContext);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const moveToCart = (product: any) => {
    cartCtx?.addToCart(product, 1);
    removeFromWishlist(product.id);
    toast.success("Moved to Cart");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8 flex items-center gap-2">
          <Heart className="text-red-500" fill="currentColor" /> My Wishlist
        </h1>
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
               <Heart size={40} />
            </div>
            <p className="text-slate-500 font-medium">Your wishlist is empty.</p>
            <Link to="/" className="text-emerald-600 font-bold hover:underline mt-4 inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative group transition-all hover:shadow-md">
                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
                   <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   {product.stock === 0 && <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-bold text-slate-800">Out of Stock</div>}
                </Link>
                
                <button onClick={() => removeFromWishlist(product.id)} className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md text-red-500 hover:bg-red-50 z-10">
                  <Trash2 size={16} />
                </button>

                <div className="p-4">
                  <h4 className="font-bold text-slate-900 mb-1 truncate">{product.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-emerald-600 font-bold">₹{product.price}</p>
                    <button 
                      onClick={() => moveToCart(product)}
                      disabled={product.stock === 0}
                      className="bg-slate-900 text-white p-2 rounded-lg hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                      title="Move to Cart"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};