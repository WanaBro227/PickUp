import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Facebook, Twitter, Instagram, Phone, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-20 font-display">
      <div className="max-w-7xl mx-auto px-4 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img src={logo} alt="PickUp Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
              <span className="text-2xl font-bold tracking-tight text-white">
                PickUp
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Sri Lanka's premier online marketplace for fixed price items and exciting live auctions. Join thousands of buyers and sellers today.
            </p>
          </div>

          {/* Column 2: Buyer Links */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Buyer</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/products" className="hover:text-[#1c74e9] hover:translate-x-1 flex items-center gap-2 transition-all font-medium">Browse Products</Link></li>
              <li><Link to="/cart" className="hover:text-[#1c74e9] hover:translate-x-1 flex items-center gap-2 transition-all font-medium">Shopping Cart</Link></li>
              <li><Link to="/orders" className="hover:text-[#1c74e9] hover:translate-x-1 flex items-center gap-2 transition-all font-medium">Order History</Link></li>
              <li><Link to="/products?type=AUCTION" className="hover:text-[#1c74e9] hover:translate-x-1 flex items-center gap-2 transition-all font-medium">Live Auctions</Link></li>
            </ul>
          </div>

          {/* Column 3: Seller Links */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Seller</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/seller/add-listing" className="hover:text-[#1c74e9] hover:translate-x-1 flex items-center gap-2 transition-all font-medium">List New Item</Link></li>
              <li><Link to="/seller/dashboard" className="hover:text-[#1c74e9] hover:translate-x-1 flex items-center gap-2 transition-all font-medium">Manage Shop</Link></li>
              <li><Link to="/seller/become-seller" className="hover:text-[#1c74e9] hover:translate-x-1 flex items-center gap-2 transition-all font-medium">Seller Application</Link></li>
            </ul>
          </div>

          {/* Column 4: Support & Contact */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Support</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-[#1c74e9]">
                  <Phone size={16} />
                </div>
                <span className="font-medium">+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-[#1c74e9]">
                  <Mail size={16} />
                </div>
                <span className="font-medium">support@pickup.lk</span>
              </li>
              <li className="pt-2">
                <Link to="/disputes" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors underline-offset-4 decoration-[#1c74e9] hover:underline">
                  Dispute Resolution <ArrowRight size={14} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <p className="font-medium">&copy; 2026 PickUp Marketplace. Designed for University of Vavuniya Project.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-600 mr-2">Follow Us</span>
            <div className="flex gap-2">
              <a href="#!" className="p-2.5 bg-slate-800 hover:bg-[#1c74e9] hover:text-white rounded-xl transition-all"><Facebook size={18} /></a>
              <a href="#!" className="p-2.5 bg-slate-800 hover:bg-[#1c74e9] hover:text-white rounded-xl transition-all"><Twitter size={18} /></a>
              <a href="#!" className="p-2.5 bg-slate-800 hover:bg-[#1c74e9] hover:text-white rounded-xl transition-all"><Instagram size={18} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;