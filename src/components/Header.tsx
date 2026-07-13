import { Search, Menu, Settings, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useNavLinks } from '../hooks/useNavLinks';
import { useState, useEffect, useRef } from 'react';
import { useProducts } from '../hooks/useProducts';

export default function Header() {
  const { links } = useNavLinks();
  const exploreLinks = links.filter(link => link.section === 'explore');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { products } = useProducts();
  const searchRef = useRef<HTMLFormElement>(null);

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
        <div className="flex items-center gap-4 lg:hidden">
          <button className="p-2 -ml-2 text-stone-600 hover:text-stone-900 transition-colors">
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
    </header>
  );
}
