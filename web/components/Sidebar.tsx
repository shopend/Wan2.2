'use client';
import { TASK_META, type TaskMode } from '@/lib/types';

const MODES: TaskMode[] = ['t2v-A14B', 'i2v-A14B', 'ti2v-5B', 's2v-14B', 'animate-14B'];

interface SidebarProps {
  activeMode: TaskMode;
  onModeChange: (mode: TaskMode) => void;
}

export function Sidebar({ activeMode, onModeChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0e1117] border-r border-white/[0.06] flex flex-col z-50">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-blue-500/25">
          W
        </div>
        <div>
          <div className="text-[13px] font-semibold text-white tracking-tight">Wan2.2</div>
          <div className="text-[10px] text-white/30 mt-0.5">AI Video Generator</div>
        </div>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        <div className="px-4 py-2 text-[9px] font-semibold uppercase tracking-widest text-white/20">Generation Mode</div>
        {MODES.map((mode) => {
          const meta = TASK_META[mode];
          const isActive = activeMode === mode;
          return (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 border-r-2 ${
                isActive
                  ? `${meta.bg} border-blue-500 ${meta.color}`
                  : 'border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
              }`}
            >
              <span className={`text-lg w-5 text-center flex-shrink-0 ${isActive ? meta.color : ''}`}>{meta.icon}</span>
              <div className="min-w-0">
                <div className={`text-[12px] font-medium leading-tight ${isActive ? 'text-white' : ''}`}>{meta.label}</div>
                <div className={`text-[10px] leading-tight mt-0.5 ${isActive ? 'text-white/50' : 'text-white/25'}`}>{meta.desc}</div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400 flex-shrink-0" />
          <span className="text-[10px] text-white/25">27B MoE · 14B Active</span>
        </div>
      </div>
    </aside>
  );
}
