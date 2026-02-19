import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CommandPreviewProps {
  command: string;
}

export function CommandPreview({ command }: CommandPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="command-preview">
      <div className="command-header">
        <span className="command-label">Generated Command</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="command-code">{command}</pre>
    </div>
  );
}
