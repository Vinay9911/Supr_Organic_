import React, { useState, useEffect, useContext } from 'react';
import { Loader2, Edit2, Trash2, Save, X, Eye, EyeOff, Clock, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '../lib/supabase';
import { DataContext } from '../context/DataContext';
import { Product, ProductStatus } from '../types';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons'>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const { products, refreshProducts } = useContext(DataContext)!;

  // Products Filter
  const visibleProducts = products.filter(p => !p.is_deleted);

  // Form States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ 
    name: '', desc: '', price: '', stock: '', weight: '', img: '', status: 'active' as ProductStatus 
  });
  const [uploading, setUploading] = useState(false);
  
  // Coupon State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  useEffect(() => { 
    fetchOrders(); 
    fetchCoupons();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price_at_order,
          products (name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } else {
      setOrders(data || []);
    }
  };

  const fetchCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setCoupons(data || []);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) toast.error("Failed to update status");
    else {
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    }
  };

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
      const payload = {
        name: productForm.name,
        description: productForm.desc,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        weight: productForm.weight,
        images: [productForm.img],
        status: productForm.status,
      };

      if (editingProduct) {
        await supabase.from('products').update(payload).eq('id', editingProduct.id);
        toast.success("Product Updated");
      } else {
        await supabase.from('products').insert({ ...payload, farming_method: 'Modern Farming', slug: productForm.name.toLowerCase().replace(/ /g, '-'), is_deleted: false });
        toast.success("Product Created");
      }
      setEditingProduct(null);
      setProductForm({ name: '', desc: '', price: '', stock: '', weight: '', img: '', status: 'active' });
      refreshProducts();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleSoftDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    await supabase.from('products').update({ is_deleted: true, status: 'hidden' }).eq('id', id);
    toast.success("Product deleted");
    refreshProducts();
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, desc: p.description, price: p.price.toString(), stock: p.stock.toString(), weight: p.weight, img: p.images[0], status: p.status });
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const getRevenueData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();
    return last7Days.map(date => {
        const dayOrders = orders.filter(o => o.created_at.startsWith(date));
        return { name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), sales: dayOrders.reduce((acc, curr) => acc + curr.total_amount, 0) };
    });
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
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={getRevenueData()}><Bar dataKey="sales" fill="#059669" /></BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
             {orders.length === 0 && <div className="text-center p-10 text-slate-400">No orders found.</div>}
             {orders.map(order => (
               <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                 <div className="p-4 flex justify-between items-center bg-slate-50 border-b border-slate-100">
                    <div>
                      <span className="font-mono text-xs text-slate-500">#{order.id.slice(0,8)}</span>
                      <p className="font-bold text-sm text-slate-800">{order.shipping_address?.split(',')[0] || 'Customer'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="font-bold text-emerald-600">₹{order.total_amount}</span>
                       <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg p-2 outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                 </div>
                 {/* Order Items List */}
                 <div className="p-4 bg-white">
                   {order.order_items?.map((item: any, i: number) => (
                     <div key={i} className="flex justify-between text-sm py-1 border-b border-dashed last:border-0 border-slate-100">
                        <span className="text-slate-600">{item.products?.name || 'Unknown Product'} <span className="text-xs text-slate-400">x{item.quantity}</span></span>
                        <span className="font-medium">₹{item.price_at_order * item.quantity}</span>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border h-fit sticky top-24">
              <h2 className="font-bold text-xl mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <input required placeholder="Name" value={productForm.name} onChange={e=>setProductForm({...productForm, name: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
                <textarea required placeholder="Description" value={productForm.desc} onChange={e=>setProductForm({...productForm, desc: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl h-24" />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Price (₹)" value={productForm.price} onChange={e=>setProductForm({...productForm, price: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
                  <input required type="number" placeholder="Stock" value={productForm.stock} onChange={e=>setProductForm({...productForm, stock: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
                </div>
                <input required placeholder="Weight (e.g., 200g)" value={productForm.weight} onChange={e=>setProductForm({...productForm, weight: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Visibility Status</label>
                  <select value={productForm.status} onChange={(e) => setProductForm({...productForm, status: e.target.value as ProductStatus})} className="w-full p-3 bg-slate-50 border rounded-xl">
                    <option value="active">Active (Visible)</option>
                    <option value="hidden">Hidden (Invisible)</option>
                    <option value="coming_soon">Coming Soon (Unclickable)</option>
                  </select>
                </div>
                <div className="relative border-2 border-dashed rounded-xl p-4 text-center">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {uploading ? <Loader2 className="animate-spin mx-auto"/> : productForm.img ? <img src={productForm.img} className="h-20 mx-auto object-contain"/> : <span className="text-sm text-slate-400">Upload Image</span>}
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={uploading} className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2"><Save size={16}/> Save</button>
                  {editingProduct && <button type="button" onClick={()=>{setEditingProduct(null); setProductForm({name:'',desc:'',price:'',stock:'', weight:'',img:'', status:'active'})}} className="bg-slate-100 p-3 rounded-xl"><X size={20}/></button>}
                </div>
              </form>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {visibleProducts.map(p => (
                <div key={p.id} className={`bg-white p-4 rounded-xl border flex gap-4 ${p.status === 'hidden' ? 'opacity-60 grayscale' : ''}`}>
                  <img src={p.images[0]} className="w-20 h-20 object-cover rounded-lg bg-slate-50" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold">{p.name}</h4>
                      <div className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-full border">
                         <span className="capitalize">{p.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">₹{p.price} • {p.weight}</p>
                    <p className="text-xs text-slate-400 mt-1">Stock: {p.stock}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={()=>startEdit(p)} className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-100"><Edit2 size={12}/> Edit</button>
                      <button onClick={()=>handleSoftDelete(p.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-red-100"><Trash2 size={12}/> Delete</button>
                    </div>
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