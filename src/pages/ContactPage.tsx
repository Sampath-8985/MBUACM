import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { submitContact } from '../services/contact';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFeedback({ type: 'error', message: 'Please provide a valid email address.' });
      return;
    }

    setLoading(true);

    try {
      const res = await submitContact(formData);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Thank you! Your message has been sent to the MBU ACM executive committee. We will respond within 24-48 hours.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to submit your message. Please try again or email us directly.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'An error occurred while sending your message.',
      });
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'Who can register for MBU ACM events?',
      a: 'All enrolled undergraduate and postgraduate students of Mohan Babu University are eligible to register for chapter events, hackathons, and workshops.'
    },
    {
      q: 'Is chapter account creation free?',
      a: 'Yes! Creating an account on our chapter website and participating in internal student workshops is completely free.'
    },
    {
      q: 'How do I join the executive or technical crew?',
      a: 'We conduct annual chapter core team recruitment at the start of each academic year. Announcements will be posted on the website and broadcast to student emails.'
    },
    {
      q: 'Can companies partner or sponsor HackSprint 2026?',
      a: 'Yes, we collaborate with tech enterprises for hackathon tracks, API bounties, hiring fast-tracks, and technical keynotes. Reach out via the contact form with the subject "Sponsorship".'
    }
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-acm-cyan/15 text-acm-light border border-acm-cyan/30 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5 text-acm-cyan" />
            <span>Get in Touch</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
            Contact the ACM Chapter
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Have a question about upcoming events, hackathon registrations, membership, or industry collaboration? Drop us a note below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          
          {/* Contact Details & Info (Left 1 col) */}
          <div className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
              <h2 className="font-display font-bold text-xl text-white">
                Official Chapter Office
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-acm-cyan shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm">Campus Address</strong>
                    <span className="text-slate-400 leading-relaxed">
                      Department of Computer Science & Engineering, School of Computing, Mohan Babu University, Sree Sainath Nagar, Tirupati, AP - 517102
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm">Official Email</strong>
                    <a href="mailto:acm@mbu.asia" className="text-acm-light hover:underline">
                      acm@mbu.asia
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm">Response Time</strong>
                    <span className="text-slate-400">
                      Typically within 24 to 48 business hours
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 text-xs text-slate-400">
                <p className="flex items-center gap-1.5 text-acm-cyan font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> For Urgent Queries
                </p>
                <span>You can also reach out in person to ACM student coordinators at the Central Computing Lab during academic hours.</span>
              </div>
            </div>
          </div>

          {/* Contact Form (Right 2 cols) */}
          <div className="lg:col-span-2">
            <div className="glass-panel p-6 sm:p-8 border border-slate-800">
              <h2 className="font-display font-bold text-xl text-white mb-6">
                Send Us a Message
              </h2>

              {feedback && (
                <div className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-start gap-3 mb-6 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/40'
                    : 'bg-rose-950/70 text-rose-200 border border-rose-500/40'
                }`}>
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@mbu.asia"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subject <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inquiry regarding HackSprint 2026 Participation"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your message or inquiry here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-acm-primary px-6 py-2.5 text-sm"
                  >
                    {loading ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* FAQs */}
        <div className="glass-panel p-8 sm:p-12 border border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-acm-cyan" />
            <h2 className="font-display font-bold text-xl text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-navy-950/60 border border-slate-800">
                <h3 className="font-semibold text-sm text-white">{faq.q}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
