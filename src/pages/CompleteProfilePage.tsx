import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRANCH_OPTIONS, ACADEMIC_YEAR_OPTIONS } from '../types';
import { completeStudentProfile } from '../services/profiles';
import { 
  UserCheck, 
  Hash, 
  GraduationCap, 
  Calendar, 
  Phone, 
  Mail, 
  AlertCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CompleteProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [rollNumber, setRollNumber] = useState(profile?.roll_number || '');
  const [branch, setBranch] = useState(profile?.branch || BRANCH_OPTIONS[0]);
  const [academicYear, setAcademicYear] = useState(profile?.academic_year || ACADEMIC_YEAR_OPTIONS[0]);
  const [phone, setPhone] = useState(profile?.phone || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.roll_number) setRollNumber(profile.roll_number);
      if (profile.branch) setBranch(profile.branch);
      if (profile.academic_year) setAcademicYear(profile.academic_year);
      if (profile.phone) setPhone(profile.phone);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('You must be logged in to complete your profile.');
      return;
    }

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    if (!rollNumber.trim()) {
      setError('University Roll Number is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await completeStudentProfile(user.id, {
        full_name: fullName.trim(),
        roll_number: rollNumber.trim().toUpperCase(),
        branch,
        academic_year: academicYear,
        phone: phone.trim() || undefined,
      });

      if (res.success) {
        await refreshProfile();
        // Return to preserved destination or user dashboard
        if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.error || 'Failed to complete profile.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving your profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-acm-blue to-cyan-400 p-0.5 shadow-glow mb-4">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center text-acm-light">
              <UserCheck className="w-7 h-7" />
            </div>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Complete Your Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Please link your Mohan Babu University academic details. This enables 1-click registration for all chapter hackathons and workshops.
          </p>
        </div>

        {/* Profile Card Form */}
        <div className="glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Email (Read-only confirmation) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Account Email (Linked)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/40 border border-slate-800 text-slate-400 text-sm cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aditya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
              />
            </div>

            {/* University Roll Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                University Roll Number / Reg. ID <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 231FA04189"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm uppercase font-mono tracking-wider focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Must match your Mohan Babu University student ID card.
              </span>
            </div>

            {/* Branch / Department Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Branch / Specialization <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan appearance-none"
                >
                  {BRANCH_OPTIONS.map((b) => (
                    <option key={b} value={b} className="bg-navy-900 text-white">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Academic Year Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Academic Year <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan appearance-none"
                >
                  {ACADEMIC_YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y} className="bg-navy-900 text-white">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone Number (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number <span className="text-slate-500 text-[11px]">(Optional for event WhatsApp alerts)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-acm-primary w-full py-3 text-sm font-semibold shadow-glow"
              >
                {loading ? (
                  <span>Saving Profile...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Save Profile & Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
