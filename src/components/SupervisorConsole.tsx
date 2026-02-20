import { Box, Typography, Paper, Button, Chip, Divider } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import { BLOOM } from '../theme';
import type { ScenarioId } from '../data/scenarios';

// ─── SVG Donut ─────────────────────────────────────────────────────────────────
function DonutChart({ segments, size = 110, centerLabel, centerSub }: {
  segments: { value: number; color: string }[];
  size?: number; centerLabel?: string; centerSub?: string;
}) {
  const r = size * 0.35, cx = size / 2, cy = size / 2;
  const sw = size * 0.18, circ = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0);
  let run = 0;
  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={BLOOM.canvas} strokeWidth={sw} />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = `${pct * circ} ${circ}`;
          const off = -(run * circ);
          run += pct;
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={sw} strokeDasharray={dash} strokeDashoffset={off} />;
        })}
      </svg>
      {(centerLabel || centerSub) && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {centerLabel && <Typography sx={{ fontSize: size * 0.17, fontWeight: 800, lineHeight: 1, color: 'text.primary' }}>{centerLabel}</Typography>}
          {centerSub   && <Typography sx={{ fontSize: size * 0.09, color: 'text.secondary', mt: 0.25 }}>{centerSub}</Typography>}
        </Box>
      )}
    </Box>
  );
}

function StatBar({ value, max, color, height = 4 }: { value: number; max: number; color: string; height?: number }) {
  return (
    <Box sx={{ height, borderRadius: 2, bgcolor: BLOOM.canvasDark, overflow: 'hidden', flex: 1 }}>
      <Box sx={{ width: `${Math.min((value / max) * 100, 100)}%`, height: '100%', bgcolor: color, borderRadius: 2, transition: 'width 0.4s ease' }} />
    </Box>
  );
}

