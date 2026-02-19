'use client';
import { useState } from 'react';
import { Sparkles, Zap, User, Info } from 'lucide-react';
import { Field, RawInput, Select, Toggle } from '@/components/FormField';
import { AdvancedSettings } from '@/components/AdvancedSettings';
import { CommandPreview } from '@/components/CommandPreview';
import { buildCommand } from '@/lib/commandBuilder';
import { createJob } from '@/lib/jobsService';
import type { AnimateParams } from '@/lib/types';

const defaults: AnimateParams = {
  task: 'animate-14B', ckpt_dir: './Wan2.2-Animate-14B', size: '832*480',
  frame_num: 81, base_seed: -1, sample_steps: 40, sample_guide_scale: 4,
  sample_solver: 'unipc', sample_shift: 5, offload_model: false, t5_cpu: false,
  use_prompt_extend: false, prompt_extend_method: 'dashscope', save_file: '',
  src_root_path: '', replace_flag: false, refert_num: 5, use_relighting_lora: false,
};

export function AnimatePanel({ onJobCreated }: { onJobCreated: () => void }) {
  const [params, setParams] = useState<AnimateParams>(defaults);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const update = (u: Partial<AnimateParams>) => setParams(p => ({ ...p, ...u }));
  const command = buildCommand(params);

  const handleAdd = async () => {
    setState('loading');
    await createJob('animate-14B', params.src_root_path, params as unknown as Record<string, unknown>);
    setState('done');
    onJobCreated();
    setTimeout(() => setState('idle'), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        {[
          { flag: false, Icon: User, name: 'Animation Mode', desc: 'Animate existing character' },
          { flag: true, Icon: Zap, name: 'Replacement Mode', desc: 'Replace with new character' },
        ].map(({ flag, Icon, name, desc }) => (
          <button
            key={String(flag)}
            onClick={() => update({ replace_flag: flag })}
            className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-150 ${
              params.replace_flag === flag
                ? 'border-blue-500/60 bg-blue-500/10 text-white'
                : 'border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/[0.14] hover:text-white/60'
            }`}
          >
            <Icon size={15} className={params.replace_flag === flag ? 'text-blue-400' : 'text-white/30'} />
            <div>
              <div className="text-[12px] font-semibold leading-tight">{name}</div>
              <div className="text-[10px] mt-0.5 text-white/30">{desc}</div>
            </div>
          </button>
        ))}
      </div>

      <Field label="Preprocessed Data Path" required hint="Path to preprocessed animation data — run the preprocess pipeline first">
        <RawInput value={params.src_root_path} onChange={v => update({ src_root_path: v })} placeholder="/path/to/preprocessed/animation/data" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Select label="Temporal Reference Frames" value={String(params.refert_num)} onChange={v => update({ refert_num: parseInt(v) })}
          options={[{ value: '1', label: '1 frame (faster)' }, { value: '5', label: '5 frames (recommended)' }]}
          hint="More frames = better temporal consistency" />
      </div>

      <Toggle label="Apply Relighting LoRA" value={params.use_relighting_lora} onChange={v => update({ use_relighting_lora: v })} hint="Better lighting adaptation to the target scene" />

      <div className="flex gap-3 p-3.5 rounded-xl bg-blue-500/[0.05] border border-blue-500/[0.15]">
        <Info size={14} className="text-blue-400/70 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-[11.5px] font-semibold text-white/70 mb-1">Preprocessing required</div>
          <p className="text-[10.5px] text-white/35 leading-relaxed">
            Before using this panel, preprocess your input using the pipeline in{' '}
            <code className="font-mono text-cyan-400/60 bg-white/[0.04] px-1 rounded text-[10px]">wan/modules/animate/preprocess/</code>.
            See <code className="font-mono text-cyan-400/60 bg-white/[0.04] px-1 rounded text-[10px]">UserGuider.md</code> for full instructions.
          </p>
        </div>
      </div>

      <AdvancedSettings params={params} onChange={u => update(u as Partial<AnimateParams>)} />
      <CommandPreview command={command} />
      <button
        onClick={handleAdd}
        disabled={state === 'loading' || !params.src_root_path.trim()}
        className={`flex items-center justify-center gap-2.5 w-full py-3 rounded-xl font-semibold text-[13px] transition-all duration-200 ${
          state === 'done' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          state === 'loading' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 cursor-wait' :
          !params.src_root_path.trim() ? 'bg-white/[0.03] text-white/20 border border-white/[0.05] cursor-not-allowed' :
          'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-400/30 hover:-translate-y-0.5'
        }`}
      >
        <Sparkles size={15} />
        {state === 'done' ? 'Added to Queue' : state === 'loading' ? 'Saving...' : 'Add to Generation Queue'}
      </button>
    </div>
  );
}
