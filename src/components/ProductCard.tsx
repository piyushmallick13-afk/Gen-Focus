import { Product } from '../types';
import { ExternalLink, ArrowRight, Star, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="group flex flex-col sm:flex-row gap-6 bg-white p-4 rounded-2xl border border-stone-100 hover:shadow-md transition-shadow">
        <Link to={`/product/${product.id}`} className={`relative w-full sm:w-48 aspect-square sm:aspect-[4/5] flex-shrink-0 overflow-hidden rounded-xl ${product.imageBgColor || 'bg-stone-100'} block`}>
          {product.discount && (
            <div className="absolute top-2 left-2 z-20 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm flex items-center gap-1.5">
              <span>Best Deal</span>
            </div>
          )}
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="h-full w-full object-cover object-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </Link>
        
        <div className="flex flex-col flex-grow py-2">
          <div className="flex justify-between items-start gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">{product.category}</p>
                {product.rating && (
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-medium">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                )}
              </div>
              <Link to={`/product/${product.id}`} className="hover:text-stone-600 transition-colors">
                <h3 className="text-lg font-medium text-stone-800">{product.name}</h3>
              </Link>
            </div>
            <div className="flex flex-col items-end mt-0.5">
              <span className="text-base font-medium text-stone-800 flex items-center">
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
          <p className="text-sm text-stone-500 leading-relaxed mb-6 font-light line-clamp-3">
            {product.description}
          </p>
          
          <div className="mt-auto flex justify-end">
            <Link
              to={`/product/${product.id}`}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-stone-50 hover:bg-stone-100 text-stone-800 text-sm font-medium rounded-xl transition-colors duration-200 border border-stone-200/60"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col h-full">
      <Link to={`/product/${product.id}`} className={`relative aspect-square sm:aspect-[4/5] w-full overflow-hidden rounded-2xl ${product.imageBgColor || 'bg-stone-100'} transition-transform duration-500 group-hover:shadow-sm block`}>
        {product.discount && (
          <div className="absolute top-3 left-3 z-20 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-sm shadow-sm flex items-center gap-1.5">
            <span>Best Deal</span>
            <span className="bg-white/20 px-1 rounded-sm">{product.discount} OFF</span>
          </div>
        )}
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="h-full w-full object-cover object-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Subtle hover overlay to hint at link */}
        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-500 pointer-events-none" />
      </Link>
      
      <div className="pt-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">{product.category}</p>
              {product.rating && (
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{product.rating}</span>
                </div>
              )}
            </div>
            <Link to={`/product/${product.id}`} className="hover:text-stone-600 transition-colors">
              <h3 className="text-base font-medium text-stone-800">{product.name}</h3>
            </Link>
          </div>
          <div className="flex flex-col items-end mt-0.5">
            <span className="text-sm font-medium text-stone-800 flex items-center">
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
        <p className="text-sm text-stone-500 leading-relaxed mb-5 font-light line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-auto">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-stone-50 hover:bg-stone-100 text-stone-800 text-sm font-medium rounded-xl transition-colors duration-200 border border-stone-200/60"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
