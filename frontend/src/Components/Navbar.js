import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { useCart } from '../Hooks/useCart';
import { useWishlist } from '../Context/WishlistContext'; 
import { 
  User, LogOut, Settings, LayoutDashboard, ShoppingCart, 
  History, Shield, LogIn, UserPlus, Search as SearchIcon, Heart 
} from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist(); 
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const userRole = user?.role || 'BUYER';
  const wishlistCount = wishlist.length; 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getInitial = (name) => name ? name.trim().charAt(0).toUpperCase() : '?';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 lg:px-20 py-3 font-display">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 md:gap-8">
        
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 text-[#1c74e9] shrink-0">
          <img src={logo} alt="PickUp" className="h-8 w-auto object-contain"/>
          <h2 className="text-xl font-bold hidden sm:block text-slate-900">PickUp</h2>
        </Link>

        {/* Search Bar - Center Section */}
        <form 
          onSubmit={handleSearch}
          className="relative flex-1 max-w-md hidden md:block"
        >
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm placeholder-slate-500 focus:border-[#1c74e9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c74e9]/20 transition-all"
            placeholder="Search auctions, electronics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Mobile Search Icon */}
          <button className="p-2 text-slate-700 bg-slate-100 rounded-xl md:hidden hover:bg-slate-200 transition-all">
            <SearchIcon size={20} />
          </button>

          {/* ➕ Wishlist Icon */}
          <Link to="/wishlist" className="relative p-2.5 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all group">
            <Heart size={20} className="group-hover:text-red-500 transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold ring-2 ring-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2.5 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all group">
            <ShoppingCart size={20} className="group-hover:text-blue-600 transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold ring-2 ring-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="h-10 w-10 rounded-full bg-[#1c74e9] flex items-center justify-center overflow-hidden border-2 border-[#1c74e9]/30 hover:ring-2 hover:ring-[#1c74e9] transition-all cursor-pointer shadow-sm"
            >
              {isLoggedIn ? (
                user.profilePic ? <img src={user.profilePic} className="h-full w-full object-cover" alt="Profile" /> 
                : <span className="text-white font-bold text-lg">{getInitial(user.fullName)}</span>
              ) : <User className="text-white" size={20} />}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="py-2">
                  {!isLoggedIn ? (
                    <>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors font-semibold text-slate-700"><LogIn size={18} className="text-[#1c74e9]" /> Login</Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors font-semibold text-slate-700"><UserPlus size={18} className="text-[#1c74e9]" /> Register</Link>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Signed in as</p>
                        <p className="text-sm font-black truncate text-slate-900">{user.fullName}</p>
                      </div>
                      {userRole === 'BUYER' && (
                        <Link to="/seller/become-seller" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-[#1c74e9] font-black hover:bg-blue-50">
                          <LayoutDashboard size={18} /> {user.sellerRequestStatus === 'PENDING' ? 'Seller Request' : 'Become a Seller'}
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 font-bold hover:bg-slate-50"><Settings size={18} className="text-slate-400" /> Edit Profile</Link>
                      {userRole === 'SELLER' && <Link to="/seller/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-[#1c74e9] font-black hover:bg-blue-50"><LayoutDashboard size={18} /> Shop Dashboard</Link>}
                      {userRole === 'ADMIN' && <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 font-black hover:bg-red-50"><Shield size={18} /> Admin Panel</Link>}
                      <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 font-bold hover:bg-slate-50"><History size={18} className="text-slate-400" /> Orders & Bids</Link>
                      <button 
                        onClick={() => { logout(); setIsMenuOpen(false); navigate('/'); }} 
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-black border-t border-slate-100 transition-colors mt-1"
                      >
                        <LogOut size={18} /> Log out
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
