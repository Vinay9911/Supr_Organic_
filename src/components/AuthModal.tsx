import React, { useState, useContext } from 'react';
import { X, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) { await auth!.signIn(email, password); } 
      else { await auth!.signUp(email, password, name); }
      onClose();
    } catch (err: any) { alert(err.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">{isLogin ? 'Welcome Back' : 'Join Supr Organic'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {!isLogin && <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />}
          <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
          <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">
          <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-600 font-bold hover:underline">{isLogin ? 'Need an account? Sign Up' : 'Have an account? Log In'}</button>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
      </div>
    </div>
  );
};