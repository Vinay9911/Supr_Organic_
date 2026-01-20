import React, { useState } from 'react';
import { MessageSquare, Leaf, X, ArrowRight, Phone } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // Controls the 2-option menu
  
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Namaste! I am the Supr Organic assistant. Ask me about our fresh mushrooms or upcoming aeroponic saffron!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    if (!API_KEY) {
       setIsTyping(false);
       return;
    }

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are the Supr Organic assistant. Products: Mushrooms (Oyster, Shiitake, Lion's Mane) & Saffron. Delivery: Delhi NCR (2 hours). Payment: UPI. User: ${userMsg}. Keep it short.`;
      const result = await model.generateContent(prompt);
      setMessages(prev => [...prev, { role: 'bot', text: result.response.text() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Network error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMainClick = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setShowOptions(!showOptions);
    }
  };

  const openWhatsapp = () => {
    window.open('https://wa.me/918826986127', '_blank');
    setShowOptions(false);
  };

  const openAIChat = () => {
    setIsOpen(true);
    setShowOptions(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      
      {/* 2-Option Menu Popup */}
      {showOptions && !isOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <button onClick={openAIChat} className="flex items-center gap-3 w-full px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 text-left">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
              <Leaf size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">AI Assistant</p>
              <p className="text-xs text-slate-500">Ask about products</p>
            </div>
          </button>
          
          <button onClick={openWhatsapp} className="flex items-center gap-3 w-full px-6 py-4 hover:bg-slate-50 transition-colors text-left">
            <div className="bg-green-100 text-green-600 p-2 rounded-full">
              <Phone size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">WhatsApp</p>
              <p className="text-xs text-slate-500">+91 8826986127</p>
            </div>
          </button>
        </div>
      )}

      {/* Main AI Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col border border-slate-100 animate-in slide-in-from-bottom-5">
           <div className="p-4 bg-emerald-600 rounded-t-3xl text-white flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Leaf size={18} className="text-white/80" />
                <span className="font-bold text-sm">Supr Assistant</span>
             </div>
             <button onClick={() => setIsOpen(false)}><X size={18} /></button>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>{m.text}</div>
               </div>
             ))}
             {isTyping && <div className="text-xs text-slate-400 px-2">Typing...</div>}
           </div>
           <div className="p-3 border-t">
             <form onSubmit={(e) => {e.preventDefault(); handleSend()}} className="flex gap-2">
               <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 bg-slate-50 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Ask about our labs..." />
               <button type="submit" className="bg-emerald-600 text-white p-2 rounded-full"><ArrowRight size={18}/></button>
             </form>
           </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={handleMainClick} 
        className={`p-4 rounded-full shadow-2xl transition-all hover:scale-110 ${isOpen || showOptions ? 'bg-slate-800 rotate-45' : 'bg-slate-900'} text-white`}
      >
        {isOpen ? <Plus className="rotate-45" size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

// Helper Icon for the FAB
const Plus = ({size, className}: {size:number, className?:string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
)