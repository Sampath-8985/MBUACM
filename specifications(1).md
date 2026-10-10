# MBU ACM Club Website — Specifications

## 1. Project Overview

Build a complete, responsive website for the ACM Student Chapter at Mohan Babu University (MBU). The website will represent the entire club, share club information, display crew members and events, and allow students to create accounts and register for events.

The system must include:
- A public-facing club website.
- Authentication for users and administrators.
- A user dashboard for profile details and event registrations.
- A separate, role-protected admin dashboard to manage crew details, events, and registrations.
- A database-backed content system so administrators can update information without editing source code.

## 2. Recommended Technology Stack

- **Frontend:** React with TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Authentication:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **File storage:** Supabase Storage for event posters and crew profile photos
- **Deployment:** A frontend hosting platform such as Vercel, with Supabase providing backend services

Use environment variables for public configuration. Never include privileged service-role keys in frontend code.

## 3. User Roles

### 3.1 Visitor
A visitor who has not logged in can:
- View Home, About, Events, Crew, and Contact Us pages.
- Open event detail pages.
- Follow an external registration link when one is provided.
- Use the contact form.
- Sign up or log in.

### 3.2 User / Student
A logged-in user can:
- Browse the same public website as visitors.
- Complete their profile the first time they sign in.
- Register for events using the website's internal registration process, when enabled.
- Follow an event's external registration link, when provided.
- View and edit permitted profile fields.
- View their event registration history and current registration status in their User Dashboard.
- Log out.

### 3.3 Admin
An authenticated administrator can:
- Access the Admin Dashboard.
- View summary counts for events, crew members, and registrations.
- Add, edit, and remove crew members.
- Create, edit, publish, unpublish, complete, and delete events.
- Upload and replace event posters.
- Set event dates, registration deadlines, venue, descriptions, and registration links.
- View registrations for each event.
- Review contact form submissions, if this feature is enabled.
- Log out.

Admin access must be granted securely by an authorized administrator. Users must not be able to assign themselves the admin role through the signup page, profile form, browser state, or direct client-side requests.

## 4. Public Website Pages

### 4.1 Home
The homepage should introduce MBU ACM and make it easy to discover club activities.

Include:
- Header with ACM club branding and primary navigation.
- Hero section with a short introduction and a relevant call to action.
- Brief club introduction.
- Featured or upcoming events, loaded from the database.
- Selected crew members or club leadership highlights.
- Announcements or activity highlights, if available.
- Footer containing contact details and relevant social links.

### 4.2 About
Include:
- Introduction to the MBU ACM Student Chapter.
- Club mission and objectives.
- Activities such as technical events, workshops, talks, and hackathons.
- Club achievements or highlights, when information is available.

Content should be easy to update as the club evolves.

### 4.3 Events
Display published events in a responsive card layout.

Each card should show, when available:
- Event poster or placeholder image.
- Event title.
- Short description.
- Date and time.
- Venue or online event label.
- Registration status or deadline.
- A button to view event details.

The Events page should support filtering or separating upcoming and past events. Draft and unpublished events must not appear publicly.

### 4.4 Event Details
Each event should have a detail view containing:
- Full event title and description.
- Poster.
- Start and end date/time.
- Venue or online meeting information.
- Eligibility or participation instructions, if provided.
- Registration deadline, if applicable.
- Registration method and button.

Registration behavior:
- **Internal registration:** The logged-in user can register through the website. The registration should be saved in the database. If the user is not logged in, direct them to log in and then return them to the event.
- **External registration:** Open the registration URL supplied by the admin. Clearly identify that registration is handled externally.
- Prevent duplicate internal registrations for the same user and event.
- Do not allow new registrations after the registration deadline or when an event is not accepting registrations.
- Display a clear success, failure, closed, or already-registered state.

### 4.5 Crew
Display club crew members using database records.

Each crew profile may contain:
- Name.
- Role or designation.
- Profile photo.
- Branch and academic year, if appropriate.
- Short biography.
- Social or professional profile links, if provided.
- Display order.

