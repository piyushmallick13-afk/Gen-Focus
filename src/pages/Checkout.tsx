import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useRazorpay } from '../hooks/useRazorpay';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity), 0);
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
      name: "Your Store",
      description: `Purchase of ${cart.length} items`,
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        clearCart();
        navigate('/');
      },
      prefill: {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        contact: userInfo.phone,
      },
      theme: {
        color: "#1c1917" // stone-900
      }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed! Error: ${response.error.description}`);
      });
      rzp.open();
    } else {
      alert("Razorpay SDK failed to load. Please try again later.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-stone-900 mb-4">Your Cart is Empty</h2>
            <Link to="/" className="text-stone-500 hover:text-stone-900 flex items-center gap-2 justify-center">
              <ArrowLeft className="w-4 h-4" /> Back to Explore
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-display text-stone-900 mt-4">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
                <h2 className="text-xl font-medium text-stone-900 mb-6">Shipping Information</h2>
                <form id="checkout-form" onSubmit={handleCheckoutSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">First Name</label>
                      <input required type="text" value={userInfo.firstName} onChange={e => setUserInfo({...userInfo, firstName: e.target.value})} className="w-full h-11 px-4 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all bg-stone-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Last Name</label>
                      <input required type="text" value={userInfo.lastName} onChange={e => setUserInfo({...userInfo, lastName: e.target.value})} className="w-full h-11 px-4 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all bg-stone-50" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                    <input required type="email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} className="w-full h-11 px-4 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all bg-stone-50" />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                    <input required type="tel" value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} className="w-full h-11 px-4 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all bg-stone-50" />
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Shipping Address</label>
                    <textarea required value={userInfo.address} onChange={e => setUserInfo({...userInfo, address: e.target.value})} rows={3} className="w-full p-4 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all bg-stone-50 resize-none"></textarea>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200 sticky top-8">
                <h2 className="text-xl font-medium text-stone-900 mb-6">Order Summary</h2>
                
                <div className="flex flex-col gap-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                      <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-stone-900 line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-stone-500 mt-0.5">
                          Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                        </p>
                        <p className="text-sm font-medium text-stone-900 mt-1">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-200 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="font-medium text-stone-900">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-stone-600">Shipping</span>
                    <span className="font-medium text-stone-900">Free</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                    <span className="text-lg font-medium text-stone-900">Total</span>
                    <span className="text-xl font-semibold text-stone-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={!isRazorpayLoaded}
                  className="w-full h-14 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium rounded-xl transition-colors duration-200 text-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay ₹{total.toFixed(2)}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Secure Checkout processed by Razorpay</span>
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
