import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import { DemoBanner } from './components/layout/DemoBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { GalleryPage } from './pages/GalleryPage';
import { CrewPage } from './pages/CrewPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { CompleteProfilePage } from './pages/CompleteProfilePage';

// User Portal Pages
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { UserProfilePage } from './pages/user/UserProfilePage';

// Admin Portal Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminEventFormPage } from './pages/admin/AdminEventFormPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminCrewPage } from './pages/admin/AdminCrewPage';
import { AdminRegistrationsPage } from './pages/admin/AdminRegistrationsPage';
import { AdminContactSubmissionsPage } from './pages/admin/AdminContactSubmissionsPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 font-sans selection:bg-acm-cyan selection:text-navy-950">
          {/* Demo status & role switcher banner */}
          <DemoBanner />

          {/* Main Chapter Navigation */}
          <Navbar />

          {/* Main Routing Content */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/crew" element={<CrewPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/complete-profile" element={<CompleteProfilePage />} />

              {/* User Dashboard & Profile */}
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/profile" element={<UserProfilePage />} />

              {/* Role-Protected Admin Portal */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/events" element={<AdminEventsPage />} />
              <Route path="/admin/events/new" element={<AdminEventFormPage />} />
              <Route path="/admin/events/edit/:id" element={<AdminEventFormPage />} />
              <Route path="/admin/gallery" element={<AdminGalleryPage />} />
              <Route path="/admin/crew" element={<AdminCrewPage />} />
              <Route path="/admin/registrations" element={<AdminRegistrationsPage />} />
              <Route path="/admin/contacts" element={<AdminContactSubmissionsPage />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Chapter Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
