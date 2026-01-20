import React, { useState, useContext } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

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

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (!auth?.user || !cartCtx) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('orders').insert({
          user_id: auth.user.id,
          total_amount: cartCtx.totalPrice,
          status: 'Pending',
          shipping_address: address + ` | Phone: ${phone}`,
          payment_method: 'UPI - 8826986127@upi'
        });
      if (error) throw error;
      setOrderSuccess(true);
      cartCtx.clearCart();
    } catch (err) { alert("Failed to place order."); } 
    finally { setLoading(false); }
  };

  if (orderSuccess) return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 text-center animate-in zoom-in-95">
        <ShieldCheck size={48} className="mx-auto mb-4 text-emerald-600"/>
        <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
        <p className="text-slate-500 mb-6">We will call you at {phone}.</p>
        <button onClick={() => { setOrderSuccess(false); onClose(); }} className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold">Continue</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in slide-in-from-bottom-10">
        <h2 className="text-xl font-bold mb-6">Checkout</h2>
        {step === 1 ? (
          <div className="space-y-4">
            <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Full Address" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 outline-none" />
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 outline-none" />
            <button disabled={!address || !phone} onClick={() => setStep(2)} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl">Next</button>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="bg-emerald-50 p-6 rounded-2xl text-center border border-emerald-100">
               <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Pay via UPI</p>
               <p className="text-3xl font-bold text-slate-900 mb-4">₹{cartCtx?.totalPrice}</p>
               <div className="bg-white p-3 rounded-lg border border-emerald-100 font-mono font-bold select-all">8826986127@upi</div>
             </div>
             <div className="flex gap-4">
               <button onClick={() => setStep(1)} className="flex-1 py-4 text-slate-500 font-bold">Back</button>
               <button onClick={handlePlaceOrder} disabled={loading} className="flex-[2] bg-emerald-600 text-white font-bold py-4 rounded-xl">{loading ? 'Processing...' : 'Confirm Paid'}</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};