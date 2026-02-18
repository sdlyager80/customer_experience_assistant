import { useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography, InputBase, IconButton,
  Menu, MenuItem, Divider, Badge, Avatar, Paper, Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BloomLogo from './BloomLogo';
import { SCENARIO_LIST, type ScenarioId } from '../data/scenarios';
import { BLOOM } from '../theme';

interface HeaderProps {
  activeScenario: ScenarioId;
  onScenarioChange: (id: ScenarioId) => void;
}

export default function Header({ activeScenario, onScenarioChange }: HeaderProps) {
  const [scenarioAnchor, setScenarioAnchor] = useState<null | HTMLElement>(null);

  const activeScenarioMeta = SCENARIO_LIST.find(s => s.id === activeScenario)!;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        height: 60,
        justifyContent: 'center',
        zIndex: (theme) => theme.zIndex.drawer + 2,
      }}
    >
      <Toolbar sx={{ px: 3, gap: 2, minHeight: '60px !important' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
          <BloomLogo size={40} />
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#333', letterSpacing: '-0.3px' }}>
              Bloom
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 400, color: '#555', letterSpacing: '-0.3px' }}>
              Insurance
            </Typography>
          </Box>
        </Box>

        {/* Search */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Paper
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              px: 1.75, py: 0.875,
              minWidth: 260, maxWidth: 400,
              bgcolor: BLOOM.canvas,
              border: `1px solid ${BLOOM.border}`,
              '&:focus-within': {
                borderColor: BLOOM.blue,
                boxShadow: `0 0 0 3px ${BLOOM.bluePale}`,
              },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', fontSize: 16, flexShrink: 0 }} />
            <InputBase
              placeholder="Search policies, claims, customers..."
              sx={{ fontSize: '0.8125rem', width: '100%', '& input': { p: 0 } }}
            />
          </Paper>
        </Box>

        {/* Right controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
          {/* Scenario Selector */}
          <Box
            onClick={(e) => setScenarioAnchor(e.currentTarget)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              px: 2, py: 1,
              borderRadius: '6px',
              bgcolor: BLOOM.blue, color: '#fff',
              fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer', userSelect: 'none',
              transition: 'background 0.15s',
              '&:hover': { bgcolor: BLOOM.blueLight },
              whiteSpace: 'nowrap',
            }}
          >
            <GridViewOutlinedIcon sx={{ fontSize: 16 }} />
            <span>{activeScenarioMeta.icon} {activeScenarioMeta.label}</span>
            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
          </Box>

          <Menu
            anchorEl={scenarioAnchor}
            open={Boolean(scenarioAnchor)}
            onClose={() => setScenarioAnchor(null)}
            PaperProps={{
              sx: {
                width: 340, mt: 0.75,
                border: `1px solid ${BLOOM.border}`,
                boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
                '& .MuiList-root': { p: 0 },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.25, bgcolor: BLOOM.canvas, borderBottom: `1px solid ${BLOOM.border}` }}>
              <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'text.secondary' }}>
                Select Demo Scenario
              </Typography>
            </Box>
            {SCENARIO_LIST.map((s) => (
              <MenuItem
                key={s.id}
                onClick={() => { onScenarioChange(s.id); setScenarioAnchor(null); }}
                sx={{
                  px: 2, py: 1.25,
                  gap: 1.5,
                  borderBottom: `1px solid ${BLOOM.canvas}`,
                  bgcolor: s.id === activeScenario ? BLOOM.blue : 'transparent',
                  color: s.id === activeScenario ? '#fff' : 'text.primary',
                  '&:hover': {
                    bgcolor: s.id === activeScenario ? BLOOM.blue : BLOOM.bluePale,
                  },
                }}
              >
                <Typography sx={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{s.icon}</Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.78125rem', fontWeight: 600, lineHeight: 1.3 }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', opacity: 0.7, mt: 0.25 }}>{s.description}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>

          {/* Notification */}
          <IconButton size="small" sx={{ border: `1px solid ${BLOOM.border}`, borderRadius: '6px', width: 36, height: 36 }}>
            <Badge
              variant="dot"
              sx={{ '& .MuiBadge-dot': { bgcolor: '#ef4444', top: 2, right: 2 } }}
            >
              <NotificationsOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </Badge>
          </IconButton>

          {/* Settings */}
          <IconButton size="small" sx={{ border: `1px solid ${BLOOM.border}`, borderRadius: '6px', width: 36, height: 36 }}>
            <SettingsOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          </IconButton>

          {/* User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1.25, borderLeft: `1px solid ${BLOOM.border}`, ml: 0.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: BLOOM.orange, fontSize: '0.6875rem', fontWeight: 700 }}>SM</Avatar>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.2 }}>Sarah Mitchell</Typography>
              <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', lineHeight: 1.2 }}>CSR</Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
