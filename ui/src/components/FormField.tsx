interface FormFieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({ label, hint, children, required }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {children}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
}

export function TextareaField({ label, value, onChange, placeholder, hint, required, rows = 4 }: TextareaFieldProps) {
  return (
    <FormField label={label} hint={hint} required={required}>
      <textarea
        className="form-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </FormField>
  );
}

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export function InputField({ label, value, onChange, type = 'text', placeholder, hint, required, min, max, step }: InputFieldProps) {
  return (
    <FormField label={label} hint={hint} required={required}>
      <input
        className="form-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
    </FormField>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}

export function SelectField({ label, value, onChange, options, hint }: SelectFieldProps) {
  return (
    <FormField label={label} hint={hint}>
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FormField>
  );
}

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}

export function ToggleField({ label, value, onChange, hint }: ToggleFieldProps) {
  return (
    <div className="form-field toggle-field">
      <div className="toggle-left">
        <span className="form-label">{label}</span>
        {hint && <span className="form-hint">{hint}</span>}
      </div>
      <button
        type="button"
        className={`toggle ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
        aria-checked={value}
        role="switch"
      >
        <span className="toggle-knob" />
      </button>
    </div>
  );
}
