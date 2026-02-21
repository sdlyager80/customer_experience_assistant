import { Box, Typography, Paper, Button } from '@mui/material';
import { BLOOM } from '../theme';
import type { ScenarioId } from '../data/scenarios';

type Priority = 'urgent' | 'high' | 'medium' | 'low';

interface QueueItem {
  id:       ScenarioId;
  customer: string;
  initials: string;
  policy:   string;
  issue:    string;
  detail:   string;
  channel:  'phone' | 'chat';
  priority: Priority;
  wait:     string;
  action?:  string;
}

const PRIORITY_CFG: Record<Priority, { color: string; bg: string; label: string }> = {
  urgent: { color: BLOOM.red,           bg: BLOOM.redPale,   label: 'Urgent' },
  high:   { color: BLOOM.orange,         bg: BLOOM.orangePale, label: 'High'   },
  medium: { color: BLOOM.blue,          bg: BLOOM.bluePale,  label: 'Medium' },
  low:    { color: BLOOM.textSecondary, bg: BLOOM.canvas,    label: 'Low'    },
};

const QUEUE: QueueItem[] = [
  { id: 'friction',   customer: 'Margaret Torres',   initials: 'MT', policy: 'FL-4421087AU',     issue: 'Claim #CLM-2026-4491 — Status Update',   detail: 'Friction · 3 contacts in 5 days · Escalation language',         channel: 'phone', priority: 'urgent', wait: '0:42'  },
  { id: 'callback',   customer: 'James Williams',    initials: 'JW', policy: 'TX-8820341HO',     issue: 'Billing Inquiry — Callback Recovery',     detail: '47 min hold · Frustration risk · CSAT recovery',               channel: 'phone', priority: 'high',   wait: '47:12' },
  { id: 'adaptive',   customer: 'David Park',        initials: 'DP', policy: 'CA-5591234UL',     issue: 'Coverage Review — Life Event',            detail: 'New dependent · Beneficiary update needed',                     channel: 'phone', priority: 'medium', wait: '1:23'  },
  { id: 'omni',       customer: 'Sarah Johnson',     initials: 'SJ', policy: 'WA-3310987AU',     issue: 'Billing Clarification',                   detail: 'Portal → Chatbot → Chat · Context loaded',                      channel: 'chat',  priority: 'medium', wait: '0:58'  },
  { id: 'workforce',  customer: 'Robert Chen',       initials: 'RC', policy: '440387261UL',      issue: 'Policy Loan — $75,000',                   detail: 'Universal Life · IVR routed · Skills match',                    channel: 'phone', priority: 'low',    wait: '2:14'  },
  { id: 'lifeevent',  customer: 'Patricia Martinez', initials: 'PM', policy: 'NV-7740123TL',     issue: 'Policy Maturity — Outbound',              detail: '20-yr term · 90 days remaining · Annuity candidate',            channel: 'phone', priority: 'low',    wait: '—'     },
  { id: 'lifepolicy', customer: 'Catherine Brooks',  initials: 'CB', policy: 'WL-2018-44219',    issue: 'Whole Life Review — Dividend Election',   detail: 'Paid-up additions inquiry · Cash value optimization',           channel: 'phone', priority: 'medium', wait: '1:45'  },
  { id: 'ivrstp',     customer: 'Linda Reyes',       initials: 'LR', policy: 'TX-AU-2024-8832',  issue: 'Address Update — IVR STP Active',         detail: '⚡ Assure Auto-Processing · No CSR Action Required',            channel: 'phone', priority: 'low',    wait: '0:34', action: 'Monitor' },
  { id: 'escalation', customer: 'Frank Harrison',    initials: 'FH', policy: 'TX-HO-2023-65219', issue: 'Claim Denial — Escalation Required',      detail: '$31K claim denied · Cancel threat · 3 policies at risk',        channel: 'phone', priority: 'urgent', wait: '0:18'  },
];

const RECENT = [
  { customer: 'Elena Murphy',   issue: 'Claim status inquiry', time: '10:14', duration: '8:22', stars: 5 },
  { customer: 'Thomas Nguyen',  issue: 'Billing question',     time: '09:52', duration: '5:47', stars: 4 },
  { customer: 'Karen Davis',    issue: 'Address & beneficiary',time: '09:31', duration: '6:15', stars: 5 },
  { customer: 'Michael Okafor', issue: 'Premium payment query',time: '09:08', duration: '4:33', stars: 4 },
];

const STATS = [
  { value: '12',   label: 'Handled Today',   sub: '+3 vs yesterday',     color: undefined       },
  { value: '7:42', label: 'Avg Handle Time', sub: '↓ 0:18 below target', color: BLOOM.green     },
  { value: '4.8',  label: 'CSAT (Today)',    sub: '↑ 0.2 from this week',color: BLOOM.green     },
  { value: '6',    label: 'Queue Depth',     sub: '2 urgent waiting',    color: BLOOM.orange    },
];

