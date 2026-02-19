import { useState } from 'react';
import { TextareaField, SelectField, ToggleField } from '../components/FormField';
import { AdvancedSettings } from '../components/AdvancedSettings';
import { CommandPreview } from '../components/CommandPreview';
import { buildCommand } from '../lib/commandBuilder';
import { createJob } from '../lib/jobsService';
import type { S2VParams } from '../lib/types';
import { Sparkles, Mic, ImageIcon } from 'lucide-react';

const defaultParams: S2VParams = {
  task: 's2v-14B',
  ckpt_dir: './Wan2.2-S2V-14B',
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
  prompt: '',
  image: '',
  audio: '',
  enable_tts: false,
  tts_text: '',
  tts_prompt_audio: '',
  tts_prompt_text: '',
  pose_video: '',
  num_clip: 2,
  infer_frames: 48,
  start_from_ref: false,
};

interface S2VPanelProps {
  onJobCreated: () => void;
}

export function S2VPanel({ onJobCreated }: S2VPanelProps) {
  const [params, setParams] = useState<S2VParams>(defaultParams);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (updates: Partial<S2VParams>) => {
    setParams((p) => ({ ...p, ...updates }));
  };

  const command = buildCommand(params);

  const handleSave = async () => {
    setLoading(true);
    await createJob('s2v-14B', params.prompt, params as unknown as Record<string, unknown>);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onJobCreated();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-icon s2v">◉</div>
        <div>
          <h2 className="panel-title">Speech to Video</h2>
          <p className="panel-subtitle">Drive video generation with audio — supports talking heads, singing, and pose-guided animation</p>
        </div>
      </div>

      <div className="panel-body">
        <div className="section-title">
          <ImageIcon size={14} />
          <span>Reference Content</span>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label className="form-label">Reference Image <span className="required">*</span></label>
            <input
              className="form-input"
              value={params.image}
              onChange={(e) => update({ image: e.target.value })}
              placeholder="/path/to/portrait.jpg"
            />
          </div>
          <div className="input-group">
            <label className="form-label">
              <Mic size={13} style={{ display: 'inline', marginRight: 5 }} />
              Audio File {!params.enable_tts && <span className="required">*</span>}
            </label>
            <input
              className="form-input"
              value={params.audio}
              onChange={(e) => update({ audio: e.target.value })}
              placeholder="/path/to/audio.wav"
              disabled={params.enable_tts}
            />
          </div>
        </div>

        <ToggleField
          label="Enable TTS (Text-to-Speech)"
          value={params.enable_tts}
          onChange={(v) => update({ enable_tts: v })}
          hint="Generate audio from text using CosyVoice"
        />

        {params.enable_tts && (
          <div className="tts-section">
            <TextareaField
              label="TTS Text"
              value={params.tts_text}
              onChange={(v) => update({ tts_text: v })}
              placeholder="Text to synthesize into speech..."
              required
              rows={3}
            />
            <div className="form-row">
              <div className="input-group">
                <label className="form-label">Reference Audio (5-15s)</label>
                <input
                  className="form-input"
                  value={params.tts_prompt_audio}
                  onChange={(e) => update({ tts_prompt_audio: e.target.value })}
                  placeholder="/path/to/reference.wav"
                />
              </div>
              <div className="input-group">
                <label className="form-label">Reference Text</label>
                <input
                  className="form-input"
                  value={params.tts_prompt_text}
                  onChange={(e) => update({ tts_prompt_text: e.target.value })}
                  placeholder="Transcript of reference audio"
                />
              </div>
            </div>
          </div>
        )}

        <div className="section-title">
          <span>Motion Control</span>
        </div>

        <div className="input-group">
          <label className="form-label">Pose Video (Optional)</label>
          <input
            className="form-input"
            value={params.pose_video}
            onChange={(e) => update({ pose_video: e.target.value })}
            placeholder="/path/to/pose.mp4 — leave empty for audio-only driving"
          />
          <span className="form-hint">DW-Pose sequence for body-driven generation</span>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label className="form-label">Number of Clips</label>
            <input
              className="form-input"
              type="number"
              value={params.num_clip}
              onChange={(e) => update({ num_clip: parseInt(e.target.value) || 2 })}
              min={1}
              max={10}
            />
          </div>
          <SelectField
            label="Frames per Clip"
            value={String(params.infer_frames)}
            onChange={(v) => update({ infer_frames: parseInt(v) })}
            options={[
              { value: '48', label: '48 frames' },
              { value: '80', label: '80 frames' },
            ]}
          />
        </div>

        <ToggleField
          label="Start from Reference"
          value={params.start_from_ref}
          onChange={(v) => update({ start_from_ref: v })}
          hint="Use reference image as first frame"
        />

        <TextareaField
          label="Prompt (Optional)"
          value={params.prompt}
          onChange={(v) => update({ prompt: v })}
          placeholder="Additional text guidance for the generation..."
          rows={3}
        />

        <AdvancedSettings
          params={params}
          onChange={(u) => update(u as Partial<S2VParams>)}
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
