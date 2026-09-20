import { Product } from '../types';
import { ArrowRight, Star, IndianRupee, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const isFestive = Boolean(product.festiveTag || product.category?.includes('Pujo') || product.category?.includes('Durga') || product.category?.includes('Aarti') || product.category?.includes('Mandir') || product.category?.includes('Festive'));

  if (viewMode === 'list') {
    return (
      <div className={`group flex flex-col sm:flex-row gap-6 bg-white p-4 md:p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
        isFestive ? 'border-amber-200/80 hover:border-rose-300 shadow-sm' : 'border-stone-200/80 hover:border-stone-300'
      }`}>
        <Link to={`/product/${product.id}`} className={`relative w-full sm:w-52 aspect-square sm:aspect-[4/5] flex-shrink-0 overflow-hidden rounded-xl ${product.imageBgColor || 'bg-[#FFFDF9]'} block`}>
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5 items-start">
            {product.festiveTag && (
              <span className="bg-rose-700 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                {product.festiveTag}
              </span>
            )}
            {product.discount && (
              <span className="bg-amber-500 text-amber-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                {product.discount} OFF
              </span>
            )}
          </div>

          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="h-full w-full object-cover object-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/999999?text=Image+Not+Available' }}
          />
        </Link>
        
        <div className="flex flex-col flex-grow py-1">
          <div className="flex justify-between items-start gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-semibold text-amber-800/80 uppercase tracking-wider">{product.category}</span>
                {product.pujoDay && (
                  <span className="text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded-full">
                    {product.pujoDay} Look
                  </span>
                )}
                {product.rating && (
                  <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-medium">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                )}
              </div>
              <Link to={`/product/${product.id}`} className="group-hover:text-rose-800 transition-colors">
                <h3 className="text-lg font-medium text-stone-900">{product.name}</h3>
              </Link>
            </div>
            <div className="flex flex-col items-end mt-0.5 shrink-0">
              <span className="text-base font-semibold text-rose-900 flex items-center">
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
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-stone-50 hover:bg-rose-700 hover:text-white text-stone-800 text-sm font-medium rounded-xl transition-all duration-200 border border-stone-200 group/btn"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover/btn:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex flex-col h-full bg-white rounded-3xl p-3 border transition-all duration-300 hover:shadow-xl ${
      isFestive ? 'border-amber-200/90 hover:border-rose-300' : 'border-stone-200/80 hover:border-stone-300'
    }`}>
      <Link to={`/product/${product.id}`} className={`relative aspect-square sm:aspect-[4/5] w-full overflow-hidden rounded-2xl ${product.imageBgColor || 'bg-[#FFFDF9]'} transition-transform duration-500 block`}>
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 items-start">
          {product.festiveTag && (
            <span className="bg-rose-700 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              {product.festiveTag}
            </span>
          )}
          {product.discount && (
            <span className="bg-amber-400 text-amber-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              {product.discount} OFF
            </span>
          )}
        </div>

        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="h-full w-full object-cover object-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/999999?text=Image+Not+Available' }}
        />
        
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-rose-950/0 group-hover:bg-rose-950/5 transition-colors duration-500 pointer-events-none" />
      </Link>
      
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-[11px] font-semibold text-amber-800/80 uppercase tracking-wider truncate">{product.category}</span>
              {product.pujoDay && (
                <span className="text-[9px] font-medium bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded-full">
                  {product.pujoDay}
                </span>
              )}
            </div>
            <Link to={`/product/${product.id}`} className="hover:text-rose-800 transition-colors block">
              <h3 className="text-base font-medium text-stone-900 line-clamp-1">{product.name}</h3>
            </Link>
          </div>
          <div className="flex flex-col items-end shrink-0 mt-0.5">
            <span className="text-sm font-semibold text-rose-900 flex items-center">
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
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-stone-50 hover:bg-rose-700 hover:text-white text-stone-800 text-xs font-semibold rounded-xl transition-all duration-200 border border-stone-200/80 group/btn shadow-sm"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover/btn:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
