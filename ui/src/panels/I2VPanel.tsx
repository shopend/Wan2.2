import { useState } from 'react';
import { TextareaField } from '../components/FormField';
import { AdvancedSettings } from '../components/AdvancedSettings';
import { CommandPreview } from '../components/CommandPreview';
import { buildCommand } from '../lib/commandBuilder';
import { createJob } from '../lib/jobsService';
import type { I2VParams } from '../lib/types';
import { Sparkles, ImageIcon } from 'lucide-react';

const defaultParams: I2VParams = {
  task: 'i2v-A14B',
  ckpt_dir: './Wan2.2-I2V-A14B',
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

interface I2VPanelProps {
  onJobCreated: () => void;
}

export function I2VPanel({ onJobCreated }: I2VPanelProps) {
  const [params, setParams] = useState<I2VParams>(defaultParams);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (updates: Partial<I2VParams>) => {
    setParams((p) => ({ ...p, ...updates }));
  };

  const command = buildCommand(params);

  const handleSave = async () => {
    setLoading(true);
    await createJob('i2v-A14B', params.prompt, params as unknown as Record<string, unknown>);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onJobCreated();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-icon i2v">◈</div>
        <div>
          <h2 className="panel-title">Image to Video</h2>
          <p className="panel-subtitle">Bring a static image to life with guided motion using the 14B model</p>
        </div>
      </div>

      <div className="panel-body">
        <div className="input-group">
          <label className="form-label">
            <ImageIcon size={14} style={{ display: 'inline', marginRight: 6 }} />
            Input Image Path
            <span className="required">*</span>
          </label>
          <input
            className="form-input"
            value={params.image}
            onChange={(e) => update({ image: e.target.value })}
            placeholder="/path/to/input.jpg or ./examples/i2v_input.JPG"
          />
          <span className="form-hint">Supports JPG, PNG, WEBP formats</span>
        </div>

        <TextareaField
          label="Motion Prompt"
          value={params.prompt}
          onChange={(v) => update({ prompt: v })}
          placeholder="Describe how the image should animate. For example: gentle wind blowing through the trees, camera slowly zooming in..."
          hint="Describe the motion, camera movement, and any transformations"
          rows={4}
        />

        <AdvancedSettings
          params={params}
          onChange={(u) => update(u as Partial<I2VParams>)}
        />

        <CommandPreview command={command} />

        <button
          className={`generate-btn ${loading ? 'loading' : ''} ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={loading || !params.image.trim()}
        >
          <Sparkles size={18} />
          <span>{loading ? 'Saving...' : saved ? 'Saved to Queue' : 'Add to Generation Queue'}</span>
        </button>
      </div>
    </div>
  );
}
