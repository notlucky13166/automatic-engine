const SUPABASE_BUCKET = 'study-uploads';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const functionsUrl = import.meta.env.VITE_FUNCTIONS_URL ?? '';

export const backendConfig = {
  supabaseUrl,
  supabaseAnonKey,
  functionsUrl,
  bucket: SUPABASE_BUCKET
};

export type BackendReadiness = 'unconfigured' | 'partial' | 'ready';

export function getBackendReadiness(): BackendReadiness {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'unconfigured';
  }

  if (!functionsUrl) {
    return 'partial';
  }

  return 'ready';
}

export function isBackendReady() {
  return getBackendReadiness() === 'ready';
}
