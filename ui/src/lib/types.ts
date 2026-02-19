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

export interface T2VParams extends BaseParams {
  prompt: string;
}

export interface I2VParams extends BaseParams {
  prompt: string;
  image: string;
}

export interface TI2VParams extends BaseParams {
  prompt: string;
  image: string;
}

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
