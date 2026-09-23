import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowRight, Sparkles, Tag, Check } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

interface CategorySectionProps {
  variant?: 'page' | 'bar';
  onSelectCategory?: (category: string, subCategory?: string) => void;
}

export default function CategorySection({ variant = 'page', onSelectCategory }: CategorySectionProps) {
  const { categoryNames: allCategories, categoryDetailsMap: categoryDetails } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  const activeSubCategory = searchParams.get('sub') || '';

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (cat: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredCategory(cat);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 180); // gentle delay for smooth mouse movement into dropdown
  };

  const selectCategory = (category: string, subCategory?: string) => {
    if (onSelectCategory) {
      onSelectCategory(category, subCategory);
    } else {
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
    }
    setHoveredCategory(null);
    setMobileExpanded(null);

    // Smooth scroll down to products section if on Home page
    const productGrid = document.getElementById('catalog-products');
    if (productGrid) {
      productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // If used as a full standalone page section
  return (
    <section 
      id="curated-categories-section" 
      className="relative z-30 bg-[#FAF9F6] border-y border-stone-200/70 py-8 lg:py-10 transition-colors"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header with subtle branding */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-stone-200/50 gap-2">
          <div>
            <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 text-stone-500" />
              <span>Department Directory</span>
            </div>
            <h2 className="text-xl md:text-2xl font-display font-medium text-stone-900 tracking-tight">
              Curated Collections
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-sm">
            Hover over any category to explore curated silhouettes, tailored apparel, and timeless wardrobe essentials.
          </p>
        </div>

        {/* Desktop Category Bar / Names */}
        <div className="relative">
          <div 
            className="hidden lg:grid gap-3 relative"
            style={{ gridTemplateColumns: `repeat(${Math.max(1, allCategories.length + 1)}, minmax(0, 1fr))` }}
          >
            
            {/* "All" button */}
            <button
              id="cat-btn-all"
              type="button"
              onClick={() => selectCategory('All')}
              onMouseEnter={() => handleMouseEnter('All')}
              className={`group flex items-center justify-between p-4 rounded-xl text-left border transition-all duration-200 ${
                activeCategory === 'All' && !activeSubCategory
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <div>
                <span className={`text-[11px] font-semibold uppercase tracking-wider block mb-0.5 ${
                  activeCategory === 'All' && !activeSubCategory ? 'text-stone-300' : 'text-stone-400'
                }`}>
                  Overview
                </span>
                <span className="font-display font-medium text-base">All Goods</span>
              </div>
              <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                activeCategory === 'All' && !activeSubCategory ? 'text-white' : 'text-stone-400'
              }`} />
            </button>

            {/* Main Categories */}
            {allCategories.map((catName) => {
              const detail = categoryDetails[catName];
              const isActive = activeCategory.toLowerCase() === catName.toLowerCase();
              const isHovered = hoveredCategory === catName;

              return (
                <div
                  key={catName}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(catName)}
                >
                  <button
                    id={`cat-btn-${catName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    type="button"
                    onClick={() => selectCategory(catName)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl text-left border transition-all duration-200 ${
                      isActive
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : isHovered
                        ? 'bg-white border-stone-900 text-stone-950 ring-2 ring-stone-900/5'
                        : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider block mb-0.5 ${
                        isActive ? 'text-stone-300' : 'text-stone-400'
                      }`}>
                        Collection
                      </span>
                      <span className="font-display font-medium text-base line-clamp-1">
                        {catName}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isHovered ? 'rotate-180 text-stone-900' : isActive ? 'text-stone-300' : 'text-stone-400'
                    }`} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Desktop Hover Mega Menu Panel */}
          <AnimatePresence>
            {hoveredCategory && hoveredCategory !== 'All' && categoryDetails[hoveredCategory] && (
              <motion.div
                id={`mega-menu-${hoveredCategory.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.99 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => handleMouseEnter(hoveredCategory)}
                onMouseLeave={handleMouseLeave}
                className="hidden lg:block absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl border border-stone-200/80 shadow-2xl overflow-hidden p-8 z-50 backdrop-blur-xl"
              >
                {(() => {
                  const detail = categoryDetails[hoveredCategory];
                  return (
                    <div className="grid grid-cols-12 gap-8 items-start">
                      
                      {/* Subcategory groups - 8 cols */}
                      <div className="col-span-8 grid grid-cols-3 gap-6 border-r border-stone-100 pr-8">
                        {(detail.groups || []).map((grp, idx) => (
                          <div key={idx} className="space-y-3">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-1.5">
                              <Tag className="w-3 h-3 text-stone-400" />
                              {grp.title}
                            </h4>
                            <ul className="space-y-2">
                              {(grp.items || []).map((item) => {
                                const isSubActive = activeSubCategory.toLowerCase() === item.toLowerCase();
                                return (
                                  <li key={item}>
                                    <button
                                      type="button"
                                      onClick={() => selectCategory(hoveredCategory, item)}
                                      className={`text-sm text-left w-full py-1 px-2 rounded-md transition-all flex items-center justify-between group ${
                                        isSubActive 
                                          ? 'bg-stone-900 text-white font-medium' 
                                          : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                                      }`}
                                    >
                                      <span>{item}</span>
                                      <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                                        isSubActive ? 'opacity-100 text-white' : 'text-stone-400'
                                      }`} />
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Highlight preview & quick tags - 4 cols */}
                      <div className="col-span-4 flex flex-col justify-between h-full pl-2">
                        <div>
                          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest block mb-1">
                            Curated Focus
                          </span>
                          <h3 className="text-lg font-display font-medium text-stone-900 mb-1">
                            {detail.name}
                          </h3>
                          <p className="text-xs text-stone-500 leading-relaxed mb-4">
                            {detail.description}
                          </p>

                          {/* Quick pill tags */}
                          <div className="mb-4">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block mb-2">
                              Popular Categories
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {(detail.popularTags || []).map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => selectCategory(hoveredCategory, tag)}
                                  className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 rounded-full transition-colors font-medium"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Direct action button */}
                        <button
                          type="button"
                          onClick={() => selectCategory(hoveredCategory)}
                          className="w-full mt-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <span>Explore All {detail.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Accordion View for Small Screens */}
          <div className="lg:hidden flex flex-col gap-2.5">
            {/* All button */}
            <button
              type="button"
              onClick={() => selectCategory('All')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium ${
                activeCategory === 'All' && !activeSubCategory
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-800 border-stone-200'
              }`}
            >
              <span>All Collections</span>
              {activeCategory === 'All' && !activeSubCategory && <Check className="w-4 h-4" />}
            </button>

            {allCategories.map((catName) => {
              const detail = categoryDetails[catName];
              const isExpanded = mobileExpanded === catName;
              const isActive = activeCategory.toLowerCase() === catName.toLowerCase();

              return (
                <div key={catName} className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                  <div className="flex items-center justify-between p-3.5">
                    <button
                      type="button"
                      onClick={() => selectCategory(catName)}
                      className={`text-sm font-display font-medium text-left flex-1 ${
                        isActive ? 'text-stone-900 font-semibold' : 'text-stone-700'
                      }`}
                    >
                      {catName}
                      {isActive && activeSubCategory && (
                        <span className="ml-2 text-xs font-normal text-stone-400">
                          ({activeSubCategory})
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileExpanded(isExpanded ? null : catName)}
                      className="p-1 text-stone-400 hover:text-stone-900 transition-colors"
                      aria-label={`Toggle subcategories for ${catName}`}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {isExpanded && detail && (
                    <div className="bg-stone-50/80 px-4 py-3 border-t border-stone-100 space-y-3">
                      <p className="text-xs text-stone-500 italic">{detail.tagline}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(detail.popularTags || []).map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => selectCategory(catName, tag)}
                            className="text-xs px-2.5 py-1 bg-white border border-stone-200 text-stone-700 rounded-full font-medium"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2 pt-2">
                        {(detail.groups || []).map((grp, i) => (
                          <div key={i} className="text-xs">
                            <span className="font-semibold text-stone-600 block mb-1">{grp.title}:</span>
                            <div className="flex flex-wrap gap-1">
                              {(grp.items || []).map(item => (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => selectCategory(catName, item)}
                                  className="text-[11px] px-2 py-0.5 bg-white text-stone-600 rounded border border-stone-200/80 hover:bg-stone-900 hover:text-white transition-colors"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => selectCategory(catName)}
                        className="w-full mt-2 py-2 bg-stone-900 text-white text-xs font-medium rounded-lg text-center"
                      >
                        View All {catName}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Active filter badge if subCategory or specific category is selected */}
        {(activeCategory !== 'All' || activeSubCategory) && (
          <div className="mt-4 pt-3 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Active Selection:</span>
              <span className="font-medium text-stone-800 bg-stone-100 px-2.5 py-1 rounded-md">
                {activeCategory} {activeSubCategory && `› ${activeSubCategory}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => selectCategory('All')}
              className="text-stone-500 hover:text-stone-900 underline font-medium"
            >
              Reset to All Collections
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
