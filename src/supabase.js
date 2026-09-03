import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

function unconfiguredError(message="Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env") {
  return { error: new Error(message) };
}

function mockQuery() {
  const result = { data: [], error: new Error("Supabase is not configured. Add the Supabase environment variables to .env.") };
  const query = {
    select: () => query,
    eq: () => query,
    order: () => query,
    limit: () => query,
    single: async () => ({ data: null, error: result.error }),
    insert: async () => result,
    update: () => query,
    delete: () => query,
    then: (resolve) => Promise.resolve(result).then(resolve)
  };
  return query;
}

const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signInWithPassword: async () => unconfiguredError(),
    signUp: async () => unconfiguredError(),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => unconfiguredError(),
    signInWithOAuth: async () => unconfiguredError()
  },
  from: () => mockQuery(),
  storage: {
    from: () => ({
      upload: async () => unconfiguredError(),
      createSignedUrl: async () => ({ data: null, error: new Error("Supabase is not configured.") })
    })
  }
};

export const supabase = url && key ? createClient(url, key) : mockSupabase;
