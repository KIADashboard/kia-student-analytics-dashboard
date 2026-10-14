import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, ExternalLink } from 'lucide-react';
import { UserRole } from '../types';
import kiaLogo from '../assets/kia-logo.png';
import campusImage from '../assets/DL-ns-62d98d43-d018-4bed-b13e-461ea1f876e8_IMG-20211214-WA0002.jpg.jpeg';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanId === 'student@kia.edu' && cleanPass === 'Student@123') {
      onLogin('student');
    } else if (cleanId === 'admin@kia.edu' && cleanPass === 'Admin@123') {
      onLogin('admin');
    } else {
      setError('Invalid email/username or password. Please try again.');
    }
  };

  return (
    <div className="kia-login-container h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white font-sans antialiased text-slate-900 select-none">

      {/* ══════════════════════════════════════════════════════
          LEFT HALF  (58%) – Campus View (DL-ns-... image)
          Elevated Logo & Institutional Name in the Left Corner
      ══════════════════════════════════════════════════════ */}
      <div className="kia-login-left hidden md:flex relative md:w-[54%] lg:w-[58%] h-full flex-col justify-between p-8 lg:p-12 overflow-hidden bg-slate-900 text-white">

        {/* College Campus Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-100"
          style={{ backgroundImage: `url(${campusImage})` }}
        />

        {/* Subtle Bottom Ambient Gradient for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* ── Bottom-Left: Slogan ── */}
        <div className="relative z-10 mt-auto">
          <div className="w-10 h-1 bg-[#c5a059] mb-3 rounded-full shadow-sm" />
          <h2 className="text-2xl lg:text-3xl xl:text-[2.1rem] font-extrabold tracking-tight text-white leading-tight drop-shadow-md max-w-lg">
            Pioneering agricultural education and academic excellence.
          </h2>
          <p className="text-slate-200/90 text-sm mt-2 max-w-md leading-relaxed font-normal drop-shadow">
            Empowering the next generation of agri-technologists and leaders.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          RIGHT HALF (42%) – Static Pure White Login Form
          No placeholders, No icons inside input boxes
      ══════════════════════════════════════════════════════ */}
      <div className="kia-login-right relative flex flex-col justify-center items-center w-full md:w-[46%] lg:w-[42%] h-full bg-white px-8 sm:px-12 lg:px-14 xl:px-16 overflow-hidden">

        <div className="w-full max-w-sm">

          {/* Institution wordmark */}
          <div className="flex justify-start mb-8">
            <img
              src={kiaLogo}
              alt="Kumaraguru Institute of Agriculture"
              className="w-44 max-w-full h-auto object-contain object-left"
            />
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              LOGIN
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email / Username field (No icon inside, No placeholder) */}
            <div>
              <label
                className="block text-slate-800 text-xs font-bold uppercase tracking-wider mb-2"
                htmlFor="kia-identifier"
              >
                Your email or username
              </label>
              <input
                id="kia-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-[#275a43] focus:ring-4 focus:ring-[#275a43]/15 rounded-xl text-slate-900 text-sm font-medium transition-all shadow-xs outline-none"
              />
            </div>

            {/* Password field (No icon inside, No placeholder) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-slate-800 text-xs font-bold uppercase tracking-wider"
                  htmlFor="kia-password"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact the KIA IT Helpdesk or your department coordinator.')}
                  className="text-xs font-semibold text-[#275a43] hover:text-[#1e4835] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="kia-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 pr-11 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-[#275a43] focus:ring-4 focus:ring-[#275a43]/15 rounded-xl text-slate-900 text-sm font-medium transition-all shadow-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Keep me logged in */}
            <div className="flex items-center pt-0.5">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#275a43] focus:ring-[#275a43] accent-[#275a43] cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-slate-600 cursor-pointer">
                Keep me logged in
              </label>
            </div>

            {/* Login Button */}
            <button
              id="kia-login-submit"
              type="submit"
              className="w-full py-3 px-4 bg-[#275a43] hover:bg-[#1e4835] active:bg-[#183a2b] text-white font-bold text-sm tracking-wide rounded-xl shadow-md hover:shadow-lg hover:shadow-[#275a43]/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 pt-1 pb-1">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Admissions button */}
            <button
              id="kia-admissions-btn"
              type="button"
              onClick={() => window.open('https://kia.ac.in', '_blank')}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-300 hover:border-slate-400 font-semibold text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue with Admissions</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              KIA &nbsp;·&nbsp; Secure Academic Portal
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
