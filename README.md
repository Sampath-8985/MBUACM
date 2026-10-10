# 🚀 Mohan Babu University (MBU) — ACM Student Chapter Website

Welcome to the official web application for the **ACM Student Chapter at Mohan Babu University (MBU)**. This platform represents the entire chapter, showcases leadership and events, and allows students to complete their academic profiles, register for workshops and hackathons, download digital event passes, and allows authorized administrators to manage events, crew members, and student registration rosters through a secure admin portal.

---

## 🌟 Key Highlights & Features

### 1. 🌐 Public Website
- **Home Page (`/`)**:
  - High-impact dark & illuminated ACM cyber aesthetic (Cyan, Electric Blue, Deep Navy).
  - Chapter metrics counter (500+ Active Members, 25+ Annual Events, ₹1.5L+ Prizes, 100% Student Mentored).
  - The Four Pillars of ACM MBU (Hackathons, Cutting-edge Workshops, Competitive Programming, Research & Mentorship).
  - Featured upcoming events loaded dynamically from the database.
  - Executive leadership spotlight.
- **About Page (`/about`)**:
  - Chapter background, Dean/Faculty sponsor vision, mission & vision statements.
  - Pillars and annual milestones at Mohan Babu University.
- **Events & Hackathons (`/events`)**:
  - Real-time search by title, venue, or keywords.
  - Filter tabs: **Upcoming Events**, **Past Events**, and **All Events**.
  - Category tags: Hackathons, Workshops, Tech Talks, Contests.
  - Status badges: *Open Now*, *Registered*, *Registrations Closed*, *Completed*.
- **Event Details (`/events/:id`)**:
  - Full-resolution visual banner poster.
  - Date, time, venue, eligibility instructions, and registration deadline countdown.
  - **1-Click Internal Registration** with duplicate registration guards and celebration confetti animation (`canvas-confetti`).
  - **External Registration Handling** with dedicated external portal indicator and safe redirect.
- **Executive Crew (`/crew`)**:
  - Roster of chapter crew members with photos, designations, branch, academic year, bios, and social links (LinkedIn, GitHub, Twitter, Email).
- **Contact Us (`/contact`)**:
  - Official university address: *Mohan Babu University, Sree Sainath Nagar, Tirupati, Andhra Pradesh - 517102*.
  - Validated contact inquiry form storing submissions securely for admin review.
  - Frequently Asked Questions (FAQ) for prospective members and sponsors.

---

### 2. 🎓 Student Hub & User Dashboard
- **First-Time Profile Onboarding (`/complete-profile`)**:
  - Mandatory prompt on first login before event registration.
  - Collects Full Name, Roll Number (unique), Branch / Specialization dropdown, Academic Year dropdown, Phone number.
  - Persisted in database and never requested again once saved.
- **User Dashboard (`/dashboard`)**:
  - Welcome banner with student profile summary and branch details.
  - Registered events timeline with venue details.
  - **Digital Event Pass Modal**: Generates a student pass with unique ID, attendee info, and verification QR graphic for event desk entry.
  - Registration cancellation option to release seats.
- **Profile Management (`/profile`)**:
  - View and update permitted student profile fields.

---

### 3. 🛡️ Role-Protected Admin Command Center
Accessible only to accounts with the securely verified `admin` role:
- **Admin Overview (`/admin`)**:
  - Real-time database count cards: Total Events, Upcoming Events, Crew Members, Registrations, and Inquiries.
  - Quick action shortcuts.
  - Recent registration activity feed.
- **Event Management (`/admin/events`)**:
  - Complete list of events including drafts and unpublished items.
  - 1-click **Publish / Unpublish** toggle.
  - Create and edit events with **Poster Upload** preview.
  - Configure start/end dates, registration deadlines, internal vs external registration mode, and acceptance toggle.
  - Permanent delete with confirmation modal (`ConfirmModal`).
- **Crew Management (`/admin/crew`)**:
  - Add and update executive crew members.
  - Upload profile photos with instant preview.
  - Set custom display order priority and toggle public visibility.
  - Remove crew members with confirmation prompt.
- **Registration Management (`/admin/registrations`)**:
  - Filter student rosters by event.
  - Search attendees by name, roll number, or email.
  - **Export Roster to CSV** for on-ground attendance and printing.
- **Contact Inquiries Review (`/admin/contacts`)**:
  - Review messages sent through the contact form.
  - Mark status as *New*, *Reviewed*, or *Archived*.
  - Reply via direct email client link.

---

