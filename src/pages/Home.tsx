import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDownAZ, ArrowUpZA, LayoutGrid, List as ListIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { allCategories } from '../data';

export default function Home() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const activeCategory = searchParams.get('category') || 'All';
  const sortBy = (searchParams.get('sort') || 'latest') as 'latest' | 'price-asc' | 'price-desc';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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
  
  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDirection, setHeroDirection] = useState(1);
  const heroProducts = products.slice(0, 4); // Take top 4 for hero

  useEffect(() => {
    if (heroProducts.length <= 1) return;
    
    const interval = setInterval(() => {
      setHeroDirection(1);
      setHeroIndex((prev) => (prev + 1) % heroProducts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroProducts.length]);

  const handleNextHero = () => {
    setHeroDirection(1);
    setHeroIndex((prev) => (prev + 1) % heroProducts.length);
  };
  
  const handlePrevHero = () => {
    setHeroDirection(-1);
    setHeroIndex((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
  };
  
  const categories = ['All', ...allCategories];
  
  let filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
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
    // 'latest' - assuming id is timestamp-based or just reversed
    return Number(b.id) - Number(a.id);
  });
  
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-stone-200 selection:text-stone-900">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-32 overflow-hidden bg-[#FAFAFA]">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[20%] -right-[10%] w-[70%] aspect-square rounded-full bg-rose-50/40 blur-3xl mix-blend-multiply" />
            <div className="absolute top-[40%] -left-[10%] w-[50%] aspect-square rounded-full bg-teal-50/40 blur-3xl mix-blend-multiply" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-medium text-stone-900 tracking-tight mb-6 leading-tight">
                Curated essentials for <br className="hidden md:block" /> intentional living.
              </h1>
              <p className="text-lg md:text-xl text-stone-500 font-light max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Discover a selection of premium, minimalist products designed to bring focus, calm, and elegance to your everyday environment.
              </p>
              <button className="inline-flex items-center justify-center h-12 px-8 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-full transition-colors duration-200">
                Explore Collection
              </button>
            </motion.div>

            {products.length > 0 && (
              <motion.div
                className="relative lg:ml-auto w-full max-w-md mx-auto lg:max-w-none lg:w-[90%]"
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 }}
              >
                <div className="aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden bg-stone-100 shadow-2xl shadow-stone-200/50 relative border border-white/50 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-stone-200/40 to-transparent z-10 pointer-events-none mix-blend-overlay" />
                  
                  {heroProducts.length > 0 ? (
                  <>
                  <AnimatePresence initial={false} custom={heroDirection}>
                    <motion.div
                      key={heroIndex}
                      custom={heroDirection}
                      variants={{
                        enter: (dir: number) => ({
                          x: dir > 0 ? '100%' : '-100%',
                          opacity: 0
                        }),
                        center: {
                          zIndex: 1,
                          x: 0,
                          opacity: 1
                        },
                        exit: (dir: number) => ({
                          zIndex: 0,
                          x: dir < 0 ? '100%' : '-100%',
                          opacity: 0
                        })
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                      }}
                      className="absolute inset-0"
                    >
                      <img 
                        src={heroProducts[heroIndex].imageUrl} 
                        alt={heroProducts[heroIndex].name}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-stone-900/40 to-transparent z-20">
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Featured Product</p>
                              <h3 className="text-base font-medium text-stone-900 line-clamp-1">{heroProducts[heroIndex].name}</h3>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm font-medium text-stone-900 block">{heroProducts[heroIndex].price}</span>
                              {heroProducts[heroIndex].mrp && <span className="text-xs text-stone-400 line-through">{heroProducts[heroIndex].mrp}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {heroProducts.length > 1 && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-3 right-3 flex justify-between z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={handlePrevHero} 
                      className="p-2 bg-white/70 hover:bg-white backdrop-blur rounded-full shadow-sm transition-colors text-stone-800"
                      aria-label="Previous product"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleNextHero} 
                      className="p-2 bg-white/70 hover:bg-white backdrop-blur rounded-full shadow-sm transition-colors text-stone-800"
                      aria-label="Next product"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  )}
                  </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                      <p>No products available</p>
                    </div>
                  )}
                </div>
                
                {/* Decorative floating elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 w-24 h-24 bg-rose-100 rounded-full blur-2xl -z-10"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute -bottom-8 -left-8 w-32 h-32 bg-teal-100 rounded-full blur-2xl -z-10"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.7, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </motion.div>
            )}
          </div>
        </section>

        {/* Category Marquee Section */}
        <section className="py-6 border-y border-stone-200/50 bg-white overflow-hidden relative">
          <div className="flex w-max animate-marquee-ltr">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex shrink-0 items-center gap-8 px-4">
                {allCategories.map((category, idx) => (
                  <span key={`cat-${i}-${idx}`} className="text-xl md:text-2xl font-display font-medium text-stone-300 uppercase tracking-widest whitespace-nowrap">
                    {category}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Product Layout Section */}
        <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto relative">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            
            {/* Sidebar Filters */}
            <aside className="flex flex-col w-full lg:w-56 shrink-0 lg:sticky lg:top-28 gap-6 lg:gap-10">
              {/* Sort Options */}
              <div>
                <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-widest mb-3 lg:mb-4 flex items-center gap-2">
                  <ArrowDownAZ className="w-4 h-4 text-stone-400" />
                  Sort By
                </h3>
                <div className="flex flex-row lg:flex-col gap-2 lg:gap-3 overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
                  <button
                    onClick={() => handleSortChange('latest')}
                    className={`shrink-0 text-left text-sm transition-colors px-4 py-2 lg:px-0 lg:py-0 rounded-full lg:rounded-none border lg:border-none ${
                      sortBy === 'latest' ? 'bg-stone-900 text-white lg:bg-transparent lg:text-stone-900 font-medium border-stone-900 lg:border-transparent' : 'bg-white lg:bg-transparent text-stone-500 hover:text-stone-800 border-stone-200 lg:border-transparent'
                    }`}
                  >
                    Latest Arrivals
                  </button>
                  <button
                    onClick={() => handleSortChange('price-asc')}
                    className={`shrink-0 text-left text-sm transition-colors px-4 py-2 lg:px-0 lg:py-0 rounded-full lg:rounded-none border lg:border-none ${
                      sortBy === 'price-asc' ? 'bg-stone-900 text-white lg:bg-transparent lg:text-stone-900 font-medium border-stone-900 lg:border-transparent' : 'bg-white lg:bg-transparent text-stone-500 hover:text-stone-800 border-stone-200 lg:border-transparent'
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => handleSortChange('price-desc')}
                    className={`shrink-0 text-left text-sm transition-colors px-4 py-2 lg:px-0 lg:py-0 rounded-full lg:rounded-none border lg:border-none ${
                      sortBy === 'price-desc' ? 'bg-stone-900 text-white lg:bg-transparent lg:text-stone-900 font-medium border-stone-900 lg:border-transparent' : 'bg-white lg:bg-transparent text-stone-500 hover:text-stone-800 border-stone-200 lg:border-transparent'
                    }`}
                  >
                    Price: High to Low
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-widest mb-3 lg:mb-4 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-stone-400" />
                  Categories
                </h3>
                <div className="flex flex-row lg:flex-col gap-2 lg:gap-3 overflow-x-auto lg:overflow-y-auto max-h-auto lg:max-h-[60vh] pr-0 lg:pr-2 custom-scrollbar pb-2 lg:pb-0">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`shrink-0 text-left text-sm transition-colors px-4 py-2 lg:px-0 lg:py-0 rounded-full lg:rounded-none border lg:border-none ${
                        activeCategory === category 
                          ? 'bg-stone-900 text-white lg:bg-transparent lg:text-stone-900 font-medium border-stone-900 lg:border-transparent' 
                          : 'bg-white lg:bg-transparent text-stone-500 hover:text-stone-800 border-stone-200 lg:border-transparent'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Product Grid */}
            <div className="flex-grow w-full min-w-0">
              <motion.div 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-medium text-stone-800 shrink-0 mb-1">Featured Curation</h2>
                  {searchQuery && (
                    <span className="text-sm text-stone-500">
                      Showing results for <span className="font-medium text-stone-900">"{searchQuery}"</span>
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
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
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16" 
                      : "grid grid-cols-1 gap-y-8"}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: { opacity: 0, x: -50 },
                      visible: { 
                        opacity: 1, 
                        x: 0,
                        transition: { 
                          duration: 0.4,
                          staggerChildren: 0.1 
                        } 
                      },
                      exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
                    }}
                  >
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
                          exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
                        }}
                        className={viewMode === 'list' ? "w-full sm:max-w-3xl" : ""}
                      >
                        <ProductCard product={product} viewMode={viewMode} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="py-20 text-center text-stone-500 bg-stone-50 rounded-2xl border border-stone-100">
                  <p>No products found matching your criteria.</p>
                  <button 
                    onClick={() => { 
                      setSearchParams(prev => { prev.delete('category'); prev.delete('q'); return prev; }); 
                    }} 
                    className="mt-4 text-stone-900 font-medium hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>
        
        {/* Newsletter/Value Prop Section */}
        <section className="px-6 py-24 bg-stone-100 mt-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-medium text-stone-800 mb-4">Mindful selections, weekly.</h2>
            <p className="text-stone-500 font-light mb-8">
              Join our newsletter for exclusive insights on minimalist design, focus, and thoughtfully crafted products.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow h-12 px-4 rounded-xl border border-stone-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition-all placeholder:text-stone-400"
                required
              />
              <button type="submit" className="h-12 px-6 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl transition-colors duration-200 shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
