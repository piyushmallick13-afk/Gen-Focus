import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { useRazorpay } from '../hooks/useRazorpay';
import { ArrowLeft, ExternalLink, Star, IndianRupee, CreditCard, X, Ruler } from 'lucide-react';
import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const isRazorpayLoaded = useRazorpay();
  
  const product = products.find(p => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    email: ''
  });

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleBuyClick = () => {
    if (product?.hasSizes && !selectedSize) {
      alert("Please select a size first.");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startRazorpay();
    setShowCheckoutModal(false);
  };

  const startRazorpay = () => {
    if (!product || !isRazorpayLoaded) return;

    const rawPrice = product.price.replace(/[^\d.]/g, '');
    const priceNum = parseFloat(rawPrice);
    if (isNaN(priceNum)) {
      alert("Invalid price configuration.");
      return;
    }

    const amountInPaise = Math.round(priceNum * 100);

    const options = {
      key: 'rzp_live_TWoUc5H0CdNOdB',
      amount: amountInPaise.toString(),
      currency: "INR",
      name: "Your Store",
      description: `Purchase of ${product.name}`,
      image: product.imageUrl,
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        contact: userInfo.phone
      },
      notes: {
        address: userInfo.address,
        size: selectedSize || 'N/A'
      },
      theme: {
        color: "#1c1917" // stone-900
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      alert(`Payment failed. Reason: ${response.error.description}`);
    });
    rzp.open();
  };

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
              <p className="text-3xl font-medium text-stone-900 flex items-center">
                <IndianRupee className="w-6 h-6 mr-1" />
                {product.price.replace('₹', '')}
              </p>
              {product.mrp && (
                <p className="text-xl font-light text-stone-400 line-through flex items-center">
                  <IndianRupee className="w-5 h-5" />
                  {product.mrp.replace('₹', '')}
                </p>
              )}
              {product.discount && (
                <span className="bg-stone-100 text-stone-800 text-sm font-medium px-2.5 py-1 rounded-md border border-stone-200">
                  {product.discount} OFF
                </span>
              )}
            </div>
            
            <div className="prose prose-stone mb-8">
              <p className="text-stone-500 leading-relaxed font-light text-lg">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            {product.hasSizes && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-stone-900">Select Size</h3>
                  <button onClick={() => setShowSizeChart(true)} className="text-sm text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors">
                    <Ruler className="w-4 h-4" /> Size Chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-12 min-w-[3rem] px-4 rounded-xl font-medium transition-all duration-200 border ${selectedSize === s ? 'border-stone-900 bg-stone-900 text-white shadow-md' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:bg-stone-50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t border-stone-200/60 pt-8">
              {product.type === 'buy' ? (
                <button 
                  onClick={handleBuyClick}
                  disabled={!isRazorpayLoaded}
                  className="flex-1 inline-flex items-center justify-center gap-3 h-14 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium rounded-xl transition-colors duration-200 text-lg px-8 cursor-pointer"
                >
                  <span>Buy Now</span>
                  <CreditCard className="w-5 h-5 opacity-70" />
                </button>
              ) : (
                <a 
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-3 h-14 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl transition-colors duration-200 text-lg px-8"
                >
                  <span>Purchase Product</span>
                  <ExternalLink className="w-5 h-5 opacity-70" />
                </a>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-4 text-center sm:text-left font-light">
              {product.type === 'buy' 
                ? "Secure payments powered by Razorpay."
                : "You will be redirected to our trusted partner to complete your purchase."}
            </p>
          </div>
        </div>
      </main>

      {/* Checkout Info Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-medium text-stone-900">Shipping & Contact Details</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="p-1 text-stone-400 hover:text-stone-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCheckoutSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">First Name</label>
                  <input required type="text" value={userInfo.firstName} onChange={e => setUserInfo({...userInfo, firstName: e.target.value})} className="w-full h-10 px-3 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Last Name</label>
                  <input required type="text" value={userInfo.lastName} onChange={e => setUserInfo({...userInfo, lastName: e.target.value})} className="w-full h-10 px-3 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900" />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-medium text-stone-500 mb-1">Email Address</label>
                <input required type="email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} className="w-full h-10 px-3 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900" />
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-medium text-stone-500 mb-1">Phone Number</label>
                <input required type="tel" value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} className="w-full h-10 px-3 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900" />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-stone-500 mb-1">Delivery Address</label>
                <textarea required rows={3} value={userInfo.address} onChange={e => setUserInfo({...userInfo, address: e.target.value})} className="w-full p-3 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900 resize-none" />
              </div>

              <button type="submit" className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl transition-colors">
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
