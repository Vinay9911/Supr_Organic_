import React, { useContext, useState } from 'react';
import { X, ArrowRight, Loader2, Plus, Minus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const cartContext = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  if (!isOpen || !cartContext) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartContext.cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const userRes = await supabase.auth.getUser();
      const userId = userRes.data.user?.id;

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId || null, 
          total_amount: cartContext.total,
          status: 'Pending',
          shipping_address: `${formData.name}, ${formData.address}, Ph: ${formData.phone}`,
          payment_method: 'COD'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartContext.cart.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_order: item.product.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      toast.success('Order placed successfully!');
      cartContext.clearCart();
      onClose();
    } catch (error: any) {
      console.error("Order Error:", error);
      toast.error('Failed to place order. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-brand-cream flex justify-between items-center bg-brand-light">
          <h2 className="font-bold text-lg text-brand-text">Checkout</h2>
          <button onClick={onClose} className="p-2 hover:bg-brand-cream rounded-full"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-brand-muted text-xs uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="space-y-4">
              {cartContext.cart.map(item => (
                <div key={item.productId} className="flex gap-3 bg-brand-light p-2 rounded-xl border border-brand-cream">
                  <img src={item.product.images[0]} className="w-16 h-16 rounded-lg object-cover bg-white" />
                  <div className="flex-1 flex flex-col justify-between">
                    <p className="font-bold text-sm text-brand-text line-clamp-1">{item.product.name}</p>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-2 bg-white rounded-lg border border-brand-cream px-1 py-1 h-7">
                          <button 
                            onClick={() => cartContext.updateQuantity(item.productId, item.quantity - 1)} 
                            className="w-5 h-5 flex items-center justify-center hover:bg-brand-light rounded text-brand-muted"
                          >
                            <Minus size={12}/>
                          </button>
                          
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          
                          <button 
                            onClick={() => cartContext.updateQuantity(item.productId, item.quantity + 1)} 
                            disabled={item.quantity >= item.product.stock}
                            className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${item.quantity >= item.product.stock ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-brand-light text-brand-muted'}`}
                          >
                            <Plus size={12}/>
                          </button>
                       </div>
                       <span className="text-xs font-bold text-brand-muted">x ₹{item.product.price}</span>
                    </div>
                  </div>
                  <div className="font-bold text-sm flex items-end pb-1 text-brand-brown">₹{item.product.price * item.quantity}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-brand-cream flex justify-between items-center">
              <span className="font-bold text-lg text-brand-text">Total</span>
              <span className="font-bold text-2xl text-brand-brown">₹{cartContext.total}</span>
            </div>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-brand-muted text-xs uppercase tracking-wider mb-4">Shipping Details</h3>
            <input required placeholder="Full Name" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl outline-none focus:border-brand-brown"/>
            <input required type="email" placeholder="Email Address" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl outline-none focus:border-brand-brown"/>
            <textarea required placeholder="Full Address" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl outline-none focus:border-brand-brown h-24"/>
            <input required placeholder="Phone Number" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl outline-none focus:border-brand-brown"/>
          </form>
        </div>

        <div className="p-4 border-t border-brand-cream bg-brand-light">
          <button form="checkout-form" disabled={loading} className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-brown/20">
            {loading ? <Loader2 className="animate-spin"/> : <>Place Order <ArrowRight size={18}/></>}
          </button>
        </div>
      </div>
    </div>
  );
};