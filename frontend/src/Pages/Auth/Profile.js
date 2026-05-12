import React, { useState } from 'react';
import { useAuth } from '../../Hooks/useAuth';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { User, Mail, MapPin, Save, ShieldCheck } from 'lucide-react'; 
const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    addresses: (user?.addresses || ['']).join(', '),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateProfile(formData);
    if (result?.success) {
      setEditing(false);
    }
    setSaving(false);
  };

  if (!user) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Please log in to view profile.</div>;

  return (
    <div className="min-h-screen bg-[#f6f7f8] py-16 px-4 font-display">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 p-12 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <User size={120} />
          </div>

          <div className="flex flex-col items-center md:items-start md:flex-row gap-8 mb-12">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#1c74e9] to-blue-800 flex items-center justify-center shadow-xl shadow-blue-200 ring-8 ring-blue-50">
              <span className="text-5xl font-black text-white">{user.fullName.charAt(0)}</span>
            </div>
            <div className="text-center md:text-left pt-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{user.fullName}</h1>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <ShieldCheck size={16} className="text-blue-500" />
                <p className="text-blue-500 font-black uppercase text-[10px] tracking-widest">{user.role} Account</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ProfileField icon={User} label="Full Name" value={formData.fullName} />
            <ProfileField icon={Mail} label="Email Address" value={formData.email} />
            <ProfileField icon={MapPin} label="Primary Address" value={formData.addresses || 'No addresses saved'} />

            {!editing ? (
              <div className="pt-8">
                <Button onClick={() => setEditing(true)} size="lg" className="w-full rounded-2xl h-14 font-black shadow-lg shadow-blue-100">
                  Update Profile Details
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-4">
                <Input label="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="rounded-xl" />
                <Input label="Addresses (comma separated)" value={formData.addresses} onChange={(e) => setFormData({...formData, addresses: e.target.value})} className="rounded-xl" />
                <div className="flex gap-4 pt-4">
                  <Button type="submit" size="lg" className="flex-1 rounded-2xl h-14 font-black" disabled={saving}>
                    <Save size={18} className="mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button type="button" variant="secondary" size="lg" onClick={() => setEditing(false)} className="flex-1 rounded-2xl h-14 font-black">
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-5 p-6 bg-slate-50/50 rounded-3xl border border-slate-50 hover:border-slate-200 transition-colors group">
    <div className="bg-white p-3 rounded-2xl shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default Profile;
