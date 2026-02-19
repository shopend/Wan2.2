import { useState } from 'react';
import { TextareaField } from '../components/FormField';
import { AdvancedSettings } from '../components/AdvancedSettings';
import { CommandPreview } from '../components/CommandPreview';
import { buildCommand } from '../lib/commandBuilder';
import { createJob } from '../lib/jobsService';
import type { T2VParams } from '../lib/types';
import { Sparkles } from 'lucide-react';

const defaultParams: T2VParams = {
  task: 't2v-A14B',
  ckpt_dir: './Wan2.2-T2V-A14B',
  size: '1280*720',
  frame_num: 81,
  base_seed: -1,
  sample_steps: 50,
  sample_guide_scale: 5.0,
  sample_solver: 'unipc',
  sample_shift: 5.0,
  offload_model: false,
  t5_cpu: false,
  use_prompt_extend: false,
  prompt_extend_method: 'dashscope',
  save_file: '',
  prompt: '',
};

interface T2VPanelProps {
  onJobCreated: () => void;
}

export function T2VPanel({ onJobCreated }: T2VPanelProps) {
  const [params, setParams] = useState<T2VParams>(defaultParams);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (updates: Partial<T2VParams>) => {
    setParams((p) => ({ ...p, ...updates }));
  };

  const command = buildCommand(params);

  const handleSave = async () => {
    setLoading(true);
    await createJob('t2v-A14B', params.prompt, params as unknown as Record<string, unknown>);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onJobCreated();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-icon t2v">✦</div>
        <div>
          <h2 className="panel-title">Text to Video</h2>
          <p className="panel-subtitle">Generate cinematic video from a text description using the 14B MoE model</p>
        </div>
      </div>

      <div className="panel-body">
        <TextareaField
          label="Prompt"
          value={params.prompt}
          onChange={(v) => update({ prompt: v })}
          placeholder="Describe your video in detail. For example: A serene mountain lake at golden hour, reflections shimmering on the calm water, a lone eagle soaring overhead..."
          hint="Be descriptive — include lighting, camera movement, mood, and subject details for best results"
          required
          rows={5}
        />

        <AdvancedSettings
          params={params}
          onChange={(u) => update(u as Partial<T2VParams>)}
        />

        <CommandPreview command={command} />

        <button
          className={`generate-btn ${loading ? 'loading' : ''} ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={loading || !params.prompt.trim()}
        >
          <Sparkles size={18} />
          <span>{loading ? 'Saving...' : saved ? 'Saved to Queue' : 'Add to Generation Queue'}</span>
        </button>
      </div>
    </div>
  );
}
