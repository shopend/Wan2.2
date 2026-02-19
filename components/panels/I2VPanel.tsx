'use client';
import { useState } from 'react';
import { Sparkles, ImageIcon } from 'lucide-react';
import { Textarea, Field, RawInput } from '@/components/FormField';
import { AdvancedSettings } from '@/components/AdvancedSettings';
import { CommandPreview } from '@/components/CommandPreview';
import { buildCommand } from '@/lib/commandBuilder';
import { createJob } from '@/lib/jobsService';
import type { I2VParams } from '@/lib/types';

const defaults: I2VParams = {
  task: 'i2v-A14B', ckpt_dir: './Wan2.2-I2V-A14B', size: '1280*720',
  frame_num: 81, base_seed: -1, sample_steps: 50, sample_guide_scale: 5,
  sample_solver: 'unipc', sample_shift: 5, offload_model: false, t5_cpu: false,
  use_prompt_extend: false, prompt_extend_method: 'dashscope', save_file: '', prompt: '', image: '',
};

export function I2VPanel({ onJobCreated }: { onJobCreated: () => void }) {
  const [params, setParams] = useState<I2VParams>(defaults);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const update = (u: Partial<I2VParams>) => setParams(p => ({ ...p, ...u }));
  const command = buildCommand(params);

  const handleAdd = async () => {
    setState('loading');
    await createJob('i2v-A14B', params.prompt, params as unknown as Record<string, unknown>);
    setState('done');
    onJobCreated();
    setTimeout(() => setState('idle'), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      <Field label="Input Image Path" required hint="Supports JPG, PNG, WEBP — provide the full local file path">
        <div className="flex items-center gap-2">
          <ImageIcon size={14} className="text-white/30 flex-shrink-0" />
          <RawInput value={params.image} onChange={v => update({ image: v })} placeholder="/path/to/input.jpg or ./examples/i2v_input.JPG" />
        </div>
      </Field>
      <Textarea label="Motion Prompt" value={params.prompt} onChange={v => update({ prompt: v })}
        placeholder="Describe the motion: gentle wind blowing through trees, camera slowly zooming in, waves rippling..."
        hint="Focus on motion, camera movement, and transformations" rows={4} />
      <AdvancedSettings params={params} onChange={u => update(u as Partial<I2VParams>)} />
      <CommandPreview command={command} />
      <button
        onClick={handleAdd}
        disabled={state === 'loading' || !params.image.trim()}
        className={`flex items-center justify-center gap-2.5 w-full py-3 rounded-xl font-semibold text-[13px] transition-all duration-200 ${
          state === 'done' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          state === 'loading' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 cursor-wait' :
          !params.image.trim() ? 'bg-white/[0.03] text-white/20 border border-white/[0.05] cursor-not-allowed' :
          'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-400/30 hover:-translate-y-0.5'
        }`}
      >
        <Sparkles size={15} />
        {state === 'done' ? 'Added to Queue' : state === 'loading' ? 'Saving...' : 'Add to Generation Queue'}
      </button>
    </div>
  );
}
