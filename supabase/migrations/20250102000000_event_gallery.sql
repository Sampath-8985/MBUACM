-- ========================================================
-- MBU ACM Student Chapter — Event Gallery Database Migration
-- ========================================================

create table if not exists public.event_gallery (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete set null,
  title text not null,
  event_date date not null,
  academic_year text default '2024-2025',
  category text not null default 'hackathon' check (category in ('hackathon', 'workshop', 'talk', 'contest', 'general')),
  summary text,
  description text not null,
  cover_image_url text not null,
  photos jsonb default '[]'::jsonb,
  attendees_count integer,
  highlights text[],
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_event_gallery_date on public.event_gallery (event_date desc);
create index if not exists idx_event_gallery_published on public.event_gallery (is_published);
create index if not exists idx_event_gallery_category on public.event_gallery (category);

-- Enable Row Level Security (RLS)
alter table public.event_gallery enable row level security;

-- Policies for public viewing
create policy "Anyone can view published gallery items"
  on public.event_gallery for select
  using (is_published = true or exists (
    select 1 from public.user_roles
    where user_roles.user_id = auth.uid() and user_roles.role = 'admin'
  ));

-- Policies for admin management
create policy "Admins have full access to gallery"
  on public.event_gallery for all
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid() and user_roles.role = 'admin'
    )
  );

-- Create storage bucket for gallery photos if not exists
insert into storage.buckets (id, name, public)
values ('gallery-photos', 'gallery-photos', true)
on conflict (id) do nothing;

-- Storage policies for gallery-photos
create policy "Gallery photos are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'gallery-photos');

create policy "Admins can upload gallery photos"
  on storage.objects for insert
  with check (
    bucket_id = 'gallery-photos' and
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid() and user_roles.role = 'admin'
    )
  );

create policy "Admins can delete gallery photos"
  on storage.objects for delete
  using (
    bucket_id = 'gallery-photos' and
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid() and user_roles.role = 'admin'
    )
  );
