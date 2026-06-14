import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ChevronRight, Check } from 'lucide-react';

interface WholesalerAuthPageProps {
  onLogin: (user: any) => void;
}

const WholesalerAuthPage: React.FC<WholesalerAuthPageProps> = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '', rememberMe: false });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    onLogin({
      id: Date.now(),
      name: loginForm.username || 'Wholesale Partner',
      email: 'wholesale@example.com',
      role: 'wholesaler'
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // Simulate registration
    onLogin({
      id: Date.now(),
      name: `${registerForm.firstName} ${registerForm.lastName}`,
      email: registerForm.email,
      role: 'wholesaler'
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        
        {/* Left Side - Log In */}
        <div className="flex-1 p-12 md:p-20 bg-white">
          <div className="mb-12">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6">W</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Log In</h2>
            <p className="text-gray-400 text-sm">Let's get started with wholesaleX</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">User Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Your user name"
                  className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all"
                  value={loginForm.username}
                  onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="Your password"
                  className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all"
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${loginForm.rememberMe ? 'bg-orange-500 border-orange-500' : 'border-gray-200 group-hover:border-orange-500'}`}>
                  {loginForm.rememberMe && <Check className="w-3 h-3 text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={loginForm.rememberMe}
                  onChange={e => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#fbb03b] hover:bg-[#f9a01b] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              Log In
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Right Side - Create Account */}
        <div className="flex-1 p-12 md:p-20 bg-[#1a1a1a] text-white">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2">Create an New Account</h2>
            <p className="text-gray-500 text-sm">Let's get started with wholesaleX</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name *</label>
                <input 
                  type="text" 
                  placeholder="Your first name"
                  className="w-full bg-white/5 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all text-white"
                  value={registerForm.firstName}
                  onChange={e => setRegisterForm({...registerForm, firstName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name *</label>
                <input 
                  type="text" 
                  placeholder="Your last name"
                  className="w-full bg-white/5 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all text-white"
                  value={registerForm.lastName}
                  onChange={e => setRegisterForm({...registerForm, lastName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="w-full bg-white/5 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all text-white"
                  value={registerForm.email}
                  onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">User Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Your user name"
                  className="w-full bg-white/5 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all text-white"
                  value={registerForm.username}
                  onChange={e => setRegisterForm({...registerForm, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="password" 
                  placeholder="Your password"
                  className="w-full bg-white/5 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all text-white"
                  value={registerForm.password}
                  onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="password" 
                  placeholder="Confirm your password"
                  className="w-full bg-white/5 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 transition-all text-white"
                  value={registerForm.confirmPassword}
                  onChange={e => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${registerForm.agreeTerms ? 'bg-orange-500 border-orange-500' : 'border-white/20 group-hover:border-orange-500'}`}>
                  {registerForm.agreeTerms && <Check className="w-3 h-3 text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={registerForm.agreeTerms}
                  onChange={e => setRegisterForm({...registerForm, agreeTerms: e.target.checked})}
                  required
                />
                <span className="text-xs text-gray-400">
                  By creating an account, you agree to shop <span className="text-white underline">Conditions of Use</span> and <span className="text-white underline">Privacy Notice</span>.
                </span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#fbb03b] hover:bg-[#f9a01b] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/20 transition-all"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WholesalerAuthPage;
