import React, { useEffect, useState } from 'react';
import { Users, Search, AlertTriangle, Hammer, Zap, UserCheck, UserX, BarChart3, DollarSign } from 'lucide-react';
import { formatLKR } from '../../Utils/formatters';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { api } from '../../Services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalRevenue: 0, activeAuctions: 0 });

  useEffect(() => {
    const loadAdminData = async () => {
      const [loadedRequests, loadedStats, loadedDisputes] = await Promise.all([
        api.getSellerRequests(),
        api.getPlatformStats(),
        api.getDisputes()
      ]);

      setRequests(loadedRequests);
      setStats(loadedStats);
      setDisputes(loadedDisputes);
    };

    loadAdminData();
  }, []);

  const approveSeller = async (userId) => {
    await api.approveSeller(userId);
    setRequests(prev => prev.filter(req => req.userId !== userId));
  };

  const denySeller = async (userId) => {
    await api.denySeller(userId);
    setRequests(prev => prev.filter(req => req.userId !== userId));
  };

  const resolveDispute = async (disputeId) => {
    await api.resolveDispute(disputeId);
    setDisputes(prev => prev.filter(d => d.id !== disputeId));
  };

  const filteredRequests = requests.filter(req => 
    (req?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (req?.businessName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDisputes = disputes.filter(d => 
    (d?.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-display">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Control Center</h1>

      {/* Tab Navigation */}
      <div className="flex bg-white rounded-xl p-1 mb-6 shadow-sm border border-slate-200">
        {[
          { id: 'stats', label: '📊 Platform Stats', icon: BarChart3 },
          { id: 'sellers', label: '👥 Seller Verification', icon: UserCheck },
          { id: 'disputes', label: '⚠️ Disputes', icon: AlertTriangle },
          { id: 'maintenance', label: '🔧 Maintenance', icon: Hammer }
        ].map(tab => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all flex-1 justify-center ${
              activeTab === tab.id ? 'bg-[#1c74e9] text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 text-blue-600">
              <div className="p-3 bg-blue-50 rounded-xl"><Users size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Users</p>
                <p className="text-4xl font-black text-slate-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 text-emerald-600">
              <div className="p-3 bg-emerald-50 rounded-xl"><DollarSign size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Platform Revenue</p>
                <p className="text-4xl font-black text-slate-900">{formatLKR(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 text-amber-600">
              <div className="p-3 bg-amber-50 rounded-xl"><Zap size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Active Auctions</p>
                <p className="text-4xl font-black text-slate-900">{stats.activeAuctions}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sellers Tab */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center">
            <h2 className="text-xl font-bold text-slate-900 flex-1">Pending Verifications ({filteredRequests.length})</h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1c74e9] outline-none"
                placeholder="Search by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Business</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Applied</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(req => (
                  <tr key={req.userId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{req.name}</div>
                      <div className="text-xs text-slate-500">{req.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{req.businessName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{req.appliedDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => approveSeller(req.userId)}>
                          <UserCheck size={14} className="mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => denySeller(req.userId)}>
                          <UserX size={14} className="mr-1" /> Deny
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-300">
          {filteredDisputes.map(dispute => (
            <div key={dispute.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-4">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-full h-fit"><AlertTriangle size={24} /></div>
                <div>
                  <h4 className="font-bold text-slate-900">{dispute.title}</h4>
                  <p className="text-sm text-slate-600 max-w-xl">{dispute.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">Order #{dispute.orderId}</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded uppercase">{dispute.type}</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => resolveDispute(dispute.id)}>Resolve Dispute</Button>
            </div>
          ))}
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Hammer size={24} className="text-[#1c74e9]" /> System Controls
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Perform bulk actions across the entire platform.</p>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 border-none shadow-amber-100">
                <Zap size={18} className="mr-2" /> End All Live Auctions
              </Button>
              <Button variant="danger" className="w-full">Suspend All New Listings</Button>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Global Search</h3>
            <p className="text-sm text-slate-500 mb-4">Find any user or item by ID or metadata.</p>
            <Input placeholder="Enter ID, Email or Product Code..." />
            <Button variant="secondary" className="mt-4 w-full">Search Database</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
