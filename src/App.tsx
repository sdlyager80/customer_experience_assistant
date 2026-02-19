import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import { theme } from './theme';
import { BLOOM } from './theme';
import Header from './components/Header';
import CSRLandingPage from './components/CSRLandingPage';
import EngagementWorkspace from './components/EngagementWorkspace';
import AgentDesktop from './pages/AgentDesktop/AgentDesktop';
import LifecycleOutreach from './pages/LifecycleOutreach/LifecycleOutreach';
import BloomLogo from './components/BloomLogo';
import type { ScenarioId } from './data/scenarios';

export type AppView = 'engagement' | 'agent-desktop' | 'lifecycle';

const HEADER_HEIGHT = 60;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Minimal header for Lifecycle Outreach view
function LifecycleHeader({ onSwitch }: { onSwitch: () => void }) {
  return (
    <Box sx={{
      position: 'fixed', top: 0, left: 0, right: 0, height: HEADER_HEIGHT,
      bgcolor: 'background.paper', borderBottom: `1px solid ${BLOOM.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      px: 3, zIndex: 300,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <BloomLogo size={36} />
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
          <Typography sx={{ fontSize: 19, fontWeight: 700, color: '#333', letterSpacing: '-0.3px' }}>Bloom</Typography>
          <Typography sx={{ fontSize: 19, fontWeight: 400, color: '#555', letterSpacing: '-0.3px' }}>Insurance</Typography>
        </Box>
        <Box sx={{ width: 1, height: 24, bgcolor: BLOOM.border, mx: 1.5 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875 }}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>Lifecycle Outreach Manager</Typography>
          <Box sx={{
            fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
            background: `linear-gradient(135deg, ${BLOOM.blue}, ${BLOOM.blueLight})`,
            color: '#fff', px: 0.875, py: 0.25, borderRadius: '4px',
          }}>Smart App</Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          onClick={onSwitch}
          sx={{
            px: 1.75, py: 0.75, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
            border: `1px solid ${BLOOM.border}`, cursor: 'pointer', color: 'text.secondary',
            transition: 'all 0.15s',
            '&:hover': { borderColor: BLOOM.blue, color: BLOOM.blue },
          }}
        >
          ← Engagement Assistant
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1.5, borderLeft: `1px solid ${BLOOM.border}` }}>
          <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: BLOOM.orange, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.625rem' }}>AL</Box>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.2 }}>Andrea Lopez</Typography>
            <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', lineHeight: 1.2 }}>Retention Analyst</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// Minimal header for Agent Desktop view
function AgentDesktopHeader({ onSwitch }: { onSwitch: () => void }) {
  return (
    <Box
      sx={{
        position: 'fixed', top: 0, left: 0, right: 0, height: HEADER_HEIGHT,
        bgcolor: 'background.paper', borderBottom: `1px solid ${BLOOM.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3, zIndex: 300,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <BloomLogo size={36} />
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
          <Typography sx={{ fontSize: 19, fontWeight: 700, color: '#333', letterSpacing: '-0.3px' }}>Bloom</Typography>
          <Typography sx={{ fontSize: 19, fontWeight: 400, color: '#555', letterSpacing: '-0.3px' }}>Insurance</Typography>
        </Box>
        <Box sx={{ width: 1, height: 24, bgcolor: BLOOM.border, mx: 1.5 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875 }}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>Agent Desktop</Typography>
          <Box sx={{
            fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
            background: `linear-gradient(135deg, ${BLOOM.blue}, ${BLOOM.blueLight})`,
            color: '#fff', px: 0.875, py: 0.25, borderRadius: '4px',
          }}>Smart App</Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* App switcher */}
        <Box
          onClick={onSwitch}
          sx={{
            px: 1.75, py: 0.75, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
            border: `1px solid ${BLOOM.border}`, cursor: 'pointer', color: 'text.secondary',
            transition: 'all 0.15s',
            '&:hover': { borderColor: BLOOM.blue, color: BLOOM.blue },
          }}
        >
          ← Engagement Assistant
        </Box>
        {/* User */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1.5, borderLeft: `1px solid ${BLOOM.border}` }}>
          <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: BLOOM.orange, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.625rem' }}>SM</Box>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.2 }}>Sarah Mitchell</Typography>
            <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', lineHeight: 1.2 }}>CSR II · L&A Servicing</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  const [view, setView] = useState<AppView>('engagement');
  const [activeScenario, setActiveScenario]   = useState<ScenarioId>('friction');
  const [workspaceActive, setWorkspaceActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {view === 'engagement' && (
          <>
            <Header
              activeScenario={activeScenario}
              onScenarioChange={(id) => {
                setActiveScenario(id);
                setSeconds(0);
                setWorkspaceActive(true);
              }}
              onSwitchToAgentDesktop={() => setView('agent-desktop')}
              onSwitchToLifecycle={() => setView('lifecycle')}
            />
            <Box sx={{ flex: 1, overflow: 'hidden', mt: `${HEADER_HEIGHT}px` }}>
              {workspaceActive ? (
                <EngagementWorkspace
                  activeScenario={activeScenario}
                  callTime={formatTime(seconds)}
                  onEndCall={() => { setWorkspaceActive(false); setSeconds(0); }}
                />
              ) : (
                <CSRLandingPage
                  onAccept={(id) => {
                    setActiveScenario(id);
                    setSeconds(0);
                    setWorkspaceActive(true);
                  }}
                />
              )}
            </Box>
          </>
        )}

        {view === 'agent-desktop' && (
          <>
            <AgentDesktopHeader onSwitch={() => setView('engagement')} />
            <Box sx={{ flex: 1, overflow: 'hidden', mt: `${HEADER_HEIGHT}px` }}>
              <AgentDesktop />
            </Box>
          </>
        )}

        {view === 'lifecycle' && (
          <>
            <LifecycleHeader onSwitch={() => setView('engagement')} />
            <Box sx={{ flex: 1, overflow: 'hidden', mt: `${HEADER_HEIGHT}px` }}>
              <LifecycleOutreach />
            </Box>
          </>
        )}

      </Box>
    </ThemeProvider>
  );
}
