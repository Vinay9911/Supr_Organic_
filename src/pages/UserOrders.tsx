import React, { useState, useEffect, useContext } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';
import { SEO } from '../components/SEO';

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
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <SEO title="My Orders" description="Track your Supr Organic orders." />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">Order History</h1>
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
             <Package size={64} className="mx-auto text-slate-200 mb-6"/>
             <p className="text-slate-500 font-medium">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const step = getStatusStep(order.status);
              return (
              <div key={order.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="font-mono text-xs text-slate-400 block mb-1">ORDER #{order.id.slice(0,8)}</span>
                    <p className="font-bold text-2xl text-slate-900">₹{order.total_amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">Estimated Delivery</p>
                    <p className="text-xs text-slate-500">Today, by 8:00 PM</p>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="relative flex items-center justify-between mb-2">
                   <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -z-0"></div>
                   <div className={`absolute left-0 top-1/2 h-1 bg-emerald-500 -z-0 transition-all duration-1000`} style={{width: step === 1 ? '0%' : step === 2 ? '50%' : '100%'}}></div>
                   
                   <div className="relative z-10 bg-white p-2 rounded-full">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'}`}><Clock size={20}/></div>
                   </div>
                   <div className="relative z-10 bg-white p-2 rounded-full">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'}`}><Truck size={20}/></div>
                   </div>
                   <div className="relative z-10 bg-white p-2 rounded-full">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'}`}><CheckCircle size={20}/></div>
                   </div>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                  <span>Processing</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};