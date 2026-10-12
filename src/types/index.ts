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
// Categories are managed by the admin, so any string id is allowed
export type EventCategory = string;

export interface EventCategoryItem {
  id: string;
  label: string;
}

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