Only active/published crew records should be visible to the public. If no photo is available, display a consistent placeholder.

### 4.6 Contact Us
Display the club's approved contact email, social links, and other official contact information.

Include a form with:
- Name.
- Email.
- Subject.
- Message.

Validate required fields and email format. Show success and error messages. Store submissions securely if persistence is implemented, and make them visible only to authorized admins. Add basic spam protection or rate limiting where supported.

### 4.7 Login and Sign Up
Provide a clear login and account creation interface.

Required behavior:
- Users can sign up and log in using the chosen Supabase Auth method.
- Show understandable validation and authentication errors.
- Handle email verification if enabled in Supabase.
- Provide logout functionality.
- After login, determine the authenticated account's role securely.
- Redirect admins to the Admin Dashboard.
- Redirect normal users to the public homepage, preserving the intended destination when necessary.
- Never trust a role value supplied by the browser or signup form.

## 5. First-Time Student Profile

After a user signs in for the first time, check whether their student profile has been completed. If it has not, redirect them to a profile-completion page before allowing them to register for events or use profile-dependent features.

Collect:
- Full name — required.
- Email address — obtained from the authenticated account; show it for confirmation and do not allow it to become a mismatched account identity.
- Roll number — required.
- Branch / department — required; use a configured dropdown where possible.
- Current academic year — required; use a configured dropdown.
- Phone number — optional unless the club decides it is required.

Requirements:
- Link the student profile to the authenticated user's unique ID.
- Validate required fields and trim unnecessary whitespace.
- Prevent duplicate roll numbers where appropriate.
- Save the profile in the database.
- Do not ask users to complete the same profile again after it is saved.
- Allow users to update permitted fields later from their User Dashboard.
- Protect profile records so users can read and edit only their own profile, while authorized admins can view the information needed to manage event registrations.

## 6. User Dashboard

The User Dashboard should be available from the logged-in user's profile menu, while the main website remains the same public-facing website.

Include:
- Welcome message and profile summary.
- View and edit profile information.
- List of events the user has registered for internally.
- Registration details such as event name, date, registration date, and status.
- Links to event details.
- Helpful empty state when the user has not registered for any events.
- Logout action.

For events registered through an external form, do not claim that the website has confirmed registration unless an external verification process exists. The site may show the external registration link for reference.

## 7. Admin Dashboard

The Admin Dashboard must be accessible only to authenticated accounts with the admin role. Direct navigation to an admin URL by a normal user must be denied, and server-side/database permissions must enforce the same restriction.

### 7.1 Overview
Show summary cards such as:
- Total events.
- Published/upcoming events.
- Total crew members.
- Total internal event registrations.

Use real database counts rather than hardcoded numbers.

### 7.2 Crew Management
The admin should be able to:
- View all crew records.
- Add a crew member.
- Edit a crew member's details.
- Upload or replace a profile photo.
- Change display order and visibility.
- Remove a crew member after a confirmation prompt.

Validate records and show clear success/error feedback.

### 7.3 Event Management
Provide an event management list and a form to create or edit events.

Event fields:
- Event title — required.
- Short summary — optional but recommended.
- Full description — required.
- Event poster — upload image; provide a preview before saving.
- Start date and time — required.
- End date and time — required where applicable and must not be earlier than the start.
- Venue or online event details.
- Registration deadline — optional but must be valid if supplied.
- Registration method: internal registration or external URL.
- External registration link — required when external registration is selected.
- Eligibility or instructions — optional.
- Event status: Draft, Published, Completed, or Cancelled.
- Registration enabled/disabled state, where needed.

Admin actions:
- Create draft.
- Publish event.
- Edit an existing event.
- Unpublish an event.
- Mark an event as completed or cancelled.
- Delete an event after a confirmation prompt.
- View registrations for an event.

