import React, { useState, useEffect, useContext } from 'react';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DataContext } from '../context/DataContext';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'add'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const { products, refreshProducts } = useContext(DataContext)!;

  // Form State for New Product
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => { if (activeTab === 'orders') fetchOrders(); }, [activeTab]);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    fetchOrders();
  };

  const updateProductPrice = async (variantId: string, newPrice: number) => {
    await supabase.from('product_variants').update({ price: newPrice }).eq('id', variantId);
    refreshProducts();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Insert Product
      const { data: prod, error: pErr } = await supabase.from('products').insert({
        name: newName,
        description: newDesc,
        base_price: parseFloat(newPrice),
        images: [newImage],
        farming_method: 'Modern Farming',
        slug: newName.toLowerCase().replace(/ /g, '-'),
        is_launching_soon: false
      }).select().single();
      
      if (pErr) throw pErr;

      // 2. Insert Default Variant
      const { error: vErr } = await supabase.from('product_variants').insert({
        product_id: prod.id,
        weight: 'Default',
        price: parseFloat(newPrice),
        stock: 10
      });
      
      if (vErr) throw vErr;

      alert("Product Added!");
      setNewName(''); setNewDesc(''); setNewPrice(''); setNewImage('');
      refreshProducts();
      setActiveTab('products');
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
          <div className="flex gap-2">
             <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-lg font-medium text-sm ${activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'}`}>Orders</button>
             <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-lg font-medium text-sm ${activeTab === 'products' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'}`}>Inventory</button>
             <button onClick={() => setActiveTab('add')} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${activeTab === 'add' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'}`}><PlusCircle size={16}/> Add New</button>
          </div>
        </div>

        {activeTab === 'add' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
             <h2 className="text-xl font-bold mb-6">Add New Product</h2>
             <form onSubmit={handleAddProduct} className="space-y-4">
               <input required placeholder="Product Name" value={newName} onChange={e=>setNewName(e.target.value)} className="w-full p-3 border rounded-xl" />
               <textarea required placeholder="Description" value={newDesc} onChange={e=>setNewDesc(e.target.value)} className="w-full p-3 border rounded-xl" />
               <input required type="number" placeholder="Base Price (₹)" value={newPrice} onChange={e=>setNewPrice(e.target.value)} className="w-full p-3 border rounded-xl" />
               <input required placeholder="Image URL" value={newImage} onChange={e=>setNewImage(e.target.value)} className="w-full p-3 border rounded-xl" />
               <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl">Create Product</button>
             </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`bg-transparent font-bold outline-none cursor-pointer ${order.status === 'Pending' ? 'text-amber-500' : 'text-emerald-600'}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <div className="text-xs text-slate-400 mt-1 sm:hidden">#{order.id.slice(0,5)}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{order.total_amount}</td>
                    <td className="px-6 py-4 hidden sm:table-cell truncate max-w-xs">{order.shipping_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-center">
                <img src={product.images[0]} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1 w-full">
                  <h3 className="font-bold text-lg text-slate-900">{product.name}</h3>
                  <div className="flex gap-4 mt-2 overflow-x-auto pb-2">
                    {product.variants.map(v => (
                      <div key={v.id} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 shrink-0">
                        <span className="text-xs font-bold text-slate-500 uppercase">{v.weight}</span>
                        <input 
                          type="number" 
                          defaultValue={v.price} 
                          onBlur={(e) => updateProductPrice(v.id, Number(e.target.value))}
                          className="w-16 bg-transparent font-bold text-slate-900 outline-none border-b border-dashed border-slate-300 focus:border-emerald-500"
                        />
                      </div>
                    ))}
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