import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, ChevronRight, Send, MessageSquare } from 'lucide-react';
import { useCart } from '../App';
import { SITE_NAME } from '../lib/constants';
import { generateTacticalAdvice } from '../services/ai';
import { ChatMessage } from '../types';

const Header = () => {
  const { cart, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isTransparent = location.pathname === '/';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/5 ${isTransparent ? 'bg-black/20 backdrop-blur-sm' : 'bg-stalker-900/90 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-display font-bold tracking-tighter text-white uppercase">
              {SITE_NAME}
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/catalog" className="text-sm font-medium text-gray-300 hover:text-stalker-accent transition-colors uppercase tracking-widest">Магазин</Link>
            <Link to="/catalog/apparel" className="text-sm font-medium text-gray-300 hover:text-stalker-accent transition-colors uppercase tracking-widest">Одежда</Link>
            <Link to="/catalog/protection" className="text-sm font-medium text-gray-300 hover:text-stalker-accent transition-colors uppercase tracking-widest">Защита</Link>
            <Link to="/catalog/packs" className="text-sm font-medium text-gray-300 hover:text-stalker-accent transition-colors uppercase tracking-widest">Снаряжение</Link>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              className="relative text-gray-300 hover:text-white transition-colors group"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-stalker-accent text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
            <button 
              className="md:hidden text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-stalker-900 border-t border-white/10 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/catalog" className="block py-3 text-base font-medium text-gray-300 border-b border-white/5" onClick={() => setIsMobileMenuOpen(false)}>КАТАЛОГ</Link>
            <Link to="/catalog/apparel" className="block py-3 text-base font-medium text-gray-300 border-b border-white/5" onClick={() => setIsMobileMenuOpen(false)}>ОДЕЖДА</Link>
            <Link to="/catalog/protection" className="block py-3 text-base font-medium text-gray-300 border-b border-white/5" onClick={() => setIsMobileMenuOpen(false)}>ЗАЩИТА</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const CartDrawer = () => {
  const { cart, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      <div className="relative w-full max-w-md bg-stalker-800 h-full shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-display font-bold text-white tracking-widest uppercase">Ваш Боекомплект</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p className="font-mono text-sm">КОНТЕЙНЕР ПУСТ</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-4">
                <div className="w-20 h-20 bg-stalker-700 rounded overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-white">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{item.selectedSize} / {item.selectedColor}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-400 font-mono">Кол-во: {item.quantity}</span>
                    <span className="text-sm font-bold text-stalker-accent">{(item.price * item.quantity).toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-stalker-900">
          <div className="flex justify-between mb-4 text-sm font-medium text-white">
            <span>ВСЕГО</span>
            <span className="font-mono text-stalker-accent">{cartTotal.toLocaleString()} ₽</span>
          </div>
          <Link 
            to="/checkout" 
            onClick={() => setIsCartOpen(false)}
            className="block w-full bg-white text-black text-center py-4 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            К оформлению
          </Link>
        </div>
      </div>
    </div>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Советник Легион Тигр на связи. Готов помочь с выбором снаряжения и экипировки.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateTacticalAdvice(input);
    const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-white text-black rotate-90' : 'bg-stalker-accent text-white'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-stalker-800/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-40 flex flex-col h-[500px] overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
          <div className="p-4 border-b border-white/10 bg-stalker-900/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="text-sm font-mono font-bold text-gray-200 uppercase tracking-widest">Советник ЛЕГИОН</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-stalker-accent text-white' : 'bg-white/10 text-gray-200 border border-white/5'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
               <div className="bg-white/10 text-gray-200 p-3 rounded-lg text-sm border border-white/5">
                 <span className="animate-pulse">Анализ...</span>
               </div>
             </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-white/10 bg-stalker-900">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Спросите о снаряжении..."
                className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-stalker-accent"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-white text-black p-2 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Footer = () => (
  <footer className="bg-black py-16 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <Link to="/" className="text-2xl font-display font-bold tracking-tighter text-white uppercase mb-6 block">
          {SITE_NAME}
        </Link>
        <p className="text-gray-500 text-sm leading-relaxed">
          Создано для элиты. Проверено в полевых условиях.
          Мы предоставляем тактические решения первого уровня для профессионалов, требующих абсолютной надежности.
        </p>
      </div>
      <div>
        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Снаряжение</h4>
        <ul className="space-y-3 text-sm text-gray-500">
          <li><Link to="/catalog/apparel" className="hover:text-stalker-accent transition-colors">Одежда</Link></li>
          <li><Link to="/catalog/footwear" className="hover:text-stalker-accent transition-colors">Обувь</Link></li>
          <li><Link to="/catalog/protection" className="hover:text-stalker-accent transition-colors">Баллистическая защита</Link></li>
          <li><Link to="/catalog/optics" className="hover:text-stalker-accent transition-colors">Оптика и Связь</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Инфо</h4>
        <ul className="space-y-3 text-sm text-gray-500">
          <li><a href="#" className="hover:text-stalker-accent transition-colors">Полевые инструкции</a></li>
          <li><a href="#" className="hover:text-stalker-accent transition-colors">Таблицы размеров</a></li>
          <li><a href="#" className="hover:text-stalker-accent transition-colors">Гарантия и Сервис</a></li>
          <li><a href="#" className="hover:text-stalker-accent transition-colors">Корпоративные заказы</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Контакты</h4>
        <div className="flex space-x-4 mb-6">
          {/* Social placeholders */}
          <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-stalker-accent transition-colors cursor-pointer"></div>
          <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-stalker-accent transition-colors cursor-pointer"></div>
          <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-stalker-accent transition-colors cursor-pointer"></div>
        </div>
        <div className="text-sm text-gray-500">
          <p>Штаб: Москва, РФ</p>
          <p>Защищенная линия: +7 (999) 000-00-00</p>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-600 font-mono">
      &copy; 2024 {SITE_NAME}. ВСЕ ПРАВА ЗАЩИЩЕНЫ. РАЗРАБОТАНО ДЛЯ КРИТИЧЕСКИ ВАЖНЫХ ЗАДАЧ.
    </div>
  </footer>
);

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stalker-900 text-gray-100">
      <Header />
      <CartDrawer />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default Layout;