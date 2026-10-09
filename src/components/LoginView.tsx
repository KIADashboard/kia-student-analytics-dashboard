import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (identifier.toLowerCase() === 'student@kia.edu' && password === 'Student@123') {
      onLogin('student');
    } else if (identifier.toLowerCase() === 'admin@kia.edu' && password === 'Admin@123') {
      onLogin('admin');
    } else {
      setError('Invalid credentials. Please check your email/phone and password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1c13] flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[#0d1c13] bg-[linear-gradient(rgba(20,50,30,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(20,50,30,0.3)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
      
      {/* Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(21,51,32,0.5)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(21,51,32,0.5)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 sm:p-10 relative z-10">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Login</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Enter your credentials to access your account.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 text-sm border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="identifier">
              Email ID or Phone Number
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or phone"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#153320] focus:ring-1 focus:ring-[#153320] transition-colors text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 pr-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#153320] focus:ring-1 focus:ring-[#153320] transition-colors text-gray-900 placeholder:text-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 p-3 bg-[#153320] hover:bg-[#0a170e] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#153320] focus:ring-offset-2 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>
      </div>

      <p className="text-[12px] text-[#faf9f6]/60 mt-8 text-center relative z-10 font-medium tracking-wide">
        Kumaraguru Institute of Agriculture &middot; Secure Portal
      </p>
    </div>
  );
};
