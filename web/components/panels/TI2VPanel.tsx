'use client';
import { useState } from 'react';
import { Sparkles, ImageIcon, Layers } from 'lucide-react';
import { Textarea, Field, RawInput } from '@/components/FormField';
import { AdvancedSettings } from '@/components/AdvancedSettings';
import { CommandPreview } from '@/components/CommandPreview';
import { buildCommand } from '@/lib/commandBuilder';
import { createJob } from '@/lib/jobsService';
import type { TI2VParams } from '@/lib/types';

const defaults: TI2VParams = {
  task: 'ti2v-5B', ckpt_dir: './Wan2.2-TI2V-5B', size: '1280*720',
  frame_num: 81, base_seed: -1, sample_steps: 50, sample_guide_scale: 5,
  sample_solver: 'unipc', sample_shift: 5, offload_model: false, t5_cpu: false,
  use_prompt_extend: false, prompt_extend_method: 'dashscope', save_file: '', prompt: '', image: '',
};

export function TI2VPanel({ onJobCreated }: { onJobCreated: () => void }) {
  const [params, setParams] = useState<TI2VParams>(defaults);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const update = (u: Partial<TI2VParams>) => setParams(p => ({ ...p, ...u }));
  const command = buildCommand(params);

  const handleAdd = async () => {
    setState('loading');
    await createJob('ti2v-5B', params.prompt, params as unknown as Record<string, unknown>);
    setState('done');
    onJobCreated();
    setTimeout(() => setState('idle'), 2000);
  };

  const canSubmit = params.image.trim() && params.prompt.trim();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-amber-500/[0.07] border border-amber-500/20 text-amber-400/80 text-[11.5px]">
        <Layers size={13} className="flex-shrink-0" />
        Both an image reference and a text prompt are required — the model fuses both to guide generation.
      </div>

      <Field label="Reference Image Path" required hint="Provides visual context for the generation">
        <div className="flex items-center gap-2">
          <ImageIcon size={14} className="text-white/30 flex-shrink-0" />
          <RawInput value={params.image} onChange={v => update({ image: v })} placeholder="/path/to/reference.jpg" />
        </div>
      </Field>
      <Textarea label="Text Prompt" value={params.prompt} onChange={v => update({ prompt: v })}
        placeholder="Describe what should happen in the video, referencing the image content..."
        hint="The text guides the motion and transformations applied to the image content"
        required rows={4} />
      <AdvancedSettings params={params} onChange={u => update(u as Partial<TI2VParams>)} />
      <CommandPreview command={command} />
      <button
        onClick={handleAdd}
        disabled={state === 'loading' || !canSubmit}
        className={`flex items-center justify-center gap-2.5 w-full py-3 rounded-xl font-semibold text-[13px] transition-all duration-200 ${
          state === 'done' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          state === 'loading' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 cursor-wait' :
          !canSubmit ? 'bg-white/[0.03] text-white/20 border border-white/[0.05] cursor-not-allowed' :
          'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-400/30 hover:-translate-y-0.5'
        }`}
      >
        <Sparkles size={15} />
        {state === 'done' ? 'Added to Queue' : state === 'loading' ? 'Saving...' : 'Add to Generation Queue'}
      </button>
    </div>
  );
}
