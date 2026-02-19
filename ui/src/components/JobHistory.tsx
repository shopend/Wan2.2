import { useState, useEffect } from 'react';
import { getJobs, deleteJob } from '../lib/jobsService';
import type { GenerationJob } from '../lib/supabase';
import { Trash2, Clock, CheckCircle, XCircle, Loader, Terminal, ChevronDown } from 'lucide-react';

const TASK_LABELS: Record<string, string> = {
  't2v-A14B': 'Text to Video',
  'i2v-A14B': 'Image to Video',
  'ti2v-5B': 'Text + Image',
  's2v-14B': 'Speech to Video',
  'animate-14B': 'Animate',
};

const TASK_ICONS: Record<string, string> = {
  't2v-A14B': '✦',
  'i2v-A14B': '◈',
  'ti2v-5B': '◆',
  's2v-14B': '◉',
  'animate-14B': '◎',
};

function StatusIcon({ status }: { status: GenerationJob['status'] }) {
  switch (status) {
    case 'pending': return <Clock size={14} className="status-icon pending" />;
    case 'running': return <Loader size={14} className="status-icon running spin" />;
    case 'completed': return <CheckCircle size={14} className="status-icon completed" />;
    case 'failed': return <XCircle size={14} className="status-icon failed" />;
  }
}

function JobCard({ job, onDelete }: { job: GenerationJob; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const params = job.params as Record<string, unknown>;
  const command = buildCommandFromParams(params);

  return (
    <div className={`job-card ${job.status}`}>
      <div className="job-card-header">
        <div className="job-left">
          <span className="job-task-icon">{TASK_ICONS[job.task] || '◯'}</span>
          <div className="job-info">
            <span className="job-task">{TASK_LABELS[job.task] || job.task}</span>
            <span className="job-prompt">{job.prompt || '(no prompt)'}</span>
          </div>
        </div>
        <div className="job-right">
          <div className={`job-status ${job.status}`}>
            <StatusIcon status={job.status} />
            <span>{job.status}</span>
          </div>
          <span className="job-time">{formatTime(job.created_at)}</span>
          <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
            <ChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
          </button>
          <button className="delete-btn" onClick={onDelete} title="Remove job">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="job-details">
          {job.error_message && (
            <div className="job-error">
              <XCircle size={13} />
              <span>{job.error_message}</span>
            </div>
          )}
          {job.output_path && (
            <div className="job-output">
              <CheckCircle size={13} />
              <span>Output: <code>{job.output_path}</code></span>
            </div>
          )}
          <div className="job-command">
            <div className="job-command-header">
              <Terminal size={13} />
              <span>Command</span>
            </div>
            <pre>{command}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function buildCommandFromParams(params: Record<string, unknown>): string {
  const parts: string[] = ['python generate.py'];
  if (params.task) parts.push(`--task ${params.task}`);
  if (params.ckpt_dir) parts.push(`--ckpt_dir "${params.ckpt_dir}"`);
  if (params.size) parts.push(`--size ${params.size}`);
  if (params.frame_num) parts.push(`--frame_num ${params.frame_num}`);
  if (params.prompt) parts.push(`--prompt "${params.prompt}"`);
  if (params.image) parts.push(`--image "${params.image}"`);
  if (params.audio) parts.push(`--audio "${params.audio}"`);
  if (params.save_file) parts.push(`--save_file "${params.save_file}"`);
  return parts.join(' \\\n  ');
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface JobHistoryProps {
  refreshKey: number;
}

export function JobHistory({ refreshKey }: JobHistoryProps) {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    const data = await getJobs();
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    await deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  if (loading) {
    return (
      <div className="history-loading">
        <Loader size={20} className="spin" />
        <span>Loading jobs...</span>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="history-empty">
        <div className="empty-icon">◯</div>
        <div className="empty-title">No generation jobs yet</div>
        <div className="empty-desc">Configure a generation task and add it to the queue to get started.</div>
      </div>
    );
  }

  return (
    <div className="job-history">
      <div className="history-header">
        <h3>Generation Queue</h3>
        <span className="job-count">{jobs.length} job{jobs.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="job-list">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onDelete={() => handleDelete(job.id)} />
        ))}
      </div>
    </div>
  );
}
