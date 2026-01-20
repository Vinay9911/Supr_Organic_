import React, { useState, useContext } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChefHat, Sparkles, ShoppingCart, Loader2, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

export const AIChef: React.FC = () => {
  const { cart } = useContext(CartContext)!;
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  
  const generateRecipe = async () => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) return toast.error("API Key missing");

    setLoading(true);
    setRecipe('');
    
    try {
      // Get ingredients from cart or default to generic mushrooms
      const ingredients = cart.length > 0 
        ? cart.map(i => i.product.name).join(', ') 
        : "Oyster Mushrooms, Shiitake Mushrooms";

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are a Michelin Star Chef specializing in vegetarian organic cuisine. 
      Create a unique, healthy recipe using these main ingredients: ${ingredients}. 
      Format nicely with: 
      1. Creative Name 
      2. Ingredients List 
      3. Step-by-Step Instructions. 
      Keep it under 300 words.`;

      const result = await model.generateContent(prompt);
      setRecipe(result.response.text());
    } catch (error) {
      toast.error("Chef is busy. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <SEO title="AI Organic Chef" description="Generate healthy mushroom recipes instantly with our AI Chef." />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-emerald-200 rotate-3">
            <ChefHat size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">The Organic AI Chef</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Don't know what to cook? Our AI Chef creates custom gourmet recipes based on the fresh mushrooms in your cart.
          </p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-0"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full"><ShoppingCart size={20}/></div>
                <div>
                  <h3 className="font-bold text-slate-900">Your Pantry</h3>
                  <p className="text-sm text-slate-500">
                    {cart.length > 0 ? `${cart.length} items selected` : 'Using default ingredients'}
                  </p>
                </div>
              </div>
              <button 
                onClick={generateRecipe} 
                disabled={loading}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-emerald-200"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Generate Recipe</>}
              </button>
            </div>

            {recipe ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-5">
                <div className="prose prose-emerald max-w-none">
                  <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                    {/* Simple formatting for markdown-like bold text */}
                    {recipe.split('**').map((part, i) => 
                      i % 2 === 1 ? <span key={i} className="font-bold text-slate-900">{part}</span> : part
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-400">Click "Generate Recipe" to start cooking!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};