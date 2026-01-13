import React, { useState } from 'react';
import { useCart } from '../App';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'success'>('form');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    clearCart();
  };

  if (cart.length === 0 && step === 'form') {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-display font-bold text-white mb-4">КОРЗИНА ПУСТА</h2>
        <Link to="/catalog" className="text-stalker-accent underline">Вернуться в арсенал</Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-stalker-900 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/20">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-white uppercase">Заказ подтвержден</h1>
          <p className="text-gray-400">Заказ #TR-8821 сформирован. Подтверждение отправлено по защищенному каналу.</p>
          <Link to="/" className="inline-block px-8 py-3 bg-white text-black font-bold uppercase text-sm mt-8">
            Вернуться на базу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-stalker-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-white uppercase mb-12 border-b border-white/10 pb-6">Безопасное Оформление</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Contact */}
              <div className="bg-stalker-800 p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white uppercase mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-stalker-accent text-white flex items-center justify-center text-xs">1</span>
                  Контактная Информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required type="email" placeholder="Email Адрес" className="bg-black/30 border border-white/10 p-3 text-white focus:border-stalker-accent outline-none" />
                  <input required type="tel" placeholder="Номер Телефона" className="bg-black/30 border border-white/10 p-3 text-white focus:border-stalker-accent outline-none" />
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-stalker-800 p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white uppercase mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-stalker-accent text-white flex items-center justify-center text-xs">2</span>
                  Адрес Доставки
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input required type="text" placeholder="Имя" className="bg-black/30 border border-white/10 p-3 text-white focus:border-stalker-accent outline-none" />
                     <input required type="text" placeholder="Фамилия" className="bg-black/30 border border-white/10 p-3 text-white focus:border-stalker-accent outline-none" />
                  </div>
                  <input required type="text" placeholder="Адрес (Улица, Дом, Кв)" className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-stalker-accent outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                     <input required type="text" placeholder="Город" className="bg-black/30 border border-white/10 p-3 text-white focus:border-stalker-accent outline-none" />
                     <input required type="text" placeholder="Индекс" className="bg-black/30 border border-white/10 p-3 text-white focus:border-stalker-accent outline-none" />
                  </div>
                </div>
              </div>

               {/* Payment */}
               <div className="bg-stalker-800 p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white uppercase mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-stalker-accent text-white flex items-center justify-center text-xs">3</span>
                  Способ Оплаты
                </h3>
                <div className="space-y-4">
                   <label className="flex items-center gap-3 p-4 border border-stalker-accent bg-stalker-accent/5 cursor-pointer">
                      <input type="radio" name="payment" defaultChecked className="text-stalker-accent focus:ring-stalker-accent" />
                      <span className="text-white font-medium">Банковская Карта (Secure)</span>
                   </label>
                   <label className="flex items-center gap-3 p-4 border border-white/10 bg-black/20 cursor-pointer hover:border-white/30">
                      <input type="radio" name="payment" className="text-stalker-accent focus:ring-stalker-accent" />
                      <span className="text-gray-300">Криптовалюта (BTC/ETH)</span>
                   </label>
                   
                   <div className="mt-4 grid grid-cols-2 gap-4">
                     <input type="text" placeholder="Номер Карты" className="col-span-2 bg-black/30 border border-white/10 p-3 text-white focus:border-stalker-accent outline-none" />
                     <input type="text" placeholder="MM/YY" className="bg-black/30 border border-white/10 p-3 text-white focus:border-stalker-accent outline-none" />
                     <input type="text" placeholder="CVC" className="bg-black/30 border border-white/10 p-3 text-white focus:border-stalker-accent outline-none" />
                   </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-stalker-accent hover:bg-stalker-accentHover text-white py-4 font-bold uppercase tracking-widest text-lg transition-all shadow-lg shadow-orange-900/20">
                Подтвердить Заказ — {cartTotal.toLocaleString()} ₽
              </button>

            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
             <div className="bg-stalker-800 p-6 border border-white/5 sticky top-24">
                <h3 className="text-lg font-bold text-white uppercase mb-6">Сводка Заказа</h3>
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                   {cart.map((item, idx) => (
                     <div key={idx} className="flex gap-4">
                       <div className="w-16 h-16 bg-stalker-700 rounded overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          <p className="text-xs text-gray-400 mt-1">{item.selectedSize} | Кол-во: {item.quantity}</p>
                          <p className="text-sm font-mono text-gray-200 mt-1">{(item.price * item.quantity).toLocaleString()} ₽</p>
                       </div>
                     </div>
                   ))}
                </div>
                
                <div className="border-t border-white/10 pt-4 space-y-2">
                   <div className="flex justify-between text-gray-400 text-sm">
                      <span>Подытог</span>
                      <span>{cartTotal.toLocaleString()} ₽</span>
                   </div>
                   <div className="flex justify-between text-gray-400 text-sm">
                      <span>Доставка</span>
                      <span>0 ₽</span>
                   </div>
                   <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-white/10 mt-4">
                      <span>Итого</span>
                      <span>{cartTotal.toLocaleString()} ₽</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;