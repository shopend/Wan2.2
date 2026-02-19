export type TaskMode = 't2v-A14B' | 'i2v-A14B' | 'ti2v-5B' | 's2v-14B' | 'animate-14B';

export type VideoSize =
  | '1280*720'
  | '720*1280'
  | '960*960'
  | '832*480'
  | '480*832'
  | '624*624';

export interface BaseParams {
  task: TaskMode;
  ckpt_dir: string;
  size: VideoSize;
  frame_num: number;
  base_seed: number;
  sample_steps: number;
  sample_guide_scale: number;
  sample_solver: 'unipc' | 'dpm++';
  sample_shift: number;
  offload_model: boolean;
  t5_cpu: boolean;
  use_prompt_extend: boolean;
  prompt_extend_method: 'dashscope' | 'local_qwen';
  save_file: string;
}

export interface T2VParams extends BaseParams { prompt: string; }
export interface I2VParams extends BaseParams { prompt: string; image: string; }
export interface TI2VParams extends BaseParams { prompt: string; image: string; }

export interface S2VParams extends BaseParams {
  prompt: string;
  image: string;
  audio: string;
  enable_tts: boolean;
  tts_text: string;
  tts_prompt_audio: string;
  tts_prompt_text: string;
  pose_video: string;
  num_clip: number;
  infer_frames: number;
  start_from_ref: boolean;
}

export interface AnimateParams extends BaseParams {
  src_root_path: string;
  replace_flag: boolean;
  refert_num: number;
  use_relighting_lora: boolean;
}

export type AnyParams = T2VParams | I2VParams | TI2VParams | S2VParams | AnimateParams;

export const TASK_META: Record<TaskMode, { label: string; desc: string; icon: string; color: string; bg: string; border: string }> = {
  't2v-A14B': { label: 'Text to Video', desc: 'Generate from text prompt', icon: '✦', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  'i2v-A14B': { label: 'Image to Video', desc: 'Animate a static image', icon: '◈', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  'ti2v-5B':  { label: 'Text + Image', desc: 'Guided image animation', icon: '◆', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  's2v-14B':  { label: 'Speech to Video', desc: 'Audio-driven generation', icon: '◉', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  'animate-14B': { label: 'Animate', desc: 'Character animation', icon: '◎', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
};
