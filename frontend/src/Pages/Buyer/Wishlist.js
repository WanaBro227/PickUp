import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../Context/WishlistContext';
import { useCart } from '../../Context/CartContext';
import { Heart, Trash2, ShoppingCart, ArrowLeft, Bell, BellOff } from 'lucide-react';
import { formatLKR } from '../../Utils/formatters';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [alerts, setAlerts] = useState({});

  const toggleAlert = (id) => {
    setAlerts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-white rounded-full transition shadow-sm bg-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            My Wishlist <Heart className="text-red-500 fill-red-500" size={28} />
          </h1>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlist.map((item) => {
              const isAlertEnabled = alerts[item.id];
              
              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-md transition relative group"
                >
                  {/* --- Price Alert Bell (Top Right) --- */}
                  <button 
                    onClick={() => toggleAlert(item.id)}
                    className={`absolute top-4 right-4 p-2 rounded-xl transition-all z-10 ${
                      isAlertEnabled 
                      ? 'bg-amber-100 text-amber-600 scale-110 shadow-sm' 
                      : 'bg-slate-50 text-slate-300 hover:text-slate-500'
                    }`}
                  >
                    {isAlertEnabled ? <Bell size={18} fill="currentColor" className="animate-ring" /> : <BellOff size={18} />}
                  </button>

                  <div className="flex gap-5 items-center">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-24 h-24 object-cover rounded-2xl ring-1 ring-slate-100" 
                    />
                    
                    <div className="flex-1 pr-8"> 
                      <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">
                        {item.title}
                      </h3>
                      <p className="text-blue-600 font-black">
                        {formatLKR(item.price || item.currentBid)}
                      </p>
                      {isAlertEnabled && (
                        <span className="text-[10px] font-bold text-amber-600 uppercase mt-1 inline-block bg-amber-50 px-2 py-0.5 rounded">
                          Price Alert On
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-50">
                    <button 
                      onClick={() => {
                        addToCart(item);
                        removeFromWishlist(item.id);
                      }}
                      className="flex-[3] bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition"
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="flex-1 p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-dashed border-slate-200">
             <Heart size={64} className="mx-auto text-slate-200 mb-4" />
             <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
             <button 
               onClick={() => navigate('/products')} 
               className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold mt-4"
             >
               Explore Products
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;