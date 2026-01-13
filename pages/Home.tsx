import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Target, Zap, ChevronDown, MoveRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '../lib/constants';

// Hook for scroll position
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };
    window.addEventListener("scroll", updatePosition);
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);
  return scrollPosition;
};

// Hook for element visibility (Intersection Observer)
const useOnScreen = (options: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, isVisible] as const;
};

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// Component for scroll-revealed content
const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = "", delay = 0 }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1, rootMargin: "-50px" });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Hero Component
const Hero = () => {
  const scrollY = useScrollPosition();

  const scrollToStory = () => {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-stalker-900">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=2070&auto=format&fit=crop" 
            alt="Tactical Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stalker-900 via-stalker-900/40 to-black/60"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        </div>
      </div>

      {/* Hero Content with Parallax Fade */}
      <div 
        className="relative z-10 max-w-7xl mx-auto px-4 w-full mt-10 sm:mt-0 flex flex-col justify-center h-full"
        style={{ 
          transform: `translateY(${scrollY * 0.2}px)`, 
          opacity: Math.max(0, 1 - scrollY / 700) 
        }}
      >
        <div className="max-w-4xl animate-in slide-in-from-bottom-10 duration-1000 fade-in fill-mode-forwards">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-stalker-accent"></div>
            <span className="text-stalker-accent font-mono text-sm tracking-[0.3em] uppercase">Коллекция 2024</span>
          </div>
          
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black text-white tracking-tighter mb-8 uppercase leading-[0.9]">
            Легион <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Тигр</span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-gray-300 max-w-xl mb-12 font-light leading-relaxed border-l border-white/20 pl-6">
            Элитное тактическое снаряжение. Сочетание военной утилитарности и бескомпромиссной эстетики.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={scrollToStory}
              className="group px-8 py-4 bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3"
            >
              Узнать историю 
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
            <Link 
              to="/catalog" 
              className="group px-8 py-4 border border-white/30 hover:border-white hover:bg-white/5 backdrop-blur text-white font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3"
            >
              В каталог
              <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-pulse"
        style={{ opacity: Math.max(0, 0.5 - scrollY / 300) }}
      >
        <span className="text-[10px] uppercase tracking-widest text-gray-400">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent"></div>
      </div>
    </div>
  );
};

// Story Scroll-Telling Section
const StorySection = () => {
  const product = MOCK_PRODUCTS[0]; // Specter V2
  return (
    <section id="story" className="bg-stalker-900 text-white py-0 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-stalker-900 to-transparent z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-24">
          
          {/* Sticky Image Side */}
          <div className="relative h-[500px] lg:h-auto order-1 lg:order-1">
            <div className="sticky top-0 h-screen flex items-center py-20">
               <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-stalker-800 border border-white/10 group">
                 <img 
                    src={product.image} 
                    alt="Specter V2 Detail" 
                    className="w-full h-full object-cover opacity-90 transition-transform duration-[2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stalker-900 via-transparent to-transparent opacity-80"></div>
                  
                  {/* Floating Specs */}
                  <div className="absolute top-8 right-8 text-right">
                    <p className="text-4xl font-display font-bold text-white/20">01</p>
                  </div>

                  <div className="absolute bottom-8 left-8">
                    <p className="font-mono text-xs text-stalker-accent tracking-widest uppercase mb-2">Объект</p>
                    <h3 className="text-3xl font-display font-bold uppercase leading-none">{product.name}</h3>
                  </div>
               </div>
            </div>
          </div>

          {/* Scrolling Text Side */}
          <div className="py-24 lg:py-48 space-y-48 order-2 lg:order-2">
            <RevealOnScroll>
              <span className="text-stalker-accent font-mono text-xs tracking-widest uppercase mb-4 block">Глава I: Происхождение</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight mb-8">
                Рождена <br/>в шторме.
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed border-l border-white/10 pl-6">
                Разработанная в суровых ветрах северных архипелагов, Specter V2 определяет баланс между дышащими свойствами и полной непроницаемостью. Это не просто защита от погоды. Это контроль над стихией.
              </p>
            </RevealOnScroll>
            
            <RevealOnScroll delay={200}>
               <span className="text-stalker-accent font-mono text-xs tracking-widest uppercase mb-4 block">Глава II: Материал</span>
               <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight mb-8">
                Тишина — <br/>твое оружие.
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed border-l border-white/10 pl-6">
                 Когда каждый звук может стать последним, ткань Cordura® 4-way stretch движется вместе с тобой. Никакого шуршания. Никакого сопротивления. Только полная свобода маневра в любой ситуации.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <span className="text-stalker-accent font-mono text-xs tracking-widest uppercase mb-4 block">Глава III: Назначение</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight mb-8">
                Вторая кожа.
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-10 border-l border-white/10 pl-6">
                Интегрированная система вентиляции и водостойкие молнии YKK® Aquaguard. Это не просто куртка. Это продолжение твоего тела, готовое к любой миссии.
              </p>
              <Link 
                to={`/product/${product.id}`}
                className="inline-flex items-center px-10 py-5 bg-stalker-accent hover:bg-stalker-accentHover text-white font-bold uppercase tracking-widest text-sm transition-all shadow-lg shadow-orange-900/20"
              >
                Приобрести {product.name} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </RevealOnScroll>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-stalker-900 to-transparent z-10"></div>
    </section>
  );
};

