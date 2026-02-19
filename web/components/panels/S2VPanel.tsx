'use client';
import { useState } from 'react';
import { Sparkles, ImageIcon, Mic, Activity } from 'lucide-react';
import { Textarea, Field, RawInput, Select, Toggle } from '@/components/FormField';
import { AdvancedSettings } from '@/components/AdvancedSettings';
import { CommandPreview } from '@/components/CommandPreview';
import { buildCommand } from '@/lib/commandBuilder';
import { createJob } from '@/lib/jobsService';
import type { S2VParams } from '@/lib/types';

const defaults: S2VParams = {
  task: 's2v-14B', ckpt_dir: './Wan2.2-S2V-14B', size: '832*480',
  frame_num: 81, base_seed: -1, sample_steps: 40, sample_guide_scale: 4,
  sample_solver: 'unipc', sample_shift: 5, offload_model: false, t5_cpu: false,
  use_prompt_extend: false, prompt_extend_method: 'dashscope', save_file: '',
  prompt: '', image: '', audio: '', enable_tts: false, tts_text: '',
  tts_prompt_audio: '', tts_prompt_text: '', pose_video: '', num_clip: 2, infer_frames: 48, start_from_ref: false,
};

export function S2VPanel({ onJobCreated }: { onJobCreated: () => void }) {
  const [params, setParams] = useState<S2VParams>(defaults);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const update = (u: Partial<S2VParams>) => setParams(p => ({ ...p, ...u }));
  const command = buildCommand(params);

  const handleAdd = async () => {
    setState('loading');
    await createJob('s2v-14B', params.prompt, params as unknown as Record<string, unknown>);
    setState('done');
    onJobCreated();
    setTimeout(() => setState('idle'), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/25 pb-1 border-b border-white/[0.05]">
        <ImageIcon size={11} /> Reference Content
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Reference Image" required hint="Portrait or subject photo">
          <RawInput value={params.image} onChange={v => update({ image: v })} placeholder="/path/to/portrait.jpg" />
        </Field>
        <Field label="Audio File" hint={params.enable_tts ? 'Disabled — using TTS' : 'WAV, MP3 audio file'}>
          <RawInput value={params.audio} onChange={v => update({ audio: v })} placeholder="/path/to/audio.wav" disabled={params.enable_tts} />
        </Field>
      </div>

      <Toggle label="Enable Text-to-Speech (CosyVoice)" value={params.enable_tts} onChange={v => update({ enable_tts: v })} hint="Synthesize audio from text instead of providing a file" />

      {params.enable_tts && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
            <Mic size={11} /> TTS Configuration
          </div>
          <Textarea label="Text to Synthesize" value={params.tts_text} onChange={v => update({ tts_text: v })} placeholder="Text that will be converted to speech..." required rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Reference Audio (5–15s)">
              <RawInput value={params.tts_prompt_audio} onChange={v => update({ tts_prompt_audio: v })} placeholder="/path/to/voice_ref.wav" />
            </Field>
            <Field label="Reference Transcript">
              <RawInput value={params.tts_prompt_text} onChange={v => update({ tts_prompt_text: v })} placeholder="Transcript of reference audio" />
            </Field>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/25 pb-1 border-b border-white/[0.05]">
        <Activity size={11} /> Motion Control
      </div>
      <Field label="Pose Video (Optional)" hint="DW-Pose sequence for body-driven generation — leave empty for audio-only driving">
        <RawInput value={params.pose_video} onChange={v => update({ pose_video: v })} placeholder="/path/to/pose.mp4" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Number of Clips">
          <input className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] text-white/90 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
            type="number" value={params.num_clip} onChange={e => update({ num_clip: parseInt(e.target.value) || 2 })} min={1} max={10} />
        </Field>
        <Select label="Frames per Clip" value={String(params.infer_frames)} onChange={v => update({ infer_frames: parseInt(v) })}
          options={[{ value: '48', label: '48 frames' }, { value: '80', label: '80 frames' }]} />
      </div>
      <Toggle label="Start from Reference Image" value={params.start_from_ref} onChange={v => update({ start_from_ref: v })} hint="Use reference image as first frame of the video" />
      <Textarea label="Additional Prompt (Optional)" value={params.prompt} onChange={v => update({ prompt: v })} placeholder="Optional text guidance for the generation..." rows={3} />

      <AdvancedSettings params={params} onChange={u => update(u as Partial<S2VParams>)} />
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
