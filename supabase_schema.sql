-- ============================================================
-- ARVEXA 2026
-- CLEAN SUPABASE PRODUCTION SCHEMA
-- ============================================================
-- IMPORTANT:
-- 1. section is completely removed
-- 2. register_no is completely removed
-- 3. team_name and problem_theme are supported
-- 4. admin can read registrations/team members
-- 5. admin can approve/reject registrations
-- 6. participants can read only their own records
-- 7. payment screenshots remain private
-- ============================================================

create extension if not exists pgcrypto;


-- ============================================================
-- PROFILES
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  full_name text,

  role text not null
    default 'student'
    check (role in ('student', 'admin')),

  gold_badges integer not null default 0,
  silver_badges integer not null default 0,
  bronze_badges integer not null default 0,

  created_at timestamptz not null
    default now()
);


-- ============================================================
-- ADD MISSING PROFILE COLUMNS TO EXISTING DATABASE
-- ============================================================

alter table public.profiles
  add column if not exists full_name text;

alter table public.profiles
  add column if not exists role text;

alter table public.profiles
  add column if not exists gold_badges integer;

alter table public.profiles
  add column if not exists silver_badges integer;

alter table public.profiles
  add column if not exists bronze_badges integer;

alter table public.profiles
  add column if not exists created_at timestamptz;


-- ============================================================
-- FIX EXISTING NULL VALUES
-- ============================================================

update public.profiles
set role = 'student'
where role is null;

update public.profiles
set gold_badges = 0
where gold_badges is null;

update public.profiles
set silver_badges = 0
where silver_badges is null;

update public.profiles
set bronze_badges = 0
where bronze_badges is null;

update public.profiles
set created_at = now()
where created_at is null;


-- ============================================================
-- AUTOMATIC PROFILE CREATION
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

  insert into public.profiles (
    id,
    full_name,
    role,
    gold_badges,
    silver_badges,
    bronze_badges
  )

  values (
    new.id,

    coalesce(
      new.raw_user_meta_data->>'full_name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),

    case
      when not exists (
        select 1
        from public.profiles
      )
      then 'admin'
      else 'student'
    end,

    0,
    0,
    0
  )

  on conflict (id) do nothing;

  return new;

end;
$$;


drop trigger if exists on_auth_user_created
on auth.users;


create trigger on_auth_user_created

after insert on auth.users

for each row

execute function public.handle_new_user();


-- ============================================================
-- REGISTRATIONS
-- ============================================================
-- NO section
-- NO register_no
-- ============================================================

create table if not exists public.registrations (

  id uuid primary key
    default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  name text not null,

  team_name text,

  branch text not null,

  department text not null,

  year text not null,

  college_name text not null,

  email text not null,

  phone text not null,

  selected_challenges text[] not null,

  problem_theme text,

  payment_amount numeric(10,2) not null,

  payment_screenshot_path text,

  payment_status text not null
    default 'pending',

  admin_note text,

  verified_at timestamptz,

  created_at timestamptz not null
    default now(),

  constraint registrations_payment_status_check
    check (
      payment_status in (
        'pending',
        'approved',
        'rejected'
      )
    )
);


-- ============================================================
-- EXISTING DATABASE: ADD REQUIRED NEW COLUMNS
-- ============================================================

alter table public.registrations
  add column if not exists team_name text;

alter table public.registrations
  add column if not exists problem_theme text;

alter table public.registrations
  add column if not exists admin_note text;

alter table public.registrations
  add column if not exists verified_at timestamptz;


-- ============================================================
-- COMPLETELY REMOVE OLD FIELDS
-- ============================================================

alter table public.registrations
  drop column if exists section;

alter table public.registrations
  drop column if exists register_no;


-- ============================================================
-- FIX PAYMENT STATUS
-- ============================================================

alter table public.registrations
  drop constraint if exists registrations_payment_status_check;


alter table public.registrations
  add constraint registrations_payment_status_check
  check (
    payment_status in (
      'pending',
      'approved',
      'rejected'
    )
  );


-- ============================================================
-- TEAM MEMBERS
-- ============================================================

create table if not exists public.team_members (

  id uuid primary key
    default gen_random_uuid(),

  registration_id uuid not null
    references public.registrations(id)
    on delete cascade,

  challenge_id text not null,

  member_index integer not null,

  name text not null,

  email text not null,

  phone text,

  college_name text,

  created_at timestamptz not null
    default now()
);


-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists registrations_user_idx
on public.registrations(user_id);


create index if not exists registrations_status_idx
on public.registrations(payment_status);


create index if not exists registrations_created_idx
on public.registrations(created_at desc);


create index if not exists team_members_registration_idx
on public.team_members(registration_id);


-- ============================================================
-- ADMIN CHECK
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  );
$$;