// Categories Grid
const CategoriesSection = () => (
  <section className="py-24 bg-stalker-900 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-tight">Категории</h2>
          <Link to="/catalog" className="text-gray-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest flex items-center">
            Весь каталог <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </RevealOnScroll>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CategoryCard 
           title="Одежда" 
           subtitle="Адаптивные слои"
           image="https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=1974&auto=format&fit=crop" 
           link="/catalog/apparel" 
           colSpan="col-span-1"
           delay={0}
        />
        <CategoryCard 
           title="Защита" 
           subtitle="Баллистика"
           image="https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=2070&auto=format&fit=crop" 
           link="/catalog/protection" 
           colSpan="col-span-1"
           delay={200}
        />
        <CategoryCard 
           title="Рюкзаки" 
           subtitle="Мобильность"
           image="https://images.unsplash.com/photo-1533575928287-253f9543df53?q=80&w=2070&auto=format&fit=crop" 
           link="/catalog/packs" 
           colSpan="col-span-1"
           delay={400}
        />
      </div>
    </div>
  </section>
);

const CategoryCard = ({ title, subtitle, image, link, colSpan, delay }: { title: string, subtitle: string, image: string, link: string, colSpan: string, delay: number }) => (
  <div className={colSpan}>
    <RevealOnScroll delay={delay} className="h-full">
      <Link to={link} className="group relative h-[500px] overflow-hidden block border border-white/5 h-full">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stalker-900 via-transparent to-transparent opacity-90"></div>
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <div className="flex justify-between items-end border-b border-white/30 pb-4 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div>
                <p className="text-stalker-accent font-mono text-xs tracking-widest uppercase mb-1">{subtitle}</p>
                <h3 className="text-3xl font-display font-bold text-white uppercase italic">
                  {title}
                </h3>
            </div>
            <ArrowRight className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-4 group-hover:translate-x-0" />
          </div>
        </div>
      </Link>
    </RevealOnScroll>
  </div>
);

// Features Component
const Features = () => (
  <div className="bg-stalker-800 py-24 border-t border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/5">
        <RevealOnScroll delay={0}>
          <div className="p-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-stalker-accent ring-1 ring-white/10">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase mb-3 tracking-wide">Точная Инженерия</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs mx-auto">Каждый шов, пряжка и панель рассчитаны на максимальную эффективность и минимальный вес.</p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <div className="p-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-stalker-accent ring-1 ring-white/10">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase mb-3 tracking-wide">Проверено Боем</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs mx-auto">Испытано в самых враждебных условиях на Земле. Если это подведет, мы это не продаем.</p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={400}>
          <div className="p-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-stalker-accent ring-1 ring-white/10">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase mb-3 tracking-wide">Быстрое Развертывание</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs mx-auto">Отправка в тот же день для критических заказов. Глобальная логистическая сеть активна.</p>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  </div>
);

// New Arrivals Component
const NewArrivals = () => (
  <div className="py-24 bg-stalker-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full"></div>
              <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Свежая поставка // Q3-2024</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">Новые поступления</h2>
          </div>
          <Link to="/catalog" className="hidden md:flex items-center text-stalker-accent hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">
            Смотреть все <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {MOCK_PRODUCTS.slice(0, 4).map((product, idx) => (
          <RevealOnScroll key={product.id} delay={idx * 100}>
            <Link to={`/product/${product.id}`} className="group block">
              <div className="aspect-[4/5] overflow-hidden relative bg-stalker-800 border border-white/5 mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                  {product.category}
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-stalker-accent transition-colors uppercase">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-3">
                  <p className="text-gray-400 font-mono text-sm">{product.price.toLocaleString()} ₽</p>
                  <span className="text-[10px] uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors">Подробнее</span>
                </div>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
      
      <div className="mt-16 text-center md:hidden">
        <Link to="/catalog" className="inline-flex items-center text-stalker-accent font-bold uppercase tracking-widest text-sm">
          Смотреть все <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="bg-stalker-900 min-h-screen">
      <Hero />
      <StorySection />
      <CategoriesSection />
      <NewArrivals />
      <Features />
    </div>
  );
};

export default Home;