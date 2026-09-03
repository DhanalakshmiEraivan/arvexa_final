# ARVEXA 2026 — Premium Competition Website

ARVEXA 2026 by QuadraFroyn Solutions is a Vite + React + Supabase competition platform with a cinematic homepage, persistent browser routing, challenge command centre, five Problem-to-Solution themes, recognition system, clean authentication, four-step registration and participant/admin dashboards.

## What was upgraded

- Replaced the old ARVEXA logo everywhere with a new professional orbital ARVEXA emblem (`public/assets/arvexa-logo.svg`).
- Added real browser-history routing for every major page, including direct/deep URLs and browser back/forward support.
- Fixed the blank-page navigation problem by removing state-only navigation as the sole routing mechanism.
- Added dedicated `/login`, `/signup`, `/register`, `/dashboard` and `/admin` routes.
- Removed the duplicate homepage footer. The global footer is now the single footer.
- Removed competition registration from the navbar/footer; registration remains available through relevant CTAs and the dedicated page.
- Added cursor-reactive network animation, particles, bilateral smoke/glow entrance and refined motion to the homepage hero.
- Replaced generic arena visuals with internet-sourced imagery relevant to AI, web design and problem solving.
- Added five detailed Problem-to-Solution themes with theme image, Theme, Problem Statement, Problem Statement ID, About This, Rules & Regulations and Format.
- Added required Problem-to-Solution theme selection during registration and stored it in `registrations.problem_theme`.
- Rebuilt authentication as a clean, light, card-based experience inspired by the supplied reference image, with separate Login and Sign Up pages.
- Rebuilt competition registration with a horizontal progress bar and cleaner multi-step layout.
- Preserved Team Name in registration and added it to the admin verification view.
- Rebuilt the recognition hero so all three medals are fully visible and the headline is balanced.
- Rebuilt the participant dashboard into a competition cockpit with readiness, registration history, team identity, arena selection, event status and next actions.
- Kept Supabase Auth, database, private payment screenshot storage and admin approval workflow integrated.

## Routes

- `/`
- `/challenges`
- `/challenge/aptiq`
- `/challenge/webphobia`
- `/challenge/problem`
- `/recognition`
- `/journey`
- `/faq`
- `/about`
- `/security`
- `/login`
- `/signup`
- `/forgot`
- `/register`
- `/dashboard`
- `/admin`

## Run locally

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm run preview
```

## Supabase setup

Copy `.env.example` to `.env` and configure:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_UPI_ID=your_upi_id
VITE_REGISTRATION_FEE=50
```

Then run `supabase_schema.sql` in the Supabase SQL editor.

The schema creates:

- `profiles`
- `registrations`
- `team_members`
- `payment-screenshots` private storage bucket
- RLS policies for participants/admins
- automatic profile creation on signup
- `team_name` and `problem_theme` registration fields

### Admin

The supplied schema keeps the first account as admin for the initial setup. For an existing project, promote the intended owner explicitly in Supabase:

```sql
update public.profiles
set role = 'admin'
where id = 'YOUR_AUTH_USER_UUID';
```

Use the Supabase Auth dashboard to configure Google, GitHub or Facebook providers if social login is required.

## Payment

The registration flow uses the configured UPI ID and QR payment. The participant uploads the original payment screenshot. The registration remains `pending` until an authorized admin approves or rejects it.

## SPA deployment

`vercel.json` and `public/_redirects` are included so direct browser navigation to nested routes can fall back to the Vite app entry point.

## Image sources

The UI uses remote Unsplash images for contextual competition visuals and Wikimedia Commons medal artwork for recognition. Remote images require internet access in the browser.

"# Arvexa-" 
"# Arvexa-" 
"# arvexa" 
"# arvexa" 
