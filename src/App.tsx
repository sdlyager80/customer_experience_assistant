import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import Header from './components/Header';
import EngagementPanel from './components/EngagementPanel';
import CSRWorkspace from './components/CSRWorkspace';
import type { ScenarioId } from './data/scenarios';

const HEADER_HEIGHT = 60;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('friction');
  const [panelOpen, setPanelOpen] = useState(true);
  const [seconds, setSeconds] = useState(194);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header activeScenario={activeScenario} onScenarioChange={setActiveScenario} />
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', mt: `${HEADER_HEIGHT}px` }}>
          <EngagementPanel
            activeScenario={activeScenario}
            open={panelOpen}
            onToggle={() => setPanelOpen((o) => !o)}
          />
          <CSRWorkspace activeScenario={activeScenario} callTime={formatTime(seconds)} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
