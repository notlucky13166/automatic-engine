import { createClient } from '@supabase/supabase-js';
import { backendConfig, isBackendReady } from './config';

export const supabaseClient = isBackendReady()
  ? createClient(backendConfig.supabaseUrl, backendConfig.supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    })
  : null;
