import React, { useState, useContext } from 'react';
import { ShieldCheck, X, Tag, Loader2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const cartCtx = useContext(CartContext);
  const auth = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Coupon State
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  if (!isOpen) return null;

  const handleApplyCoupon = async () => {
    if (!promoCode) return;
    try {
      // Dynamic Check from DB
      const { data, error } = await supabase.from('coupons').select('*').eq('code', promoCode.toUpperCase()).eq('is_active', true).single();
      
      if (error || !data) {
        toast.error("Invalid or Expired Coupon");
        setDiscount(0);
      } else {
        const discountAmount = Math.round((cartCtx?.totalPrice || 0) * (data.discount_percentage / 100));
        setDiscount(discountAmount);
        toast.success(`Coupon Applied: ${data.discount_percentage}% Off!`);
      }
    } catch (err) { toast.error("Error applying coupon"); }
  };

  const finalTotal = (cartCtx?.totalPrice || 0) - discount;

  const handlePlaceOrder = async () => {
    if (!auth?.user || !cartCtx) return;
    setLoading(true);
    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase.from('orders').insert({
          user_id: auth.user.id,
          total_amount: finalTotal,
          status: 'Pending',
          shipping_address: `${address} | Phone: ${phone}`,
          payment_method: 'UPI'
      }).select().single();

      if (orderError) throw orderError;

      // 2. Decrement Stock (Using Database Function for safety)
      const orderItemsJson = cartCtx.cart.map(item => ({ variantId: item.variantId, quantity: item.quantity }));
      const { error: stockError } = await supabase.rpc('decrement_stock', { order_items: orderItemsJson });

      if (stockError) throw new Error("Some items are out of stock!");

      // 3. Create Order Items (optional tracking)
      // ... (Code to insert into order_items table would go here)

      setOrderSuccess(true);
      cartCtx.clearCart();
      toast.success("Order Placed Successfully!");
    } catch (err: any) { 
      toast.error(err.message || "Failed to place order."); 
    } finally { 
      setLoading(false); 
    }
  };

  if (orderSuccess) return (
    // ... (Keep existing Success UI)
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 text-center animate-in zoom-in-95 shadow-2xl">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={40} className="text-emerald-600"/>
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">Order Confirmed!</h2>
        <p className="text-slate-500 mb-6">We will call you shortly at <span className="font-bold text-slate-900">{phone}</span> to confirm delivery.</p>
        <button onClick={() => { setOrderSuccess(false); onClose(); setStep(1); }} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
       {/* ... (Keep existing Layout, only changes in logic above) */}
       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in slide-in-from-bottom-10 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-slate-900">Checkout</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Delivery Details</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Full Address (House No, Street, Landmark)" className="w-full mt-1 bg-slate-50 p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]" />
            </div>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500" />
            
            <button disabled={!address || !phone} onClick={() => setStep(2)} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Next Step
            </button>
          </div>
        ) : (
          <div className="space-y-6">
             {/* Coupon Section */}
             <div className="flex gap-2">
               <div className="relative flex-1">
                 <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   placeholder="Promo Code" 
                   value={promoCode} 
                   onChange={e => setPromoCode(e.target.value)}
                   disabled={discount > 0}
                   className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 uppercase" 
                 />
               </div>
               <button onClick={handleApplyCoupon} disabled={!promoCode || discount > 0} className="bg-slate-900 text-white px-4 rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50">Apply</button>
             </div>

             {/* Order Summary */}
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
               <div className="flex justify-between text-slate-500 text-sm"><span>Subtotal</span><span>₹{cartCtx?.totalPrice}</span></div>
               {discount > 0 && (
                 <div className="flex justify-between text-emerald-600 font-bold text-sm"><span>Discount</span><span>- ₹{discount}</span></div>
               )}
               <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-lg text-slate-900"><span>Total to Pay</span><span>₹{finalTotal}</span></div>
             </div>

             <div className="flex gap-4">
               <button onClick={() => setStep(1)} className="flex-1 py-4 text-slate-500 font-bold hover:text-slate-800">Back</button>
               <button onClick={handlePlaceOrder} disabled={loading} className="flex-[2] bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2">
                 {loading ? <Loader2 className="animate-spin" /> : 'Confirm Paid'}
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};