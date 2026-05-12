import React, { useState } from 'react';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { useAuth } from '../../Hooks/useAuth';
import Modal from '../../Components/Modal';
import { CheckCircle, AlertCircle, Store, FileText } from 'lucide-react';

const BecomeSeller = () => {
  const { user, requestSellerAccess } = useAuth();
  
  const [formData, setFormData] = useState({
    businessName: user?.businessDetails?.name || '',
    description: user?.businessDetails?.description || '',
    contactPhone: user?.businessDetails?.contact || '',
    documents: user?.businessDetails?.documents || '',
  });
  
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const payload = {
      name: formData.businessName,
      description: formData.description,
      contactPhone: formData.contact,
      documents: formData.documents
    };

    const results = await requestSellerAccess(payload);

    if (results.success) {
      setShowModal(true);
    }
    else {
      setError(results.error || 'We could not submit your request. Please try again later.');
    }

    setLoading(false);
  };

  if (user?.role === 'SELLER') {
    return (
      <div className="min-h-screen bg-[#f6f7f8] py-12">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center mb-4">Already a Seller!</h2>
          <p className="text-slate-600 text-center mb-8">
            Your shop <strong>{user.businessDetails?.name}</strong> is approved and ready.
          </p>
          <Button to="/seller/dashboard" size="lg" className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const requestStatus = user?.sellerRequestStatus || 'NONE';
  const isPending = requestStatus === 'PENDING';
  const isRejected = requestStatus === 'REJECTED';

  return (
    <div className="min-h-screen bg-[#f6f7f8] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-[#1c74e9]">
              <Store size={28} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Become a Seller</h1>
            <p className="text-slate-600">
              Start selling fixed-price items and auctions on PickUp. Admin review keeps the marketplace trusted.
            </p>
          </div>

          {(isPending || isRejected) && (
            <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium ${isPending ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {isPending
                ? 'Your seller request is pending admin approval. You can still update the details below and resubmit if needed.'
                : 'Your previous seller request was denied. Update your business details and try again.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
            <Input
              label="Business Name"
              placeholder="e.g. Chamara's Tech Hub"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
            <Input.TextArea
              label="Business Description"
              placeholder="Tell buyers about your business..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
            <Input
              label="Contact Phone"
              type="tel"
              placeholder="+94 77 123 4567"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />
            <Input.TextArea
              label="Supporting Documents / Notes"
              placeholder="Business registration no., delivery policy, or any supporting details for the admin."
              value={formData.documents}
              onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
              rows={3}
            />
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                <FileText size={16} />
                Seller checklist
              </div>
              <p>After approval you can list fixed-price items, create auctions, manage your own orders, and track revenue from the seller dashboard.</p>
            </div>
            <Button type="submit" size="lg" className="w-full" loading={loading} disabled={!user}>
              {isPending ? 'Update Seller Request' : 'Submit Seller Request'}
            </Button>
          </form>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Pending Approval">
        <>
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-slate-600 text-center">
            Your business details have been recorded. Admin will review your seller request within 24 hours.
          </p>
          <p className="text-sm text-slate-500 text-center mt-2">
            While waiting, you can keep browsing as a buyer and come back here any time.
          </p>
        </>
        <div className="flex gap-3 pt-6">
          <Button to="/seller/become-seller" className="flex-1" variant="secondary">
            Review Request
          </Button>
          <Button to="/" className="flex-1">Continue Browsing</Button>
        </div>
      </Modal>
    </div>
  );
};

export default BecomeSeller;
