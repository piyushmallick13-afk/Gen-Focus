import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { useRazorpay } from '../hooks/useRazorpay';
import { ArrowLeft, ExternalLink, Star, IndianRupee, CreditCard, X, Ruler, ShoppingCart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { DurgaTrinayani } from '../components/FestiveDurgaMotifs';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const isRazorpayLoaded = useRazorpay();
  
  const product = products.find(p => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeChart, setShowSizeChart] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


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

  const primaryImage = product.imageUrl || 'https://placehold.co/600x400/eeeeee/999999?text=Product+Image';
  const allImages = [primaryImage, ...(product.additionalImages || [])];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  const handleAddToCart = () => {
    if (product.hasSizes && !selectedSize) {
      alert("Please select a size first.");
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: primaryImage,
      quantity: 1,
      size: selectedSize || undefined
    });
  };

  const handleBuyClick = () => {
    if (product?.hasSizes && !selectedSize) {
      alert("Please select a size first.");
      return;
    }
    
    // Add to cart and immediately proceed to checkout
    addToCart({
      productId: product!.id,
      name: product!.name,
      price: product!.price,
      imageUrl: primaryImage,
      quantity: 1,
      size: selectedSize || undefined
    });
    
    navigate('/checkout');
  };



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
            
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImageIndex}
                src={allImages[currentImageIndex]} 
                alt={`${product.name} - view ${currentImageIndex + 1}`}
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
                referrerPolicy="no-referrer"
                onError={(e: any) => { e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/999999?text=Image+Not+Available' }}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              />
            </AnimatePresence>

            {allImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 p-2 bg-white/80 hover:bg-white backdrop-blur rounded-full text-stone-800 shadow-sm transition-all z-20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 p-2 bg-white/80 hover:bg-white backdrop-blur rounded-full text-stone-800 shadow-sm transition-all z-20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 flex gap-2 z-20">
                  {allImages.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-stone-800 w-6' : 'bg-stone-400 hover:bg-stone-600'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {/* Festive badge if applicable */}
            {product.festiveTag && (
              <div className="inline-flex items-center gap-2 self-start mb-3 px-3 py-1 rounded-full bg-rose-100 border border-rose-300/80 text-rose-950 text-xs font-semibold shadow-xs">
                <DurgaTrinayani className="w-4 h-4 text-rose-800 shrink-0" />
                <span>{product.festiveTag}</span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <p className="text-xs font-semibold text-amber-900/70 uppercase tracking-widest">{product.category}</p>
              {product.rating && (
                <div className="flex items-center gap-1 text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{product.rating}</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-medium text-stone-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {product.pujoDay && (
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-amber-900 bg-amber-50/80 border border-amber-200/80 px-3 py-1.5 rounded-xl self-start">
                <Sparkles className="w-3.5 h-3.5 text-rose-700" />
                <span>Recommended for <strong>{product.pujoDay}</strong> celebrations</span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <p className="text-2xl md:text-3xl font-bold text-rose-950 flex items-center">
                <IndianRupee className="w-5 h-5 mr-0.5" />
                {product.price.replace('₹', '')}
              </p>
              {product.mrp && (
                <p className="text-lg font-light text-stone-400 line-through flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {product.mrp.replace('₹', '')}
                </p>
              )}
              {product.discount && (
                <span className="bg-rose-50 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-md border border-rose-200">
                  {product.discount} OFF
                </span>
              )}
            </div>
            
            <div className="prose prose-stone mb-6">
              <p className="text-stone-600 leading-relaxed font-light text-base">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            {product.hasSizes && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-stone-900">Select Size</h3>
                  <button onClick={() => setShowSizeChart(true)} className="text-xs text-rose-800 hover:text-rose-900 font-medium flex items-center gap-1 transition-colors">
                    <Ruler className="w-3.5 h-3.5" /> Size Chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-11 min-w-[2.75rem] px-3.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${selectedSize === s ? 'border-rose-900 bg-rose-900 text-white shadow-sm' : 'border-stone-200 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50/50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3.5 mt-auto border-t border-amber-200/80 pt-6">
              <button 
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2.5 h-13 border border-amber-300 bg-amber-50/60 hover:bg-amber-100/60 text-stone-900 font-semibold rounded-xl transition-all duration-200 text-base px-6 cursor-pointer"
              >
                <span>Add to Cart</span>
                <ShoppingCart className="w-4 h-4 opacity-80" />
              </button>
              
              {product.type === 'buy' ? (
                <button 
                  onClick={handleBuyClick}
                  disabled={!isRazorpayLoaded}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 h-13 bg-rose-800 hover:bg-rose-900 shadow-md shadow-rose-950/20 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 text-base px-6 cursor-pointer"
                >
                  <span>Buy Now • Checkout</span>
                  <CreditCard className="w-4 h-4 text-amber-300" />
                </button>
              ) : (
                <a 
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2.5 h-13 bg-rose-800 hover:bg-rose-900 text-white font-semibold rounded-xl transition-all duration-200 text-base px-6 shadow-md shadow-rose-950/20"
                >
                  <span>Purchase</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
              )}
            </div>
            <p className="text-[11px] text-stone-400 mt-3 text-center sm:text-left font-light">
              {product.type === 'buy' 
                ? "Fast Pujo express dispatch & secure payments powered by Razorpay."
                : "You will be redirected to our trusted partner to complete your purchase."}
            </p>
          </div>
        </div>
      </main>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-medium text-stone-900">Size Guide</h3>
              <button onClick={() => setShowSizeChart(false)} className="p-1 text-stone-400 hover:text-stone-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <table className="w-full text-sm text-left">
                <thead className="text-stone-500 border-b border-stone-100">
                  <tr>
                    <th className="pb-2 font-medium">Size</th>
                    <th className="pb-2 font-medium">Chest (in)</th>
                    <th className="pb-2 font-medium">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  <tr><td className="py-2 font-medium text-stone-900">XS</td><td className="py-2 text-stone-600">34-36</td><td className="py-2 text-stone-600">27</td></tr>
                  <tr><td className="py-2 font-medium text-stone-900">S</td><td className="py-2 text-stone-600">36-38</td><td className="py-2 text-stone-600">28</td></tr>
                  <tr><td className="py-2 font-medium text-stone-900">M</td><td className="py-2 text-stone-600">38-40</td><td className="py-2 text-stone-600">29</td></tr>
                  <tr><td className="py-2 font-medium text-stone-900">L</td><td className="py-2 text-stone-600">40-42</td><td className="py-2 text-stone-600">30</td></tr>
                  <tr><td className="py-2 font-medium text-stone-900">XL</td><td className="py-2 text-stone-600">42-44</td><td className="py-2 text-stone-600">31</td></tr>
                  <tr><td className="py-2 font-medium text-stone-900">XXL</td><td className="py-2 text-stone-600">44-46</td><td className="py-2 text-stone-600">32</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      
      <Footer />
    </div>
  );
}
