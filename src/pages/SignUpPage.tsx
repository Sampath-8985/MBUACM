import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  User, 
  AlertCircle, 
  Sparkles,
} from 'lucide-react';

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const SignUpPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await signup(email, password, fullName);
      if (res.success) {
        const target = redirectUrl
          ? `/complete-profile?redirect=${encodeURIComponent(redirectUrl)}`
          : '/complete-profile';
        navigate(target);
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        const target = redirectUrl
          ? `/complete-profile?redirect=${encodeURIComponent(redirectUrl)}`
          : '/complete-profile';
        navigate(target);
      } else {
        setError(res.error || 'Google Sign-up failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign-up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* Header with Official Circular Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-acm-blue via-cyan-400 to-acm-light shadow-glow mb-4">
            <img
              src="/logo.png"
              alt="MBU ACM Student Chapter Logo"
              className="w-full h-full object-contain rounded-full bg-navy-950 p-0.5"
            />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Join MBU ACM Chapter
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Create your student account to register for workshops and hackathons.
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In / Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg disabled:opacity-60 mb-5 border border-slate-200"
          >
            <GoogleIcon className="w-4 h-4 shrink-0" />
            <span>Sign Up with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-slate-700/80 w-full" />
            <span className="bg-navy-900 px-3 text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0">
              Or with Email
            </span>
            <div className="border-t border-slate-700/80 w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneha Reddy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. sneha@mbu.asia"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-acm-primary w-full py-2.5 text-sm mt-3"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account & Continue</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link
                to={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'}
                className="text-acm-cyan hover:underline font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
