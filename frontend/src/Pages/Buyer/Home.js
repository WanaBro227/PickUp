import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../Components/ProductCard';
import { useRecent } from '../../Context/RecentlyViewedContext';
import { ArrowRight, Laptop, Shirt, Home as HomeIcon, Ghost, Gamepad2 } from 'lucide-react';
import { formatLKR } from '../../Utils/formatters';
import { api } from '../../Services/api';

const Home = () => {
  const navigate = useNavigate();
  const { recentItems } = useRecent();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const items = await api.getProducts();
      setProducts(items.slice(0, 4));
    };

    loadProducts();
  }, []);

  const handleCategoryClick = (category) => {
    category === 'All Categories' ? navigate('/products') : navigate(`/products?category=${category}`);
  };

  const categories = [
    { name: 'All Categories', icon: <Ghost size={18} /> },
    { name: 'Electronics', icon: <Laptop size={18} /> },
    { name: 'Fashion', icon: <Shirt size={18} /> },
    { name: 'Home & Living', icon: <HomeIcon size={18} /> },
    { name: 'Gaming', icon: <Gamepad2 size={18} /> }
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-[#f6f7f8] dark:bg-[#0f172a] font-display">
      <main className="mx-auto w-full max-w-7xl px-4 lg:px-20 py-8">
        
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl h-[400px]">
            <img className="absolute inset-0 h-full w-full object-cover opacity-50" src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1000" alt="" />
            <div className="relative z-10 flex flex-col items-start justify-center h-full p-8 md:p-16 lg:w-2/3">
              <span className="mb-4 inline-block rounded-full bg-blue-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">Limited Offer</span>
              <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">Upgrade Your Setup with 40% Off</h1>
              <div className="flex gap-4">
                <button onClick={() => handleCategoryClick('Electronics')} className="rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-900 hover:bg-blue-50 transition-all shadow-xl">Shop Now</button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-4">
            {categories.map((cat) => (
              <button key={cat.name} onClick={() => handleCategoryClick(cat.name)} className="flex shrink-0 items-center gap-3 rounded-2xl px-6 py-4 text-sm font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 hover:border-blue-500 transition-all shadow-sm">
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </section>

        {recentItems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Continue Watching</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {recentItems.map(item => (
                <div key={item.id} onClick={() => navigate(`/products/${item.id}`)} className="min-w-[200px] bg-white dark:bg-slate-800 p-4 rounded-[2rem] shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all">
                  <img src={item.img} className="w-full h-28 object-cover rounded-2xl mb-3" alt="" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</h4>
                  <p className="text-blue-600 font-black mt-1 text-sm">{formatLKR(item.price || item.currentBid)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Recommended for You</h2>
            <button onClick={() => navigate('/products')} className="group flex items-center gap-2 text-blue-600 font-bold text-sm">
              See All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