### 4. ⚡ Dual-Mode Hybrid Architecture
The application runs out of the box in **Interactive Hybrid Demo Mode** (with pre-loaded events, crew, gallery albums, and demo user accounts) and seamlessly switches to **Live Firebase** when credentials are configured:
- **Demo Mode**: Includes a top status bar allowing instant switching between **Student View** and **Admin View** with 1 click. You can test both email and Google authentication instantly. All created events, registered events, and edits persist in browser `localStorage`.
- **Firebase Mode**: Automatically activates when Firebase credentials (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.) are provided in `.env`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 with TypeScript |
| **Build Tool & Bundler** | Vite 8 |
| **Styling** | Tailwind CSS v3 (Custom ACM dark theme, glassmorphism, glow effects) |
| **Routing** | React Router v7 |
| **Icons** | Lucide React + Custom Brand SVGs |
| **Animations** | Tailwind Keyframes & Canvas Confetti |
| **Backend & Auth** | Firebase Auth (Email/Password + Google Sign-In) & Cloud Firestore |
| **File Storage** | Firebase Storage (`event-posters`, `crew-photos`, `gallery-photos`) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Run Locally in Development Mode
```bash
# Clone or navigate to the directory
cd "MBU ACM"

# Install dependencies (if not already installed)
npm install

# Start the Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔥 Firebase Setup & Configuration

To connect your live Firebase project:

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication**:
   - Go to **Build -> Authentication -> Sign-in method**.
   - Enable **Email/Password**.
   - Enable **Google** (add your project support email and save).
3. Enable **Cloud Firestore**:
   - Go to **Build -> Firestore Database -> Create database** (start in Test mode or configure production security rules).
4. Enable **Firebase Storage**:
   - Go to **Build -> Storage -> Get started**.
5. Register a Web App in Firebase Console:
   - Go to **Project Settings -> General -> Your apps -> Web app (</>)**.
   - Copy your `firebaseConfig` object and add them to `.env`:
```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
```
6. Start/Restart your dev server (`npm run dev`). The top banner will immediately show `🟢 Live Firebase Connected`!

---

## 🧪 Testing Roles in Demo Mode

If evaluating locally before connecting Supabase:
- **Test as Student**: Click **"Student View"** in the top demo bar, or log in with `student@mbu.asia` (password: any string). You can register for events, view your pass in `/dashboard`, and update your profile.
- **Test as Admin**: Click **"Admin View"** in the top demo bar, or log in with `admin@mbuacm.ac.in` (password: any string). You can access `/admin`, create/edit events, publish/unpublish, manage crew, and download CSV rosters.
- **Reset Demo Data**: Click **"Reset Demo"** in the top bar anytime to restore the default seed data.

---

## 📂 Project Directory Structure

```text
├── public/
│   ├── favicon.svg             # Custom ACM Diamond SVG favicon
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── ScrollToTop.tsx # Smooth route scroll restoration
│   │   ├── crew/
│   │   │   └── CrewCard.tsx    # Responsive crew profile card
│   │   ├── events/
│   │   │   └── EventCard.tsx   # Event card with badges & deadlines
│   │   ├── layout/
│   │   │   ├── DemoBanner.tsx  # Interactive mode & role switcher
│   │   │   ├── Navbar.tsx      # Header navigation & user dropdown
│   │   │   ├── Footer.tsx      # Chapter address, links & credits
│   │   │   └── AdminLayout.tsx # Role-protected admin shell
│   │   └── ui/
│   │       ├── ConfirmModal.tsx# Confirmation dialog for delete actions
│   │       ├── LoadingSpinner.tsx
│   │       └── SocialIcons.tsx # GitHub, LinkedIn, X, Instagram SVGs
│   ├── context/
│   │   └── AuthContext.tsx     # Firebase auth, Google OAuth & persona state
│   ├── lib/
│   │   ├── firebase.ts         # Firebase App, Auth, Firestore & Storage
│   │   └── mockData.ts         # Seed data for MBU ACM events, crew & gallery
│   ├── pages/
│   │   ├── HomePage.tsx        # Hero, metrics, pillars, upcoming events
│   │   ├── AboutPage.tsx       # Mission, vision, achievements
│   │   ├── EventsPage.tsx      # Filterable events grid & search
│   │   ├── EventDetailsPage.tsx# Poster, 1-click registration, tickets
│   │   ├── CrewPage.tsx        # Executive leadership roster
│   │   ├── ContactPage.tsx     # Contact form & FAQ
│   │   ├── LoginPage.tsx       # Auth with role-based routing
│   │   ├── SignUpPage.tsx      # Account creation
│   │   ├── CompleteProfilePage.tsx # Student onboarding
│   │   ├── user/
│   │   │   ├── UserDashboardPage.tsx # Registered events & digital pass
│   │   │   └── UserProfilePage.tsx   # Profile editor
│   │   └── admin/
│   │       ├── AdminDashboardPage.tsx# Metrics & activity feed
│   │       ├── AdminEventsPage.tsx   # Event management table
│   │       ├── AdminEventFormPage.tsx# Create/edit event form
│   │       ├── AdminCrewPage.tsx     # Crew roster management
│   │       ├── AdminRegistrationsPage.tsx # Roster & CSV export
│   │       └── AdminContactSubmissionsPage.tsx # Inquiry review
│   ├── services/
│   │   ├── contact.ts
│   │   ├── crew.ts
│   │   ├── events.ts
│   │   ├── profiles.ts
│   │   ├── registrations.ts
│   │   ├── storage.ts
│   │   └── store.ts            # Persistent LocalStorage layer
│   ├── types/
│   │   └── index.ts            # Schema types & constants
│   ├── App.tsx                 # App routes and layout
│   ├── index.css               # Tailwind base & glassmorphism classes
│   └── main.tsx
├── supabase/
│   └── migrations/
│       └── 20250101000000_mbu_acm_init.sql # Complete PostgreSQL DDL & RLS
├── .env.example
├── tailwind.config.js
└── package.json
```

---

## 🛡️ License & Copyright
Developed for the **ACM Student Chapter at Mohan Babu University (MBU)**. All rights reserved.
