import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { useAuth } from '../../Hooks/useAuth';
import { api } from '../../Services/api';
import Modal from '../../Components/Modal';
import { formatLKR } from '../../Utils/formatters';

const AddListing = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdListing, setCreatedListing] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    type: 'FIXED',
    price: '',
    stock: '1',
    startPrice: '',
    reservePrice: '',
    endDate: '',
    increment: '1000',
  });

  if (!user || user.role !== 'SELLER') {
    return (
      <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">
        Access Denied: Sellers Only
      </div>
    );
  }

  // ✅ STRONG VALIDATION
  const validateStep = () => {
    if (step === 1) {
      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.category.trim() ||
        !formData.imageUrl.trim()
      ) {
        setError('Please complete all basic details.');
        return false;
      }
    }

    if (step === 2) {
      if (formData.type === 'FIXED') {
        if (!formData.price || Number(formData.price) <= 0) {
          setError('Enter a valid price.');
          return false;
        }
        if (!formData.stock || Number(formData.stock) <= 0) {
          setError('Enter valid stock quantity.');
          return false;
        }
      } else {
        if (!formData.startPrice || Number(formData.startPrice) <= 0) {
          setError('Enter a valid starting bid.');
          return false;
        }
      }
    }

    if (step === 3 && formData.type === 'AUCTION') {
      if (!formData.endDate) {
        setError('Select auction end date.');
        return false;
      }
      if (!formData.increment || Number(formData.increment) <= 0) {
        setError('Enter valid increment.');
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    // ✅ Skip step 3 if FIXED
    if (step === 2 && formData.type === 'FIXED') {
      setStep(4);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step === 4 && formData.type === 'FIXED') {
      setStep(2);
    } else {
      setStep(prev => prev - 1);
    }
  };

  // ✅ BACKEND DATA FIX
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const backendData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      images: [formData.imageUrl.trim()],
      type: formData.type,

      price: formData.type === 'FIXED' ? Number(formData.price) : null,
      stock: formData.type === 'FIXED' ? Number(formData.stock) : null,

      startPrice: formData.type === 'AUCTION' ? Number(formData.startPrice) : null,
      currentBid: formData.type === 'AUCTION' ? Number(formData.startPrice) : null,
      reservePrice: formData.reservePrice ? Number(formData.reservePrice) : null,
      increment: formData.type === 'AUCTION' ? Number(formData.increment) : null,
      endTime: formData.type === 'AUCTION' ? formData.endDate : null,
    };

    try {
      const result = await api.createListing(backendData, user.id);
      setCreatedListing(result.listing);
      setShowSuccess(true);
    } catch (err) {
      setError('Publishing failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Details', 'Pricing', 'Settings', 'Review'];

  return (
    <div className="min-h-screen bg-[#f6f7f8] py-12 font-display">
      <div className="max-w-2xl mx-auto px-4">

        {/* HEADER */}
        <div className="bg-white rounded-[3rem] shadow-2xl border overflow-hidden">
          <div className="p-8 bg-blue-600 text-white flex justify-between">
            {steps.map((label, i) => (
              <div key={label} className="text-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold 
                  ${step >= i + 1 ? 'bg-white text-blue-600' : 'bg-white/20 text-white/40'}`}>
                  {i + 1}
                </div>
                <p className="text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="p-8">

            {error && <div className="mb-4 text-red-600 font-bold">{error}</div>}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <Input label="Title" value={formData.title}
                  onChange={(e)=>setFormData({...formData,title:e.target.value})}/>
                <Input label="Category" value={formData.category}
                  onChange={(e)=>setFormData({...formData,category:e.target.value})}/>
                <Input label="Image URL" value={formData.imageUrl}
                  onChange={(e)=>setFormData({...formData,imageUrl:e.target.value})}/>
                <Input.TextArea label="Description" value={formData.description}
                  onChange={(e)=>setFormData({...formData,description:e.target.value})}/>

                <Button onClick={handleNext}>Next</Button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button onClick={()=>setFormData({...formData,type:'FIXED'})}>Fixed</button>
                  <button onClick={()=>setFormData({...formData,type:'AUCTION'})}>Auction</button>
                </div>

                {formData.type === 'FIXED' ? (
                  <>
                    <Input label="Price" type="number"
                      value={formData.price}
                      onChange={(e)=>setFormData({...formData,price:e.target.value})}/>
                    <Input label="Stock" type="number"
                      value={formData.stock}
                      onChange={(e)=>setFormData({...formData,stock:e.target.value})}/>
                  </>
                ) : (
                  <Input label="Start Price" type="number"
                    value={formData.startPrice}
                    onChange={(e)=>setFormData({...formData,startPrice:e.target.value})}/>
                )}

                <div className="flex justify-between">
                  <Button onClick={handlePrev}>Back</Button>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </div>
            )}

            {/* STEP 3 (Auction only) */}
            {step === 3 && formData.type === 'AUCTION' && (
              <div className="space-y-4">
                <Input label="End Date" type="datetime-local"
                  value={formData.endDate}
                  onChange={(e)=>setFormData({...formData,endDate:e.target.value})}/>
                <Input label="Increment" type="number"
                  value={formData.increment}
                  onChange={(e)=>setFormData({...formData,increment:e.target.value})}/>
                <Input label="Reserve Price"
                  value={formData.reservePrice}
                  onChange={(e)=>setFormData({...formData,reservePrice:e.target.value})}/>

                <div className="flex justify-between">
                  <Button onClick={handlePrev}>Back</Button>
                  <Button onClick={handleNext}>Review</Button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div>
                <h2 className="font-bold">{formData.title}</h2>
                <p>{formatLKR(formData.price || formData.startPrice)}</p>

                <div className="flex gap-4 mt-4">
                  <Button onClick={handlePrev}>Edit</Button>
                  <Button onClick={handleSubmit} loading={loading}>Publish</Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <Modal isOpen={showSuccess} onClose={()=>setShowSuccess(false)} title="Success">
        <div className="text-center py-6">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-500"/>
          <p className="font-bold">Listing Created Successfully</p>
        </div>
      </Modal>
    </div>
  );
};

export default AddListing;