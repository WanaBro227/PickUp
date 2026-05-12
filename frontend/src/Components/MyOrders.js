import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  Truck 
} from 'lucide-react';

const MyOrders = () => {
  const navigate = useNavigate();

  const orders = [
    {
      id: 'ORD-4RGEYXSNO',
      productName: 'Omega Mechanical Watch',
      price: '25,500',
      date: 'March 24, 2026',
      status: 'Processing',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=200', 
      statusColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 'ORD-7VBNM290P',
      productName: 'Nike Air Max 270',
      price: '18,200',
      date: 'March 20, 2026',
      status: 'Shipped',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
      statusColor: 'bg-blue-100 text-blue-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg text-gray-800">My Orders</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              <div className="p-5 flex items-center gap-4">
                {/* Product Image */}
                <img 
                  src={order.image} 
                  alt={order.productName} 
                  className="w-20 h-20 object-cover rounded-xl"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">
                        {order.productName}
                      </h3>
                      <p className="text-xs text-blue-600 font-mono mt-1">
                        {order.id}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      LKR {order.price}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-xs gap-1">
                      <Clock size={14} />
                      <span>Ordered on {order.date}</span>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.statusColor}`}>
                      {order.status}
                    </div>
                  </div>
                </div>

                <div className="text-gray-300">
                  <ChevronRight size={20} />
                </div>
              </div>

              <div className="bg-gray-50 px-5 py-3 border-t flex justify-end gap-3">
                <button className="text-xs font-semibold text-blue-600 hover:underline">
                  Track Order
                </button>
                <button className="text-xs font-semibold text-gray-500 hover:underline">
                  Order Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Package size={32} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">No orders yet</h2>
            <p className="text-gray-500 mt-2">Looks like you haven't made any purchases.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 bg-blue-500 text-white px-8 py-2 rounded-full font-bold hover:bg-blue-600 transition"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;