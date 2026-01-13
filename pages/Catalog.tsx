import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES } from '../lib/constants';
import { Product } from '../types';

const Catalog = () => {
  const { category } = useParams<{ category: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Derived data
  const allTags = Array.from(new Set(MOCK_PRODUCTS.flatMap(p => p.tags)));
  
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      // Category filter
      if (category && product.category !== category) return false;
      
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      
      // Tag filter
      if (selectedTags.length > 0) {
        const hasTag = selectedTags.some(tag => product.tags.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });
  }, [category, priceRange, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="pt-24 min-h-screen bg-stalker-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white uppercase tracking-tighter mb-2">
              {category ? CATEGORIES.find(c => c.id === category)?.name : 'Полный Каталог'}
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              {filteredProducts.length} ЕД. ДОСТУПНО
            </p>
          </div>
          
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="mt-4 md:mt-0 flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-stalker-accent hover:text-white transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Фильтры</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 flex-shrink-0 space-y-8 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Категории</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/catalog" 
                    className={`text-sm ${!category ? 'text-white font-bold' : 'text-gray-400 hover:text-white'} transition-colors`}
                  >
                    Все Снаряжение
                  </Link>
                </li>
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <Link 
                      to={`/catalog/${cat.id}`}
                      className={`text-sm ${category === cat.id ? 'text-white font-bold' : 'text-gray-400 hover:text-white'} transition-colors`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Цена</h3>
              <input 
                type="range" 
                min="0" 
                max="50000" 
                step="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-stalker-accent"
              />
              <div className="flex justify-between text-xs font-mono text-gray-300 mt-2">
                <span>0 ₽</span>
                <span>{priceRange[1].toLocaleString()} ₽</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Характеристики</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2 py-1 border ${selectedTags.includes(tag) ? 'border-stalker-accent text-stalker-accent bg-stalker-accent/10' : 'border-white/10 text-gray-400 hover:border-white/30'} transition-all`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            <button onClick={() => {setPriceRange([0,50000]); setSelectedTags([])}} className="text-xs text-stalker-accent underline uppercase tracking-widest">Сбросить фильтры</button>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">Снаряжение не найдено по заданным параметрам.</p>
                <button onClick={() => {setPriceRange([0,50000]); setSelectedTags([])}} className="mt-4 text-stalker-accent underline">Сбросить фильтры</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <Link to={`/product/${product.id}`} className="group bg-stalker-800 border border-white/5 hover:border-stalker-accent/50 transition-all duration-300 flex flex-col h-full">
    <div className="aspect-square overflow-hidden relative bg-stalker-700">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
      />
      {product.tags.includes("New") && (
        <div className="absolute top-2 right-2 bg-stalker-accent text-white text-[10px] font-bold px-2 py-1 uppercase">
          New
        </div>
      )}
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.category}</div>
      <h3 className="text-white font-medium text-lg leading-tight mb-2 group-hover:text-stalker-accent transition-colors">
        {product.name}
      </h3>
      <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
        <span className="text-white font-mono text-sm">{product.price.toLocaleString()} ₽</span>
        <span className="text-gray-500 text-xs uppercase group-hover:text-white transition-colors">Смотреть</span>
      </div>
    </div>
  </Link>
);

export default Catalog;