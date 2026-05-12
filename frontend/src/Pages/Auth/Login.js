import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import logo from '../../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, loading, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    const result = await login(email, password);

    if (result.success) {
      const userRole = result.user?.role;

      if (userRole === 'ADMIN') navigate('/admin/dashboard');
      else if (userRole === 'SELLER') navigate('/seller/dashboard');
      else navigate('/');
    }
    else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8] py-12 px-4 sm:px-6 lg:px-8 font-display">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center">
          <img className="h-24 md:h-36 w-auto object-contain mb-2" src={logo} alt="PickUp" />
          <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-center text-sm text-slate-600">Sign in to continue to PickUp</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <div className="text-red-500 text-xs text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
          
          <div className="space-y-4"> 
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c74e9] transition-all" 
              placeholder="Email address" 
            />
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c74e9] transition-all" 
              placeholder="Password" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#1c74e9] hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-sm text-center">
            <Link to="/register" className="font-medium text-[#1c74e9] hover:underline">Don't have an account? Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
