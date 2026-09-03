# ARVEXA 2026 — Supabase registration fix

The registration flow now includes `team_name` and `problem_theme` in the schema.

Run `supabase_schema.sql` in the Supabase SQL Editor. The migration uses `ADD COLUMN IF NOT EXISTS`
and finishes with a PostgREST schema reload notification.

The frontend also has a compatibility retry: if an older live schema still reports that
`problem_theme` is missing from the schema cache, the registration row is retried without that
optional column so the payment/registration submission is not blocked. Once the migration is
applied, the selected Problem to Solution theme is stored normally.

For deployment, keep the existing `.env` variables (or provide the same variables in the host's
production environment):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_UPI_ID`
- `VITE_REGISTRATION_FEE`
