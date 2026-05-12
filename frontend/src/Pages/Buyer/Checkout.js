import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../Hooks/useAuth';
import { api } from '../../Services/api';
import { ArrowLeft, CreditCard, Truck, Loader2, ShieldCheck } from 'lucide-react';
import { formatLKR } from '../../Utils/formatters';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const shipping = cartItems.length > 0 ? 15.00 : 0;
  const total = cartTotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setIsProcessing(true);
    setError('');

    try {
      const orderPayload = {
        items: cartItems,
        userId: user?.id || "GUEST",
        totalAmount: total,
        shippingDetails: {
           name: e.target[0].value,
           email: e.target[1].value,
           address: e.target[2].value,
           city: e.target[3].value,
           zip: e.target[4].value
        }
      };

      const response = await api.placeOrder(orderPayload);
      
      if (response.success) {
        clearCart();
        navigate('/success', { state: { orderId: response.orderId } });
      }
    } catch (error) {
      setError('Order placement failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-slate-500 mb-8 hover:text-blue-600 font-bold transition-all">
          <ArrowLeft size={20} /> Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Section */}
          <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4 text-slate-900">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                <Truck size={24} />
              </div> 
              Shipping Details
            </h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <input type="text" placeholder="Full Name" required defaultValue={user?.fullName} className="w-full p-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-700" />
                <input type="email" placeholder="Email Address" required defaultValue={user?.email} className="w-full p-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-700" />
                <input type="text" placeholder="Delivery Address" required className="w-full p-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-700" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City" required className="w-full p-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-700" />
                  <input type="text" placeholder="Zip Code" required className="w-full p-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-700" />
                </div>
              </div>

              <div className="pt-6">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900">
                  <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><CreditCard size={22} /></div> Payment Method
                </h2>
                <div className="p-6 border-2 border-blue-600 bg-blue-50/50 rounded-[2rem] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full border-4 border-blue-600 bg-white"></div>
                    <span className="font-extrabold text-slate-800 text-lg">Cash on Delivery</span>
                  </div>
                  <ShieldCheck className="text-blue-600" />
                </div>
              </div>
              
              <button type="submit" disabled={isProcessing || cartItems.length === 0} className="w-full bg-[#1c74e9] text-white py-6 rounded-3xl font-black text-xl mt-10 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-3">
                {isProcessing ? <><Loader2 className="animate-spin" /> Finalizing Order...</> : `Confirm Order ${formatLKR(total)}`}
              </button>
            </form>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-10">
              <h2 className="text-2xl font-black mb-8 text-slate-900 border-b pb-4">Order Summary</h2>
              <div className="max-h-[350px] overflow-y-auto pr-2 space-y-6 mb-8 custom-scrollbar">
                {cartItems.map(item => (
                  <div key={item.productId} className="flex justify-between items-center gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={item.img} alt={item.title} className="w-16 h-16 object-cover rounded-2xl shadow-sm group-hover:scale-105 transition-transform" />
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">{item.quantity}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm line-clamp-1">{item.title}</p>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Price: {formatLKR(item.price || 0)}</p>
                      </div>
                    </div>
                    <span className="font-black text-slate-700">{formatLKR((item.price || 0) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>Subtotal</span><span>{formatLKR(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>Shipping</span><span>{formatLKR(shipping)}</span>
                </div>
                <div className="flex justify-between pt-4 text-3xl font-black text-[#1c74e9]">
                  <span>Total</span><span>{formatLKR(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
