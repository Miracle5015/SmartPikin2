-- ==========================================
-- SMART PIKIN - SUPABASE SQL SCHEMA
-- ==========================================
-- This schema sets up the database structure, configures Row Level Security (RLS),
-- and creates access policies so parents can only access their own data and their children's data.
--
-- How to apply:
-- 1. Go to your Supabase Dashboard (https://supabase.com).
-- 2. Open your project and navigate to the "SQL Editor" in the left sidebar.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- ==========================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────────
-- 1. PARENT'S PROFILE TABLE (Linked to auth.users)
-- ────────────────────────────────────────────────────────────────
create table if not exists public."Parent's Profile" (
    id uuid references auth.users on delete cascade primary key,
    first_name text,
    last_name text,
    phone_number text,
    email_address text,
    role text default 'parent',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Parent's Profile
alter table public."Parent's Profile" enable row level security;

-- Policies for "Parent's Profile"
create policy "Parents can view their own profile on Parent's Profile"
    on public."Parent's Profile" for select
    using (auth.uid() = id);

create policy "Parents can insert/create their own profile on Parent's Profile"
    on public."Parent's Profile" for insert
    with check (auth.uid() = id);

create policy "Parents can update their own profile on Parent's Profile"
    on public."Parent's Profile" for update
    using (auth.uid() = id);

create policy "Parents can delete their own profile on Parent's Profile"
    on public."Parent's Profile" for delete
    using (auth.uid() = id);


-- ────────────────────────────────────────────────────────────────
-- 2. CHILD'S INFORMATION TABLE (Linked to Parent's Profile)
-- ────────────────────────────────────────────────────────────────
create table if not exists public."Child's Information" (
    id uuid default gen_random_uuid() primary key,
    parent_id uuid references public."Parent's Profile"(id) on delete cascade not null,
    first_name text not null,
    age_range text,
    gender text,
    reading_level_milestone text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Child's Information
alter table public."Child's Information" enable row level security;

-- Policies for "Child's Information"
create policy "Parents can view their children's profiles on Child's Information"
    on public."Child's Information" for select
    using (auth.uid() = parent_id);

create policy "Parents can register new children on Child's Information"
    on public."Child's Information" for insert
    with check (auth.uid() = parent_id);

create policy "Parents can update their children's profile details on Child's Information"
    on public."Child's Information" for update
    using (auth.uid() = parent_id);

create policy "Parents can remove child records on Child's Information"
    on public."Child's Information" for delete
    using (auth.uid() = parent_id);


-- ────────────────────────────────────────────────────────────────
-- Legacy / Compatibility Tables (Profiles & Children)
-- ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    parent_first_name text,
    parent_last_name text,
    email text,
    phone text,
    role text default 'parent',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- ────────────────────────────────────────────────────────────────
-- 2. CHILDREN TABLE (Linked to profiles)
-- ────────────────────────────────────────────────────────────────
create table if not exists public.children (
    id uuid default gen_random_uuid() primary key,
    parent_id uuid references public.profiles(id) on delete cascade not null,
    child_first_name text not null,
    child_age integer,
    child_gender text,
    child_grade text,
    reading_level text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on children
alter table public.children enable row level security;

-- ────────────────────────────────────────────────────────────────
-- 3. LESSONS TABLE (Content bank)
-- ────────────────────────────────────────────────────────────────
create table if not exists public.lessons (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    content text, -- Core text/story content
    grade_level text, -- Targeted grade/class
    reading_level text, -- Reading tier (e.g., Beginning Reader)
    audio_url text, -- For pre-recorded read-aloud voice-overs
    image_url text, -- Cover or illustration url
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on lessons
alter table public.lessons enable row level security;

-- ────────────────────────────────────────────────────────────────
-- 4. VOICE SESSIONS TABLE (Audio/Pronunciation Assessment sessions)
-- ────────────────────────────────────────────────────────────────
create table if not exists public.voice_sessions (
    id uuid default gen_random_uuid() primary key,
    child_id uuid references public.children(id) on delete cascade not null,
    lesson_id uuid references public.lessons(id) on delete set null,
    duration_seconds integer default 0,
    accuracy_score numeric(5,2), -- Percentage accuracy (e.g., 94.50)
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on voice_sessions
alter table public.voice_sessions enable row level security;

-- ────────────────────────────────────────────────────────────────
-- 5. VOICE MESSAGES TABLE (Individual audio recording fragments)
-- ────────────────────────────────────────────────────────────────
create table if not exists public.voice_messages (
    id uuid default gen_random_uuid() primary key,
    session_id uuid references public.voice_sessions(id) on delete cascade,
    child_id uuid references public.children(id) on delete cascade not null,
    audio_url text not null,
    transcript text,
    pronunciation_feedback jsonb, -- AI diagnostics, mispronounced words, etc.
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on voice_messages
alter table public.voice_messages enable row level security;

-- ────────────────────────────────────────────────────────────────
-- 6. QUIZ RESULTS TABLE (Post-lesson assessment records)
-- ────────────────────────────────────────────────────────────────
create table if not exists public.quiz_results (
    id uuid default gen_random_uuid() primary key,
    child_id uuid references public.children(id) on delete cascade not null,
    lesson_id uuid references public.lessons(id) on delete cascade not null,
    score integer not null, -- Questions answered correctly
    total_questions integer not null,
    answers_json jsonb, -- Record of choices made
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on quiz_results
alter table public.quiz_results enable row level security;

-- ────────────────────────────────────────────────────────────────
-- 7. LEARNING PROGRESS TABLE (Continuous tracker)
-- ────────────────────────────────────────────────────────────────
create table if not exists public.learning_progress (
    id uuid default gen_random_uuid() primary key,
    child_id uuid references public.children(id) on delete cascade not null,
    lesson_id uuid references public.lessons(id) on delete cascade not null,
    status text check (status in ('not_started', 'in_progress', 'completed')) default 'not_started' not null,
    last_read_at timestamp with time zone default timezone('utc'::text, now()) not null,
    time_spent_seconds integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- A child can have only one progress row per lesson
    unique (child_id, lesson_id)
);

-- Enable RLS on learning_progress
alter table public.learning_progress enable row level security;

-- ────────────────────────────────────────────────────────────────
-- 8. BADGES TABLE (Achievements unlocked)
-- ────────────────────────────────────────────────────────────────
create table if not exists public.badges (
    id uuid default gen_random_uuid() primary key,
    child_id uuid references public.children(id) on delete cascade not null,
    badge_type text not null, -- e.g., 'reading_streak', 'perfect_quiz'
    title text not null,
    description text,
    unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on badges
alter table public.badges enable row level security;


-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- ─── PROFILES POLICIES ───
create policy "Parents can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Parents can insert/create their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

create policy "Parents can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);


-- ─── CHILDREN POLICIES ───
create policy "Parents can view their children's profiles"
    on public.children for select
    using (auth.uid() = parent_id);

create policy "Parents can register new children"
    on public.children for insert
    with check (auth.uid() = parent_id);

create policy "Parents can update their children's profile details"
    on public.children for update
    using (auth.uid() = parent_id);

create policy "Parents can remove child records"
    on public.children for delete
    using (auth.uid() = parent_id);


-- ─── LESSONS POLICIES (Read for parents, write restricted) ───
create policy "Lessons are readable by any authenticated parent"
    on public.lessons for select
    using (auth.role() = 'authenticated');


-- ─── VOICE SESSIONS POLICIES ───
create policy "Parents can view voice sessions for their children"
    on public.voice_sessions for select
    using (
        child_id in (
            select c.id from public.children c where c.parent_id = auth.uid()
        )
    );

create policy "Parents can log voice sessions for their children"
    on public.voice_sessions for insert
    with check (
        child_id in (
            select c.id from public.children c where c.parent_id = auth.uid()
        )
    );


-- ─── VOICE MESSAGES POLICIES ───
create policy "Parents can view voice messages for their children"
    on public.voice_messages for select
    using (
        child_id in (
            select c.id from public.children c where c.parent_id = auth.uid()
        )
    );

create policy "Parents can create voice recordings for their children"
    on public.voice_messages for insert
    with check (
        child_id in (
            select c.id from public.children c where c.parent_id = auth.uid()
        )
    );


-- ─── QUIZ RESULTS POLICIES ───
create policy "Parents can view quiz results for their children"
    on public.quiz_results for select
    using (
        child_id in (
            select c.id from public.children c where c.parent_id = auth.uid()
        )
    );

create policy "Parents can submit quiz results for their children"
    on public.quiz_results for insert
    with check (
        child_id in (
            select c.id from public.children c where c.parent_id = auth.uid()
        )
    );


-- ─── LEARNING PROGRESS POLICIES ───
create policy "Parents can view learning progress for their children"
    on public.learning_progress for select
    using (
        child_id in (
            select c.id from public.children c where c.parent_id = auth.uid()
        )
    );

create policy "Parents can update learning progress for their children"
    on public.learning_progress for insert
    with check (
        child_id in (
            select c.id from public.children c where c.parent_id = auth.uid()
        )
    );

create policy "Parents can edit learning progress records"
    on public.learning_progress for update
    using (
        child_id in (
            select c.id from public.children c where c.parent_id = auth.uid()
        )
    );


-- ─── BADGES POLICIES ───
create policy "Parents can view achievements for their children"
    on public.badges for select
    using (
        child_id in (
            select c.id from public.children c where c.parent_id = auth.uid()
        )
    );

create policy "Parents can reward achievements to their children"
    on public.badges for insert
    with check (
        child_id in (
            select c.id from public.children c where c.parent_id = auth.uid()
        )
    );


-- ================================================================
-- DATABASE AUTOMATIC TRIGGERS (Best Practice)
-- ================================================================
-- This trigger automatically creates an entry in BOTH profiles and "Parent's Profile"
-- tables whenever a user registers through Supabase Authentication.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- 1. Insert into default compatibility table
  insert into public.profiles (id, parent_first_name, parent_last_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'parent_first_name', ''),
    coalesce(new.raw_user_meta_data->>'parent_last_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'parent')
  )
  on conflict (id) do update
  set
    parent_first_name = excluded.parent_first_name,
    parent_last_name = excluded.parent_last_name,
    email = excluded.email,
    phone = excluded.phone,
    role = excluded.role,
    updated_at = now();

  -- 2. Insert into custom requested "Parent's Profile" table
  insert into public."Parent's Profile" (id, first_name, last_name, email_address, phone_number, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'parent_first_name', new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'parent_last_name', new.raw_user_meta_data->>'last_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'phone_number', ''),
    coalesce(new.raw_user_meta_data->>'role', 'parent')
  )
  on conflict (id) do update
  set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    email_address = excluded.email_address,
    phone_number = excluded.phone_number,
    role = excluded.role,
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to hook into auth.users insert
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
