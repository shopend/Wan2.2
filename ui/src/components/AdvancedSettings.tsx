import { useState } from 'react';
import { SelectField, InputField, ToggleField } from './FormField';
import type { BaseParams } from '../lib/types';
import { ChevronDown } from 'lucide-react';

const SIZE_OPTIONS = [
  { value: '1280*720', label: '1280×720 (16:9 Landscape)' },
  { value: '720*1280', label: '720×1280 (9:16 Portrait)' },
  { value: '960*960', label: '960×960 (1:1 Square)' },
  { value: '832*480', label: '832×480 (Widescreen)' },
  { value: '480*832', label: '480×832 (Tall)' },
  { value: '624*624', label: '624×624 (Square Small)' },
];

interface AdvancedSettingsProps {
  params: BaseParams;
  onChange: (updates: Partial<BaseParams>) => void;
}

export function AdvancedSettings({ params, onChange }: AdvancedSettingsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="advanced-settings">
      <button
        type="button"
        className="advanced-toggle"
        onClick={() => setOpen(!open)}
      >
        <span>Advanced Settings</span>
        <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div className="advanced-content">
          <div className="form-row">
            <SelectField
              label="Resolution"
              value={params.size}
              onChange={(v) => onChange({ size: v as BaseParams['size'] })}
              options={SIZE_OPTIONS}
            />
            <InputField
              label="Frame Count"
              type="number"
              value={params.frame_num}
              onChange={(v) => onChange({ frame_num: parseInt(v) || 81 })}
              hint="Must be 4n+1 (e.g. 81, 49, 17)"
              min={17}
              step={4}
            />
          </div>

          <div className="form-row">
            <InputField
              label="Sample Steps"
              type="number"
              value={params.sample_steps}
              onChange={(v) => onChange({ sample_steps: parseInt(v) || 50 })}
              min={1}
              max={100}
            />
            <InputField
              label="Guidance Scale"
              type="number"
              value={params.sample_guide_scale}
              onChange={(v) => onChange({ sample_guide_scale: parseFloat(v) || 5.0 })}
              min={1}
              max={20}
              step={0.5}
            />
          </div>

          <div className="form-row">
            <SelectField
              label="Solver"
              value={params.sample_solver}
              onChange={(v) => onChange({ sample_solver: v as 'unipc' | 'dpm++' })}
              options={[
                { value: 'unipc', label: 'UniPC (Recommended)' },
                { value: 'dpm++', label: 'DPM++ (Alternative)' },
              ]}
            />
            <InputField
              label="Sample Shift"
              type="number"
              value={params.sample_shift}
              onChange={(v) => onChange({ sample_shift: parseFloat(v) || 5.0 })}
              min={0}
              max={20}
              step={0.1}
            />
          </div>

          <div className="form-row">
            <InputField
              label="Seed"
              type="number"
              value={params.base_seed}
              onChange={(v) => onChange({ base_seed: parseInt(v) || -1 })}
              hint="-1 for random"
            />
            <InputField
              label="Checkpoint Directory"
              value={params.ckpt_dir}
              onChange={(v) => onChange({ ckpt_dir: v })}
              placeholder="/path/to/Wan2.2-A14B"
            />
          </div>

          <div className="form-row">
            <InputField
              label="Output File"
              value={params.save_file}
              onChange={(v) => onChange({ save_file: v })}
              placeholder="output.mp4 (auto if empty)"
            />
          </div>

          <div className="toggles-row">
            <ToggleField
              label="Offload to CPU"
              value={params.offload_model}
              onChange={(v) => onChange({ offload_model: v })}
              hint="Saves GPU memory"
            />
            <ToggleField
              label="T5 on CPU"
              value={params.t5_cpu}
              onChange={(v) => onChange({ t5_cpu: v })}
              hint="Text encoder on CPU"
            />
            <ToggleField
              label="Prompt Extend"
              value={params.use_prompt_extend}
              onChange={(v) => onChange({ use_prompt_extend: v })}
              hint="Enrich prompts with AI"
            />
          </div>

          {params.use_prompt_extend && (
            <SelectField
              label="Extend Method"
              value={params.prompt_extend_method}
              onChange={(v) => onChange({ prompt_extend_method: v as 'dashscope' | 'local_qwen' })}
              options={[
                { value: 'dashscope', label: 'DashScope API' },
                { value: 'local_qwen', label: 'Local Qwen Model' },
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
}
