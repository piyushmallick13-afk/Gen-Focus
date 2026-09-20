import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useRazorpay } from '../hooks/useRazorpay';
import { ArrowLeft, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DurgaTrinayani } from '../components/FestiveDurgaMotifs';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const isRazorpayLoaded = useRazorpay();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    email: '',
  });

  const total = cart.reduce((sum, item) => {
    if (!item || !item.price) return sum;
    const priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
    return sum + (priceNum * (item.quantity || 1));
  }, 0);

  const totalInPaise = Math.round(total * 100);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    startRazorpay();
  };

  const startRazorpay = () => {
    if (!isRazorpayLoaded) return;

    const options = {
      key: 'rzp_test_TYoUc5H0CdNOdB', // fallback dummy key format
      amount: totalInPaise.toString(),
      currency: "INR",
      name: "GenFocus • শারদীয় উৎসব",
      description: `Durga Puja Order - ${cart.length} festive items`,
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}\nশুভ শারদীয়া! May Maa Durga bless your home with happiness and joy.`);
        clearCart();
        navigate('/');
      },
      prefill: {
        name: `${userInfo.firstName} ${userInfo.lastName}`.trim(),
        email: userInfo.email,
        contact: userInfo.phone,
      },
      theme: {
        color: "#9f1239" // rose-800
      }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed! Error: ${response.error?.description || 'Transaction could not be processed'}`);
      });
      rzp.open();
    } else {
      alert("Razorpay SDK failed to load. Please try again later.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20 px-6">
          <div className="text-center bg-white p-8 md:p-12 rounded-3xl border border-amber-200/80 shadow-sm max-w-md">
            <DurgaTrinayani className="w-12 h-12 text-rose-800 mx-auto mb-4 opacity-70" />
            <h2 className="text-2xl font-display font-medium text-stone-900 mb-2">Your Cart is Empty</h2>
            <p className="text-xs text-stone-500 mb-6 font-light">
              Add your favorite Durga Puja thalis, brassware, and festive outfits to celebrate Sharadotsav.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> 
              Explore Pujo Collection
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Header />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Bar */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-rose-800 hover:text-rose-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Continue Pujo Shopping
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
              <div>
                <h1 className="text-3xl font-display font-medium text-stone-900">
                  Festive Checkout
                </h1>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Complete your order for fast delivery before Durga Puja
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-300 text-rose-900 text-xs font-semibold">
                <DurgaTrinayani className="w-3.5 h-3.5 text-rose-800" />
                <span>শুভ শারদীয়া • Sharadotsav Order</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-amber-200/80">
                <h2 className="text-lg font-semibold text-stone-900 mb-5 flex items-center gap-2">
                  <span>Shipping & Delivery Details</span>
                </h2>
                <form id="checkout-form" onSubmit={handleCheckoutSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">First Name</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. Sourav"
                        value={userInfo.firstName} 
                        onChange={e => setUserInfo({...userInfo, firstName: e.target.value})} 
                        className="w-full h-11 px-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-800/30 transition-all bg-[#FFFDF9] text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Last Name</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. Banerjee"
                        value={userInfo.lastName} 
                        onChange={e => setUserInfo({...userInfo, lastName: e.target.value})} 
                        className="w-full h-11 px-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-800/30 transition-all bg-[#FFFDF9] text-sm" 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="e.g. sourav@example.com"
                      value={userInfo.email} 
                      onChange={e => setUserInfo({...userInfo, email: e.target.value})} 
                      className="w-full h-11 px-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-800/30 transition-all bg-[#FFFDF9] text-sm" 
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (for Courier & Pujo Dispatch)</label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="e.g. +91 98765 43210"
                      value={userInfo.phone} 
                      onChange={e => setUserInfo({...userInfo, phone: e.target.value})} 
                      className="w-full h-11 px-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-800/30 transition-all bg-[#FFFDF9] text-sm" 
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Full Delivery Address (Include Landmark / Pincode)</label>
                    <textarea 
                      required 
                      value={userInfo.address} 
                      placeholder="Apartment, Street, Landmark, Kolkata / West Bengal, PIN Code"
                      onChange={e => setUserInfo({...userInfo, address: e.target.value})} 
                      rows={3} 
                      className="w-full p-3.5 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-800/30 transition-all bg-[#FFFDF9] text-sm resize-none"
                    />
                  </div>

                  {/* Festive Perks banner */}
                  <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-rose-950">Festive Season Assurance</h4>
                      <p className="text-[11px] text-stone-600 font-light mt-0.5 leading-relaxed">
                        Every order includes sacred vermilion/sindoor touch, traditional red drawstring pouch, and fragile transit insulation for Puja brassware.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-amber-200/80 sticky top-28">
                <h2 className="text-lg font-semibold text-stone-900 mb-5">Order Summary</h2>
                
                <div className="flex flex-col gap-3.5 mb-6 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {cart.map(item => {
                    if (!item) return null;
                    const itemImg = item.imageUrl || 'https://placehold.co/600x400/eeeeee/999999?text=Product';
                    return (
                      <div key={item.id} className="flex gap-3.5 pb-3.5 border-b border-stone-100 last:border-0 last:pb-0">
                        <div className="w-16 h-16 rounded-xl bg-stone-50 border border-stone-200/60 overflow-hidden shrink-0">
                          <img 
                            src={itemImg} 
                            alt={item.name || 'Item'} 
                            className="w-full h-full object-cover mix-blend-multiply" 
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/999999?text=Product' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-medium text-stone-900 line-clamp-1">{item.name}</h3>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                          </p>
                          <p className="text-xs font-semibold text-rose-900 mt-1">{item.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-amber-200/80 mb-6 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="font-semibold text-stone-900">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-stone-600">Festive Packaging</span>
                    <span className="text-emerald-700 font-medium">Free</span>
                  </div>
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <span className="text-stone-600">Pujo Express Shipping</span>
                    <span className="text-emerald-700 font-medium">Free</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                    <span className="text-base font-semibold text-stone-900">Total Payable</span>
                    <span className="text-xl font-bold text-rose-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={!isRazorpayLoaded}
                  className="w-full h-14 bg-rose-800 hover:bg-rose-900 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-rose-900/20 text-base flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5 text-amber-300" />
                  Pay ₹{total.toFixed(2)} with Razorpay
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Secure Checkout powered by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
