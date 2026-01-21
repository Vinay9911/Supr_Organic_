import React, { useState, useEffect, useContext } from 'react';
import { Package, Truck, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

export const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useContext(AuthContext)!;

  useEffect(() => {
    if (user) {
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        .then(({ data }) => setOrders(data || []));
    }
  }, [user]);

  const getStatusStep = (status: string) => {
    if (status === 'Delivered') return 3;
    if (status === 'Shipped') return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-brand-light py-24 px-4">
      <SEO title="My Orders" description="Track your Supr Organic orders." />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-text mb-8">Order History</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg border border-brand-cream">
             <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6 text-brand-brown">
                <Package size={40} />
             </div>
             <h3 className="text-xl font-bold text-brand-text mb-2">No orders yet</h3>
             <p className="text-brand-muted mb-8">Looks like you haven't tasted the magic yet.</p>
             <Link to="/" className="inline-flex items-center gap-2 bg-brand-brown text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition-colors">
                Start Shopping <ArrowRight size={18}/>
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const step = getStatusStep(order.status);
              return (
              <div key={order.id} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-brand-cream">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-8 gap-4">
                  <div>
                    <span className="font-mono text-xs text-brand-brown/60 font-bold block mb-1 tracking-wider">ORDER #{order.id.slice(0,8).toUpperCase()}</span>
                    <p className="font-serif font-bold text-3xl text-brand-text">₹{order.total_amount}</p>
                    <p className="text-xs text-brand-muted mt-1">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="text-left sm:text-right bg-brand-light px-4 py-2 rounded-xl border border-brand-cream">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-1">Status</p>
                    <p className="text-sm font-bold text-brand-brown">{order.status}</p>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="relative flex items-center justify-between mb-2 mt-8 px-2">
                   {/* Background Line */}
                   <div className="absolute left-0 top-1/2 w-full h-1 bg-brand-cream -z-0 rounded-full"></div>
                   
                   {/* Active Progress Line */}
                   <div className={`absolute left-0 top-1/2 h-1 bg-brand-brown -z-0 transition-all duration-1000 rounded-full`} style={{width: step === 1 ? '0%' : step === 2 ? '50%' : '100%'}}></div>
                   
                   {/* Step 1: Processing */}
                   <div className="relative z-10 bg-white p-1 rounded-full border-4 border-white">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= 1 ? 'bg-brand-brown text-white shadow-lg shadow-brand-brown/30' : 'bg-brand-cream text-brand-muted'}`}>
                        <Clock size={18}/>
                     </div>
                   </div>

                   {/* Step 2: Shipped */}
                   <div className="relative z-10 bg-white p-1 rounded-full border-4 border-white">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= 2 ? 'bg-brand-brown text-white shadow-lg shadow-brand-brown/30' : 'bg-brand-cream text-brand-muted'}`}>
                        <Truck size={18}/>
                     </div>
                   </div>

                   {/* Step 3: Delivered */}
                   <div className="relative z-10 bg-white p-1 rounded-full border-4 border-white">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= 3 ? 'bg-brand-green text-white shadow-lg shadow-brand-green/30' : 'bg-brand-cream text-brand-muted'}`}>
                        <CheckCircle size={18}/>
                     </div>
                   </div>
                </div>

                <div className="flex justify-between text-[10px] sm:text-xs font-bold text-brand-muted uppercase tracking-widest px-0 sm:px-2 mt-3">
                  <span className={step >= 1 ? 'text-brand-brown' : ''}>Processing</span>
                  <span className={step >= 2 ? 'text-brand-brown' : ''}>Shipped</span>
                  <span className={step >= 3 ? 'text-brand-green' : ''}>Delivered</span>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};