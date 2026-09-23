import React from 'react';
import { Product } from '../types';
import { ArrowRight, Star, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="group flex flex-col sm:flex-row gap-6 bg-white p-4 md:p-5 rounded-2xl border border-stone-200/80 transition-all duration-300 hover:border-stone-300 hover:shadow-md">
        <Link 
          to={`/product/${product.id}`} 
          className={`relative w-full sm:w-52 aspect-square sm:aspect-[4/5] shrink-0 overflow-hidden rounded-xl ${product.imageBgColor || 'bg-stone-50'} block`}
        >
          {product.discount && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-stone-900 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                {product.discount} OFF
              </span>
            </div>
          )}

          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="h-full w-full object-cover object-center mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/999999?text=Image+Not+Available' }}
          />
        </Link>
        
        <div className="flex flex-col grow py-1">
          <div className="flex justify-between items-start gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{product.category}</span>
                {product.subcategory && (
                  <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full tracking-wide">
                    {product.subcategory}
                  </span>
                )}
                {product.rating && (
                  <div className="flex items-center gap-1 text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
                    <Star className="w-3 h-3 fill-stone-700 text-stone-700" />
                    <span>{product.rating}</span>
                  </div>
                )}
              </div>
              <Link to={`/product/${product.id}`} className="group-hover:text-stone-600 transition-colors">
                <h3 className="text-lg font-medium text-stone-900">{product.name}</h3>
              </Link>
            </div>
            <div className="flex flex-col items-end mt-0.5 shrink-0">
              <span className="text-base font-semibold text-stone-900 flex items-center">
                <IndianRupee className="w-3.5 h-3.5" />
                {product.price.replace('₹', '')}
              </span>
              {product.mrp && (
                <span className="text-xs text-stone-400 line-through mt-0.5 flex items-center">
                  <IndianRupee className="w-2.5 h-2.5" />
                  {product.mrp.replace('₹', '')}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed mb-6 font-light line-clamp-2">
            {product.description}
          </p>
          
          <div className="mt-auto flex justify-end">
            <Link
              to={`/product/${product.id}`}
              className="inline-flex items-center justify-center gap-2 py-2 px-5 bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-800 text-xs font-medium rounded-xl transition-all duration-200 border border-stone-200 group/btn shadow-xs"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover/btn:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl p-3 border border-stone-200/80 transition-all duration-300 hover:border-stone-300 hover:shadow-md">
      <Link 
        to={`/product/${product.id}`} 
        className={`relative aspect-square sm:aspect-[4/5] w-full overflow-hidden rounded-xl ${product.imageBgColor || 'bg-stone-50'} transition-transform duration-500 block`}
      >
        {product.discount && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-stone-900 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              {product.discount} OFF
            </span>
          </div>
        )}

        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="h-full w-full object-cover object-center mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/999999?text=Image+Not+Available' }}
        />
      </Link>
      
      <div className="p-3 flex flex-col grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider truncate">{product.category}</span>
              {product.subcategory && (
                <span className="text-[9px] font-medium text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded-full tracking-wide">
                  {product.subcategory}
                </span>
              )}
            </div>
            <Link to={`/product/${product.id}`} className="hover:text-stone-600 transition-colors block">
              <h3 className="text-base font-medium text-stone-900 line-clamp-1">{product.name}</h3>
            </Link>
          </div>
          <div className="flex flex-col items-end shrink-0 mt-0.5">
            <span className="text-sm font-semibold text-stone-900 flex items-center">
              <IndianRupee className="w-3 h-3" />
              {product.price.replace('₹', '')}
            </span>
            {product.mrp && (
              <span className="text-xs text-stone-400 line-through mt-0.5 flex items-center">
                <IndianRupee className="w-2.5 h-2.5" />
                {product.mrp.replace('₹', '')}
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed mb-4 font-light line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-auto">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-800 text-xs font-semibold rounded-xl transition-all duration-200 border border-stone-200 group/btn shadow-xs"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover/btn:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
