import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Hooks/useAuth';
import { PlusCircle, Package, DollarSign, Truck, Gavel, Users, Pencil, Trash2, Ban, CheckCircle2, XCircle } from 'lucide-react';
import { formatLKR } from '../../Utils/formatters';
import Button from '../../Components/Button';
import { Link } from 'react-router-dom';
import { api } from '../../Services/api';
import Modal from '../../Components/Modal';
import Input from '../../Components/Input';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [bids, setBids] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', stock: '', currentBid: '' });
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;

      const [loadedListings, loadedSales, loadedBids, loadedOrders] = await Promise.all([
        api.getSellerListings(user.id),
        api.getSellerSales(user.id),
        api.getSellerBids(user.id),
        api.getSellerOrders(user.id)
      ]);

      setListings(loadedListings);
      setSales(loadedSales);
      setBids(loadedBids);
      setOrders(loadedOrders);
    };

    loadDashboard();
  }, [user]);

  const stats = [
    { label: 'Total Revenue', value: formatLKR(sales.reduce((total, sale) => total + (sale.revenue || 0), 0)), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Active Listings', value: listings.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Pending Bids', value: bids.length, icon: Gavel, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Total Orders', value: orders.length, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const openEditModal = (listing) => {
    setEditingListing(listing);
    setEditForm({
      title: listing.title || '',
      description: listing.description || '',
      price: listing.price || '',
      stock: listing.stock || '',
      currentBid: listing.startPrice || listing.currentBid || ''
    });
  };

  const handleSaveListing = async () => {
    if (!editingListing) return;

    const updates = {
      title: editForm.title,
      description: editForm.description,
      ...(editingListing.type === 'FIXED'
        ? { price: Number(editForm.price), stock: Number(editForm.stock) }
        : { startPrice: Number(editForm.currentBid), currentBid: Number(editForm.currentBid) })
    };

    const result = await api.updateListing(editingListing.id, updates);
    if (result.success) {
      setListings(prev => prev.map(item => item.id === editingListing.id ? result.product : item));
      setEditingListing(null);
    }
  };

  const handleDeleteListing = async (listingId) => {
    await api.deleteListing(listingId);
    setListings(prev => prev.filter(item => item.id !== listingId));
  };

  const handleEndAuction = async (listingId) => {
    const result = await api.endAuctionEarly(listingId);
    if (result.success) {
      setListings(prev => prev.map(item => item.id === listingId ? result.product : item));
    }
  };

  const handleShipOrder = async (orderId) => {
    const result = await api.updateSellerOrder(orderId, { status: 'SHIPPED' });
    if (result.success) {
      setOrders(prev => prev.map(order => order.orderId === orderId ? result.order : order));
      setSales(prev => prev.some(sale => sale.orderId === orderId) ? prev : [...prev, { orderId, revenue: result.order.totalAmount, productId: result.order.productId }]);
    }
  };

  const handleRejectOrder = async () => {
    if (!rejectingOrder) return;
    const result = await api.updateSellerOrder(rejectingOrder.orderId, {
      status: 'REJECTED',
      rejectionReason
    });
    if (result.success) {
      setOrders(prev => prev.map(order => order.orderId === rejectingOrder.orderId ? result.order : order));
      setRejectingOrder(null);
      setRejectionReason('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] py-12 px-6 font-display">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Shop Dashboard</h1>
            <p className="text-slate-400 font-black mt-2 uppercase text-[10px] tracking-[0.3em]">
              Welcome back, <span className="text-blue-600">{user?.fullName || 'Chamara Perera'}</span>
            </p>
          </div>
          <Button as={Link} to="/seller/add-listing" className="rounded-[1.5rem] px-8 py-4 shadow-2xl shadow-blue-300 transition-transform hover:scale-105 active:scale-95">
            <PlusCircle size={20} className="mr-3" /> <span className="font-black">List New Product</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-50 transition-all hover:shadow-2xl group">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-50 p-4 gap-2">
            {[
              { id: 'listings', label: 'My Listings', icon: Package },
              { id: 'orders', label: 'Incoming Orders', icon: Truck },
              { id: 'bids', label: 'Recent Bids', icon: Gavel }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-10">
            {activeTab === 'listings' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                      <th className="pb-6 px-4">Product</th>
                      <th className="pb-6 px-4">Type</th>
                      <th className="pb-6 px-4">Status</th>
                      <th className="pb-6 px-4 text-right">Price</th>
                      <th className="pb-6 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {listings.map(item => (
                      <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-6 px-4 font-black text-slate-900">Product #{item.productId || item.id}</td>
                        <td className="py-6 px-4">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black">{item.type || 'FIXED'}</span>
                        </td>
                        <td className="py-6 px-4">
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase">Active</span>
                        </td>
                        <td className="py-6 px-4 text-right font-black text-slate-900">{formatLKR(item.price || item.currentBid || item.startPrice || 0)}</td>
                        <td className="py-6 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEditModal(item)} className="inline-flex items-center gap-1 text-slate-400 font-black text-xs hover:text-blue-600 transition-colors">
                              <Pencil size={14} /> Edit
                            </button>
                            {item.type === 'AUCTION' && item.status === 'ACTIVE' && (
                              <button onClick={() => handleEndAuction(item.id)} className="inline-flex items-center gap-1 text-amber-500 font-black text-xs hover:text-amber-600 transition-colors">
                                <Ban size={14} /> End
                              </button>
                            )}
                            <button onClick={() => handleDeleteListing(item.id)} className="inline-flex items-center gap-1 text-red-400 font-black text-xs hover:text-red-600 transition-colors">
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length > 0 ? orders.map((order, index) => (
                  <div key={`${order.orderId}-${index}`} className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-6">
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-slate-900">Order #{order.orderId}</p>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Product #{order.productId} • Buyer {order.buyerName}</p>
                        </div>
                        <span className={`w-fit rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest ${order.status === 'SHIPPED' ? 'bg-green-100 text-green-700' : order.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-white text-slate-600'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3 text-sm text-slate-600">
                      <div className="rounded-2xl bg-white p-4">
                        <p className="mb-1 font-bold text-slate-900">Amount</p>
                        <p>{formatLKR(order.totalAmount)}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <p className="mb-1 font-bold text-slate-900">Shipping Address</p>
                        <p>{order.shippingAddress}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <p className="mb-1 font-bold text-slate-900">Purchase Date</p>
                        <p>{order.createdAt}</p>
                      </div>
                    </div>
                    {order.status === 'PENDING' && (
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={() => handleShipOrder(order.orderId)} size="sm" className="rounded-xl">
                          <CheckCircle2 size={14} className="mr-1" /> Mark Shipped
                        </Button>
                        <Button onClick={() => setRejectingOrder(order)} size="sm" variant="danger" className="rounded-xl">
                          <XCircle size={14} className="mr-1" /> Reject Purchase
                        </Button>
                      </div>
                    )}
                    {order.rejectionReason && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <span className="font-bold">Rejection reason:</span> {order.rejectionReason}
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="rounded-3xl border-2 border-dashed border-slate-200 px-6 py-16 text-center text-slate-400 font-bold">
                    Orders will appear here once buyers start purchasing your listings.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bids' && (
               <div className="space-y-4">
               {bids.map((bid, i) => (
                 <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                            <Gavel size={20} />
                        </div>
                        <div>
                            <p className="font-black text-slate-900 text-sm">New bid on Auction #{bid.productId}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">2 minutes ago</p>
                        </div>
                    </div>
                    <span className="text-xl font-black text-blue-600">{formatLKR(bid.amount)}</span>
                 </div>
               ))}
             </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={!!editingListing} onClose={() => setEditingListing(null)} title="Edit Listing">
        <div className="space-y-4">
          <Input label="Title" value={editForm.title} onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))} />
          <Input.TextArea label="Description" value={editForm.description} onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))} rows={4} />
          {editingListing?.type === 'FIXED' ? (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price" type="number" value={editForm.price} onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))} />
              <Input label="Stock" type="number" value={editForm.stock} onChange={(e) => setEditForm(prev => ({ ...prev, stock: e.target.value }))} />
            </div>
          ) : (
            <Input label="Starting / Current Bid" type="number" value={editForm.currentBid} onChange={(e) => setEditForm(prev => ({ ...prev, currentBid: e.target.value }))} />
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setEditingListing(null)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSaveListing}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!rejectingOrder} onClose={() => { setRejectingOrder(null); setRejectionReason(''); }} title="Reject Purchase">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Share a short reason so the admin can review the rejection if needed.</p>
          <Input.TextArea label="Reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={4} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => { setRejectingOrder(null); setRejectionReason(''); }}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={handleRejectOrder} disabled={!rejectionReason.trim()}>Reject Order</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SellerDashboard;
