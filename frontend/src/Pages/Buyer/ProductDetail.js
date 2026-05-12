import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { useWishlist } from '../../Context/WishlistContext';
import { useAuctionTimer } from '../../Hooks/useAuctionTimer';
import { api } from '../../Services/api';
import { formatLKR, getMinBid } from '../../Utils/formatters';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import Modal from '../../Components/Modal';
import { ArrowLeft, Gavel, Clock, Users, Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../Hooks/useAuth';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  const { timeLeft, ended } = useAuctionTimer(product?.endTime);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');

      const found = await api.getProduct(id);
      if (found) {
        setProduct(found);
        setBidAmount(getMinBid(found.currentBid || found.startPrice).toString());
      } else {
        setError('We could not find that product.');
      }

      setLoading(false);
    };

    loadProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-500 font-bold">Loading product...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center text-slate-500 font-bold">{error}</div>;

  const isAuction = product.type === 'AUCTION';
  const isOwner = user?.id === product.sellerId;
  const isFavorite = isInWishlist(product.id);
  const minBid = getMinBid(product.currentBid || product.startPrice);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    isFavorite ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const handlePlaceBid = async () => {
    setBidError('');
    setBidSuccess('');
    setIsSubmittingBid(true);

    const response = await api.placeBid(product.id, bidAmount, user?.id);
    if (response.success) {
      setProduct(response.product);
      setBidAmount(getMinBid(response.product.currentBid || response.product.startPrice).toString());
      setBidSuccess('Your bid has been placed successfully.');
      setShowBidModal(false);
    } else {
      setBidError(response.error || 'Unable to place your bid right now.');
    }

    setIsSubmittingBid(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] pt-4 pb-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-20 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" className="hover:bg-white" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} className="mr-2" /> Back
          </Button>
          <button
            onClick={toggleWishlist}
            className={`p-4 rounded-2xl shadow-sm border transition-all ${isFavorite ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white text-slate-400'}`}
          >
            <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl shadow-2xl bg-white p-2">
              <img src={product.img} alt={product.title} className="w-full h-[450px] object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-500" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm">
                <Users size={20} className="mx-auto mb-1 text-blue-500" />
                <p className="text-xs font-bold text-slate-400">Watchers</p>
                <p className="text-lg font-bold">18</p>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm">
                <Gavel size={20} className="mx-auto mb-1 text-amber-500" />
                <p className="text-xs font-bold text-slate-400">Total Bids</p>
                <p className="text-lg font-bold">{product.bids || 0}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{product.title}</h1>
              <p className="text-slate-500 text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-xl">
              {bidSuccess && (
                <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                  {bidSuccess}
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {isAuction ? 'Current Bid' : 'Price'}
                  </span>
                  <p className="text-5xl font-black text-blue-600">
                    {isAuction ? formatLKR(product.currentBid || product.startPrice) : formatLKR(product.price)}
                  </p>
                </div>
                {isAuction && (
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                    <div className={`p-2 rounded-lg ${ended ? 'bg-red-100' : 'bg-amber-100'}`}>
                      <Clock size={20} className={ended ? 'text-red-600' : 'text-amber-600'} />
                    </div>
                    <span className={`font-mono text-xl font-bold ${ended ? 'text-red-600' : 'text-slate-800'}`}>{timeLeft}</span>
                  </div>
                )}
              </div>

              {!isOwner && (
                isAuction ? (
                  <Button
                    size="lg"
                    className="w-full py-8 text-xl font-black rounded-2xl shadow-lg"
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                        return;
                      }
                      setBidError('');
                      setBidSuccess('');
                      setShowBidModal(true);
                    }}
                    disabled={ended}
                  >
                    <Gavel size={24} className="mr-3" />
                    {ended ? 'Auction Closed' : 'Place Your Bid'}
                  </Button>
                ) : (
                  <Button size="lg" className="w-full py-8 text-xl font-black rounded-2xl shadow-lg" onClick={() => addToCart(product)}>
                    <ShoppingCart size={24} className="mr-3" />
                    Add to Cart
                  </Button>
                )
              )}

              {isOwner && (
                <Button variant="secondary" size="lg" className="w-full py-8 text-xl font-bold rounded-2xl border-2 border-dashed border-slate-200">
                  Manage My Listing
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showBidModal} onClose={() => setShowBidModal(false)} title="Place Your Bid">
        <div className="space-y-6 p-2">
          {bidError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {bidError}
            </div>
          )}
          <Input
            type="number"
            label="Your Bid Amount (LKR)"
            placeholder={`Min. ${minBid}`}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          <Button size="lg" className="w-full py-5 text-lg font-black rounded-xl" onClick={handlePlaceBid} disabled={isSubmittingBid}>
            {isSubmittingBid ? 'Submitting Bid...' : 'Confirm Bid'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;
