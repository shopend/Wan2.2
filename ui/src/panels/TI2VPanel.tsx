import { useState } from 'react';
import { TextareaField } from '../components/FormField';
import { AdvancedSettings } from '../components/AdvancedSettings';
import { CommandPreview } from '../components/CommandPreview';
import { buildCommand } from '../lib/commandBuilder';
import { createJob } from '../lib/jobsService';
import type { TI2VParams } from '../lib/types';
import { Sparkles, ImageIcon, Type } from 'lucide-react';

const defaultParams: TI2VParams = {
  task: 'ti2v-5B',
  ckpt_dir: './Wan2.2-TI2V-5B',
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
  image: '',
};

interface TI2VPanelProps {
  onJobCreated: () => void;
}

export function TI2VPanel({ onJobCreated }: TI2VPanelProps) {
  const [params, setParams] = useState<TI2VParams>(defaultParams);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (updates: Partial<TI2VParams>) => {
    setParams((p) => ({ ...p, ...updates }));
  };

  const command = buildCommand(params);

  const handleSave = async () => {
    setLoading(true);
    await createJob('ti2v-5B', params.prompt, params as unknown as Record<string, unknown>);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onJobCreated();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-icon ti2v">◆</div>
        <div>
          <h2 className="panel-title">Text + Image to Video</h2>
          <p className="panel-subtitle">Combine image context with detailed text guidance using the 5B model (720P only)</p>
        </div>
      </div>

      <div className="panel-body">
        <div className="dual-input-notice">
          <Type size={14} />
          <span>Provide both an image reference and a text prompt — the model uses both to generate the video.</span>
        </div>

        <div className="input-group">
          <label className="form-label">
            <ImageIcon size={14} style={{ display: 'inline', marginRight: 6 }} />
            Reference Image Path
            <span className="required">*</span>
          </label>
          <input
            className="form-input"
            value={params.image}
            onChange={(e) => update({ image: e.target.value })}
            placeholder="/path/to/reference.jpg"
          />
          <span className="form-hint">The image provides visual context for the generation</span>
        </div>

        <TextareaField
          label="Text Prompt"
          value={params.prompt}
          onChange={(v) => update({ prompt: v })}
          placeholder="Describe what should happen in the video, referencing the image content..."
          hint="The text guides the motion and transformations applied to the image content"
          required
          rows={4}
        />

        <AdvancedSettings
          params={params}
          onChange={(u) => update(u as Partial<TI2VParams>)}
        />

        <CommandPreview command={command} />

        <button
          className={`generate-btn ${loading ? 'loading' : ''} ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={loading || !params.image.trim() || !params.prompt.trim()}
        >
          <Sparkles size={18} />
          <span>{loading ? 'Saving...' : saved ? 'Saved to Queue' : 'Add to Generation Queue'}</span>
        </button>
      </div>
    </div>
  );
}
