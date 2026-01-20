import React, { useState, useEffect, useContext } from 'react';
import { PlusCircle, Upload, Loader2, Edit2, Trash2, Save, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '../lib/supabase';
import { DataContext } from '../context/DataContext';
import { Product } from '../types';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons'>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const { products, refreshProducts } = useContext(DataContext)!;

  // Form States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', desc: '', price: '', img: '' });
  const [uploading, setUploading] = useState(false);
  
  // Coupon State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  useEffect(() => { 
    fetchOrders(); 
    fetchCoupons();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const fetchCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setCoupons(data || []);
  };

  // --- SALES TREND LOGIC (REAL TIME) ---
  const getRevenueData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayOrders = orders.filter(o => o.created_at.startsWith(date));
      return {
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        sales: dayOrders.reduce((acc, curr) => acc + curr.total_amount, 0)
      };
    });
  };

  // --- PRODUCT MANAGEMENT ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const filePath = `${Math.random()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('products').upload(filePath, file);
      if (error) throw error;
      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      setProductForm(prev => ({ ...prev, img: data.publicUrl }));
      toast.success('Image uploaded');
    } catch (error: any) { toast.error(error.message); } 
    finally { setUploading(false); }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update Existing
        await supabase.from('products').update({
          name: productForm.name,
          description: productForm.desc,
          base_price: parseFloat(productForm.price),
          images: [productForm.img]
        }).eq('id', editingProduct.id);
        
        // Update first variant price for consistency
        if (editingProduct.variants[0]) {
           await supabase.from('product_variants').update({ price: parseFloat(productForm.price) })
           .eq('id', editingProduct.variants[0].id);
        }
        toast.success("Product Updated");
      } else {
        // Create New
        const { data: prod, error } = await supabase.from('products').insert({
          name: productForm.name,
          description: productForm.desc,
          base_price: parseFloat(productForm.price),
          images: [productForm.img],
          farming_method: 'Modern Farming',
          slug: productForm.name.toLowerCase().replace(/ /g, '-'),
          is_launching_soon: false
        }).select().single();
        if (error) throw error;
        await supabase.from('product_variants').insert({
          product_id: prod.id, weight: 'Default', price: parseFloat(productForm.price), stock: 10
        });
        toast.success("Product Created");
      }
      setEditingProduct(null);
      setProductForm({ name: '', desc: '', price: '', img: '' });
      refreshProducts();
    } catch (err: any) { toast.error(err.message); }
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, desc: p.description, price: p.basePrice.toString(), img: p.images[0] });
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ORDER MANAGEMENT ---
  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    toast.success(`Order marked as ${status}`);
    fetchOrders();
  };

  // --- COUPON MANAGEMENT ---
  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('coupons').insert({
      code: newCouponCode.toUpperCase(),
      discount_percentage: parseInt(newCouponDiscount)
    });
    if (error) toast.error("Failed to add coupon");
    else {
      toast.success("Coupon Added");
      setNewCouponCode('');
      setNewCouponDiscount('');
      fetchCoupons();
    }
  };

  const deleteCoupon = async (id: string) => {
    await supabase.from('coupons').delete().eq('id', id);
    fetchCoupons();
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            {['overview', 'orders', 'products', 'coupons'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}>{tab}</button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <p className="text-xs font-bold text-slate-500 uppercase">Total Revenue</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">₹{orders.reduce((a,c) => a + c.total_amount, 0)}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <p className="text-xs font-bold text-slate-500 uppercase">Total Orders</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{orders.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border h-96">
              <h3 className="font-bold text-lg mb-6">Real-time Sales Trend (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getRevenueData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="sales" fill="#059669" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="p-4 font-mono text-xs">{order.id.slice(0,8)}</td>
                    <td className="p-4 text-sm max-w-[200px] truncate">{order.shipping_address}</td>
                    <td className="p-4 font-bold">₹{order.total_amount}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span></td>
                    <td className="p-4 flex gap-2">
                      <button onClick={()=>updateOrderStatus(order.id, 'Shipped')} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-100">Ship</button>
                      <button onClick={()=>updateOrderStatus(order.id, 'Delivered')} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-bold hover:bg-green-100">Deliver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border h-fit sticky top-24">
              <h2 className="font-bold text-xl mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <input required placeholder="Name" value={productForm.name} onChange={e=>setProductForm({...productForm, name: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
                <textarea required placeholder="Description" value={productForm.desc} onChange={e=>setProductForm({...productForm, desc: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl h-24" />
                <input required type="number" placeholder="Price (₹)" value={productForm.price} onChange={e=>setProductForm({...productForm, price: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
                
                <div className="relative border-2 border-dashed rounded-xl p-4 text-center">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {uploading ? <Loader2 className="animate-spin mx-auto"/> : productForm.img ? <img src={productForm.img} className="h-20 mx-auto object-contain"/> : <span className="text-sm text-slate-400">Upload Image</span>}
                </div>

                <div className="flex gap-2">
                  <button type="submit" disabled={uploading} className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2"><Save size={16}/> Save</button>
                  {editingProduct && <button type="button" onClick={()=>{setEditingProduct(null); setProductForm({name:'',desc:'',price:'',img:''})}} className="bg-slate-100 p-3 rounded-xl"><X size={20}/></button>}
                </div>
              </form>
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl border flex gap-4">
                  <img src={p.images[0]} className="w-20 h-20 object-cover rounded-lg bg-slate-50" />
                  <div className="flex-1">
                    <h4 className="font-bold">{p.name}</h4>
                    <p className="text-sm text-slate-500">₹{p.basePrice}</p>
                    <button onClick={()=>startEdit(p)} className="mt-2 text-sm text-emerald-600 font-bold flex items-center gap-1"><Edit2 size={14}/> Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Code</label>
                <input value={newCouponCode} onChange={e=>setNewCouponCode(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl mt-1" placeholder="SUMMER2026" />
              </div>
              <div className="w-32">
                 <label className="text-xs font-bold text-slate-500 uppercase">Discount %</label>
                 <input type="number" value={newCouponDiscount} onChange={e=>setNewCouponDiscount(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl mt-1" placeholder="10" />
              </div>
              <button onClick={handleAddCoupon} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold h-[50px]">Add Coupon</button>
            </div>
            
            <div className="bg-white rounded-2xl border overflow-hidden">
               {coupons.map(c => (
                 <div key={c.id} className="flex justify-between items-center p-4 border-b last:border-0">
                   <div>
                     <span className="font-bold text-lg font-mono">{c.code}</span>
                     <span className="ml-3 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">{c.discount_percentage}% OFF</span>
                   </div>
                   <button onClick={()=>deleteCoupon(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18}/></button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};