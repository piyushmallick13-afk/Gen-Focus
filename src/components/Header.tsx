import { Search, Menu, Settings, X, Instagram, Clock, LayoutGrid, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useNavLinks } from '../hooks/useNavLinks';
import { useState, useEffect, useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import { allCategories } from '../data';
import { motion, AnimatePresence } from 'motion/react';

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

  const handleSuggestionClick = (productName: string) => {
    setSearchQuery(productName);
    setShowSuggestions(false);
    navigate(`/?q=${encodeURIComponent(productName)}`);
  };

  const filteredSuggestions = searchQuery.trim() 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
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
        
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl font-display font-medium tracking-wide text-stone-800">
            genfocus
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {exploreLinks.map(link => (
            <Link key={link.id} to={link.url} className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
              {link.label}
            </Link>
          ))}
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
                      onClick={() => handleSuggestionClick(product.name)}
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
                                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
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