Rules:
- Only published events appear on the public website.
- Updates should appear on the public website without requiring a code change or redeployment.
- Validate URLs and date/time values.
- Confirm destructive actions before deletion.
- Prefer soft cancellation or status updates for events that already have registrations, so that registration records are not lost without warning.

### 7.4 Registration Management
The admin can select an event and view its internal registrations.

Display relevant fields such as:
- Student name.
- Roll number.
- Branch.
- Academic year.
- Email.
- Registration date/time.
- Registration status, if statuses are supported.

Provide search or basic filtering if practical. Restrict this section to admins. Do not expose student lists publicly.

### 7.5 Contact Submissions
If contact form submissions are saved, allow admins to view and mark them as reviewed. These records must remain private to authorized admins.

## 8. Data Model

Use relational database tables with suitable IDs, timestamps, constraints, and foreign keys. A suggested schema is below; the implementation may refine it as long as all required behavior is supported.

### `profiles`
- `id` — primary key matching the authenticated user's ID.
- `full_name` — required.
- `email` — linked to the authenticated account.
- `roll_number` — required; unique where appropriate.
- `branch` — required.
- `academic_year` — required.
- `phone` — optional.
- `profile_completed` — boolean or equivalent completion state.
- `created_at`, `updated_at`.

### `user_roles` or secure role metadata
- User ID.
- Role, such as `user` or `admin`.
- Created/updated timestamps as appropriate.

Role changes must be available only through a secure admin process, not ordinary profile editing.

### `crew_members`
- `id`.
- `name`.
- `role` / `designation`.
- `branch` — optional.
- `academic_year` — optional.
- `photo_url` — optional.
- `bio` — optional.
- `social_links` — optional structured fields or JSON.
- `display_order`.
- `is_published`.
- `created_at`, `updated_at`.

### `events`
- `id`.
- `title`.
- `summary` — optional.
- `description`.
- `poster_url` — optional.
- `start_at`.
- `end_at`.
- `venue` — optional.
- `registration_deadline` — optional.
- `registration_type` — internal or external.
- `registration_url` — required for external registration.
- `eligibility_or_instructions` — optional.
- `status` — draft, published, completed, or cancelled.
- `registration_enabled`.
- `created_by` — admin user ID.
- `created_at`, `updated_at`.

### `event_registrations`
- `id`.
- `event_id` — foreign key to events.
- `user_id` — foreign key to the authenticated user/profile.
- `registered_at`.
- `status` — optional, such as registered or cancelled.
- Unique constraint on (`event_id`, `user_id`) to prevent duplicate registrations.

### `contact_submissions` (if persisted)
- `id`.
- `name`.
- `email`.
- `subject`.
- `message`.
- `status` — for example, new or reviewed.
- `created_at`.

## 9. Security and Data Permissions

Use Supabase Row Level Security (RLS) and database policies to enforce access control. Frontend route checks improve user experience but are not a security boundary by themselves.

Required access principles:
- Public visitors can read published events and published crew profiles.
- Only admins can create, update, publish, unpublish, or delete events and crew records.
- Users can read and edit only their own profile, except for fields managed by administrators.
- Users can create and view their own internal registrations.
- Users cannot register another user or bypass event registration rules.
- Only admins can read registration lists across users.
- Only admins can read contact form submissions.
- Private uploads and sensitive records must not be publicly accessible without an explicit policy.
- Validate all inputs in the application and enforce important constraints in the database.
- Do not store passwords directly in the application database; use Supabase Auth.

## 10. File Uploads

Use Supabase Storage for event posters and crew photos.

Requirements:
- Accept suitable image formats such as PNG, JPEG, and WebP.
- Enforce reasonable file-size limits.
- Validate file type and size.
- Display an image preview before or after upload.
- Store the resulting path/URL in the corresponding database record.
- Restrict upload, update, and delete operations to admins.
- Use placeholders if an image is absent or fails to load.

## 11. Design and User Experience

