import type { TaskMode } from '../lib/types';

const modes: { id: TaskMode; label: string; desc: string; icon: string }[] = [
  { id: 't2v-A14B', label: 'Text to Video', desc: 'Generate from text prompt', icon: '✦' },
  { id: 'i2v-A14B', label: 'Image to Video', desc: 'Animate a static image', icon: '◈' },
  { id: 'ti2v-5B', label: 'Text + Image', desc: 'Guided image animation', icon: '◆' },
  { id: 's2v-14B', label: 'Speech to Video', desc: 'Audio-driven generation', icon: '◉' },
  { id: 'animate-14B', label: 'Animate', desc: 'Character animation', icon: '◎' },
];

interface SidebarProps {
  activeMode: TaskMode;
  onModeChange: (mode: TaskMode) => void;
}

export function Sidebar({ activeMode, onModeChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">W</div>
        <div>
          <div className="brand-name">Wan2.2</div>
          <div className="brand-tagline">AI Video Generator</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Generation Mode</div>
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`nav-item ${activeMode === mode.id ? 'active' : ''}`}
            onClick={() => onModeChange(mode.id)}
          >
            <span className="nav-icon">{mode.icon}</span>
            <div className="nav-text">
              <span className="nav-title">{mode.label}</span>
              <span className="nav-desc">{mode.desc}</span>
            </div>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="model-badge">
          <span className="badge-dot" />
          <span>27B MoE · 14B Active</span>
        </div>
      </div>
    </aside>
  );
}