const LBL = { fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.8px', color: 'text.secondary' };

// ─── Data ──────────────────────────────────────────────────────────────────────
const CHANNEL_STATS = [
  { label: 'Portal Users',   value: '12,507', delta: '+342 today', color: BLOOM.blue,       Icon: PersonOutlineIcon     },
  { label: 'Call Center',    value: '5,493',  delta: '9 in queue', color: BLOOM.blueLight,  Icon: PhoneOutlinedIcon     },
  { label: 'Live Chats',     value: '3,720',  delta: '12 active',  color: BLOOM.green,      Icon: ChatBubbleOutlineIcon },
  { label: 'Email Inbound',  value: '1,720',  delta: '47 pending', color: BLOOM.orange,     Icon: EmailOutlinedIcon     },
  { label: 'Email Outbound', value: '2,325',  delta: 'Sent today', color: BLOOM.lightGreen, Icon: SendOutlinedIcon      },
];

const CHANNEL_SEGMENTS = [
  { label: 'Portal',   value: 42, color: BLOOM.blue      },
  { label: 'Chat',     value: 23, color: BLOOM.blueLight },
  { label: 'Call In',  value: 18, color: BLOOM.green     },
  { label: 'Call Out', value: 9,  color: BLOOM.orange    },
  { label: 'Email',    value: 8,  color: BLOOM.lightGreen},
];

const CONV_SEGMENTS = [
  { label: 'Automated', value: 23, color: BLOOM.blueLight },
  { label: 'Triage',    value: 21, color: BLOOM.orange    },
  { label: 'Specialist',value: 15, color: BLOOM.blue      },
];

const AGENT_STATUS = [
  { label: 'On Call',   count: 18, color: BLOOM.blue,          Icon: HeadsetMicOutlinedIcon  },
  { label: 'Available', count: 4,  color: BLOOM.green,         Icon: CheckCircleOutlineIcon  },
  { label: 'Wrap-Up',   count: 3,  color: BLOOM.orange,        Icon: AccessTimeOutlinedIcon  },
  { label: 'Away',      count: 2,  color: BLOOM.textSecondary, Icon: PauseCircleOutlineIcon  },
];

const SENTIMENT = [
  { label: 'Positive', value: 68, color: BLOOM.green,         bg: BLOOM.greenPale  },
  { label: 'Neutral',  value: 21, color: BLOOM.textSecondary, bg: BLOOM.canvas     },
  { label: 'Negative', value: 11, color: BLOOM.redDark,       bg: BLOOM.redPale    },
];

const AI_INSIGHTS = [
  { icon: '📈', title: 'Spike in Support Requests', metric: '+12.6%', metricColor: '#b45309', detail: 'Support volume elevated vs. prior 7-day average. AI routing prioritising urgent contacts across all channels.' },
  { icon: '🕐', title: 'Longer Wait Times — Midwest', metric: '−2:04', metricColor: BLOOM.redDark, detail: 'Average wait time in OH, MI, IN is 2:04 above SLA target. 3 agents reassigned from secondary overflow queue.' },
];

type Priority = 'critical' | 'high' | 'medium';
const P_CFG: Record<Priority, { color: string; bg: string; label: string }> = {
  critical: { color: BLOOM.redDark, bg: BLOOM.redPale,   label: 'Critical' },
  high:     { color: '#b45309',     bg: '#fffbeb',       label: 'High'     },
  medium:   { color: BLOOM.blue,    bg: BLOOM.bluePale,  label: 'Medium'   },
};

interface Escalation { id: ScenarioId; customer: string; initials: string; csr: string; issue: string; detail: string; priority: Priority; wait: string; action: string; }
const ESCALATIONS: Escalation[] = [
  { id: 'escalation', customer: 'Frank Harrison',  initials: 'FH', csr: 'Unassigned',  issue: 'Claim Denial — Escalation Required',  detail: '$31K denied · Cancel threat · 3 policies at risk',           priority: 'critical', wait: '0:18',  action: 'Review'  },
  { id: 'friction',   customer: 'Margaret Torres', initials: 'MT', csr: 'Unassigned',  issue: 'Claim Status — Friction Alert',       detail: '3 contacts in 5 days · Escalation language detected by AI',  priority: 'critical', wait: '0:42',  action: 'Review'  },
  { id: 'callback',   customer: 'James Williams',  initials: 'JW', csr: 'S. Mitchell', issue: 'Billing Inquiry — 47 min hold',       detail: 'Callback recovery · Frustration risk · CSAT opportunity',   priority: 'high',     wait: '47:12', action: 'Monitor' },
  { id: 'adaptive',   customer: 'David Park',      initials: 'DP', csr: 'K. Davis',    issue: 'Life Event — Cross-sell Opportunity', detail: 'New dependent · Beneficiary update · Annuity upsell flagged',priority: 'medium',   wait: '1:23',  action: 'Coach'   },
];

const RECENT: { customer: string; csr: string; state: string; issue: string; status: string; sentiment: 'Positive'|'Neutral'|'Negative'; stars: number; time: string; duration: string; claim: string }[] = [
  { customer: 'Lori S.',      csr: 'T. Nguyen',  state: 'TX', issue: 'Billing Question', status: 'Open',   sentiment: 'Positive', stars: 5, time: '10:14', duration: '6:22',  claim: 'BL-4421' },
  { customer: 'Angela R.',    csr: 'S. Mitchell', state: 'OH', issue: 'Claims Handling',  status: 'Closed', sentiment: 'Neutral',  stars: 4, time: '09:52', duration: '8:41',  claim: 'CL-8841' },
  { customer: 'Priya F.',     csr: 'K. Davis',    state: 'FL', issue: 'Policy Questions', status: 'Open',   sentiment: 'Positive', stars: 5, time: '09:31', duration: '5:15',  claim: '—'       },
  { customer: 'Dr. David H.', csr: 'M. Okafor',   state: 'IN', issue: 'Billing',          status: 'Closed', sentiment: 'Negative', stars: 3, time: '09:08', duration: '12:33', claim: 'BL-7723' },
  { customer: 'Sandra K.',    csr: 'R. Chen',     state: 'GA', issue: 'Policy Maturity',  status: 'Open',   sentiment: 'Positive', stars: 5, time: '08:55', duration: '7:04',  claim: '—'       },
];

const MTD_KPIS = [
  { value: '31,651', label: 'Monthly Interactions', color: BLOOM.blue       },
  { value: '62K+',   label: 'Chat Messages',        color: BLOOM.blueLight  },
  { value: '1,250',  label: 'Outbound Sent',        color: BLOOM.green      },
  { value: '74%',    label: 'First Contact Res.',   color: BLOOM.green      },
  { value: '91%',    label: 'SLA Compliance',       color: BLOOM.lightGreen },
  { value: '4.2',    label: 'Avg CSAT (MTD)',       color: BLOOM.green      },
];

interface SupervisorConsoleProps { onReview: (id: ScenarioId) => void; }

export default function SupervisorConsole({ onReview }: SupervisorConsoleProps) {
  const totalAgents = AGENT_STATUS.reduce((a, s) => a + s.count, 0);

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default', pb: 6 }}>

      {/* ── Command bar ── */}
      <Box sx={{
        background: `linear-gradient(135deg, ${BLOOM.blueDark} 0%, ${BLOOM.blue} 60%, ${BLOOM.blueLight} 100%)`,
        px: 3, py: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
            <Typography sx={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.4px', color: '#fff' }}>
              Customer Engagement Console
            </Typography>
            <Box sx={{ px: 0.875, py: 0.25, borderRadius: '4px', bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: BLOOM.lightGreen,
                  '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
                  animation: 'blink 1.5s ease infinite',
                }} />
                <Typography sx={{ fontSize: '0.4375rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#fff' }}>
                  Live
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)' }}>
            Welcome to Your Engagement Hub &nbsp;·&nbsp; Andrea Lopez, Engagement Supervisor &nbsp;·&nbsp; Thursday, February 19, 2026
          </Typography>
        </Box>

        {/* Supervisor KPIs */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[
            { value: '234',  label: 'Handled Today',  delta: '+18',  up: true  },
            { value: '7:18', label: 'Team Avg AHT',   delta: '−0:24',up: true  },
            { value: '4.7',  label: 'Team CSAT',      delta: '+0.1', up: true  },
            { value: '9',    label: 'Queue Depth',    delta: '3 esc',up: false },
          ].map(k => (
            <Box key={k.label} sx={{ textAlign: 'center', px: 1.75, py: 1, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', minWidth: 76 }}>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1, color: '#fff' }}>{k.value}</Typography>
              <Typography sx={{ fontSize: '0.4375rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'rgba(255,255,255,0.65)', mt: 0.25 }}>{k.label}</Typography>
              <Typography sx={{ fontSize: '0.4375rem', fontWeight: 600, color: k.up ? BLOOM.lightGreen : '#FFB74D', mt: 0.125 }}>{k.delta}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ p: 2.5 }}>

        {/* ── Channel Stats Strip ── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1.25, mb: 2.5 }}>
          {CHANNEL_STATS.map(ch => (
            <Paper key={ch.label} sx={{ p: 1.625, display: 'flex', alignItems: 'center', gap: 1.5, borderLeft: `3px solid ${ch.color}`, transition: 'box-shadow 0.15s', '&:hover': { boxShadow: `0 4px 16px ${ch.color}22` } }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '8px', flexShrink: 0, bgcolor: `${ch.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ch.Icon sx={{ fontSize: 18, color: ch.color }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '1.375rem', fontWeight: 800, lineHeight: 1, color: ch.color }}>{ch.value}</Typography>
                <Typography sx={{ ...LBL, mt: 0.25 }}>{ch.label}</Typography>
                <Typography sx={{ fontSize: '0.4875rem', color: 'text.disabled', mt: 0.125 }}>{ch.delta}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* ── Main 3-column grid ── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '220px 1fr 248px', gap: 2, mb: 2.5, alignItems: 'start' }}>

          {/* Col 1: Channels + Agent Status */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <Paper sx={{ p: 2 }}>
              <Typography sx={{ ...LBL, mb: 1.5 }}>Channels Breakdown</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
                <DonutChart segments={CHANNEL_SEGMENTS} size={114} />
              </Box>
              {CHANNEL_SEGMENTS.map(seg => (
                <Box key={seg.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.875, mb: 0.875 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: seg.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', flex: 1 }}>{seg.label}</Typography>
                  <StatBar value={seg.value} max={100} color={seg.color} />
                  <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, minWidth: 28, textAlign: 'right' }}>{seg.value}%</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1.25 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.5rem', color: 'text.disabled' }}>Filters &amp; Quick Stats</Typography>
                <Typography sx={{ fontSize: '0.5rem', fontWeight: 600, color: BLOOM.blue, cursor: 'pointer' }}>View All</Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25 }}>
                <Typography sx={{ ...LBL }}>Agent Status</Typography>
                <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, color: 'text.primary' }}>{totalAgents} total</Typography>
              </Box>
              {AGENT_STATUS.map(a => (
                <Box key={a.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.875, mb: 1 }}>
                  <a.Icon sx={{ fontSize: 13, color: a.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', flex: 1 }}>{a.label}</Typography>
                  <StatBar value={a.count} max={totalAgents} color={a.color} />
                  <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, color: a.color, minWidth: 18, textAlign: 'right' }}>{a.count}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1.25 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: BLOOM.green,
                  '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.25 } },
                  animation: 'pulse 2s ease infinite' }} />
                <Typography sx={{ fontSize: '0.5rem', color: 'text.disabled' }}>Assure NLP · All systems nominal</Typography>
              </Box>
            </Paper>
          </Box>

          {/* Col 2: Active Conversations + AI Insights + Escalations */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Aggregate bar */}
            <Paper sx={{ p: 2.25, borderTop: `3px solid ${BLOOM.blue}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <DonutChart segments={CONV_SEGMENTS} size={80} centerLabel="59" centerSub="active" />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1, color: BLOOM.blue, mb: 0.375 }}>
                    59.2 Active Conversations
                  </Typography>
                  <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', mb: 1.125 }}>Across all agents and channels</Typography>
                  <Box sx={{ display: 'flex', gap: 2.5 }}>
                    {CONV_SEGMENTS.map(s => (
                      <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.625 }}>
                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: s.color }} />
                        <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary' }}>
                          {s.label} <Box component="span" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Box>
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0, pl: 2.5, borderLeft: `1px solid ${BLOOM.border}` }}>
                  <Typography sx={{ ...LBL, mb: 0.5 }}>Avg Handling Time</Typography>
                  <Typography sx={{ fontSize: '1.875rem', fontWeight: 800, lineHeight: 1, color: BLOOM.green }}>
                    6<Typography component="span" sx={{ fontSize: '1rem', fontWeight: 400, color: 'text.secondary' }}>m </Typography>
                    14<Typography component="span" sx={{ fontSize: '1rem', fontWeight: 400, color: 'text.secondary' }}>s</Typography>
                  </Typography>
                  <Typography sx={{ fontSize: '0.5rem', color: BLOOM.green, mt: 0.5, fontWeight: 600 }}>↓ On Target</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.75, pt: 1.5, borderTop: `1px solid ${BLOOM.border}` }}>
                <Button size="small" variant="outlined" sx={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'none', px: 2 }}>
                  View All Active →
                </Button>
              </Box>
            </Paper>

            {/* AI Insights */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875, mb: 1.125 }}>
                <AutoAwesomeIcon sx={{ fontSize: 13, color: BLOOM.blue }} />
                <Typography sx={{ ...LBL }}>AI Customer Insights</Typography>
                <Chip label="Powered by Assure" size="small" sx={{ height: 16, fontSize: '0.375rem', fontWeight: 700, bgcolor: BLOOM.bluePale, color: BLOOM.blueDark, '& .MuiChip-label': { px: 1, letterSpacing: '0.3px' } }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {AI_INSIGHTS.map(ins => (
                  <Paper key={ins.title} sx={{ p: 1.875, display: 'flex', alignItems: 'flex-start', gap: 1.5, borderLeft: `3px solid ${ins.metricColor}` }}>
                    <Typography sx={{ fontSize: '1.375rem', lineHeight: 1, flexShrink: 0, mt: 0.125 }}>{ins.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.375, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>{ins.title}</Typography>
                        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 800, color: ins.metricColor, fontVariantNumeric: 'tabular-nums' }}>{ins.metric}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary', lineHeight: 1.55 }}>{ins.detail}</Typography>
                    </Box>
                    <Button size="small" variant="text" sx={{ fontSize: '0.5rem', fontWeight: 600, textTransform: 'none', color: BLOOM.blue, px: 1, flexShrink: 0, whiteSpace: 'nowrap' }}>
                      Details
                    </Button>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Escalations */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.125 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 13, color: BLOOM.redDark }} />
                  <Typography sx={{ ...LBL }}>Needs Attention</Typography>
                  <Box sx={{ px: 0.875, py: 0.25, borderRadius: '8px', bgcolor: BLOOM.redPale, border: `1px solid ${BLOOM.redBorder}` }}>
                    <Typography sx={{ fontSize: '0.4375rem', fontWeight: 700, color: BLOOM.redDark }}>
                      {ESCALATIONS.filter(e => e.priority === 'critical').length} CRITICAL
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '0.5rem', fontWeight: 600, color: BLOOM.blue, cursor: 'pointer' }}>
                  View all 9 →
                </Typography>
              </Box>
              <Paper>
                {ESCALATIONS.map((item, i) => {
                  const p = P_CFG[item.priority];
                  return (
                    <Box key={item.id} sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      px: 2, py: 1.375,
                      borderBottom: i < ESCALATIONS.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none',
                      borderLeft: `3px solid ${p.color}`,
                      transition: 'background 0.12s',
                      '&:hover': { bgcolor: BLOOM.canvas },
                    }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, bgcolor: BLOOM.canvas, border: `1px solid ${BLOOM.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5625rem', fontWeight: 700, color: 'text.secondary' }}>
                        {item.initials}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625, mb: 0.25, flexWrap: 'wrap' }}>
                          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.customer}</Typography>
                          <Box sx={{ px: 0.625, py: 0.125, borderRadius: '3px', bgcolor: p.bg }}>
                            <Typography sx={{ fontSize: '0.375rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: p.color }}>{p.label}</Typography>
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, mb: 0.125 }}>{item.issue}</Typography>
                        <Typography sx={{ fontSize: '0.5rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.detail} · CSR: {item.csr}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right', flexShrink: 0, minWidth: 44 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: item.priority === 'critical' ? BLOOM.redDark : '#b45309' }}>{item.wait}</Typography>
                        <Typography sx={{ fontSize: '0.375rem', color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px' }}>wait</Typography>
                      </Box>
                      <Button
                        variant={item.action === 'Review' ? 'contained' : 'outlined'}
                        size="small"
                        disableElevation
                        onClick={() => onReview(item.id)}
                        sx={{
                          fontSize: '0.5625rem', fontWeight: 700, px: 1.5, flexShrink: 0, textTransform: 'none',
                          ...(item.action !== 'Review' && { borderColor: BLOOM.border, color: 'text.secondary', '&:hover': { borderColor: BLOOM.blue, color: BLOOM.blue, bgcolor: BLOOM.bluePale } }),
                        }}
                      >{item.action}</Button>
                    </Box>
                  );
                })}
              </Paper>
            </Box>
          </Box>

          {/* Col 3: Outbound + Sentiment + Performance */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.375 }}>
                <SendOutlinedIcon sx={{ fontSize: 13, color: BLOOM.blue }} />
                <Typography sx={{ ...LBL, color: BLOOM.blue }}>Outbound Messaging</Typography>
              </Box>
              <Box sx={{ bgcolor: BLOOM.bluePale, borderRadius: '8px', p: 1.5, mb: 1.375, border: `1px solid ${BLOOM.border}` }}>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: BLOOM.blueDark, mb: 0.5 }}>
                  Policyholders over Age 60
                </Typography>
                <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary', lineHeight: 1.6 }}>
                  Prevent Storm Damage: secure outdoor items and review your annual coverage. Stay safe!{' '}
                  <Box component="span" sx={{ color: BLOOM.blue, fontWeight: 600, cursor: 'pointer' }}>Learn more</Box>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small" fullWidth disableElevation startIcon={<SendOutlinedIcon sx={{ fontSize: 12 }} />} sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'none' }}>
                  Send Message
                </Button>
                <Button variant="outlined" size="small" sx={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'none', borderColor: BLOOM.border, color: 'text.secondary', whiteSpace: 'nowrap', '&:hover': { borderColor: BLOOM.blue, color: BLOOM.blue } }}>
                  Preview
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
                <SentimentSatisfiedOutlinedIcon sx={{ fontSize: 13, color: BLOOM.green }} />
                <Typography sx={{ ...LBL }}>Sentiment Trends</Typography>
              </Box>
              {SENTIMENT.map(s => (
                <Box key={s.label} sx={{ mb: 1.375 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: s.color }} />
                      <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>{s.label}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: s.color }}>{s.value}%</Typography>
                  </Box>
                  <StatBar value={s.value} max={100} color={s.color} height={5} />
                </Box>
              ))}
              <Divider sx={{ my: 1.25 }} />
              <Typography sx={{ fontSize: '0.5rem', color: 'text.disabled', lineHeight: 1.6 }}>
                ↑ 1.4M+ trend events · Positive feedback on digital portal
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, borderLeft: `3px solid ${BLOOM.blue}` }}>
              <Typography sx={{ ...LBL, color: BLOOM.blue, mb: 1 }}>Team Performance</Typography>
              {[
                { label: 'FCR Rate',        value: '74%',  color: BLOOM.green       },
                { label: 'SLA Compliance',  value: '91%',  color: BLOOM.lightGreen  },
                { label: 'Escalation Rate', value: '3.2%', color: '#b45309'         },
                { label: 'Avg CSAT (MTD)',  value: '4.7',  color: BLOOM.green       },
              ].map(kpi => (
                <Box key={kpi.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.875 }}>
                  <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary' }}>{kpi.label}</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: kpi.color }}>{kpi.value}</Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>

        {/* ── Recent Engagements ── */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
            <Typography sx={{ ...LBL }}>Recent Engagements</Typography>
            <Typography sx={{ fontSize: '0.5rem', fontWeight: 600, color: BLOOM.blue, cursor: 'pointer' }}>Export Report →</Typography>
          </Box>
          <Paper>
            <Box sx={{ display: 'grid', gridTemplateColumns: '50px 115px 115px 40px 1fr 68px 58px 78px 60px 64px', px: 2, py: 1, bgcolor: BLOOM.canvas, borderBottom: `1px solid ${BLOOM.border}` }}>
              {['Time', 'Customer', 'CSR', 'ST', 'Issue Category', 'Duration', 'Status', 'Sentiment', 'Claim', 'Rating'].map(h => (
                <Typography key={h} sx={{ ...LBL }}>{h}</Typography>
              ))}
            </Box>
            {RECENT.map((r, i) => {
              const sColor = r.sentiment === 'Positive' ? BLOOM.green : r.sentiment === 'Negative' ? BLOOM.redDark : BLOOM.textSecondary;
              const sBg    = r.sentiment === 'Positive' ? BLOOM.greenPale : r.sentiment === 'Negative' ? BLOOM.redPale : BLOOM.canvas;
              return (
                <Box key={i} sx={{
                  display: 'grid', gridTemplateColumns: '50px 115px 115px 40px 1fr 68px 58px 78px 60px 64px',
                  px: 2, py: 1.375, alignItems: 'center',
                  borderBottom: i < RECENT.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none',
                  '&:hover': { bgcolor: BLOOM.canvas }, transition: 'background 0.1s',
                }}>
                  <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>{r.time}</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600 }}>{r.customer}</Typography>
                  <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>{r.csr}</Typography>
                  <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>{r.state}</Typography>
                  <Typography sx={{ fontSize: '0.625rem' }}>{r.issue}</Typography>
                  <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>{r.duration}</Typography>
                  <Box><Box sx={{ display: 'inline-flex', px: 0.75, py: 0.25, borderRadius: '4px', bgcolor: r.status === 'Open' ? BLOOM.bluePale : BLOOM.canvas, color: r.status === 'Open' ? BLOOM.blue : 'text.secondary' }}><Typography sx={{ fontSize: '0.4875rem', fontWeight: 700 }}>{r.status}</Typography></Box></Box>
                  <Box><Box sx={{ display: 'inline-flex', px: 0.75, py: 0.25, borderRadius: '4px', bgcolor: sBg, color: sColor }}><Typography sx={{ fontSize: '0.4875rem', fontWeight: 700 }}>{r.sentiment}</Typography></Box></Box>
                  <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary', fontFamily: 'monospace' }}>{r.claim}</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: BLOOM.amber, letterSpacing: '1px' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</Typography>
                </Box>
              );
            })}
          </Paper>
        </Box>

        {/* ── MTD KPI footer ── */}
        <Paper sx={{ overflow: 'hidden' }}>
          <Box sx={{ px: 2.5, py: 1, background: `linear-gradient(135deg, ${BLOOM.blueDark}, ${BLOOM.blue})`, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.4375rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.7)' }}>
              Month-to-Date Enterprise KPIs
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
            {MTD_KPIS.map((kpi, i) => (
              <Box key={kpi.label} sx={{ p: 2, textAlign: 'center', borderRight: i < MTD_KPIS.length - 1 ? `1px solid ${BLOOM.border}` : 'none' }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, color: kpi.color, mb: 0.375 }}>{kpi.value}</Typography>
                <Typography sx={{ ...LBL }}>{kpi.label}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>

      </Box>
    </Box>
  );
}
