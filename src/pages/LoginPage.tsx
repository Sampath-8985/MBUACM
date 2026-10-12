import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Shield, AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react';

// Admin-only sign in (route: /admin/login)
export const LoginPage: React.FC = () => {
  const { isAdmin, isLoading, loginWithGoogle, loginWithEmail, loginDemoAdmin, isFirebaseConnected } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const target = redirect && redirect.startsWith('/admin') ? redirect : '/admin';

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && isAdmin) navigate(target, { replace: true });
  }, [isAdmin, isLoading, navigate, target]);

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    const res = await loginWithGoogle();
    setSubmitting(false);
    if (res.success) {
      navigate(target, { replace: true });
    } else {
      setError(res.error || 'Sign-in failed.');
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await loginWithEmail(email, password);
    setSubmitting(false);
    if (res.success) {
      navigate(target, { replace: true });
    } else {
      setError(res.error || 'Sign-in failed.');
    }
  };

  const handleDemo = () => {
    loginDemoAdmin();
    navigate(target, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Checking session..." />
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-acm-blue via-cyan-400 to-acm-light shadow-glow">
          <img src="/logo.png" alt="MBU ACM Logo" className="w-full h-full object-contain rounded-full bg-navy-950 p-1" />
        </div>
        <h1 className="mt-6 font-display font-black text-3xl text-white tracking-tight">Admin Sign In</h1>
        <p className="mt-2 text-sm text-slate-400">
          This area is only for MBU ACM chapter admins.
        </p>

        <div className="mt-8 glass-panel p-6 border border-slate-800 space-y-4 text-left">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 text-rose-200 border border-rose-500/40 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isFirebaseConnected ? (
            <>
              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-email"
                      type="email"
                      required
                      autoComplete="username"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-acm-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span>{submitting ? 'Signing in...' : 'Sign in'}</span>
                </button>
              </form>

              <div className="flex items-center gap-3 py-1">
                <span className="flex-1 h-px bg-slate-800" />
                <span className="text-xs text-slate-500">or</span>
                <span className="flex-1 h-px bg-slate-800" />
              </div>

            <button
              onClick={handleGoogle}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
                <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.7l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
              <span>Continue with Google</span>
            </button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-xl p-3">
                Firebase keys are not set, so the site is running in local demo mode. Add your keys to <code>.env</code> to enable Google sign-in.
              </p>
              <button onClick={handleDemo} className="btn-acm-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Continue as Demo Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
