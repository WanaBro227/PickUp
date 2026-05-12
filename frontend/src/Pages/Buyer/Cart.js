import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Loader2 } from 'lucide-react';
import { formatLKR } from '../../Utils/formatters';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = cartItems.length > 0 ? 15.00 : 0;
  const total = cartTotal + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    setIsProcessing(true);
      setTimeout(() => {
      setIsProcessing(false);
      navigate('/checkout'); 
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 pt-10 px-4">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-bold transition-all"
        >
          <ArrowLeft size={20} /> Continue Shopping
        </button>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
          <ShoppingBag className="text-blue-600" size={32} /> Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.productId} className="bg-white dark:bg-slate-800 rounded-[25px] p-5 shadow-sm flex items-center gap-4 border border-slate-100 dark:border-slate-700">
                  <img src={item.img} alt={item.title} className="w-24 h-24 object-cover rounded-2xl bg-slate-100" />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                    <div className="text-blue-600 font-black text-lg mt-1">{formatLKR(item.price || 0)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1.5 dark:text-white hover:bg-white rounded-lg"><Minus size={16}/></button>
                      <span className="px-4 font-black dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1.5 dark:text-white hover:bg-white rounded-lg"><Plus size={16}/></button>
                    </div>
                    <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[40px] border-2 border-dashed border-slate-200">
                <ShoppingBag size={80} className="mx-auto text-slate-200 mb-6" />
                <h2 className="text-2xl font-bold dark:text-white">Your cart is empty</h2>
                <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all inline-block mt-4">Browse Products</Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-[35px] p-8 shadow-xl border border-slate-50 sticky top-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Summary</h2>
              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-slate-500 font-medium"><span>Subtotal</span><span>{formatLKR(cartTotal)}</span></div>
                <div className="flex justify-between text-slate-500 font-medium"><span>Shipping Fee</span><span>{formatLKR(shipping)}</span></div>
                <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold dark:text-white">Total</span>
                  <span className="text-blue-600 text-3xl font-black">{formatLKR(total)}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout} 
                disabled={cartItems.length === 0 || isProcessing}
                className="w-full bg-blue-600 text-white py-5 rounded-[22px] font-black text-lg hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? <><Loader2 size={22} className="animate-spin" /> Processing...</> : "Checkout Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
