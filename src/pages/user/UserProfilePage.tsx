import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/profiles';
import { BRANCH_OPTIONS, ACADEMIC_YEAR_OPTIONS } from '../../types';
import { 
  User, 
  Mail, 
  Hash, 
  GraduationCap, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Save
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [branch, setBranch] = useState(profile?.branch || BRANCH_OPTIONS[0]);
  const [academicYear, setAcademicYear] = useState(profile?.academic_year || ACADEMIC_YEAR_OPTIONS[0]);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.phone) setPhone(profile.phone);
      if (profile.branch) setBranch(profile.branch);
      if (profile.academic_year) setAcademicYear(profile.academic_year);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFeedback(null);

    if (!fullName.trim()) {
      setFeedback({ type: 'error', message: 'Full name cannot be blank.' });
      return;
    }

    setLoading(true);
    try {
      const res = await updateProfile(user.id, {
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
        branch,
        academic_year: academicYear,
      });

      if (res.success) {
        await refreshProfile();
        setFeedback({ type: 'success', message: 'Profile details updated successfully.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'An error occurred while updating profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to User Dashboard</span>
        </Link>

        <div className="glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3.5 pb-6 border-b border-slate-800 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-acm-cyan">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-white">
                Student Profile Information
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage your Mohan Babu University chapter account data.
              </p>
            </div>
          </div>

          {feedback && (
            <div className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-start gap-2.5 mb-6 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/40'
                : 'bg-rose-950/70 text-rose-200 border border-rose-500/40'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Read-Only Account Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Account Email (Non-editable)
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

            {/* Read-Only Roll Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                University Roll Number
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value={profile?.roll_number || 'Not Set'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/40 border border-slate-800 text-slate-300 text-sm font-mono uppercase cursor-not-allowed select-none"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Roll number is uniquely mapped to your student record. Contact chapter admin to change.
              </span>
            </div>

            {/* Editable Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Branch / Specialization
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                >
                  {BRANCH_OPTIONS.map((b) => (
                    <option key={b} value={b} className="bg-navy-900 text-white">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Academic Year
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                >
                  {ACADEMIC_YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y} className="bg-navy-900 text-white">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number
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

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-acm-primary px-6 py-2.5 text-sm"
              >
                {loading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
