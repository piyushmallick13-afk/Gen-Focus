import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDownAZ, LayoutGrid, List as ListIcon, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { allCategories } from '../data';
import { DurgaTrinayani, AlponaDivider, PujoDaysTabStrip, PUJO_DAYS, PujoDayInfo, DhakIcon, DhunuchiIcon } from '../components/FestiveDurgaMotifs';
import durgaHeroBanner from '../assets/images/durga_puja_festive_hero_1789895231868.jpg';

export default function Home() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const activeCategory = searchParams.get('category') || 'All';
  const sortBy = (searchParams.get('sort') || 'latest') as 'latest' | 'price-asc' | 'price-desc';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPujoDay, setSelectedPujoDay] = useState<PujoDayInfo>(PUJO_DAYS[2]); // Default to Ashtami (most celebrated day)
  const productsSectionRef = useRef<HTMLDivElement>(null);
  
  const handleCategoryChange = (category: string) => {
    setSearchParams(prev => {
      prev.set('category', category);
      return prev;
    });
  };

  const handleSortChange = (sort: 'latest' | 'price-asc' | 'price-desc') => {
    setSearchParams(prev => {
      prev.set('sort', sort);
      return prev;
    });
  };

  const handleSelectPujoDay = (day: PujoDayInfo) => {
    setSelectedPujoDay(day);
    if (day.recommendedCategory) {
      handleCategoryChange(day.recommendedCategory);
    }
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDirection, setHeroDirection] = useState(1);
  const heroProducts = products.filter(p => p.festiveTag || p.category?.includes('Pujo') || p.category?.includes('Aarti')).slice(0, 4);
  const fallbackHero = heroProducts.length > 0 ? heroProducts : products.slice(0, 4);

  useEffect(() => {
    if (fallbackHero.length <= 1) return;
    
    const interval = setInterval(() => {
      setHeroDirection(1);
      setHeroIndex((prev) => (prev + 1) % fallbackHero.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [fallbackHero.length]);

  const handleNextHero = () => {
    setHeroDirection(1);
    setHeroIndex((prev) => (prev + 1) % fallbackHero.length);
  };
  
  const handlePrevHero = () => {
    setHeroDirection(-1);
    setHeroIndex((prev) => (prev - 1 + fallbackHero.length) % fallbackHero.length);
  };
  
  const categories = ['All', ...allCategories];
  
  let filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => {
        if (activeCategory === 'Durga Puja Specials') {
          return Boolean(p.festiveTag || p.category?.includes('Pujo') || p.category?.includes('Aarti') || p.category?.includes('Mandir') || p.category?.includes('Festive'));
        }
        return p.category === activeCategory;
      });

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.festiveTag && p.festiveTag.toLowerCase().includes(q))
    );
  }

  // Sort products
  const parsePrice = (priceStr: string) => {
    return Number(priceStr.replace(/[^0-9.-]+/g,""));
  };

  filteredProducts.sort((a, b) => {
    if (sortBy === 'price-asc') {
      return parsePrice(a.price) - parsePrice(b.price);
    } else if (sortBy === 'price-desc') {
      return parsePrice(b.price) - parsePrice(a.price);
    }
    return Number(b.id) - Number(a.id);
  });
  
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF7F2] text-stone-900 selection:bg-rose-900 selection:text-amber-100">
      <Header />
      
      <main className="flex-grow">
        {/* Festive Durga Puja Hero Section */}
        <section className="relative px-6 py-16 md:py-24 overflow-hidden bg-gradient-to-b from-[#FFFBF5] via-[#FFF8EE] to-[#FAF7F2] border-b border-amber-900/10">
          {/* Subtle Ambient Festive Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[15%] -right-[5%] w-[65%] aspect-square rounded-full bg-rose-200/30 blur-3xl mix-blend-multiply" />
            <div className="absolute top-[30%] -left-[10%] w-[55%] aspect-square rounded-full bg-amber-200/30 blur-3xl mix-blend-multiply" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & Festive Text */}
            <motion.div 
              className="lg:col-span-6 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-300 text-rose-900 text-xs font-semibold mb-6 shadow-sm">
                <DurgaTrinayani className="w-4 h-4 text-rose-800" />
                <span>শুভ শারদীয়া • SHARADOTSAV 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-stone-900 tracking-tight mb-6 leading-[1.15]">
                Welcome Maa Durga with <span className="festive-crimson-text font-bold">Timeless Splendor.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-stone-600 font-light max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Handcrafted pure brass Dhunuchi, royal Gorod silks, autumn Shiuli fragrances, and curated lifestyle essentials for all five joyous days of Durga Puja.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={() => {
                    handleCategoryChange('Durga Puja Specials');
                    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-8 bg-rose-800 hover:bg-rose-900 text-white font-medium rounded-full transition-all duration-200 shadow-md shadow-rose-900/20 hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Explore Pujo Specials</span>
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('pujo-days-strip')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 bg-white hover:bg-amber-50/80 text-stone-800 font-medium rounded-full transition-all duration-200 border border-amber-200 shadow-sm"
                >
                  <DhakIcon className="w-4 h-4 text-rose-700" />
                  <span>5 Days Lookbook</span>
                </button>
              </div>

              {/* Cultural Sub-banner */}
              <div className="mt-8 pt-6 border-t border-amber-900/10 flex items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-light">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>Authentic Handcrafts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Free Festive Packaging</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Pan-India Pujo Express</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual / Banner Showcase */}
            <motion.div
              className="lg:col-span-6 relative w-full max-w-lg mx-auto lg:max-w-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300/80 bg-stone-900 group">
                <img 
                  src={durgaHeroBanner} 
                  alt="Durga Puja Artistic Celebration" 
                  className="w-full h-80 sm:h-96 md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/30 to-transparent pointer-events-none" />

                {/* Floating Featured Product Overlay */}
                {fallbackHero.length > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-amber-200/80">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={fallbackHero[heroIndex].imageUrl} 
                            alt={fallbackHero[heroIndex].name}
                            className="w-14 h-14 rounded-xl object-cover border border-amber-200 shrink-0"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/eeeeee/999999?text=Product' }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-1.5 py-0.2 rounded">
                                {fallbackHero[heroIndex].festiveTag || 'Festive Pick'}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-stone-900 truncate">
                              {fallbackHero[heroIndex].name}
                            </h4>
                            <span className="text-xs font-semibold text-rose-900">
                              {fallbackHero[heroIndex].price}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            onClick={handlePrevHero} 
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors text-stone-700"
                            aria-label="Previous product"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={handleNextHero} 
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors text-stone-700"
                            aria-label="Next product"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Decorative Alpona Corner Accents */}
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-rose-600/20 blur-xl pointer-events-none" />
            </motion.div>
          </div>
        </section>

        {/* 5 Days of Pujo Interactive Experience Section */}
        <section id="pujo-days-strip" className="max-w-7xl mx-auto px-6 -mt-6 relative z-20">
          <PujoDaysTabStrip 
            activeDay={selectedPujoDay.day}
            onSelectDay={handleSelectPujoDay}
          />
        </section>

        {/* Selected Day Feature Spotlight */}
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="bg-white/80 backdrop-blur-sm border border-amber-200/80 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-rose-800 border border-amber-200 shrink-0">
                <DhunuchiIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-rose-900 text-sm">{selectedPujoDay.englishTitle}</span>
                  <span className="text-xs text-stone-500">• {selectedPujoDay.ritual}</span>
                </div>
                <p className="text-xs text-stone-600 font-light mt-1">
                  <strong>Style & Living Advice:</strong> {selectedPujoDay.styleAdvice}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                handleCategoryChange(selectedPujoDay.recommendedCategory);
                productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition-colors border border-rose-200 shrink-0"
            >
              <span>View {selectedPujoDay.day} Essentials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Festive Marquee Section */}
        <section className="py-4 border-y border-amber-900/10 bg-gradient-to-r from-rose-950 via-red-900 to-amber-950 text-amber-200 overflow-hidden relative mt-12">
          <div className="flex w-max animate-marquee-ltr">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex shrink-0 items-center gap-10 px-6 font-display font-medium text-sm md:text-base uppercase tracking-widest">
                <span className="flex items-center gap-2">🌸 শুভ শারদীয়া</span>
                <span className="text-amber-500/50">•</span>
                <span className="flex items-center gap-2">🥁 DHAKER TALE TALE</span>
                <span className="text-amber-500/50">•</span>
                <span className="flex items-center gap-2">🪔 SANDHI PUJA AARTI</span>
                <span className="text-amber-500/50">•</span>
                <span className="flex items-center gap-2">🌾 KASH PHOOL & AGOMONI</span>
                <span className="text-amber-500/50">•</span>
                <span className="flex items-center gap-2">🌺 PUJOR NOTUN SHAJ</span>
                <span className="text-amber-500/50">•</span>
                <span className="flex items-center gap-2">✨ SUBHO BIJOYA BLESSINGS</span>
                <span className="text-amber-500/50">•</span>
              </div>
            ))}
          </div>
        </section>

        {/* Traditional Alpona Section Divider */}
        <AlponaDivider className="my-10 max-w-4xl mx-auto" />

        {/* Product Layout Section */}
        <section ref={productsSectionRef} className="px-6 py-8 md:py-16 max-w-7xl mx-auto relative">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
            
            {/* Sidebar Filters */}
            <aside className="flex flex-col w-full lg:w-60 shrink-0 lg:sticky lg:top-28 gap-6 lg:gap-8 bg-white/70 backdrop-blur-sm p-5 rounded-3xl border border-amber-200/60 shadow-sm">
              {/* Sort Options */}
              <div>
                <h3 className="text-xs font-semibold text-rose-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ArrowDownAZ className="w-4 h-4 text-amber-600" />
                  Sort Collections
                </h3>
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
                  <button
                    onClick={() => handleSortChange('latest')}
                    className={`shrink-0 text-left text-xs md:text-sm transition-all px-3 py-2 rounded-xl border ${
                      sortBy === 'latest' 
                        ? 'bg-rose-800 text-white font-medium border-rose-900 shadow-sm' 
                        : 'bg-white text-stone-600 hover:bg-amber-50/70 border-stone-200'
                    }`}
                  >
                    Latest Arrivals
                  </button>
                  <button
                    onClick={() => handleSortChange('price-asc')}
                    className={`shrink-0 text-left text-xs md:text-sm transition-all px-3 py-2 rounded-xl border ${
                      sortBy === 'price-asc' 
                        ? 'bg-rose-800 text-white font-medium border-rose-900 shadow-sm' 
                        : 'bg-white text-stone-600 hover:bg-amber-50/70 border-stone-200'
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => handleSortChange('price-desc')}
                    className={`shrink-0 text-left text-xs md:text-sm transition-all px-3 py-2 rounded-xl border ${
                      sortBy === 'price-desc' 
                        ? 'bg-rose-800 text-white font-medium border-rose-900 shadow-sm' 
                        : 'bg-white text-stone-600 hover:bg-amber-50/70 border-stone-200'
                    }`}
                  >
                    Price: High to Low
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-xs font-semibold text-rose-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-amber-600" />
                  Festive & Home Categories
                </h3>
                <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto max-h-auto lg:max-h-[55vh] pr-0 lg:pr-1 custom-scrollbar pb-2 lg:pb-0">
                  {categories.map(category => {
                    const isPujoCategory = category.includes('Pujo') || category.includes('Durga') || category.includes('Aarti') || category.includes('Mandir') || category.includes('Festive');
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`shrink-0 text-left text-xs transition-all px-3 py-2 rounded-xl border flex items-center justify-between ${
                          activeCategory === category 
                            ? 'bg-rose-800 text-white font-semibold border-rose-900 shadow-sm' 
                            : isPujoCategory
                              ? 'bg-amber-50/80 text-rose-900 hover:bg-amber-100/80 border-amber-200 font-medium'
                              : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
                        }`}
                      >
                        <span className="truncate">{category}</span>
                        {isPujoCategory && activeCategory !== category && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Main Product Grid */}
            <div className="flex-grow w-full min-w-0">
              <motion.div 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl md:text-3xl font-display font-medium text-stone-900 shrink-0">
                      {activeCategory === 'All' ? 'Curated Festive & Home Essentials' : activeCategory}
                    </h2>
                    <span className="text-xs bg-amber-100 text-amber-900 font-medium px-2 py-0.5 rounded-full border border-amber-200">
                      {filteredProducts.length} items
                    </span>
                  </div>
                  {searchQuery ? (
                    <span className="text-xs text-stone-500">
                      Showing results for <span className="font-semibold text-rose-800">"{searchQuery}"</span>
                    </span>
                  ) : (
                    <p className="text-xs text-stone-500 font-light">
                      Handpicked for devotion, elevated living, and joyous celebrations.
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-stone-200 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-rose-800 text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-rose-800 text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                    aria-label="List view"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
              
              {filteredProducts.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`${activeCategory}-${sortBy}-${viewMode}-${searchQuery}`}
                    className={viewMode === 'grid' 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                      : "grid grid-cols-1 gap-4"}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { 
                        opacity: 1, 
                        transition: { 
                          duration: 0.3,
                          staggerChildren: 0.08 
                        } 
                      },
                      exit: { opacity: 0, transition: { duration: 0.2 } }
                    }}
                  >
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] } },
                          exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } }
                        }}
                        className={viewMode === 'list' ? "w-full" : ""}
                      >
                        <ProductCard product={product} viewMode={viewMode} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="py-20 text-center text-stone-500 bg-white/80 rounded-3xl border border-amber-200/80 p-8 shadow-sm">
                  <DurgaTrinayani className="w-12 h-12 mx-auto mb-3 text-rose-700 opacity-60" />
                  <p className="text-base font-medium text-stone-800 mb-1">No products found for this selection.</p>
                  <p className="text-xs text-stone-500 mb-4">Try clearing your filters to explore our full festive catalog.</p>
                  <button 
                    onClick={() => { 
                      setSearchParams(prev => { prev.delete('category'); prev.delete('q'); return prev; }); 
                    }} 
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>
        
        {/* Newsletter/Festive Gifting Section */}
        <section className="px-6 py-20 bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100/60 border-t border-amber-900/10 mt-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex p-3 rounded-full bg-white shadow-md border border-amber-200 mb-4">
              <DurgaTrinayani className="w-8 h-8 text-rose-800" />
            </div>
            <h2 className="text-2xl md:text-4xl font-display font-medium text-stone-900 mb-3">
              শারদ শুভেচ্ছা ও উপহার
            </h2>
            <p className="text-sm md:text-base text-stone-600 font-light mb-8 max-w-xl mx-auto">
              Subscribe to our festive gazette for exclusive early access to Subho Bijoya confection gift boxes, festive home styling guides, and celebratory offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email for festive updates" 
                className="flex-grow h-12 px-4 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-800/30 text-stone-800 text-sm placeholder:text-stone-400 shadow-sm"
                required
              />
              <button type="submit" className="h-12 px-6 bg-rose-800 hover:bg-rose-900 text-white font-medium rounded-xl transition-colors duration-200 shrink-0 shadow-sm">
                Join Festive Circle
              </button>
            </form>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

