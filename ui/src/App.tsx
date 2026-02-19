import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { JobHistory } from './components/JobHistory';
import { T2VPanel } from './panels/T2VPanel';
import { I2VPanel } from './panels/I2VPanel';
import { TI2VPanel } from './panels/TI2VPanel';
import { S2VPanel } from './panels/S2VPanel';
import { AnimatePanel } from './panels/AnimatePanel';
import type { TaskMode } from './lib/types';
import { History } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<TaskMode>('t2v-A14B');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const handleJobCreated = () => {
    setRefreshKey((k) => k + 1);
    setShowHistory(true);
  };

  return (
    <div className="app">
      <Sidebar activeMode={mode} onModeChange={setMode} />

      <main className="main">
        <div className="main-header">
          <div className="main-header-left">
            <h1 className="main-title">
              {mode === 't2v-A14B' && 'Text to Video'}
              {mode === 'i2v-A14B' && 'Image to Video'}
              {mode === 'ti2v-5B' && 'Text + Image to Video'}
              {mode === 's2v-14B' && 'Speech to Video'}
              {mode === 'animate-14B' && 'Character Animation'}
            </h1>
            <span className="model-tag">Wan2.2</span>
          </div>
          <button
            className={`history-toggle ${showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(!showHistory)}
          >
            <History size={16} />
            <span>Queue</span>
            {refreshKey > 0 && <span className="badge">{refreshKey}</span>}
          </button>
        </div>

        <div className="main-content">
          <div className="panel-area">
            {mode === 't2v-A14B' && <T2VPanel onJobCreated={handleJobCreated} />}
            {mode === 'i2v-A14B' && <I2VPanel onJobCreated={handleJobCreated} />}
            {mode === 'ti2v-5B' && <TI2VPanel onJobCreated={handleJobCreated} />}
            {mode === 's2v-14B' && <S2VPanel onJobCreated={handleJobCreated} />}
            {mode === 'animate-14B' && <AnimatePanel onJobCreated={handleJobCreated} />}
          </div>

          {showHistory && (
            <div className="history-area">
              <JobHistory refreshKey={refreshKey} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
