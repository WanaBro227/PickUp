import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useCart } from '../Context/CartContext';
import { useRecent } from '../Context/RecentlyViewedContext';
import { formatLKR } from '../Utils/formatters';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToRecent } = useRecent();
  const navigate = useNavigate();
  const isAuction = product.type === "AUCTION";

  const handleProductClick = () => {
    addToRecent(product);
    navigate(`/products/${product.id}`);
  };

  const handleAction = (e) => {
    e.stopPropagation(); 
    if (isAuction) {
      handleProductClick();
    } else {
      addToCart(product);
    }
  };

  return (
    <div 
      onClick={handleProductClick}
      className="group relative flex flex-col rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm transition-all hover:shadow-md border border-slate-100 dark:border-slate-700 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
        <img className="h-full w-full object-cover transition-transform group-hover:scale-105" src={product.img} alt={product.title} />
        <div className={`absolute top-2 left-2 flex items-center rounded-md px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider ${isAuction ? 'bg-amber-500' : 'bg-green-500'}`}>
          {isAuction ? 'Auction' : 'Fixed Price'}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">{product.brand} • {product.category}</p>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            {isAuction && <span className="text-xs text-slate-400">Current Bid</span>}
            <span className="text-lg font-bold text-[#1c74e9]">
              {formatLKR(isAuction ? product.currentBid : product.price)}
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={handleAction}
        className={`mt-4 w-full rounded-lg py-2 text-xs font-bold transition-all ${
          isAuction 
          ? 'bg-[#1c74e9] text-white hover:opacity-90' 
          : 'bg-slate-100 dark:bg-slate-700 hover:bg-[#1c74e9] hover:text-white'
        }`}
      >
        {isAuction ? 'Place Bid' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;
