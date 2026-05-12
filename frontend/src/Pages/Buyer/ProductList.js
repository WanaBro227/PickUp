import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../Services/api';
import { useWishlist } from '../../Context/WishlistContext';
import { useRecent } from '../../Context/RecentlyViewedContext';
import { Heart } from 'lucide-react'; 
import { formatLKR } from '../../Utils/formatters';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams(); 
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToRecent } = useRecent();

  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts({ category: selectedCategory, search: searchQuery });
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) { 
        console.error(error);
        setProducts([]); 
      } finally { 
        setLoading(false); 
      }
    };
    loadProducts();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900">Marketplace</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10 font-bold text-slate-400">Loading items...</div>
          ) : products.length > 0 ? (
            products.map(product => {
              const isFavorite = isInWishlist(product.id);
              return (
                <div 
                  key={product.id} 
                  className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-50 relative group cursor-pointer hover:shadow-xl transition-all duration-300" 
                  onClick={() => {
                    addToRecent(product);
                    navigate(`/products/${product.id}`);
                  }}
                >
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      isFavorite ? removeFromWishlist(product.id) : addToWishlist(product); 
                    }}
                    className="absolute top-6 right-6 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-sm text-slate-400 hover:text-red-500 transition-all"
                  >
                    <Heart size={18} fill={isFavorite ? "#ef4444" : "none"} className={isFavorite ? "text-red-500" : ""} />
                  </button>
                  
                  <img 
                    src={product.img} 
                    alt={product.title} 
                    className="w-full h-64 object-cover rounded-2xl mb-4 group-hover:scale-[1.02] transition-transform" 
                  />
                  
                  <h3 className="font-bold text-slate-800 mb-1 truncate">{product.title}</h3>
                  <p className="text-blue-600 font-black text-lg">
                    {formatLKR(product.price || product.currentBid)}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10 text-slate-400 font-bold">
              No products found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;