- Use a clean, modern, professional visual identity suitable for a university ACM chapter.
- Keep navigation consistent across public pages.
- Make the layout responsive on desktop, tablet, and mobile.
- Use reusable components for navigation, event cards, crew cards, form fields, buttons, dialogs, and notifications.
- Provide loading, success, error, and empty states.
- Use accessible labels, keyboard-friendly controls, visible focus indicators, appropriate contrast, and useful image alternative text.
- Format dates and times consistently and use the intended local timezone for event display.
- Show clear confirmation before destructive operations.
- Avoid hardcoded production events, crew members, account roles, and dashboard totals.

## 12. Non-Functional Requirements

- Maintainable component and folder structure.
- Type-safe data handling with TypeScript.
- Shared validation for common forms.
- Clear error handling without exposing secrets or database internals.
- Reasonable loading performance and appropriately sized images.
- No dead navigation links or inert primary actions.
- Keep environment secrets out of source control.
- Include setup instructions and a `.env.example` file with placeholder values only.

## 13. Suggested Project Structure

```text
src/
  components/
    layout/
    navigation/
    events/
    crew/
    forms/
    ui/
  pages/
    HomePage.tsx
    AboutPage.tsx
    EventsPage.tsx
    EventDetailsPage.tsx
    CrewPage.tsx
    ContactPage.tsx
    LoginPage.tsx
    SignUpPage.tsx
    CompleteProfilePage.tsx
    user/
      UserDashboardPage.tsx
      UserProfilePage.tsx
      UserRegistrationsPage.tsx
    admin/
      AdminDashboardPage.tsx
      AdminCrewPage.tsx
      AdminEventsPage.tsx
      AdminEventFormPage.tsx
      AdminRegistrationsPage.tsx
      AdminContactSubmissionsPage.tsx
  hooks/
  lib/
    supabase.ts
    auth.ts
    validation.ts
  services/
    profiles.ts
    events.ts
    crew.ts
    registrations.ts
  types/
  App.tsx
  main.tsx
supabase/
  migrations/
public/
```

This is a suggested organization. Adjust it as the project grows without putting all pages, database logic, and authentication in a single component.

## 14. Acceptance Criteria

The project is considered ready when:

1. The public Home, About, Events, Crew, and Contact Us pages work on desktop and mobile.
2. Visitors can create accounts and log in.
3. New users are prompted to complete their student profile once, and their profile persists on later visits.
4. Normal users land on the public homepage after login and can open their User Dashboard.
5. Admins use the same login page but are redirected to the Admin Dashboard based on their securely stored role.
6. Normal users cannot access admin functionality through direct URLs or database requests.
7. Admins can add, edit, publish, unpublish, and manage events without editing application code.
8. Published event changes appear on the public Events page from the database.
9. Admins can upload posters and manage crew profiles and photos.
10. Users can complete internal registrations, and duplicate registrations are prevented.
11. External registration links open correctly and are clearly distinguished from internal registration.
12. Admins can view registrations for each event, while ordinary users cannot access other students' registration details.
13. Form validation, loading states, empty states, and success/error messages are implemented.
14. Supabase RLS policies protect profiles, roles, events, crew, registrations, and contact submissions.
15. Setup and deployment instructions are documented, with no privileged secrets committed to the repository.

## 15. Implementation Order

1. Set up the frontend project, responsive layout, routing, and public pages.
2. Configure Supabase, authentication, database schema, and RLS policies.
3. Implement first-time profile completion and role-based redirects.
4. Build User Dashboard and profile management.
5. Build Admin Dashboard and crew management.
6. Build event creation, editing, publication, poster uploads, and registration management.
7. Connect event registration and contact form workflows.
8. Test visitor, user, and admin journeys, including permission-denied cases.
9. Deploy the frontend and configure production environment variables and Supabase settings.

## Final Goal

Deliver a complete and maintainable MBU ACM club website where visitors can learn about the club, students can create profiles and register for events, and authorized admins can manage club crew information, events, posters, registration links, and student registrations through a secure dashboard.
