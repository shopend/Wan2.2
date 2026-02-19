'use client';
import { useState } from 'react';
import { History } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { JobQueue } from './JobQueue';
import { T2VPanel } from './panels/T2VPanel';
import { I2VPanel } from './panels/I2VPanel';
import { TI2VPanel } from './panels/TI2VPanel';
import { S2VPanel } from './panels/S2VPanel';
import { AnimatePanel } from './panels/AnimatePanel';
import { TASK_META, type TaskMode } from '@/lib/types';

export function MainView() {
  const [mode, setMode] = useState<TaskMode>('t2v-A14B');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  const meta = TASK_META[mode];

  const handleJobCreated = () => {
    setRefreshKey(k => k + 1);
    setShowQueue(true);
  };

  return (
    <div className="flex min-h-screen bg-[#080a0f]">
      <Sidebar activeMode={mode} onModeChange={setMode} />

      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex items-center justify-between px-7 py-4 bg-[#080a0f]/90 backdrop-blur-sm border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg ${meta.bg} border ${meta.border} flex items-center justify-center text-sm ${meta.color}`}>
              {meta.icon}
            </div>
            <div>
              <h1 className="text-[15px] font-semibold text-white tracking-tight">{meta.label}</h1>
              <p className="text-[10px] text-white/30 mt-0.5">{meta.desc}</p>
            </div>
            <span className="ml-1 text-[10px] font-medium text-blue-400/70 bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-0.5">Wan2.2</span>
          </div>

          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all duration-150 border ${
              showQueue
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                : 'bg-white/[0.03] text-white/40 border-white/[0.07] hover:text-white/60 hover:bg-white/[0.05]'
            }`}
          >
            <History size={14} />
            Queue
            {refreshKey > 0 && (
              <span className="bg-blue-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {refreshKey > 9 ? '9+' : refreshKey}
              </span>
            )}
          </button>
        </header>

        <div className="flex flex-1">
          <div className="flex-1 px-7 py-6 overflow-y-auto max-w-3xl">
            <div className={`rounded-2xl border border-white/[0.06] bg-[#0d1018] overflow-hidden`}>
              <div className={`flex items-start gap-4 px-6 py-5 border-b border-white/[0.05] bg-gradient-to-r from-white/[0.02] to-transparent`}>
                <div className={`w-10 h-10 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center text-xl ${meta.color} flex-shrink-0`}>
                  {meta.icon}
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-white tracking-tight">{meta.label}</h2>
                  <p className="text-[11.5px] text-white/35 mt-0.5 leading-relaxed">{getPanelSubtitle(mode)}</p>
                </div>
              </div>
              <div className="px-6 py-6">
                {mode === 't2v-A14B' && <T2VPanel onJobCreated={handleJobCreated} />}
                {mode === 'i2v-A14B' && <I2VPanel onJobCreated={handleJobCreated} />}
                {mode === 'ti2v-5B' && <TI2VPanel onJobCreated={handleJobCreated} />}
                {mode === 's2v-14B' && <S2VPanel onJobCreated={handleJobCreated} />}
                {mode === 'animate-14B' && <AnimatePanel onJobCreated={handleJobCreated} />}
              </div>
            </div>
          </div>

          {showQueue && (
            <div className="w-80 border-l border-white/[0.05] bg-[#0a0c12] sticky top-[61px] h-[calc(100vh-61px)] overflow-hidden flex flex-col">
              <JobQueue refreshKey={refreshKey} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getPanelSubtitle(mode: TaskMode): string {
  const map: Record<TaskMode, string> = {
    't2v-A14B': 'Generate cinematic video directly from a text description using the 14B MoE model at up to 720P',
    'i2v-A14B': 'Bring any static image to life with guided motion — supports 480P and 720P output',
    'ti2v-5B': 'Fuse image context with detailed text guidance for highly controlled video generation (720P only)',
    's2v-14B': 'Audio-driven video generation — supports talking heads, singing, and pose-guided body animation',
    'animate-14B': 'Animate or replace characters with reference motion data — two modes: animation and replacement',
  };
  return map[mode];
}
