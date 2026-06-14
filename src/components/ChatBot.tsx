import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  ChevronRight, 
  ShoppingBag, 
  Star, 
  Zap, 
  Tag, 
  Search, 
  Shield, 
  User, 
  Truck, 
  PhoneCall,
  Bot,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface ChatBotProps {
  onNavigate: (view: string) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: 'Bestselling', icon: ShoppingBag, view: 'products' },
    { label: 'Recommended', icon: Star, view: 'products' },
    { label: 'New Arrivals', icon: Zap, view: 'products' },
    { label: 'Offers', icon: Tag, view: 'products' },
    { label: 'Search Product', icon: Search, view: 'products' },
    { label: 'Policies', icon: Shield, view: 'home' },
    { label: 'My Account', icon: User, view: 'profile' },
    { label: 'Order Tracking', icon: Truck, view: 'orders' },
    { label: 'Connect with Vendor', icon: MessageCircle, view: 'home' },
    { label: 'Callback', icon: PhoneCall, view: 'home' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const botPlaceholderId = (Date.now() + 1).toString();
    const botPlaceholderMessage: Message = {
      id: botPlaceholderId,
      text: 'Typing...',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botPlaceholderMessage]);

    await new Promise(r => setTimeout(r, 600));
    const responses: Record<string, string> = {
      'Bestselling': 'Our best-selling products include premium headphones, smartwatches, and wireless earbuds. Would you like to browse our top sellers?',
      'Recommended': 'Based on your interests, we recommend checking out our latest electronics and home accessories. Want me to show you some options?',
      'New Arrivals': 'We have exciting new arrivals in electronics, fashion, and home decor. Browse the latest products now!',
      'Offers': 'Check out our current deals! Many products are available at discounted prices with free shipping.',
      'Search Product': 'You can search for any product using the search bar. What product are you looking for?',
      'Policies': 'Our policies include free returns within 30 days, secure payment processing, and buyer protection.',
      'My Account': 'You can manage your account, view orders, and update preferences from your profile page.',
      'Order Tracking': 'Track your order status in real-time from the Orders page. You\'ll get updates at every step.',
      'Connect with Vendor': 'You can connect directly with vendors through our messaging system for any product inquiries.',
      'Callback': 'Our support team will call you back within 24 hours. Please ensure your contact details are up to date.'
    };
    const response = responses[text] || `I'd be happy to help with "${text}". Let me look into that for you!`;
    setMessages(prev => prev.map(m => 
      m.id === botPlaceholderId 
        ? { ...m, text: response } 
        : m
    ));
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    handleSend(action.label);
    if (action.view) {
      setTimeout(() => {
        onNavigate(action.view);
      }, 1500);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[400px] max-w-[calc(100vw-48px)] bg-white rounded-[32px] shadow-2xl border border-black/5 overflow-hidden flex flex-col"
            style={{ height: '600px', maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="p-6 bg-black text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Nova AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Always Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'user' ? 'bg-orange-100' : 'bg-zinc-100'
                    }`}>
                      {msg.sender === 'user' ? <UserIcon className="w-4 h-4 text-orange-600" /> : <Bot className="w-4 h-4 text-zinc-600" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user' 
                      ? 'bg-black text-white rounded-tr-none' 
                      : 'bg-zinc-50 text-zinc-900 border border-black/5 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4 border-t border-black/5 bg-zinc-50/50">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-black/5 rounded-xl text-[11px] font-bold text-zinc-600 hover:border-black hover:text-black transition-all shadow-sm"
                  >
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-black/5">
              <div className="relative flex items-center gap-3">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-zinc-100 border-none rounded-2xl py-4 px-6 text-sm font-medium outline-none focus:ring-2 focus:ring-black/5 transition-all"
                />
                <button 
                  onClick={() => handleSend()}
                  className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-white text-black rotate-90' : 'bg-black text-white'
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            1
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;
