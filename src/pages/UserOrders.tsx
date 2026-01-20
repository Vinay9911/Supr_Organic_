import React, { useState, useEffect, useContext } from 'react';
import { Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';

export const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useContext(AuthContext)!;

  useEffect(() => {
    if (user) {
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        .then(({ data }) => setOrders(data || []));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
             <Package size={48} className="mx-auto text-slate-300 mb-4"/>
             <p className="text-slate-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-slate-400">#{order.id.slice(0,8)}</span>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>{order.status}</span>
                  </div>
                  <p className="font-bold text-slate-900">Total: ₹{order.total_amount}</p>
                  <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-sm text-slate-500">
                  <p className="font-bold text-slate-700">Delivery To:</p>
                  <p className="max-w-xs">{order.shipping_address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};