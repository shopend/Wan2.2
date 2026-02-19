import type { AnyParams, T2VParams, I2VParams, TI2VParams, S2VParams, AnimateParams } from './types';

export function buildCommand(params: AnyParams): string {
  const parts: string[] = ['python generate.py'];
  parts.push(`--task ${params.task}`);
  parts.push(`--ckpt_dir "${params.ckpt_dir}"`);
  parts.push(`--size ${params.size}`);
  parts.push(`--frame_num ${params.frame_num}`);
  if (params.base_seed !== -1) parts.push(`--base_seed ${params.base_seed}`);
  parts.push(`--sample_steps ${params.sample_steps}`);
  parts.push(`--sample_guide_scale ${params.sample_guide_scale}`);
  parts.push(`--sample_solver ${params.sample_solver}`);
  parts.push(`--sample_shift ${params.sample_shift}`);
  if (params.offload_model) parts.push('--offload_model True');
  if (params.t5_cpu) parts.push('--t5_cpu True');
  if (params.use_prompt_extend) {
    parts.push('--use_prompt_extend');
    parts.push(`--prompt_extend_method ${params.prompt_extend_method}`);
  }
  if (params.save_file) parts.push(`--save_file "${params.save_file}"`);

  switch (params.task) {
    case 't2v-A14B': {
      const p = params as T2VParams;
      if (p.prompt) parts.push(`--prompt "${p.prompt}"`);
      break;
    }
    case 'i2v-A14B': {
      const p = params as I2VParams;
      if (p.prompt) parts.push(`--prompt "${p.prompt}"`);
      if (p.image) parts.push(`--image "${p.image}"`);
      break;
    }
    case 'ti2v-5B': {
      const p = params as TI2VParams;
      if (p.prompt) parts.push(`--prompt "${p.prompt}"`);
      if (p.image) parts.push(`--image "${p.image}"`);
      break;
    }
    case 's2v-14B': {
      const p = params as S2VParams;
      if (p.prompt) parts.push(`--prompt "${p.prompt}"`);
      if (p.image) parts.push(`--image "${p.image}"`);
      if (p.audio) parts.push(`--audio "${p.audio}"`);
      if (p.enable_tts) {
        parts.push('--enable_tts');
        if (p.tts_text) parts.push(`--tts_text "${p.tts_text}"`);
        if (p.tts_prompt_audio) parts.push(`--tts_prompt_audio "${p.tts_prompt_audio}"`);
        if (p.tts_prompt_text) parts.push(`--tts_prompt_text "${p.tts_prompt_text}"`);
      }
      if (p.pose_video) parts.push(`--pose_video "${p.pose_video}"`);
      parts.push(`--num_clip ${p.num_clip}`);
      parts.push(`--infer_frames ${p.infer_frames}`);
      if (p.start_from_ref) parts.push('--start_from_ref');
      break;
    }
    case 'animate-14B': {
      const p = params as AnimateParams;
      if (p.src_root_path) parts.push(`--src_root_path "${p.src_root_path}"`);
      if (p.replace_flag) parts.push('--replace_flag');
      parts.push(`--refert_num ${p.refert_num}`);
      if (p.use_relighting_lora) parts.push('--use_relighting_lora');
      break;
    }
  }

  return parts.join(' \\\n  ');
}
