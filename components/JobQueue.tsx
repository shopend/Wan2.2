'use client';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, Loader2, Trash2, ChevronDown, Terminal, ListVideo } from 'lucide-react';
import { getJobs, deleteJob } from '@/lib/jobsService';
import type { GenerationJob } from '@/lib/supabase';

const TASK_LABELS: Record<string, string> = {
  't2v-A14B': 'Text to Video', 'i2v-A14B': 'Image to Video',
  'ti2v-5B': 'Text + Image', 's2v-14B': 'Speech to Video', 'animate-14B': 'Animate',
};
const TASK_ICONS: Record<string, string> = {
  't2v-A14B': '✦', 'i2v-A14B': '◈', 'ti2v-5B': '◆', 's2v-14B': '◉', 'animate-14B': '◎',
};

function StatusBadge({ status }: { status: GenerationJob['status'] }) {
  const cfg = {
    pending:   { icon: <Clock size={10} />,     label: 'Pending',   cls: 'bg-white/[0.05] text-white/30' },
    running:   { icon: <Loader2 size={10} className="animate-spin" />, label: 'Running', cls: 'bg-blue-500/15 text-blue-400' },
    completed: { icon: <CheckCircle2 size={10} />, label: 'Done',   cls: 'bg-emerald-500/15 text-emerald-400' },
    failed:    { icon: <XCircle size={10} />,    label: 'Failed',   cls: 'bg-red-500/15 text-red-400' },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.cls}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function JobCard({ job, onDelete }: { job: GenerationJob; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const params = job.params as Record<string, unknown>;

  const borderColor = {
    pending: 'border-l-white/10', running: 'border-l-blue-500/60',
    completed: 'border-l-emerald-500/60', failed: 'border-l-red-500/60',
  }[job.status];

  const shortCommand = [
    'python generate.py',
    `--task ${params.task || job.task}`,
    params.prompt ? `--prompt "${String(params.prompt).slice(0, 40)}${String(params.prompt).length > 40 ? '…' : ''}"` : '',
  ].filter(Boolean).join(' \\\n  ');

  return (
    <div className={`rounded-lg border border-white/[0.07] border-l-2 ${borderColor} bg-white/[0.02] overflow-hidden`}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="text-sm text-white/30 flex-shrink-0">{TASK_ICONS[job.task] || '◯'}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[11.5px] font-semibold text-white/70 leading-tight">{TASK_LABELS[job.task] || job.task}</div>
          {job.prompt && <div className="text-[10px] text-white/25 truncate mt-0.5">{job.prompt}</div>}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <StatusBadge status={job.status} />
          <button onClick={() => setExpanded(!expanded)} className="w-5 h-5 flex items-center justify-center rounded text-white/20 hover:text-white/50 hover:bg-white/[0.05] transition-all">
            <ChevronDown size={12} className={`transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={onDelete} className="w-5 h-5 flex items-center justify-center rounded text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/[0.05] px-3 py-3 flex flex-col gap-2">
          <div className="text-[9px] text-white/20 uppercase tracking-widest">{new Date(job.created_at).toLocaleString()}</div>
          {job.error_message && (
            <div className="flex items-start gap-2 p-2 rounded-lg bg-red-500/10 text-red-400 text-[10.5px]">
              <XCircle size={11} className="flex-shrink-0 mt-0.5" />{job.error_message}
            </div>
          )}
          {job.output_path && (
            <div className="flex items-center gap-2 text-emerald-400 text-[10.5px]">
              <CheckCircle2 size={11} /><code className="font-mono">{job.output_path}</code>
            </div>
          )}
          <div className="rounded-lg bg-[#060810] border border-white/[0.05] overflow-hidden">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-white/[0.04] text-white/20">
              <Terminal size={10} /><span className="text-[9px] uppercase tracking-widest">Command</span>
            </div>
            <pre className="px-2.5 py-2 text-[10px] font-mono text-cyan-300/60 overflow-x-auto leading-relaxed">{shortCommand}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export function JobQueue({ refreshKey }: { refreshKey: number }) {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getJobs().then(data => { setJobs(data); setLoading(false); });
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    await deleteJob(id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 text-white/60">
          <ListVideo size={14} />
          <span className="text-[12px] font-semibold">Generation Queue</span>
        </div>
        {jobs.length > 0 && (
          <span className="text-[10px] text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full">{jobs.length}</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/20">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-[11px]">Loading...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="text-4xl text-white/10">◯</div>
            <div className="text-[12px] font-medium text-white/25">No jobs yet</div>
            <div className="text-[11px] text-white/15 max-w-[200px] leading-relaxed">Configure a generation task and add it to the queue</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {jobs.map(job => <JobCard key={job.id} job={job} onDelete={() => handleDelete(job.id)} />)}
          </div>
        )}
      </div>
    </div>
  );
}
