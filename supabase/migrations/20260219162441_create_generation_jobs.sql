/*
  # AI Video Generator - Generation Jobs Schema

  ## New Tables
  - `generation_jobs`
    - `id` (uuid, primary key)
    - `task` (text) - generation mode (t2v, i2v, ti2v, s2v, animate)
    - `status` (text) - pending, running, completed, failed
    - `prompt` (text) - user text prompt
    - `params` (jsonb) - all generation parameters as JSON
    - `output_path` (text) - path to generated video
    - `error_message` (text) - error if failed
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on `generation_jobs` table
  - Allow public read/write since this is a local tool (no auth required)
*/

CREATE TABLE IF NOT EXISTS generation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  prompt text DEFAULT '',
  params jsonb DEFAULT '{}',
  output_path text DEFAULT '',
  error_message text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read generation jobs"
  ON generation_jobs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert generation jobs"
  ON generation_jobs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update generation jobs"
  ON generation_jobs FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete generation jobs"
  ON generation_jobs FOR DELETE
  TO anon, authenticated
  USING (true);
