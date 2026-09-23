import { Search, Menu, Settings, X, Instagram, Clock, LayoutGrid, ChevronDown, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { categoryNames: allCategories, categoryDetailsMap: categoryDetails } = useCategories();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const activeCategory = searchParams.get('category') || 'All';
  const activeSubCategory = searchParams.get('sub') || '';
  const sortBy = searchParams.get('sort') || 'latest';
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { products } = useProducts();
  const searchRef = useRef<HTMLFormElement>(null);
  
  const { cart, setIsCartOpen } = useCart();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categories = ['All', ...allCategories];

  const handleNavMouseEnter = (cat: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCategory(cat);
  };

  const handleNavMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 180);
  };

  const handleCategorySelect = (category: string, subCategory?: string) => {
    setSearchParams(prev => {
      if (category === 'All') {
        prev.delete('category');
        prev.delete('sub');
      } else {
        prev.set('category', category);
        if (subCategory) {
          prev.set('sub', subCategory);
        } else {
          prev.delete('sub');
        }
      }
      return prev;
    });
    setHoveredCategory(null);
    setIsDrawerOpen(false);
    navigate('/');

    // Smooth scroll down to products section
    setTimeout(() => {
      const el = document.getElementById('catalog-products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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

  const allowedCategoriesSet = new Set(allCategories.map(c => c.toLowerCase()));
  const filteredSuggestions = searchQuery.trim() 
    ? products
        .filter(p => allCategories.length === 0 || !p.category || allowedCategoriesSet.has(p.category.toLowerCase()))
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFAFA]/80 backdrop-blur-md border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 -ml-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-semibold tracking-wider transition-transform duration-200 group-hover:scale-105 shadow-xs">
            g
          </div>
          <span className="text-2xl font-display font-medium tracking-wide text-stone-800">
            genfocus
          </span>
        </Link>

        {/* Desktop Categories Navigation with Hover Mega Menus */}
        <nav 
          className="hidden lg:flex items-center gap-6 relative"
          onMouseLeave={handleNavMouseLeave}
        >
          {allCategories.map((category) => {
            const detail = categoryDetails[category];
            const isHovered = hoveredCategory === category;
            const isActive = activeCategory.toLowerCase() === category.toLowerCase();

            return (
              <div 
                key={category} 
                className="relative py-2"
                onMouseEnter={() => handleNavMouseEnter(category)}
              >
                <button
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-1 px-2 rounded-lg ${
                    isActive
                      ? 'text-stone-900 font-semibold'
                      : isHovered
                      ? 'text-stone-900 bg-stone-100/80'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>{category}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown for hovered category */}
                <AnimatePresence>
                  {isHovered && detail && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      onMouseEnter={() => handleNavMouseEnter(category)}
                      onMouseLeave={handleNavMouseLeave}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-80 bg-white border border-stone-200/80 rounded-2xl shadow-xl p-5 z-50 mt-1"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Department</p>
                          <h4 className="text-sm font-display font-medium text-stone-900">{category}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCategorySelect(category)}
                          className="text-xs text-stone-500 hover:text-stone-900 font-medium flex items-center gap-1"
                        >
                          <span>All</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Related Categories */}
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block mb-1.5">
                            Related Categories
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(detail.popularTags || []).map(tag => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleCategorySelect(category, tag)}
                                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                                  activeSubCategory.toLowerCase() === tag.toLowerCase()
                                    ? 'bg-stone-900 text-white font-medium'
                                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-stone-100 pt-2 space-y-1">
                          {(detail.groups || []).slice(0, 2).map((grp, i) => (
                            <div key={i} className="text-xs">
                              <span className="font-semibold text-stone-700 text-[11px] block mb-1">{grp.title}</span>
                              <div className="flex flex-wrap gap-1">
                                {(grp.items || []).slice(0, 4).map(item => (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() => handleCategorySelect(category, item)}
                                    className="text-[11px] px-2 py-0.5 rounded text-stone-600 hover:bg-stone-50 hover:text-stone-900 border border-stone-100"
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 relative">
          <Link to="/admin" className="p-2 text-stone-600 hover:text-stone-900 transition-colors" title="Admin">
            <Settings className="w-5 h-5" />
          </Link>
          
          {isSearchOpen ? (
            <form ref={searchRef} onSubmit={handleSearchSubmit} className="relative flex items-center border border-stone-200 rounded-full px-3 py-1.5 bg-white shadow-sm">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search..." 
                className="w-32 md:w-48 bg-transparent text-sm focus:outline-none text-stone-800"
                autoFocus
              />
              <button type="submit" className="p-1 text-stone-400 hover:text-stone-800 transition-colors">
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
                <div className="absolute top-full right-0 mt-2 w-full md:w-64 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden flex flex-col z-50">
                  {filteredSuggestions.map(product => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSuggestionClick(product)}
                      className="text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors border-b border-stone-100 last:border-0 truncate"
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
              className="p-2 text-stone-600 hover:text-stone-900 transition-colors" 
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <button 
            onClick={() => setIsCartOpen(true)} 
            className="p-2 text-stone-600 hover:text-stone-900 transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center rounded-full pointer-events-none">
                {cartItemCount}
              </span>
            )}
          </button>
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
              className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col overflow-y-auto"
            >
              <div className="p-6 border-b border-stone-200/50 flex items-center justify-between">
                <span className="text-xl font-display font-medium tracking-wide text-stone-800">
                  Menu
                </span>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 -mr-2 text-stone-400 hover:text-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-6 flex flex-col gap-10">
                {/* Sort By */}
                <div>
                  <h3 className="text-xs font-medium text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-stone-400" />
                    Sort By
                  </h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { handleSortChange('latest'); setIsDrawerOpen(false); }}
                      className={`text-left px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        sortBy === 'latest'
                          ? 'bg-stone-900 text-white shadow-md'
                          : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      Latest Products
                    </button>
                    <button
                      onClick={() => { handleSortChange('price-asc'); setIsDrawerOpen(false); }}
                      className={`text-left px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        sortBy === 'price-asc'
                          ? 'bg-stone-900 text-white shadow-md'
                          : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => { handleSortChange('price-desc'); setIsDrawerOpen(false); }}
                      className={`text-left px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        sortBy === 'price-desc'
                          ? 'bg-stone-900 text-white shadow-md'
                          : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
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
                      <LayoutGrid className="w-4 h-4 text-stone-400" />
                      Departments & Categories
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
                          visible: { height: 'auto', opacity: 1, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] } }
                        }}
                        className="overflow-hidden space-y-2 pb-4"
                      >
                        <button
                          type="button"
                          onClick={() => handleCategorySelect('All')}
                          className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-all border ${
                            activeCategory === 'All' && !activeSubCategory
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          All Collections
                        </button>

                        {allCategories.map(category => {
                          const detail = categoryDetails[category];
                          const isExpanded = expandedMobileCategory === category;
                          const isCatActive = activeCategory.toLowerCase() === category.toLowerCase();

                          return (
                            <div key={category} className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                              <div className="flex items-center justify-between p-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleCategorySelect(category)}
                                  className={`text-xs font-medium text-left flex-1 ${
                                    isCatActive ? 'text-stone-950 font-semibold' : 'text-stone-700'
                                  }`}
                                >
                                  {category}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setExpandedMobileCategory(isExpanded ? null : category)}
                                  className="p-1 text-stone-400 hover:text-stone-900"
                                >
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                              </div>

                              {isExpanded && detail && (
                                <div className="bg-stone-50 p-2.5 border-t border-stone-100 space-y-2">
                                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                                    Related Categories:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {(detail.popularTags || []).map(tag => (
                                      <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleCategorySelect(category, tag)}
                                        className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                                          activeSubCategory.toLowerCase() === tag.toLowerCase()
                                            ? 'bg-stone-900 text-white border-stone-900'
                                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                                        }`}
                                      >
                                        {tag}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Social Media Link */}
              <div className="p-6 border-t border-stone-200/50 mt-auto">
                <div className="flex items-center justify-center gap-4">
                  <a 
                    href="https://www.instagram.com/_gen_focus_/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
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
