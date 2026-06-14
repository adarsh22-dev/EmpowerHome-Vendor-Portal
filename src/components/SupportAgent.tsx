import React, { useState } from 'react';
import { HeadphonesIcon, Send, Loader, Bot, MessageCircle, AlertTriangle } from 'lucide-react';

export default function SupportAgent() {
  const [messages, setMessages] = useState<Array<{id:string,text:string,sender:'bot'|'user',actions?:any,needsEscalation?:boolean,escalationReason?:string}>>([
    {id:'1', text:'Hi! I\'m your AI Support Agent. How can I help you today? You can ask about orders, returns, tracking, or replacements.', sender:'bot'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const sendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), text, sender: 'user' as const };
    const botMsg = { id: (Date.now()+1).toString(), text: 'Typing...', sender: 'bot' as const };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/support-agent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, orderId: orderId || undefined, action: 'support' })
      });
      const data = await res.json();
      setMessages(prev => prev.map(m => m.id === botMsg.id ? { ...m, text: data.response, needsEscalation: data.needsEscalation, escalationReason: data.escalationReason } as typeof m : m));
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === botMsg.id ? { ...m, text: "I'm having trouble connecting. Please try again." } : m));
    }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <HeadphonesIcon className="w-8 h-8 text-indigo-600" /> AI Support Agent
          </h2>
          <p className="text-black/40 text-sm mt-1">Automated order support, returns, tracking, and replacements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 space-y-3">
          <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Order ID (optional)</label>
            <input value={orderId} onChange={e => setOrderId(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" placeholder="e.g. 1" />
          </div>
          <div className="space-y-2">
            {[
              { label: 'Track Order', msg: 'Where is my order?' },
              { label: 'Return Request', msg: 'I want to return an item' },
              { label: 'Report Damage', msg: 'My item arrived damaged' },
              { label: 'Cancel Order', msg: 'I want to cancel my order' },
            ].map((a, i) => (
              <button key={i} onClick={() => { setInput(a.msg); sendMessage(a.msg); }} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors text-left flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-indigo-500" /> {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ height: '500px' }}>
            <div className="p-4 bg-indigo-600 text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center"><Bot className="w-5 h-5" /></div>
              <div><h3 className="font-bold text-sm">AI Support Agent</h3><p className="text-[10px] text-white/60">Online • Automated support</p></div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-50 border border-gray-100 rounded-tl-none'}`}>
                    {m.text}
                    {m.needsEscalation && <div className="mt-2 p-2 bg-amber-100 rounded-lg text-xs text-amber-800 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Needs escalation: {m.escalationReason}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-3">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()} placeholder="Type your message..." className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
                <button onClick={() => sendMessage()} disabled={loading} className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
