-- ARVEXA 2026 / Supabase production schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student','admin')),
  gold_badges integer not null default 0,
  silver_badges integer not null default 0,
  bronze_badges integer not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public
as $$
declare first_user boolean;
begin
  select not exists(select 1 from public.profiles) into first_user;
  insert into public.profiles(id,full_name,role)
  values(new.id,coalesce(new.raw_user_meta_data->>'full_name',split_part(new.email,'@',1)),
    case when first_user then 'admin' else 'student' end);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  branch text not null,
  department text not null,
  section text not null,
  register_no text not null,
  year text not null,
  college_name text not null,
  email text not null,
  phone text not null,
  selected_challenges text[] not null,
  payment_amount numeric(10,2) not null,
  payment_screenshot_path text,
  payment_status text not null default 'pending' check(payment_status in ('pending','approved','rejected')),
  admin_note text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  challenge_id text not null,
  member_index integer not null,
  name text not null,
  email text not null,
  phone text,
  college_name text,
  created_at timestamptz not null default now()
);

create index if not exists registrations_user_idx on public.registrations(user_id);
create index if not exists team_members_registration_idx on public.team_members(registration_id);

alter table public.profiles enable row level security;
alter table public.registrations enable row level security;
alter table public.team_members enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin') $$;

drop policy if exists "profile self read" on public.profiles;
create policy "profile self read" on public.profiles for select using(id=auth.uid() or public.is_admin());

drop policy if exists "registrations self insert" on public.registrations;
create policy "registrations self insert" on public.registrations for insert with check(user_id=auth.uid());

drop policy if exists "registrations self read" on public.registrations;
create policy "registrations self read" on public.registrations for select using(user_id=auth.uid() or public.is_admin());

drop policy if exists "registrations admin update" on public.registrations;
create policy "registrations admin update" on public.registrations for update using(public.is_admin()) with check(public.is_admin());

drop policy if exists "team self insert" on public.team_members;
create policy "team self insert" on public.team_members for insert with check(
  exists(select 1 from public.registrations r where r.id=registration_id and r.user_id=auth.uid())
);

drop policy if exists "team self/admin read" on public.team_members;
create policy "team self/admin read" on public.team_members for select using(
  exists(select 1 from public.registrations r where r.id=registration_id and r.user_id=auth.uid()) or public.is_admin()
);

insert into storage.buckets(id,name,public) values('payment-screenshots','payment-screenshots',false)
on conflict(id) do nothing;

drop policy if exists "payment upload own folder" on storage.objects;
create policy "payment upload own folder" on storage.objects for insert to authenticated
with check(bucket_id='payment-screenshots' and (storage.foldername(name))[1]=auth.uid()::text);

drop policy if exists "payment read own/admin" on storage.objects;
create policy "payment read own/admin" on storage.objects for select to authenticated
using(bucket_id='payment-screenshots' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));

-- Optional hardening: only admins may directly update profile roles/badges.
drop policy if exists "admin profile update" on public.profiles;
create policy "admin profile update" on public.profiles for update using(public.is_admin()) with check(public.is_admin());

-- IMPORTANT:
-- The first account created after this schema is applied becomes admin.
-- If you already have users, promote the intended owner once:
-- update public.profiles set role='admin' where id='YOUR_AUTH_USER_UUID';


-- ARVEXA registration enhancement: team identity captured during registration.
alter table public.registrations add column if not exists team_name text;
alter table public.registrations add column if not exists problem_theme text;

-- PostgREST schema-cache refresh for Supabase projects where the new columns were
-- added after the API schema was first loaded.
notify pgrst, 'reload schema';
-- =========================================================
-- ARVEXA ADMIN ACCESS + REGISTRATION APPROVAL FIX
-- =========================================================

-- Make sure RLS is enabled
alter table public.profiles enable row level security;
alter table public.registrations enable row level security;
alter table public.team_members enable row level security;


-- =========================================================
-- ADMIN CHECK
-- =========================================================

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


-- =========================================================
-- PROFILES
-- =========================================================

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


-- =========================================================
-- REGISTRATIONS
-- =========================================================

drop policy if exists "registrations self insert"
on public.registrations;

create policy "registrations self insert"
on public.registrations
for insert
to authenticated
with check (
  user_id = auth.uid()
);


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


-- =========================================================
-- TEAM MEMBERS
-- =========================================================

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


drop policy if exists "team self/admin read"
on public.team_members;

create policy "team self/admin read"
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
  or public.is_admin()
);


-- =========================================================
-- REGISTRATION INDEXES
-- =========================================================

create index if not exists registrations_user_idx
on public.registrations(user_id);

create index if not exists registrations_status_idx
on public.registrations(payment_status);

create index if not exists registrations_created_idx
on public.registrations(created_at desc);

create index if not exists team_members_registration_idx
on public.team_members(registration_id);


-- =========================================================
-- REQUIRED REGISTRATION COLUMNS
-- =========================================================

alter table public.registrations
add column if not exists team_name text;

alter table public.registrations
add column if not exists problem_theme text;

alter table public.registrations
add column if not exists admin_note text;

alter table public.registrations
add column if not exists verified_at timestamptz;


-- =========================================================
-- STORAGE
-- =========================================================

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
do nothing;


drop policy if exists "payment upload own folder"
on storage.objects;

create policy "payment upload own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'payment-screenshots'
  and (storage.foldername(name))[1] =
      auth.uid()::text
);


drop policy if exists "payment read own/admin"
on storage.objects;

create policy "payment read own/admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-screenshots'
  and (
    (storage.foldername(name))[1] =
      auth.uid()::text
    or public.is_admin()
  )
);


-- =========================================================
-- FORCE POSTGREST TO REFRESH ITS SCHEMA
-- =========================================================

notify pgrst, 'reload schema';
