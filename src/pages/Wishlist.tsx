import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { DataContext } from '../context/DataContext';

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext)!;
  const { products } = useContext(DataContext)!;

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8 flex items-center gap-2">
          <Heart className="text-red-500" fill="currentColor" /> My Wishlist
        </h1>
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400">Your wishlist is empty.</p>
            <Link to="/" className="text-emerald-600 font-bold hover:underline mt-4 inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative group">
                <Link to={`/product/${product.id}`}>
                  <img src={product.images[0]} className="w-full aspect-square object-cover" />
                </Link>
                <button onClick={() => removeFromWishlist(product.id)} className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md text-red-500 hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
                <div className="p-4">
                  <h4 className="font-bold">{product.name}</h4>
                  <p className="text-emerald-600 font-bold">₹{product.basePrice}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};