'use client';
import { useState } from 'react';
import { ChevronDown, Settings2 } from 'lucide-react';
import { Input, Select, Toggle } from './FormField';
import type { BaseParams } from '@/lib/types';

const SIZE_OPTIONS = [
  { value: '1280*720', label: '1280×720 — 16:9 Landscape' },
  { value: '720*1280', label: '720×1280 — 9:16 Portrait' },
  { value: '960*960', label: '960×960 — 1:1 Square' },
  { value: '832*480', label: '832×480 — Widescreen' },
  { value: '480*832', label: '480×832 — Tall' },
  { value: '624*624', label: '624×624 — Square Small' },
];

interface Props { params: BaseParams; onChange: (u: Partial<BaseParams>) => void; }

export function AdvancedSettings({ params, onChange }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-150"
      >
        <div className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors">
          <Settings2 size={13} />
          <span className="text-[12px] font-medium">Advanced Settings</span>
        </div>
        <ChevronDown size={14} className={`text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 py-4 border-t border-white/[0.06] bg-[#0a0d14] flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Resolution" value={params.size} onChange={v => onChange({ size: v as BaseParams['size'] })} options={SIZE_OPTIONS} />
            <Input label="Frame Count" type="number" value={params.frame_num} onChange={v => onChange({ frame_num: parseInt(v) || 81 })} hint="Must be 4n+1 (17, 49, 81…)" min={17} step={4} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Sample Steps" type="number" value={params.sample_steps} onChange={v => onChange({ sample_steps: parseInt(v) || 50 })} min={1} max={100} />
            <Input label="Guidance Scale" type="number" value={params.sample_guide_scale} onChange={v => onChange({ sample_guide_scale: parseFloat(v) || 5 })} min={1} max={20} step={0.5} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Solver" value={params.sample_solver} onChange={v => onChange({ sample_solver: v as 'unipc' | 'dpm++' })} options={[{ value: 'unipc', label: 'UniPC (Recommended)' }, { value: 'dpm++', label: 'DPM++ (Alternative)' }]} />
            <Input label="Sample Shift" type="number" value={params.sample_shift} onChange={v => onChange({ sample_shift: parseFloat(v) || 5 })} min={0} max={20} step={0.1} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Random Seed" type="number" value={params.base_seed} onChange={v => onChange({ base_seed: parseInt(v) || -1 })} hint="-1 for random" />
            <Input label="Checkpoint Directory" value={params.ckpt_dir} onChange={v => onChange({ ckpt_dir: v })} placeholder="./Wan2.2-T2V-A14B" />
          </div>
          <Input label="Output File Path" value={params.save_file} onChange={v => onChange({ save_file: v })} placeholder="output.mp4 (auto-generated if empty)" />
          <div className="grid grid-cols-1 gap-2">
            <Toggle label="Offload Model to CPU" value={params.offload_model} onChange={v => onChange({ offload_model: v })} hint="Reduces GPU memory at the cost of speed" />
            <Toggle label="T5 Encoder on CPU" value={params.t5_cpu} onChange={v => onChange({ t5_cpu: v })} hint="Places text encoder on CPU" />
            <Toggle label="Prompt Extend (AI enrichment)" value={params.use_prompt_extend} onChange={v => onChange({ use_prompt_extend: v })} hint="Automatically enriches prompts with AI" />
          </div>
          {params.use_prompt_extend && (
            <Select label="Extend Method" value={params.prompt_extend_method} onChange={v => onChange({ prompt_extend_method: v as 'dashscope' | 'local_qwen' })}
              options={[{ value: 'dashscope', label: 'DashScope API' }, { value: 'local_qwen', label: 'Local Qwen Model' }]} />
          )}
        </div>
      )}
    </div>
  );
}
