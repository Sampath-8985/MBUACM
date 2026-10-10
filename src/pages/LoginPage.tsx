import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Shield, 
  User, 
  Sparkles,
} from 'lucide-react';
import { DEMO_ADMIN_PROFILE, DEMO_STUDENT_PROFILE } from '../lib/mockData';

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

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle, isFirebaseConnected } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.role === 'admin') {
          navigate('/admin');
        } else if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/');
        }
      } else {
        setError(result.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        if (res.role === 'admin') {
          navigate('/admin');
        } else if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/');
        }
      } else {
        setError(res.error || 'Google Sign-In failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign-in.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click test login helpers
  const handleFastDemoLogin = async (type: 'admin' | 'student') => {
    setError(null);
    setLoading(true);
    try {
      const demoEmail = type === 'admin' ? DEMO_ADMIN_PROFILE.email : DEMO_STUDENT_PROFILE.email;
      const result = await login(demoEmail, 'demo12345');
      if (result.success) {
        if (type === 'admin') {
          navigate('/admin');
        } else if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/');
        }
      }
    } catch (e: any) {
      setError(e.message || 'Quick demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* Card Header with Official Circular Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-acm-blue via-cyan-400 to-acm-light shadow-glow mb-4">
            <img
              src="/logo.png"
              alt="MBU ACM Student Chapter Logo"
              className="w-full h-full object-contain rounded-full bg-navy-950 p-0.5"
            />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Sign In to MBU ACM
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Access event registrations, your user dashboard, and chapter resources.
          </p>
        </div>

        {/* Demo Fast Login Helpers */}
        <div className="mb-6 p-4 rounded-2xl bg-navy-900/90 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2.5">
            <span className="flex items-center gap-1.5 text-acm-cyan">
              <Sparkles className="w-3.5 h-3.5" /> Fast Demo Access
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1-Click Test</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleFastDemoLogin('student')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium flex items-center justify-center gap-1.5 border border-slate-700/60 hover:border-acm-cyan/40 transition-all"
            >
              <User className="w-3.5 h-3.5 text-acm-cyan" />
              <span>Demo Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleFastDemoLogin('admin')}
              className="px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-xs text-purple-200 font-semibold flex items-center justify-center gap-1.5 border border-purple-500/30 hover:border-purple-400/60 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg disabled:opacity-60 mb-5 border border-slate-200"
          >
            <GoogleIcon className="w-4 h-4 shrink-0" />
            <span>Sign In with Google</span>
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
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@mbu.asia or admin@mbuacm.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-500">
                  {isFirebaseConnected ? 'Firebase Auth' : 'Any password for demo'}
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-acm-primary w-full py-2.5 text-sm mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In with Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              New to Mohan Babu University ACM?{' '}
              <Link
                to={redirectUrl ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : '/signup'}
                className="text-acm-cyan hover:underline font-semibold"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
