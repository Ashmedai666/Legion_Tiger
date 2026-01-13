import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../App';
import { MOCK_PRODUCTS } from '../lib/constants';
import { Star, Truck, ShieldCheck, ArrowRight, Check } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return <div className="pt-32 text-center text-white">Товар не найден. <button onClick={() => navigate('/catalog')} className="text-stalker-accent underline">Вернуться в каталог</button></div>;
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, 1, selectedSize, 'Black');
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="pt-24 min-h-screen bg-stalker-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8 text-xs font-mono text-gray-500 uppercase">
          <span className="hover:text-white cursor-pointer" onClick={() => navigate('/catalog')}>Магазин</span> / {product.category} / <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-stalker-800 border border-white/5 overflow-hidden">
              <img 
                src={product.images[selectedImage] || product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.concat(product.images).slice(0, 4).map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx % product.images.length)}
                  className={`aspect-square border ${selectedImage === (idx % product.images.length) ? 'border-stalker-accent' : 'border-white/10 hover:border-white/30'} bg-stalker-800 overflow-hidden transition-all`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight uppercase mb-4 leading-none">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex text-stalker-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-400 font-mono">ID: {product.id}-{product.category.toUpperCase().slice(0,3)}</span>
            </div>

            <p className="text-2xl font-mono text-white mb-8 border-b border-white/10 pb-8">
              {product.price.toLocaleString()} ₽
            </p>

            <div className="mb-8">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Выберите Размер</h3>
               <div className="flex gap-4">
                 {['S', 'M', 'L', 'XL'].map(size => (
                   <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center border font-mono text-sm transition-all ${selectedSize === size ? 'bg-white text-black border-white' : 'border-white/20 text-gray-400 hover:border-white'}`}
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>

            <div className="flex gap-4 mb-12">
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-stalker-accent hover:bg-stalker-accentHover text-white py-4 font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-80"
              >
                {isAdding ? <Check className="w-5 h-5" /> : 'В корзину'}
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-400">
               <div className="flex items-center gap-3">
                 <Truck className="w-5 h-5 text-stalker-accent" />
                 <span>Бесплатная доставка при заказе от 20,000 ₽</span>
               </div>
               <div className="flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-stalker-accent" />
                 <span>Пожизненная гарантия качества</span>
               </div>
            </div>
          </div>
        </div>

        {/* Story & Specs - Progressive Disclosure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/10 pt-16">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-display font-bold text-white uppercase mb-6">Полевой Отчет</h2>
            <div className="prose prose-invert prose-lg text-gray-300 font-light leading-relaxed">
              <p>{product.story}</p>
              <p className="mt-4">{product.description}</p>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-display font-bold text-white uppercase mb-6">Технические Данные</h2>
            <div className="bg-stalker-800 p-6 border border-white/5">
              <table className="w-full text-sm text-left">
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className="border-b border-white/5 last:border-0">
                      <td className="py-3 text-gray-500 font-bold uppercase text-xs">{key}</td>
                      <td className="py-3 text-gray-200 font-mono text-right">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;