interface CSRLandingPageProps { onAccept: (id: ScenarioId) => void; }

export default function CSRLandingPage({ onAccept }: CSRLandingPageProps) {
  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default', p: 3, pb: 5 }}>

      {/* Welcome banner */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.3px', mb: 0.25 }}>
          Good morning, Sarah Mitchell
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
          CSR II · L&A Servicing · Thursday, February 19, 2026
        </Typography>
      </Box>

      {/* Stats row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.25, mb: 3 }}>
        {STATS.map(s => (
          <Paper key={s.label} sx={{ p: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.1, color: 'text.primary' }}>
              {s.value}
            </Typography>
            <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mt: 0.375 }}>
              {s.label}
            </Typography>
            <Typography sx={{ fontSize: '0.5625rem', color: BLOOM.textSecondary, mt: 0.25 }}>{s.sub}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Main grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 2, alignItems: 'start' }}>

        {/* Active Queue */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary' }}>
              Active Queue
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625 }}>
              <Box sx={{
                width: 6, height: 6, borderRadius: '50%', bgcolor: BLOOM.red,
                '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
                animation: 'blink 1.2s ease infinite',
              }} />
              <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: BLOOM.red, textTransform: 'uppercase', letterSpacing: '1px' }}>Live</Typography>
            </Box>
          </Box>

          <Paper>
            {QUEUE.map((item, i) => {
              const p = PRIORITY_CFG[item.priority];
              return (
                <Box key={item.id} sx={{
                  display: 'flex', alignItems: 'center', gap: 1.75,
                  px: 2.25, py: 1.5,
                  borderBottom: i < QUEUE.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none',
                  borderLeft: `3px solid ${p.color}`,
                  transition: 'background 0.12s',
                  '&:hover': { bgcolor: BLOOM.canvas },
                }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, bgcolor: BLOOM.canvas, border: `1px solid ${BLOOM.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, color: 'text.secondary' }}>
                    {item.initials}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.customer}</Typography>
                      <Box sx={{ fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', px: 0.75, py: 0.25, borderRadius: '3px', bgcolor: p.bg, color: p.color, flexShrink: 0 }}>
                        {p.label}
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'text.primary', mb: 0.125 }}>{item.issue}</Typography>
                    <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>
                      {item.channel === 'phone' ? '📞' : '💬'} {item.detail} · {item.policy}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0, minWidth: 52 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: item.priority === 'urgent' ? BLOOM.red : item.priority === 'high' ? BLOOM.orange : BLOOM.textSecondary }}>
                      {item.wait}
                    </Typography>
                    <Typography sx={{ fontSize: '0.5rem', color: BLOOM.textSecondary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>wait</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    disableElevation
                    onClick={() => onAccept(item.id)}
                    sx={{
                      fontSize: '0.6875rem', fontWeight: 700, px: 2.25, flexShrink: 0,
                      ...(item.action === 'Monitor' && {
                        bgcolor: BLOOM.blueLight, '&:hover': { bgcolor: BLOOM.blue },
                      }),
                    }}
                  >
                    {item.action ?? 'Accept'}
                  </Button>
                </Box>
              );
            })}
          </Paper>
        </Box>

        {/* Right column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          <Paper sx={{ p: 1.75, borderLeft: `3px solid ${BLOOM.blue}` }}>
            <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: BLOOM.blue, mb: 0.625 }}>
              Team Update
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.6, color: 'text.secondary' }}>
              CSAT target hit — <strong style={{ color: '#1e293b' }}>4.8 avg this week</strong> 🎉<br />
              New UL loan guidelines effective <strong style={{ color: '#1e293b' }}>Feb 21</strong>. Review before processing loans.
            </Typography>
          </Paper>

          <Paper sx={{ p: 1.75, borderLeft: `3px solid ${BLOOM.blueLight}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.625 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: BLOOM.green }} />
              <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: BLOOM.blue }}>
                Assure Orchestration
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.5 }}>
              All systems operational · NLP pipeline active · Context engine ready
            </Typography>
          </Paper>

          <Box>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1.25 }}>
              Recently Completed
            </Typography>
            <Paper>
              {RECENT.map((r, i) => (
                <Box key={i} sx={{ px: 2, py: 1.25, borderBottom: i < RECENT.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.25 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{r.customer}</Typography>
                    <Typography sx={{ fontSize: '0.5625rem', color: BLOOM.textSecondary }}>{r.time}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>{r.issue} · {r.duration}</Typography>
                    <Typography sx={{ fontSize: '0.625rem', color: BLOOM.orange, letterSpacing: '1px' }}>
                      {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
