import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Button from '../../Components/Button';

const Success = () => {
  const navigate = useNavigate();
  const orderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl text-center border border-slate-100">
        
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full animate-bounce">
            <CheckCircle size={60} className="text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Order Success!</h1>
        <p className="text-slate-500 mb-8 font-medium leading-relaxed">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {/* Order ID Box */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-dashed border-slate-200 group hover:border-blue-300 transition-colors">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order Number</p>
          <p className="text-xl font-mono font-bold text-[#1c74e9]">{orderId}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            size="lg" 
            className="w-full py-6 font-bold rounded-2xl shadow-lg shadow-blue-100 bg-[#1c74e9] text-white flex items-center justify-center hover:bg-blue-600 transition" 
            onClick={() => navigate('/orders')} 
          >
            <Package size={20} className="mr-2" />
            View My Orders
          </Button>
          
          <button 
            className="w-full py-4 font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center transition" 
            onClick={() => navigate('/')}
          >
            Continue Shopping
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;