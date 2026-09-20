import { X, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { DurgaTrinayani } from './FestiveDurgaMotifs';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    if (!item || !item.price) return sum;
    const priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
    return sum + (priceNum * (item.quantity || 1));
  }, 0);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#FFFDF9] shadow-2xl z-50 flex flex-col border-l border-amber-200"
          >
            {/* Header with festive greeting */}
            <div className="p-5 border-b border-amber-200/80 bg-gradient-to-r from-[#FFFBF2] to-[#FFF6E5]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-rose-950 flex items-center gap-2">
                  <DurgaTrinayani className="w-5 h-5 text-rose-800" />
                  Your Festive Cart
                </h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-amber-100/50 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-900 bg-amber-100/70 border border-amber-300/60 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3 text-rose-700 shrink-0" />
                <span>Subho Sharadiya: Complimentary festive sacred packaging</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-500 py-12">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-8 h-8 text-amber-800/40" />
                  </div>
                  <p className="font-medium text-stone-800 mb-1">Your cart is empty</p>
                  <p className="text-xs text-stone-500 text-center max-w-xs mb-4">
                    Explore our Durga Puja specials, puja aarti thalis, and festive apparels.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    Browse Pujo Collections
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map(item => {
                    if (!item) return null;
                    const itemImg = item.imageUrl || 'https://placehold.co/600x400/eeeeee/999999?text=Product';
                    return (
                      <div key={item.id} className="flex gap-3.5 bg-white p-3 rounded-2xl border border-amber-200/60 shadow-sm">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-50 shrink-0 border border-stone-200/60">
                          <img 
                            src={itemImg} 
                            alt={item.name || 'Product'} 
                            className="w-full h-full object-cover mix-blend-multiply" 
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/999999?text=Product' }}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1">{item.name}</h3>
                            <div className="text-xs text-stone-600 flex gap-2 mt-0.5">
                              <span className="font-semibold text-rose-900">{item.price}</span>
                              {item.size && <span className="text-stone-400">• Size: {item.size}</span>}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                            <div className="flex items-center gap-1.5 border border-stone-200 bg-stone-50 rounded-lg p-0.5">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-rose-900 font-bold text-xs"
                                aria-label="Decrease quantity"
                              >-</button>
                              <span className="text-xs font-semibold w-4 text-center text-stone-800">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-rose-900 font-bold text-xs"
                                aria-label="Increase quantity"
                              >+</button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-700 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-5 border-t border-amber-200/80 bg-[#FFFDF9]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-stone-500 font-medium">Subtotal</span>
                  <span className="font-semibold text-base text-rose-950">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-4 text-[11px] text-emerald-700 font-medium">
                  <span>Pujo Express Delivery</span>
                  <span>Free</span>
                </div>
                <button 
                  onClick={handleCheckoutClick}
                  className="w-full h-12 bg-rose-800 hover:bg-rose-900 text-white font-semibold rounded-xl transition-all shadow-md shadow-rose-900/20 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <span>• ₹{total.toFixed(2)}</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