-- ============================================================
-- RLS
-- ============================================================

alter table public.profiles
enable row level security;

alter table public.registrations
enable row level security;

alter table public.team_members
enable row level security;


-- ============================================================
-- PROFILE POLICIES
-- ============================================================

drop policy if exists "profile self read"
on public.profiles;

create policy "profile self read"

on public.profiles

for select

to authenticated

using (
  id = auth.uid()
  or public.is_admin()
);


drop policy if exists "admin profile update"
on public.profiles;

create policy "admin profile update"

on public.profiles

for update

to authenticated

using (
  public.is_admin()
)

with check (
  public.is_admin()
);


-- ============================================================
-- REGISTRATION INSERT
-- ============================================================

drop policy if exists "registrations self insert"
on public.registrations;

create policy "registrations self insert"

on public.registrations

for insert

to authenticated

with check (
  user_id = auth.uid()
);


-- ============================================================
-- REGISTRATION READ
-- ============================================================

drop policy if exists "registrations self read"
on public.registrations;

create policy "registrations self read"

on public.registrations

for select

to authenticated

using (
  user_id = auth.uid()
  or public.is_admin()
);


-- ============================================================
-- REGISTRATION UPDATE
-- ADMIN ONLY
-- ============================================================

drop policy if exists "registrations admin update"
on public.registrations;

create policy "registrations admin update"

on public.registrations

for update

to authenticated

using (
  public.is_admin()
)

with check (
  public.is_admin()
);


-- ============================================================
-- TEAM MEMBER INSERT
-- ============================================================

drop policy if exists "team self insert"
on public.team_members;

create policy "team self insert"

on public.team_members

for insert

to authenticated

with check (

  exists (
    select 1
    from public.registrations r

    where r.id = registration_id

      and r.user_id = auth.uid()
  )

);


-- ============================================================
-- TEAM MEMBER READ
-- ============================================================

drop policy if exists "team self admin read"
on public.team_members;

create policy "team self admin read"

on public.team_members

for select

to authenticated

using (

  exists (
    select 1
    from public.registrations r

    where r.id = registration_id

      and r.user_id = auth.uid()
  )

  or

  public.is_admin()

);


-- ============================================================
-- PAYMENT STORAGE BUCKET
-- ============================================================

insert into storage.buckets (
  id,
  name,
  public
)

values (
  'payment-screenshots',
  'payment-screenshots',
  false
)

on conflict (id)
do update set public = false;


-- ============================================================
-- PAYMENT SCREENSHOT UPLOAD
-- ============================================================

drop policy if exists "payment upload own folder"
on storage.objects;

create policy "payment upload own folder"

on storage.objects

for insert

to authenticated

with check (

  bucket_id = 'payment-screenshots'

  and

  (storage.foldername(name))[1]
    = auth.uid()::text

);


-- ============================================================
-- PAYMENT SCREENSHOT READ
-- USER + ADMIN
-- ============================================================

drop policy if exists "payment read own admin"
on storage.objects;

create policy "payment read own admin"

on storage.objects

for select

to authenticated

using (

  bucket_id = 'payment-screenshots'

  and

  (

    (storage.foldername(name))[1]
      = auth.uid()::text

    or

    public.is_admin()

  )

);


-- ============================================================
-- POSTGRES SCHEMA CACHE
-- ============================================================

notify pgrst, 'reload schema';
