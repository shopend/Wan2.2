import { useState } from 'react';
import { SelectField, ToggleField } from '../components/FormField';
import { AdvancedSettings } from '../components/AdvancedSettings';
import { CommandPreview } from '../components/CommandPreview';
import { buildCommand } from '../lib/commandBuilder';
import { createJob } from '../lib/jobsService';
import type { AnimateParams } from '../lib/types';
import { Sparkles, Zap } from 'lucide-react';

const defaultParams: AnimateParams = {
  task: 'animate-14B',
  ckpt_dir: './Wan2.2-Animate-14B',
  size: '832*480',
  frame_num: 81,
  base_seed: -1,
  sample_steps: 40,
  sample_guide_scale: 4.0,
  sample_solver: 'unipc',
  sample_shift: 5.0,
  offload_model: false,
  t5_cpu: false,
  use_prompt_extend: false,
  prompt_extend_method: 'dashscope',
  save_file: '',
  src_root_path: '',
  replace_flag: false,
  refert_num: 5,
  use_relighting_lora: false,
};

interface AnimatePanelProps {
  onJobCreated: () => void;
}

export function AnimatePanel({ onJobCreated }: AnimatePanelProps) {
  const [params, setParams] = useState<AnimateParams>(defaultParams);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (updates: Partial<AnimateParams>) => {
    setParams((p) => ({ ...p, ...updates }));
  };

  const command = buildCommand(params);

  const handleSave = async () => {
    setLoading(true);
    await createJob('animate-14B', params.src_root_path, params as unknown as Record<string, unknown>);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onJobCreated();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-icon animate">◎</div>
        <div>
          <h2 className="panel-title">Character Animation</h2>
          <p className="panel-subtitle">Animate characters with reference motion data — supports animation and replacement modes</p>
        </div>
      </div>

      <div className="panel-body">
        <div className="mode-selector">
          <button
            className={`mode-btn ${!params.replace_flag ? 'active' : ''}`}
            onClick={() => update({ replace_flag: false })}
          >
            <Sparkles size={14} />
            <div>
              <div className="mode-name">Animation Mode</div>
              <div className="mode-desc">Animate existing character</div>
            </div>
          </button>
          <button
            className={`mode-btn ${params.replace_flag ? 'active' : ''}`}
            onClick={() => update({ replace_flag: true })}
          >
            <Zap size={14} />
            <div>
              <div className="mode-name">Replacement Mode</div>
              <div className="mode-desc">Replace character with new one</div>
            </div>
          </button>
        </div>

        <div className="input-group">
          <label className="form-label">Preprocessed Data Path <span className="required">*</span></label>
          <input
            className="form-input"
            value={params.src_root_path}
            onChange={(e) => update({ src_root_path: e.target.value })}
            placeholder="/path/to/preprocessed/animation/data"
          />
          <span className="form-hint">
            Path to preprocessed animation data (use preprocess pipeline first).
            See <code>wan/modules/animate/preprocess/UserGuider.md</code> for instructions.
          </span>
        </div>

        <div className="form-row">
          <SelectField
            label="Temporal Reference Frames"
            value={String(params.refert_num)}
            onChange={(v) => update({ refert_num: parseInt(v) })}
            options={[
              { value: '1', label: '1 frame (faster)' },
              { value: '5', label: '5 frames (recommended)' },
            ]}
            hint="Higher = more temporal consistency"
          />
        </div>

        <ToggleField
          label="Relighting LoRA"
          value={params.use_relighting_lora}
          onChange={(v) => update({ use_relighting_lora: v })}
          hint="Apply relighting model for better lighting adaptation"
        />

        <div className="animate-info">
          <div className="info-icon">ℹ</div>
          <div>
            <strong>Preprocessing Required</strong>
            <p>
              Before using this mode, you must preprocess your input data using the pipeline in{' '}
              <code>wan/modules/animate/preprocess/</code>.
              The pipeline extracts poses, segments subjects, and prepares motion data.
            </p>
          </div>
        </div>

        <AdvancedSettings
          params={params}
          onChange={(u) => update(u as Partial<AnimateParams>)}
        />

        <CommandPreview command={command} />

        <button
          className={`generate-btn ${loading ? 'loading' : ''} ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={loading || !params.src_root_path.trim()}
        >
          <Sparkles size={18} />
          <span>{loading ? 'Saving...' : saved ? 'Saved to Queue' : 'Add to Generation Queue'}</span>
        </button>
      </div>
    </div>
  );
}
