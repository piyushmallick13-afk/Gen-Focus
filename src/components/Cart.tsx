import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

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
            className="fixed inset-0 bg-stone-950/30 backdrop-blur-xs z-50"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-stone-200"
          >
            {/* Cart Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                  <span>Shopping Cart</span>
                  {cart.length > 0 && (
                    <span className="text-xs font-normal text-stone-500">
                      ({cart.reduce((a, b) => a + b.quantity, 0)} items)
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-stone-400 font-light mt-0.5">
                  Plastic-free sustainable packaging on all orders
                </p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-50 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-500 py-12">
                  <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-6 h-6 text-stone-400" />
                  </div>
                  <p className="font-medium text-stone-900 text-sm mb-1">Your cart is empty</p>
                  <p className="text-xs text-stone-500 text-center max-w-xs mb-5 font-light">
                    Explore our curated essentials for work, sound, writing, and living.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-xl transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {cart.map(item => {
                    if (!item) return null;
                    const itemImg = item.imageUrl || 'https://placehold.co/600x400/eeeeee/999999?text=Product';
                    return (
                      <div key={item.id} className="flex gap-3 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/80">
                        <div className="w-18 h-18 rounded-xl overflow-hidden bg-white shrink-0 border border-stone-200/60 flex items-center justify-center p-1">
                          <img 
                            src={itemImg} 
                            alt={item.name || 'Product'} 
                            className="w-full h-full object-contain mix-blend-multiply" 
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/999999?text=Product' }}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="text-xs font-medium text-stone-900 line-clamp-1">{item.name}</h3>
                            <div className="text-xs text-stone-500 flex gap-2 mt-0.5">
                              <span className="font-semibold text-stone-900">{item.price}</span>
                              {item.size && <span className="text-stone-400">• Size: {item.size}</span>}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/60">
                            <div className="flex items-center gap-1.5 border border-stone-200 bg-white rounded-lg p-0.5">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-5 h-5 flex items-center justify-center text-stone-500 hover:text-stone-900 font-medium text-xs"
                                aria-label="Decrease quantity"
                              >-</button>
                              <span className="text-xs font-medium w-4 text-center text-stone-800">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-5 h-5 flex items-center justify-center text-stone-500 hover:text-stone-900 font-medium text-xs"
                                aria-label="Increase quantity"
                              >+</button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
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
            
            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-stone-100 bg-stone-50/50">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="font-medium text-stone-900">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-4 text-[11px]">
                  <span className="text-stone-500">Standard Delivery</span>
                  <span className="text-stone-900 font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between mb-4 pt-2 border-t border-stone-200/60">
                  <span className="text-sm font-medium text-stone-900">Total</span>
                  <span className="text-base font-semibold text-stone-900">₹{total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckoutClick}
                  className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
