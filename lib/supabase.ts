import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type GenerationJob = {
  id: string;
  task: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  prompt: string;
  params: Record<string, unknown>;
  output_path: string;
  error_message: string;
  created_at: string;
  updated_at: string;
};
