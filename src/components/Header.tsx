import { Search, Menu, Settings, X, Instagram, Clock, LayoutGrid, ChevronDown, ShoppingBag, Sparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useNavLinks } from '../hooks/useNavLinks';
import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import { allCategories } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../contexts/CartContext';
import { DurgaTrinayani, DhakBeatsController } from './FestiveDurgaMotifs';
import durgaEmblem from '../assets/images/durga_emblem_logo_1789895244534.jpg';

export default function Header() {
  const { links } = useNavLinks();
  const exploreLinks = links.filter(link => link.section === 'explore');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const activeCategory = searchParams.get('category') || 'All';
  const sortBy = searchParams.get('sort') || 'latest';
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { products } = useProducts();
  const searchRef = useRef<HTMLFormElement>(null);
  
  const { cart, setIsCartOpen } = useCart();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categories = ['All', ...allCategories];

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

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleSuggestionClick = (product: { id: string; name: string }) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  const filteredSuggestions = searchQuery.trim() 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Festive Announcement Top Bar */}
      <div className="bg-gradient-to-r from-rose-900 via-red-800 to-amber-900 text-amber-100 text-xs py-2 px-4 shadow-sm border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="inline-block px-1.5 py-0.5 rounded bg-amber-400 text-rose-950 font-bold text-[10px] tracking-wider uppercase shrink-0">
              শারদীয়া
            </span>
            <span className="truncate font-light text-[11px] md:text-xs">
              <strong className="font-semibold text-amber-200">শুভ শারদীয়া!</strong> Celebrate Durga Puja with handcrafted lifestyle essentials & festive hampers.
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleCategoryChange('Durga Puja Specials')}
              className="text-[11px] text-amber-200 hover:text-white underline underline-offset-2 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              View Pujo Specials
            </button>
            <span className="text-amber-400/40">|</span>
            <DhakBeatsController />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full bg-[#FAF7F2]/90 backdrop-blur-md border-b border-amber-900/10 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 -ml-2 text-stone-700 hover:text-rose-800 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md shadow-rose-900/10 group-hover:scale-105 transition-transform">
              <img 
                src={durgaEmblem} 
                alt="Maa Durga Emblem" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-amber-300/40 rounded-full pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-display font-medium tracking-wide text-stone-900 group-hover:text-rose-900 transition-colors">
                  genfocus
                </span>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  শারদীয়া
                </span>
              </div>
              <span className="text-[10px] text-amber-800/80 font-medium tracking-widest uppercase">
                Durga Puja Festive Edition
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            <button
              onClick={() => handleCategoryChange('Durga Puja Specials')}
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors px-3 py-1 rounded-full border ${
                activeCategory === 'Durga Puja Specials'
                  ? 'bg-rose-700 text-white border-rose-800 shadow-sm'
                  : 'text-rose-800 bg-rose-50/80 hover:bg-rose-100/80 border-rose-200/70'
              }`}
            >
              <DurgaTrinayani className="w-4 h-3 text-rose-700" color="currentColor" />
              <span>Pujo Specials</span>
            </button>

            {exploreLinks.map(link => (
              <Link key={link.id} to={link.url} className="text-sm font-medium text-stone-600 hover:text-rose-800 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 relative">
            <div className="sm:hidden">
              <DhakBeatsController />
            </div>

            <Link to="/admin" className="p-2 text-stone-600 hover:text-rose-800 transition-colors" title="Admin">
              <Settings className="w-5 h-5" />
            </Link>
            
            {isSearchOpen ? (
              <form ref={searchRef} onSubmit={handleSearchSubmit} className="relative flex items-center border border-amber-300 rounded-full px-3 py-1.5 bg-white shadow-sm ring-2 ring-amber-100">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search Pujo collections..." 
                  className="w-32 md:w-48 bg-transparent text-sm focus:outline-none text-stone-800"
                  autoFocus
                />
                <button type="submit" className="p-1 text-stone-400 hover:text-rose-800 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => { 
                    setIsSearchOpen(false); 
                    setSearchQuery(searchParams.get('q') || ''); 
                    setShowSuggestions(false);
                  }} 
                  className="p-1 text-stone-400 hover:text-stone-800 transition-colors ml-1"
                >
                  <X className="w-4 h-4" />
                </button>

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full right-0 mt-2 w-full md:w-64 bg-white border border-amber-200 rounded-xl shadow-lg overflow-hidden flex flex-col z-50">
                    {filteredSuggestions.map(product => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSuggestionClick(product)}
                        className="text-left px-4 py-2 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-900 transition-colors border-b border-stone-100 last:border-0 truncate"
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                )}
              </form>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="p-2 text-stone-600 hover:text-rose-800 transition-colors" 
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            <button 
              onClick={() => setIsCartOpen(true)} 
              className="p-2 text-stone-700 hover:text-rose-800 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-700 text-white text-[10px] font-bold flex items-center justify-center rounded-full pointer-events-none shadow-sm ring-1 ring-amber-300">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-[#FFFDF9] shadow-2xl z-50 flex flex-col overflow-y-auto border-r border-amber-200/50"
            >
              {/* Drawer Festive Header */}
              <div className="p-6 bg-gradient-to-br from-rose-900 to-amber-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-300/80 shadow">
                    <img 
                      src={durgaEmblem} 
                      alt="Durga Emblem" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="font-display font-medium text-lg leading-snug text-amber-100">
                      genfocus
                    </div>
                    <div className="text-[11px] text-amber-300 font-light">
                      শুভ শারদীয়া • Sharadotsav
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 -mr-2 text-amber-200 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-6 flex flex-col gap-8">
                {/* Durga Puja Special Highlight */}
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-rose-800 font-semibold text-xs uppercase tracking-wider">
                    <DurgaTrinayani className="w-5 h-5 text-rose-700" />
                    <span>পূজোর কেনাকাটা (Pujo Shopping)</span>
                  </div>
                  <p className="text-xs text-stone-600 font-light mb-3">
                    Explore curated lookbooks, dhunuchi aarti brassware, and traditional gifts for the 5 days of festival.
                  </p>
                  <button
                    onClick={() => {
                      handleCategoryChange('Durga Puja Specials');
                      setIsDrawerOpen(false);
                    }}
                    className="w-full py-2 px-3 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm text-center"
                  >
                    Browse Pujo Collection
                  </button>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="text-xs font-medium text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Sort By
                  </h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { handleSortChange('latest'); setIsDrawerOpen(false); }}
                      className={`text-left px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        sortBy === 'latest'
                          ? 'bg-rose-800 text-white shadow-md'
                          : 'bg-stone-50 text-stone-700 hover:bg-amber-50 hover:text-rose-900'
                      }`}
                    >
                      Latest Products
                    </button>
                    <button
                      onClick={() => { handleSortChange('price-asc'); setIsDrawerOpen(false); }}
                      className={`text-left px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        sortBy === 'price-asc'
                          ? 'bg-rose-800 text-white shadow-md'
                          : 'bg-stone-50 text-stone-700 hover:bg-amber-50 hover:text-rose-900'
                      }`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => { handleSortChange('price-desc'); setIsDrawerOpen(false); }}
                      className={`text-left px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        sortBy === 'price-desc'
                          ? 'bg-rose-800 text-white shadow-md'
                          : 'bg-stone-50 text-stone-700 hover:bg-amber-50 hover:text-rose-900'
                      }`}
                    >
                      Price: High to Low
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <button 
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="flex items-center justify-between w-full text-left text-xs font-medium text-stone-900 uppercase tracking-widest mb-4 focus:outline-none"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-amber-600" />
                      Categories
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isCategoriesOpen && (
                      <motion.div 
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                          hidden: { height: 0, opacity: 0, transition: { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] } },
                          visible: { height: 'auto', opacity: 1, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98], staggerChildren: 0.05 } }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 pb-4">
                          {categories.map(category => (
                            <motion.button
                              variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] } }
                              }}
                              key={category}
                              onClick={() => { handleCategoryChange(category); setIsDrawerOpen(false); }}
                              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all border ${
                                activeCategory === category
                                  ? 'bg-rose-800 text-white border-rose-900 shadow-sm'
                                  : 'bg-white text-stone-700 border-amber-200/80 hover:border-amber-400 hover:bg-amber-50/50'
                              }`}
                            >
                              {category}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Social Media Link */}
              <div className="p-6 border-t border-amber-200/50 mt-auto bg-amber-50/30">
                <div className="flex items-center justify-center gap-4">
                  <a 
                    href="https://www.instagram.com/_gen_focus_/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm text-stone-600 hover:text-rose-800 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-rose-700" />
                    <span>Follow us on Instagram</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

