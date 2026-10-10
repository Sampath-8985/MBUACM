export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  roll_number?: string;
  branch?: string;
  academic_year?: string;
  phone?: string;
  profile_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  branch?: string;
  academic_year?: string;
  photo_url?: string;
  bio?: string;
  social_links?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
  };
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export type EventStatus = 'draft' | 'published' | 'completed' | 'cancelled';
export type RegistrationType = 'internal' | 'external';
export type EventCategory = 'hackathon' | 'workshop' | 'talk' | 'contest' | 'general';

export interface ClubEvent {
  id: string;
  title: string;
  summary?: string;
  description: string;
  poster_url?: string;
  start_at: string;
  end_at: string;
  venue?: string;
  registration_deadline?: string;
  registration_type: RegistrationType;
  registration_url?: string;
  eligibility_or_instructions?: string;
  status: EventStatus;
  registration_enabled: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  category?: EventCategory;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
  status: 'registered' | 'attended' | 'cancelled';
  event?: ClubEvent;
  profile?: UserProfile;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'reviewed' | 'archived';
  created_at: string;
}

export interface EventGalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  uploaded_at?: string;
}

export interface EventGalleryItem {
  id: string;
  event_id?: string;
  title: string;
  event_date: string;
  academic_year?: string;
  category: EventCategory;
  summary: string;
  description: string;
  cover_image_url: string;
  photos: EventGalleryPhoto[];
  attendees_count?: number;
  highlights?: string[];
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export const BRANCH_OPTIONS = [
  'Computer Science & Engineering (CSE)',
  'CSE (Artificial Intelligence & Machine Learning)',
  'CSE (Data Science)',
  'CSE (Cyber Security)',
  'CSE (Cloud Computing)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'MCA / Master of Computer Applications',
  'Other / Interdisciplinary'
];

export const ACADEMIC_YEAR_OPTIONS = [
  '1st Year (B.Tech)',
  '2nd Year (B.Tech)',
  '3rd Year (B.Tech)',
  '4th Year (B.Tech)',
  'Postgraduate / Research Scholar'
];
