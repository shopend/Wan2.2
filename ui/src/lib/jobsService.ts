import { supabase, type GenerationJob } from './supabase';

export async function createJob(
  task: string,
  prompt: string,
  params: Record<string, unknown>
): Promise<GenerationJob | null> {
  const { data, error } = await supabase
    .from('generation_jobs')
    .insert({ task, prompt, params, status: 'pending' })
    .select()
    .maybeSingle();
  if (error) {
    console.error('Error creating job:', error);
    return null;
  }
  return data;
}

export async function getJobs(): Promise<GenerationJob[]> {
  const { data, error } = await supabase
    .from('generation_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
  return data ?? [];
}

export async function deleteJob(id: string): Promise<void> {
  await supabase.from('generation_jobs').delete().eq('id', id);
}

export async function updateJobStatus(
  id: string,
  status: GenerationJob['status'],
  updates?: Partial<GenerationJob>
): Promise<void> {
  await supabase
    .from('generation_jobs')
    .update({ status, updated_at: new Date().toISOString(), ...updates })
    .eq('id', id);
}
