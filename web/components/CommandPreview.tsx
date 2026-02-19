'use client';
import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

export function CommandPreview({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden bg-[#090c12]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06]">
        <div className="flex items-center gap-2 text-white/30">
          <Terminal size={12} />
          <span className="text-[10px] font-semibold uppercase tracking-widest">Generated Command</span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150 ${
            copied ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.07] hover:text-white/60'
          }`}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-4 text-[11.5px] font-mono text-cyan-300/80 leading-relaxed overflow-x-auto whitespace-pre">{command}</pre>
    </div>
  );
}
