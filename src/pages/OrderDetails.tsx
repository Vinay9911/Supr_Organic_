import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';
import { Loader2, ArrowLeft, MapPin, Package, Calendar } from 'lucide-react';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext)!;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      supabase.from('orders')
        .select(`*, order_items(*, products(name, images))`)
        .eq('id', id)
        .eq('user_id', user.id) // Security check
        .single()
        .then(({ data, error }) => {
          if (!error) setOrder(data);
          setLoading(false);
        });
    }
  }, [user, id]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin"/></div>;
  if (!order) return <div className="pt-24 text-center">Order not found</div>;

  return (
    <div className="min-h-screen bg-brand-light pt-24 px-4 pb-10">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-brand-cream overflow-hidden">
        <div className="p-6 border-b border-brand-cream flex justify-between items-center bg-brand-light/50">
          <Link to="/orders" className="flex items-center gap-2 text-brand-muted hover:text-brand-brown font-bold">
            <ArrowLeft size={18}/> Back to Orders
          </Link>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase ${
            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>{order.status}</span>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-brand-text mb-2">Order #{order.id.slice(0,8)}</h1>
              <p className="text-brand-muted flex items-center gap-2"><Calendar size={16}/> {new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-brand-muted font-bold uppercase">Total Amount</p>
              <p className="text-4xl font-serif font-bold text-brand-brown">₹{order.total_amount}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-brand-light rounded-2xl border border-brand-cream">
              <h4 className="font-bold text-brand-muted uppercase text-xs mb-3 flex items-center gap-2"><MapPin size={14}/> Shipping To</h4>
              <p className="font-bold text-brand-text whitespace-pre-line">{order.shipping_address}</p>
            </div>
             <div className="p-4 bg-brand-light rounded-2xl border border-brand-cream">
              <h4 className="font-bold text-brand-muted uppercase text-xs mb-3 flex items-center gap-2"><Package size={14}/> Payment</h4>
              <p className="font-bold text-brand-text">{order.payment_method}</p>
              {order.payment_proof_url && <a href={order.payment_proof_url} target="_blank" className="text-xs text-brand-brown underline mt-1 block">View Payment Proof</a>}
            </div>
          </div>

          <h3 className="font-bold text-lg mb-4">Items Ordered</h3>
          <div className="space-y-4">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-brand-cream">
                <img src={item.products?.images?.[0]} className="w-16 h-16 rounded-lg object-cover bg-brand-light"/>
                <div className="flex-1">
                  {/* FIXED: Uses snapshot name if available, else product name */}
                  <p className="font-bold text-brand-text">{item.product_name_snapshot || item.products?.name}</p>
                  <p className="text-sm text-brand-muted">Qty: {item.quantity} × ₹{item.price_at_order}</p>
                </div>
                <p className="font-bold text-brand-brown text-lg">₹{item.price_at_order * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};