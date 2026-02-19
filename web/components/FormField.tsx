'use client';
import { type ReactNode } from 'react';

interface LabelProps { label: string; required?: boolean; hint?: string; children: ReactNode; }

export function Field({ label, required, hint, children }: LabelProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-white/50 tracking-wide">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <span className="text-[10px] text-white/25 leading-relaxed">{hint}</span>}
    </div>
  );
}

const inputBase = "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] text-white/90 placeholder-white/20 outline-none transition-all duration-150 focus:border-blue-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20";

interface TextareaProps { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; required?: boolean; rows?: number; }
export function Textarea({ label, value, onChange, placeholder, hint, required, rows = 4 }: TextareaProps) {
  return (
    <Field label={label} required={required} hint={hint}>
      <textarea className={`${inputBase} resize-none leading-relaxed`} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} />
    </Field>
  );
}

interface InputProps { label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string; hint?: string; required?: boolean; min?: number; max?: number; step?: number; disabled?: boolean; }
export function Input({ label, value, onChange, type = 'text', placeholder, hint, required, min, max, step, disabled }: InputProps) {
  return (
    <Field label={label} required={required} hint={hint}>
      <input className={`${inputBase} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} min={min} max={max} step={step} disabled={disabled} />
    </Field>
  );
}

interface SelectProps { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; hint?: string; }
export function Select({ label, value, onChange, options, hint }: SelectProps) {
  return (
    <Field label={label} hint={hint}>
      <select
        className={`${inputBase} cursor-pointer appearance-none`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff40' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(opt => <option key={opt.value} value={opt.value} className="bg-[#1a1f2e]">{opt.label}</option>)}
      </select>
    </Field>
  );
}

interface ToggleProps { label: string; value: boolean; onChange: (v: boolean) => void; hint?: string; }
export function Toggle({ label, value, onChange, hint }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-lg">
      <div>
        <div className="text-[12px] font-medium text-white/60">{label}</div>
        {hint && <div className="text-[10px] text-white/25 mt-0.5">{hint}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${value ? 'bg-blue-500' : 'bg-white/10'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${value ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

export function RawInput({ value, onChange, placeholder, disabled }: { value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean; }) {
  return <input className={`${inputBase} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} />;
}
