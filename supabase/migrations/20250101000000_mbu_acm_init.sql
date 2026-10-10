-- ========================================================
-- MBU ACM Student Chapter — Database Schema & RLS Policies
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null,
  roll_number text unique,
  branch text,
  academic_year text,
  phone text,
  profile_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. USER ROLES TABLE
create table if not exists public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. CREW MEMBERS TABLE
create table if not exists public.crew_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  branch text,
  academic_year text,
  photo_url text,
  bio text,
  social_links jsonb default '{}'::jsonb,
  display_order integer default 0,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. EVENTS TABLE
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary text,
  description text not null,
  poster_url text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  venue text default 'Mohan Babu University Campus',
  registration_deadline timestamptz,
  registration_type text not null default 'internal' check (registration_type in ('internal', 'external')),
  registration_url text,
  eligibility_or_instructions text,
  status text not null default 'draft' check (status in ('draft', 'published', 'completed', 'cancelled')),
  registration_enabled boolean default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. EVENT REGISTRATIONS TABLE
create table if not exists public.event_registrations (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  registered_at timestamptz default now(),
  status text not null default 'registered' check (status in ('registered', 'attended', 'cancelled')),
  unique (event_id, user_id)
);

-- 6. CONTACT SUBMISSIONS TABLE
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'archived')),
  created_at timestamptz default now()
);

-- ========================================================
-- SECURITY FUNCTIONS & ROW LEVEL SECURITY (RLS)
-- ========================================================

-- Helper function to verify admin role securely
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.crew_members enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.contact_submissions enable row level security;

-- PROFILES POLICIES
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- USER ROLES POLICIES
create policy "Users can read own role or admins read all"
  on public.user_roles for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Admins can manage user roles"
  on public.user_roles for all
  using (public.is_admin());

-- CREW MEMBERS POLICIES
create policy "Public can view published crew"
  on public.crew_members for select
  using (is_published = true or public.is_admin());

create policy "Admins can manage crew members"
  on public.crew_members for all
  using (public.is_admin());

-- EVENTS POLICIES
create policy "Public can view published events"
  on public.events for select
  using (status = 'published' or public.is_admin());

create policy "Admins can manage events"
  on public.events for all
  using (public.is_admin());

-- EVENT REGISTRATIONS POLICIES
create policy "Users can view own registrations or admins view all"
  on public.event_registrations for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can register for themselves"
  on public.event_registrations for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.events
      where id = event_id and status = 'published' and registration_enabled = true
      and (registration_deadline is null or registration_deadline > now())
    )
  );

create policy "Users can cancel own registration or admins manage"
  on public.event_registrations for update
  using (auth.uid() = user_id or public.is_admin());

create policy "Admins can delete registrations"
  on public.event_registrations for delete
  using (public.is_admin());

-- CONTACT SUBMISSIONS POLICIES
create policy "Anyone can create contact submission"
  on public.contact_submissions for insert
  with check (true);

create policy "Only admins can view contact submissions"
  on public.contact_submissions for select
  using (public.is_admin());

create policy "Only admins can update contact submissions"
  on public.contact_submissions for update
  using (public.is_admin());

-- ========================================================
-- AUTOMATIC PROFILE & ROLE CREATION ON SIGNUP TRIGGER
-- ========================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert into profiles
  insert into public.profiles (id, full_name, email, profile_completed)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    false
  );

  -- Assign default 'user' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========================================================
-- STORAGE BUCKETS (Run in Supabase SQL editor)
-- ========================================================
insert into storage.buckets (id, name, public) 
values ('event-posters', 'event-posters', true), ('crew-photos', 'crew-photos', true)
on conflict (id) do nothing;

create policy "Event posters are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'event-posters');

create policy "Admins can upload event posters"
  on storage.objects for insert
  with check (bucket_id = 'event-posters' and public.is_admin());

create policy "Crew photos are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'crew-photos');

create policy "Admins can upload crew photos"
  on storage.objects for insert
  with check (bucket_id = 'crew-photos' and public.is_admin());
