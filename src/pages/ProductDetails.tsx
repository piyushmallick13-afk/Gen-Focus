import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { ArrowLeft, ExternalLink, Star } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-[#FAFAFA]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-display font-medium text-stone-800 mb-4">Product not found</h2>
            <Link to="/" className="text-stone-500 hover:text-stone-900 flex items-center gap-2 justify-center">
              <ArrowLeft className="w-4 h-4" />
              Back to Collection
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAFAFA]">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 md:py-24 w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery / Main Image */}
          <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden ${product.imageBgColor || 'bg-stone-100'} p-8 md:p-12 flex items-center justify-center`}>
            {product.discount && (
              <div className="absolute top-6 left-6 z-20 bg-stone-900/90 backdrop-blur text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm">
                {product.discount} OFF
              </div>
            )}
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-medium text-stone-400 uppercase tracking-widest">{product.category}</p>
              {product.rating && (
                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-1 rounded text-xs font-medium">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating} Rating</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-stone-900 mb-6 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-8">
              <p className="text-3xl font-medium text-stone-900">{product.price}</p>
              {product.mrp && (
                <p className="text-xl font-light text-stone-400 line-through">{product.mrp}</p>
              )}
              {product.discount && (
                <span className="bg-stone-100 text-stone-800 text-sm font-medium px-2.5 py-1 rounded-md border border-stone-200">
                  {product.discount} OFF
                </span>
              )}
            </div>
            
            <div className="prose prose-stone mb-12">
              <p className="text-stone-500 leading-relaxed font-light text-lg">
                {product.description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t border-stone-200/60 pt-8">
              <a 
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-3 h-14 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl transition-colors duration-200 text-lg px-8"
              >
                <span>Purchase Product</span>
                <ExternalLink className="w-5 h-5 opacity-70" />
              </a>
            </div>
            <p className="text-xs text-stone-400 mt-4 text-center sm:text-left font-light">
              You will be redirected to our trusted partner to complete your purchase.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
