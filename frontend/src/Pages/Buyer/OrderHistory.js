import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageCheck, Gavel, Clock, Filter, ChevronRight, ShoppingBag } from 'lucide-react';
import { formatLKR, formatDate, getStatusColor } from '../../Utils/formatters';
import { mockBuyerOrders, mockBidHistory } from '../../Utils/mockData';

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const orders = mockBuyerOrders.map(order => ({
    ...order,
    date: order.date || '2026-03-24', 
    status: order.status || 'DELIVERED',
    image: order.image || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200' 
  }));

  const bids = mockBidHistory;

  const filteredOrders = orders.filter(order => filter === 'all' || order.status === filter);

  return (
    <div className="min-h-screen bg-[#f6f7f8] py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-20">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Activity History</h1>
                <p className="text-slate-500 font-medium">Manage your purchases and track your auction bids.</p>
            </div>
        </header>

        {/* Tabs - Modern UI */}
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-slate-200 w-fit mb-10">
          <button 
            className={`py-3 px-8 rounded-[1.2rem] font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-[#1c74e9] text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} />
            Purchases ({orders.length})
          </button>
          <button 
            className={`py-3 px-8 rounded-[1.2rem] font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'bids' ? 'bg-[#1c74e9] text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('bids')}
          >
            <Gavel size={18} />
            My Bids ({bids.length})
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Filter Dropdown */}
            <div className="flex items-center gap-3 mb-8 bg-white w-fit p-2 rounded-2xl shadow-sm border border-slate-100">
              <div className="bg-slate-100 p-2 rounded-xl">
                <Filter size={18} className="text-slate-600" />
              </div>
              <select 
                className="bg-transparent border-none font-bold text-slate-600 focus:ring-0 cursor-pointer pr-8 text-sm uppercase tracking-wider"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="DELIVERED">Delivered</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            
            <div className="space-y-6">
              {filteredOrders.length > 0 ? filteredOrders.map(order => (
                <div 
                  key={order.id} 
                  onClick={() => navigate(`/products/${order.productId || '1'}`)}
                  className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-24 h-24 bg-slate-50 rounded-[1.8rem] overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <img src={order.image} alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Order #{order.id}</h3>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{formatDate(order.date)}</p>
                      </div>
                    </div>
                    <span className={`w-fit px-6 py-2.5 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase border shadow-sm ${getStatusColor(order.status).replace('bg-', 'border- bg-')}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-50">
                    <div className="bg-slate-50/50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="font-black text-lg text-blue-600">{formatLKR(order.total)}</p>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Item Count</p>
                      <p className="font-black text-lg text-slate-700">01 Qty</p>
                    </div>
                    <div className="hidden sm:block bg-slate-50/50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment</p>
                      <p className="font-black text-lg text-slate-700 text-sm">Cash on Delivery</p>
                    </div>
                    <div className="hidden sm:block bg-slate-50/50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tracking</p>
                      <p className="font-black text-sm text-green-500 flex items-center gap-1 italic">On Time <PackageCheck size={14} /></p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                   <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="text-slate-300" size={32} />
                   </div>
                  <p className="text-slate-400 font-bold text-lg">No orders found here.</p>
                  <button onClick={() => navigate('/products')} className="mt-4 text-blue-600 font-black text-sm uppercase tracking-widest hover:underline">Explore Store</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bids' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {bids.length > 0 ? bids.map((bid, index) => (
              <div key={index} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700 opacity-50"></div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                  <div className="bg-amber-50 p-5 rounded-[1.8rem] h-fit w-fit shadow-inner">
                    <Gavel size={32} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="font-black text-2xl text-slate-900 tracking-tight">Luxury Watch Auction</h3>
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(bid.status)}`}>
                        {bid.status}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Your Highest Bid</p>
                            <p className="text-2xl font-black text-blue-600">{formatLKR(bid.bidAmount)}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl h-fit">
                            <Clock size={20} className="text-amber-500 animate-pulse" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ending In</p>
                                <p className="text-slate-900 font-black text-sm">2d 14h 30m</p>
                            </div>
                        </div>
                    </div>
                  </div>
                  <button onClick={() => navigate('/products')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200">
                    Outbid
                  </button>
                </div>
              </div>
            )) : (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                   <Gavel className="mx-auto text-slate-200 mb-4" size={48} />
                   <p className="text-slate-400 font-bold">No active bids found.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;