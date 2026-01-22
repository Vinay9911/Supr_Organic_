import React, { useContext, useState } from 'react';
import { X, ArrowRight, Loader2, CreditCard, Banknote, Tag, Upload, Copy, Check } from 'lucide-react';
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
  
  // Form Data
  const [formData, setFormData] = useState({ name: '', address: '', phone: '', email: '' });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  
  // UPI State
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  if (!isOpen || !cartContext) return null;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast.error("Invalid or expired coupon");
        setDiscount(0);
        setAppliedCoupon(null);
      } else {
        const discountAmount = Math.round((cartContext.total * data.discount_percentage) / 100);
        setDiscount(discountAmount);
        setAppliedCoupon(data.code);
        toast.success(`Coupon applied! You saved ₹${discountAmount}`);
      }
    } catch (e) {
      toast.error("Could not apply coupon");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("8826986127@kotak");
    setCopied(true);
    toast.success("UPI ID Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartContext.cart.length === 0) return;
    
    // Validation
    if (paymentMethod === 'UPI' && !paymentFile) {
      toast.error("Please upload the payment screenshot");
      return;
    }

    setLoading(true);

    try {
      // 1. Double-Check Stock Validation
      const isStockValid = await cartContext.validateStock();
      if (!isStockValid) {
        setLoading(false);
        return; 
      }

      const userRes = await supabase.auth.getUser();
      const userId = userRes.data.user?.id;
      const finalAmount = cartContext.total - discount;

      // 2. Upload Screenshot (if UPI)
      let paymentProofUrl = null;
      if (paymentMethod === 'UPI' && paymentFile) {
        const fileName = `${Date.now()}_${paymentFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const { error: uploadError } = await supabase.storage
          .from('payment_proofs')
          .upload(fileName, paymentFile);
        
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('payment_proofs')
          .getPublicUrl(fileName);
          
        paymentProofUrl = publicUrlData.publicUrl;
      }

      // 3. Create Order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId || null, 
          total_amount: finalAmount,
          status: 'Pending',
          shipping_address: `${formData.name}, ${formData.address}, Ph: ${formData.phone}, Email: ${formData.email}`,
          payment_method: paymentMethod === 'UPI' ? 'UPI' : 'Cash on Delivery',
          payment_proof_url: paymentProofUrl,
          coupon_code: appliedCoupon,
          discount_applied: discount
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 4. Create Order Items (WITH SNAPSHOT)
      for (const item of cartContext.cart) {
        await supabase.from('order_items').insert({
          order_id: orderData.id,
          product_id: item.productId,
          quantity: item.quantity,
          price_at_order: item.product.price,
          product_name_snapshot: item.product.name // <--- SNAPSHOT FIX
        });

        // Deduct Stock
        const { error: stockError } = await supabase.rpc('decrement_stock', { 
          row_id: item.productId, 
          quantity: item.quantity 
        });
        
        if (stockError) {
           // Fallback if RPC fails
           const newStock = item.product.stock - item.quantity;
           await supabase.from('products').update({ stock: newStock }).eq('id', item.productId);
        }
      }
      
      // 5. Update Coupon
      if (appliedCoupon) {
        await supabase.rpc('increment_coupon_usage', { coupon_code: appliedCoupon });
      }

      toast.success('Order placed successfully! Confirmation email sent.');
      cartContext.clearCart();
      onClose();
      
      // Reset State
      setDiscount(0);
      setAppliedCoupon(null);
      setFormData({ name: '', address: '', phone: '', email: '' });
      setPaymentFile(null);

    } catch (error: any) {
      console.error("Order Error:", error);
      toast.error('Failed to place order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-brand-cream flex justify-between items-center bg-brand-light">
          <h2 className="font-bold text-lg text-brand-text">Checkout</h2>
          <button onClick={onClose} className="p-2 hover:bg-brand-cream rounded-full"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid md:grid-cols-2 gap-8">
          
          {/* Left Column: Order Summary */}
          <div>
            <h3 className="font-bold text-brand-muted text-xs uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cartContext.cart.map(item => (
                <div key={item.productId} className="flex gap-3 bg-brand-light p-2 rounded-xl border border-brand-cream">
                  <img src={item.product.images[0]} className="w-16 h-16 rounded-lg object-cover bg-white" />
                  <div className="flex-1 flex flex-col justify-between">
                    <p className="font-bold text-sm text-brand-text line-clamp-1">{item.product.name}</p>
                    <div className="flex items-center gap-3">
                       <span className="text-xs text-brand-muted">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="font-bold text-sm flex items-end pb-1 text-brand-brown">₹{item.product.price * item.quantity}</div>
                </div>
              ))}
            </div>
            
            {/* Coupon */}
            <div className="mt-6 pt-4 border-t border-brand-cream">
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Apply Coupon</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-3 text-brand-muted" size={16}/>
                  <input 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)} 
                    placeholder="Enter code" 
                    className="w-full pl-10 pr-3 py-2 bg-brand-light border border-brand-cream rounded-xl text-sm uppercase"
                    disabled={!!appliedCoupon}
                  />
                </div>
                {appliedCoupon ? (
                  <button onClick={() => {setAppliedCoupon(null); setDiscount(0); setCouponCode('');}} className="text-red-500 text-sm font-bold px-3">Remove</button>
                ) : (
                  <button onClick={handleApplyCoupon} className="bg-brand-text text-white px-4 rounded-xl text-sm font-bold">Apply</button>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-brand-muted"><span>Subtotal</span><span>₹{cartContext.total}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm text-green-600 font-bold"><span>Discount</span><span>-₹{discount}</span></div>}
              <div className="flex justify-between font-bold text-lg text-brand-text pt-2 border-t border-brand-cream"><span>Total</span><span>₹{cartContext.total - discount}</span></div>
            </div>
          </div>

          {/* Right Column: Form */}
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-brand-muted text-xs uppercase tracking-wider mb-4">Shipping Details</h3>
            <input required placeholder="Full Name" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl outline-none focus:border-brand-brown"/>
            <input required type="email" placeholder="Email Address" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl outline-none focus:border-brand-brown"/>
            <input required placeholder="Phone Number" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl outline-none focus:border-brand-brown"/>
            <textarea required placeholder="Full Address" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl outline-none focus:border-brand-brown h-20"/>
            
            <h3 className="font-bold text-brand-muted text-xs uppercase tracking-wider mb-2 mt-6">Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
               <button type="button" onClick={()=>setPaymentMethod('COD')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'COD' ? 'bg-brand-brown text-white border-brand-brown' : 'bg-white border-brand-cream text-brand-muted'}`}>
                  <Banknote size={24}/> <span className="text-xs font-bold">Cash on Delivery</span>
               </button>
               <button type="button" onClick={()=>setPaymentMethod('UPI')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'UPI' ? 'bg-brand-brown text-white border-brand-brown' : 'bg-white border-brand-cream text-brand-muted'}`}>
                  <CreditCard size={24}/> <span className="text-xs font-bold">Pay via UPI</span>
               </button>
            </div>

            {/* UPI Payment Instructions */}
            {paymentMethod === 'UPI' && (
               <div className="bg-brand-light border border-brand-cream rounded-xl p-4 animate-in slide-in-from-top-2">
                  <p className="text-xs text-brand-muted uppercase font-bold mb-2">1. Send Payment To:</p>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-brand-cream mb-4">
                     <span className="font-mono font-bold text-brand-text flex-1">8826986127@kotak</span>
                     <button type="button" onClick={copyToClipboard} className="text-brand-brown hover:text-brand-dark">
                        {copied ? <Check size={18}/> : <Copy size={18}/>}
                     </button>
                  </div>

                  <p className="text-xs text-brand-muted uppercase font-bold mb-2">2. Upload Screenshot:</p>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-brand-brown/20 border-dashed rounded-xl cursor-pointer bg-white hover:bg-brand-light transition-colors">
                     {paymentFile ? (
                        <div className="flex items-center gap-2 text-brand-brown font-bold text-sm">
                           <Check size={16} /> {paymentFile.name.slice(0, 20)}...
                        </div>
                     ) : (
                        <div className="flex flex-col items-center gap-1 text-brand-muted">
                           <Upload size={20} />
                           <span className="text-xs">Click to upload image</span>
                        </div>
                     )}
                     <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
               </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-cream bg-brand-light">
          <button form="checkout-form" disabled={loading} className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-brown/20">
            {loading ? <Loader2 className="animate-spin"/> : (
               paymentMethod === 'COD' ? <span>Place Order (COD) <ArrowRight className="inline" size={18}/></span> : <span>Confirm Payment <ArrowRight className="inline" size={18}/></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};