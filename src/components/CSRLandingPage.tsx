import { Box, Typography, Paper, Button, Divider, Chip } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { BLOOM } from '../theme';
import type { ScenarioId } from '../data/scenarios';

// ─── Style token ───────────────────────────────────────────────────────────────
const LABEL = {
  fontSize: '0.5625rem',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.8px',
  color: 'text.secondary',
};

// ─── SVG Donut Chart ───────────────────────────────────────────────────────────
function DonutChart({
  segments,
  size = 100,
  centerLabel,
  centerSub,
}: {
  segments: { value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const r = size * 0.36;
  const cx = size / 2;
  const cy = size / 2;
  const sw = size * 0.19;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0);
  let run = 0;
  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = `${pct * circ} ${circ}`;
          const off = -(run * circ);
          run += pct;
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth={sw}
              strokeDasharray={dash} strokeDashoffset={off} />
          );
        })}
      </svg>
      {(centerLabel || centerSub) && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          {centerLabel && <Typography sx={{ fontSize: size * 0.145, fontWeight: 700, lineHeight: 1 }}>{centerLabel}</Typography>}
          {centerSub   && <Typography sx={{ fontSize: size * 0.082, color: 'text.secondary', mt: 0.25 }}>{centerSub}</Typography>}
        </Box>
      )}
    </Box>
  );
}

// ─── Bar (horizontal progress) ─────────────────────────────────────────────────
function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <Box sx={{ height: 5, borderRadius: 3, bgcolor: BLOOM.canvas, overflow: 'hidden', flex: 1 }}>
      <Box sx={{ width: `${(value / max) * 100}%`, height: '100%', bgcolor: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
    </Box>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const CHANNEL_STATS = [
  { label: 'Portal Users',   value: '12,507', delta: '+342 today',  color: BLOOM.blue,       Icon: PersonOutlineIcon     },
  { label: 'Call Center',    value: '5,493',  delta: '4 in queue',  color: BLOOM.blueDark,   Icon: PhoneOutlinedIcon     },
  { label: 'Live Chats',     value: '3,720',  delta: '12 active',   color: BLOOM.green,      Icon: ChatBubbleOutlineIcon },
  { label: 'Email Inbound',  value: '1,720',  delta: '47 pending',  color: BLOOM.orange,     Icon: EmailOutlinedIcon     },
  { label: 'Email Outbound', value: '2,325',  delta: 'Sent today',  color: BLOOM.lightGreen, Icon: SendOutlinedIcon      },
];

const CHANNEL_SEGMENTS = [
  { label: 'Portal',   value: 42, color: BLOOM.blue      },
  { label: 'Chat',     value: 23, color: BLOOM.blueLight },
  { label: 'Call In',  value: 18, color: BLOOM.green     },
  { label: 'Call Out', value: 9,  color: BLOOM.orange    },
  { label: 'Email',    value: 8,  color: BLOOM.lightGreen},
];

const AGENT_STATUS = [
  { label: 'On Call',   count: 18, color: BLOOM.blue,          Icon: HeadsetMicOutlinedIcon      },
  { label: 'Available', count: 4,  color: BLOOM.green,         Icon: CheckCircleOutlineIcon      },
  { label: 'Away',      count: 2,  color: BLOOM.orange,        Icon: PauseCircleOutlineIcon      },
  { label: 'Wrap-Up',  count: 3,  color: BLOOM.textSecondary, Icon: AccessTimeOutlinedIcon      },
];

const CONV_SEGMENTS = [
  { label: 'Automated', value: 23, color: BLOOM.blueLight },
  { label: 'Triage',    value: 21, color: BLOOM.orange    },
  { label: 'Specialist',value: 15, color: BLOOM.blue      },
];

type Priority = 'critical' | 'high' | 'medium';
interface Escalation {
  id: ScenarioId;
  customer: string;
  initials: string;
  csr: string;
  issue: string;
  detail: string;
  priority: Priority;
  wait: string;
  sentiment: 'Negative' | 'Neutral';
  action: string;
}

const PRIORITY_CFG: Record<Priority, { color: string; bg: string; label: string }> = {
  critical: { color: BLOOM.red,    bg: BLOOM.redPale,  label: 'Critical' },
  high:     { color: '#b45309',    bg: '#fffbeb',      label: 'High'     },
  medium:   { color: BLOOM.blue,   bg: BLOOM.bluePale, label: 'Medium'   },
};

// Only escalations / coaching items the supervisor cares about
const ESCALATIONS: Escalation[] = [
  {
    id: 'escalation', customer: 'Frank Harrison', initials: 'FH', csr: 'Unassigned',
    issue: 'Claim Denial — Escalation Required',
    detail: '$31K denied · Cancel threat · 3 policies at risk · Supervisor requested',
    priority: 'critical', wait: '0:18', sentiment: 'Negative', action: 'Review',
  },
  {
    id: 'friction', customer: 'Margaret Torres', initials: 'MT', csr: 'Unassigned',
    issue: 'Claim Status — Friction Alert',
    detail: '3 contacts in 5 days · Escalation language detected · AI flagged',
    priority: 'critical', wait: '0:42', sentiment: 'Negative', action: 'Review',
  },
  {
    id: 'callback', customer: 'James Williams', initials: 'JW', csr: 'S. Mitchell',
    issue: 'Billing Inquiry — 47 min hold',
    detail: 'Callback recovery · Frustration risk · CSAT recovery opportunity',
    priority: 'high', wait: '47:12', sentiment: 'Negative', action: 'Monitor',
  },
  {
    id: 'adaptive', customer: 'David Park', initials: 'DP', csr: 'K. Davis',
    issue: 'Life Event — Cross-sell Opportunity',
    detail: 'New dependent · Beneficiary update · Annuity upsell flagged by AI',
    priority: 'medium', wait: '1:23', sentiment: 'Neutral', action: 'Coach',
  },
];

const SENTIMENT = [
  { label: 'Positive', value: 68, color: BLOOM.green         },
  { label: 'Neutral',  value: 21, color: BLOOM.textSecondary },
  { label: 'Negative', value: 11, color: BLOOM.red           },
];

const SUPERVISOR_STATS = [
  { value: '234',  label: 'Handled Today', sub: '+18 vs yesterday',    color: undefined   },
  { value: '7:18', label: 'Team Avg AHT',  sub: '↓ 0:24 below target', color: BLOOM.green },
  { value: '4.7',  label: 'Team CSAT',     sub: '↑ 0.1 last week',     color: BLOOM.green },
  { value: '9',    label: 'Queue Depth',   sub: '3 escalations active', color: '#b45309'   },
];

const AI_INSIGHTS = [
  {
    icon: '📈',
    title: 'Spike in Support Requests',
    metric: '+12.6%',
    metricColor: '#b45309',
    detail: 'Support volume elevated vs. prior 7-day average. AI routing prioritising urgent contacts across all channels.',
  },
  {
    icon: '🕐',
    title: 'Longer Wait Times — Midwest',
    metric: '−2:04',
    metricColor: BLOOM.red,
    detail: 'Avg wait in OH, MI, IN is 2:04 above SLA target. 3 agents reassigned from secondary overflow queue.',
  },
];

const RECENT: {
  customer: string; csr: string; state: string; issue: string;
  status: string; sentiment: 'Positive' | 'Neutral' | 'Negative'; stars: number;
  time: string; duration: string; claim: string;
}[] = [
  { customer: 'Lori S.',       csr: 'T. Nguyen',  state: 'TX', issue: 'Billing Question',  status: 'Open',   sentiment: 'Positive', stars: 5, time: '10:14', duration: '6:22',  claim: 'BL-4421' },
  { customer: 'Angela R.',     csr: 'S. Mitchell', state: 'OH', issue: 'Claims Handling',   status: 'Closed', sentiment: 'Neutral',  stars: 4, time: '09:52', duration: '8:41',  claim: 'CL-8841' },
  { customer: 'Priya F.',      csr: 'K. Davis',    state: 'FL', issue: 'Policy Questions',  status: 'Open',   sentiment: 'Positive', stars: 5, time: '09:31', duration: '5:15',  claim: '—'       },
  { customer: 'Dr. David H.',  csr: 'M. Okafor',   state: 'IN', issue: 'Billing',           status: 'Closed', sentiment: 'Negative', stars: 3, time: '09:08', duration: '12:33', claim: 'BL-7723' },
  { customer: 'Sandra K.',     csr: 'R. Chen',     state: 'GA', issue: 'Policy Maturity',   status: 'Open',   sentiment: 'Positive', stars: 5, time: '08:55', duration: '7:04',  claim: '—'       },
];

const ENTERPRISE_KPIS = [
  { value: '31,651', label: 'Monthly Interactions' },
  { value: '62K+',   label: 'Chat Messages'        },
  { value: '1,250',  label: 'Outbound Sent'        },
  { value: '6,293',  label: 'Policies Reviewed'    },
  { value: '4.2',    label: 'Avg CSAT (MTD)'       },
  { value: '74%',    label: 'First Contact Res.'   },
];

// ─── Main component ─────────────────────────────────────────────────────────────
interface CSRLandingPageProps {
  onAccept: (id: ScenarioId) => void;
}

export default function CSRLandingPage({ onAccept }: CSRLandingPageProps) {
  const totalAgents = AGENT_STATUS.reduce((a, s) => a + s.count, 0);

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default', p: 2.5, pb: 6 }}>

      {/* ── Page title + Supervisor KPIs ── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.25 }}>
        <Box>
          <Typography sx={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.4px', mb: 0.25 }}>
            Customer Engagement Console
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
            Welcome to Your Engagement Hub · Andrea Lopez, Engagement Supervisor · Thursday, February 19, 2026
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, flexShrink: 0 }}>
          {SUPERVISOR_STATS.map(s => (
            <Paper key={s.label} sx={{ p: 1.5, textAlign: 'center', minWidth: 88 }}>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.1, color: s.color ?? 'text.primary' }}>
                {s.value}
              </Typography>
              <Typography sx={{ ...LABEL, mt: 0.25 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '0.5rem', color: BLOOM.textTertiary, mt: 0.25 }}>{s.sub}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* ── Channel Stats Strip ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1.25, mb: 2.25 }}>
        {CHANNEL_STATS.map(ch => (
          <Paper key={ch.label} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, borderLeft: `3px solid ${ch.color}` }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '8px', flexShrink: 0, bgcolor: ch.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ch.Icon sx={{ fontSize: 18, color: ch.color }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.1, color: ch.color }}>{ch.value}</Typography>
              <Typography sx={{ ...LABEL, mt: 0.125 }}>{ch.label}</Typography>
              <Typography sx={{ fontSize: '0.5rem', color: BLOOM.textTertiary, mt: 0.125 }}>{ch.delta}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Main 3-column grid ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '220px 1fr 252px', gap: 2, mb: 2.25, alignItems: 'start' }}>

        {/* ── Col 1: Channels + Agent Status ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Channels Breakdown */}
          <Paper sx={{ p: 2 }}>
            <Typography sx={{ ...LABEL, mb: 1.5 }}>Channels Breakdown</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.75 }}>
              <DonutChart segments={CHANNEL_SEGMENTS} size={112} />
            </Box>
            {CHANNEL_SEGMENTS.map(seg => (
              <Box key={seg.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.875, mb: 0.875 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: seg.color, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', flex: 1 }}>{seg.label}</Typography>
                <Bar value={seg.value} max={100} color={seg.color} />
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, minWidth: 28, textAlign: 'right' }}>{seg.value}%</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1.25 }} />
            <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary' }}>Filters &amp; Quick Stats</Typography>
          </Paper>

          {/* Agent Team Status */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ ...LABEL }}>Agent Status</Typography>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700 }}>{totalAgents} total</Typography>
            </Box>
            {AGENT_STATUS.map(a => (
              <Box key={a.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <a.Icon sx={{ fontSize: 14, color: a.color, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', flex: 1 }}>{a.label}</Typography>
                <Bar value={a.count} max={totalAgents} color={a.color} />
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, minWidth: 20, textAlign: 'right', color: a.color }}>{a.count}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1.25 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: BLOOM.green,
                '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
                animation: 'pulse 2s ease infinite' }} />
              <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary' }}>All systems operational · Assure NLP active</Typography>
            </Box>
          </Paper>
        </Box>

        {/* ── Col 2: Active Conversations ── */}
        <Box>

          {/* Aggregate summary */}
          <Paper sx={{ p: 2, mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <DonutChart segments={CONV_SEGMENTS} size={76} centerLabel="59" centerSub="active" />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1, mb: 0.375 }}>
                  59.2 Active Conversations
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', mb: 1 }}>
                  Across all channels and agents
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {CONV_SEGMENTS.map(s => (
                    <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.625 }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: s.color }} />
                      <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>
                        {s.label}{' '}
                        <Box component="span" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Box>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right', flexShrink: 0, borderLeft: `1px solid ${BLOOM.border}`, pl: 2.5 }}>
                <Typography sx={{ ...LABEL, mb: 0.5 }}>Avg Handling Time</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1, color: BLOOM.green }}>
                  6<Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 400 }}>m </Typography>
                  14<Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 400 }}>s</Typography>
                </Typography>
                <Typography sx={{ fontSize: '0.5625rem', color: BLOOM.green, mt: 0.5, fontWeight: 600 }}>↓ On Target</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Needs Supervisor Attention */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: BLOOM.red }} />
              <Typography sx={{ ...LABEL }}>Needs Attention</Typography>
              <Box sx={{ px: 1.125, py: 0.25, borderRadius: '10px', bgcolor: BLOOM.redPale, color: BLOOM.red, fontSize: '0.5625rem', fontWeight: 700 }}>
                {ESCALATIONS.filter(e => e.priority === 'critical').length} critical
              </Box>
            </Box>
            <Typography sx={{ fontSize: '0.5625rem', fontWeight: 600, color: BLOOM.blue, cursor: 'pointer' }}>
              View all 9 in queue →
            </Typography>
          </Box>

          <Paper>
            {ESCALATIONS.map((item, i) => {
              const p = PRIORITY_CFG[item.priority];
              const sentColor = item.sentiment === 'Negative' ? BLOOM.red : BLOOM.textSecondary;
              const sentBg    = item.sentiment === 'Negative' ? BLOOM.redPale : BLOOM.canvas;
              return (
                <Box key={item.id} sx={{
                  display: 'flex', alignItems: 'center', gap: 1.75,
                  px: 2, py: 1.5,
                  borderBottom: i < ESCALATIONS.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none',
                  borderLeft: `3px solid ${p.color}`,
                  '&:hover': { bgcolor: BLOOM.canvas },
                  transition: 'background 0.12s',
                }}>
                  {/* Avatar */}
                  <Box sx={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, bgcolor: BLOOM.canvas, border: `1px solid ${BLOOM.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5625rem', fontWeight: 700, color: 'text.secondary' }}>
                    {item.initials}
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625, mb: 0.25, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.customer}</Typography>
                      <Box sx={{ fontSize: '0.4375rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', px: 0.625, py: 0.25, borderRadius: '3px', bgcolor: p.bg, color: p.color, flexShrink: 0 }}>
                        {p.label}
                      </Box>
                      <Box sx={{ fontSize: '0.4375rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', px: 0.625, py: 0.25, borderRadius: '3px', bgcolor: sentBg, color: sentColor, flexShrink: 0 }}>
                        {item.sentiment}
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'text.primary', mb: 0.125 }}>{item.issue}</Typography>
                    <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.detail} · CSR: {item.csr}
                    </Typography>
                  </Box>

                  {/* Wait */}
                  <Box sx={{ textAlign: 'right', flexShrink: 0, minWidth: 46 }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: item.priority === 'critical' ? BLOOM.red : '#b45309' }}>
                      {item.wait}
                    </Typography>
                    <Typography sx={{ fontSize: '0.4375rem', color: BLOOM.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>wait</Typography>
                  </Box>

                  {/* Supervisor action */}
                  <Button
                    variant={item.action === 'Review' ? 'contained' : 'outlined'}
                    size="small"
                    disableElevation
                    onClick={() => onAccept(item.id)}
                    color={item.action === 'Review' ? 'primary' : 'primary'}
                    sx={{
                      fontSize: '0.6875rem', fontWeight: 700, px: 1.75, flexShrink: 0,
                      ...(item.action !== 'Review' && {
                        borderColor: BLOOM.border,
                        color: 'text.secondary',
                        '&:hover': { borderColor: BLOOM.blue, color: BLOOM.blue, bgcolor: BLOOM.bluePale },
                      }),
                    }}
                  >
                    {item.action}
                  </Button>
                </Box>
              );
            })}
          </Paper>
        </Box>

        {/* ── Col 3: Outbound + Sentiment + Team Update ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Outbound Messaging */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
              <SendOutlinedIcon sx={{ fontSize: 14, color: BLOOM.blue }} />
              <Typography sx={{ ...LABEL, color: BLOOM.blue }}>Outbound Messaging</Typography>
            </Box>
            <Box sx={{ bgcolor: BLOOM.bluePale, borderRadius: '6px', p: 1.5, mb: 1.25, border: `1px solid ${BLOOM.border}` }}>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: BLOOM.blueDark, mb: 0.5 }}>
                Policyholders over Age 60
              </Typography>
              <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary', lineHeight: 1.55 }}>
                Prevent Storm Damage: secure outdoor items and review your annual coverage. Stay safe!{' '}
                <Typography component="span" sx={{ fontSize: '0.5625rem', color: BLOOM.blue, fontWeight: 600, cursor: 'pointer' }}>
                  Learn more
                </Typography>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" fullWidth disableElevation startIcon={<SendOutlinedIcon sx={{ fontSize: 13 }} />} sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                Send Message
              </Button>
              <Button variant="outlined" size="small" sx={{ fontSize: '0.75rem', fontWeight: 600, borderColor: BLOOM.border, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                Preview
              </Button>
            </Box>
          </Paper>

          {/* Sentiment Trends */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
              <SentimentSatisfiedOutlinedIcon sx={{ fontSize: 14, color: BLOOM.green }} />
              <Typography sx={{ ...LABEL }}>Sentiment Trends</Typography>
            </Box>
            {SENTIMENT.map(s => (
              <Box key={s.label} sx={{ mb: 1.375 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: s.color }} />
                    <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>{s.label}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: s.color }}>{s.value}%</Typography>
                </Box>
                <Box sx={{ height: 5, borderRadius: '3px', bgcolor: BLOOM.canvas, overflow: 'hidden' }}>
                  <Box sx={{ width: `${s.value}%`, height: '100%', bgcolor: s.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </Box>
              </Box>
            ))}
            <Divider sx={{ my: 1.25 }} />
            <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary', lineHeight: 1.55 }}>
              ↑ 1.4M+ trend events · Positive feedback on digital portal · Proactive outreach scoring well
            </Typography>
          </Paper>

          {/* Team Performance */}
          <Paper sx={{ p: 1.75, borderLeft: `3px solid ${BLOOM.blue}` }}>
            <Typography sx={{ ...LABEL, color: BLOOM.blue, mb: 0.875 }}>Team Performance</Typography>
            {[
              { label: 'FCR Rate',         value: '74%',   color: BLOOM.green  },
              { label: 'SLA Compliance',   value: '91%',   color: BLOOM.green  },
              { label: 'Escalation Rate',  value: '3.2%',  color: '#b45309'    },
              { label: 'Avg CSAT (MTD)',   value: '4.7',   color: BLOOM.green  },
            ].map(kpi => (
              <Box key={kpi.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>{kpi.label}</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: kpi.color }}>{kpi.value}</Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>

      {/* ── AI Customer Insights ── */}
      <Box sx={{ mb: 2.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875, mb: 1.25 }}>
          <AutoAwesomeIcon sx={{ fontSize: 14, color: BLOOM.blue }} />
          <Typography sx={{ ...LABEL }}>AI Customer Insights</Typography>
          <Chip label="Powered by Assure" size="small" sx={{ height: 16, fontSize: '0.4375rem', fontWeight: 700, bgcolor: BLOOM.bluePale, color: BLOOM.blueDark, letterSpacing: '0.3px', '& .MuiChip-label': { px: 1 } }} />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
          {AI_INSIGHTS.map(ins => (
            <Paper key={ins.title} sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5, borderLeft: `3px solid ${ins.metricColor}` }}>
              <Typography sx={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{ins.icon}</Typography>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.375, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>{ins.title}</Typography>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: ins.metricColor, fontVariantNumeric: 'tabular-nums' }}>{ins.metric}</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', lineHeight: 1.55 }}>{ins.detail}</Typography>
              </Box>
              <Button variant="text" size="small" sx={{ fontSize: '0.5625rem', fontWeight: 600, color: BLOOM.blue, flexShrink: 0, px: 1, whiteSpace: 'nowrap' }}>
                View Details
              </Button>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* ── Recent Engagements ── */}
      <Box sx={{ mb: 2.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
          <Typography sx={{ ...LABEL }}>Recent Engagements</Typography>
          <Typography sx={{ fontSize: '0.5625rem', fontWeight: 600, color: BLOOM.blue, cursor: 'pointer' }}>Export Report →</Typography>
        </Box>
        <Paper>
          {/* Header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '52px 120px 130px 44px 1fr 80px 64px 80px 64px 68px', px: 2, py: 1, bgcolor: BLOOM.canvas, borderBottom: `1px solid ${BLOOM.border}` }}>
            {['Time', 'Customer', 'CSR', 'State', 'Issue Category', 'Duration', 'Status', 'Sentiment', 'Claim #', 'Rating'].map(h => (
              <Typography key={h} sx={{ ...LABEL }}>{h}</Typography>
            ))}
          </Box>
          {/* Rows */}
          {RECENT.map((r, i) => {
            const sentColor = r.sentiment === 'Positive' ? BLOOM.green : r.sentiment === 'Negative' ? BLOOM.red : BLOOM.textSecondary;
            const sentBg    = r.sentiment === 'Positive' ? BLOOM.greenPale : r.sentiment === 'Negative' ? BLOOM.redPale : BLOOM.canvas;
            return (
              <Box key={i} sx={{
                display: 'grid', gridTemplateColumns: '52px 120px 130px 44px 1fr 80px 64px 80px 64px 68px',
                px: 2, py: 1.375,
                borderBottom: i < RECENT.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none',
                alignItems: 'center',
                '&:hover': { bgcolor: BLOOM.canvas },
                transition: 'background 0.1s',
              }}>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>{r.time}</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{r.customer}</Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>{r.csr}</Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>{r.state}</Typography>
                <Typography sx={{ fontSize: '0.6875rem' }}>{r.issue}</Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>{r.duration}</Typography>
                <Box>
                  <Box sx={{ display: 'inline-flex', px: 0.75, py: 0.375, borderRadius: '4px', bgcolor: r.status === 'Open' ? BLOOM.bluePale : BLOOM.canvas, color: r.status === 'Open' ? BLOOM.blue : BLOOM.textSecondary }}>
                    <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700 }}>{r.status}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'inline-flex', px: 0.75, py: 0.375, borderRadius: '4px', bgcolor: sentBg, color: sentColor }}>
                    <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700 }}>{r.sentiment}</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', fontFamily: 'monospace' }}>{r.claim}</Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: BLOOM.amber, letterSpacing: '1px' }}>
                  {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                </Typography>
              </Box>
            );
          })}
        </Paper>
      </Box>

      {/* ── Enterprise KPI footer strip ── */}
      <Paper sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 0.875, bgcolor: BLOOM.blueDark, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.6)' }}>
            Month-to-Date Enterprise KPIs
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {ENTERPRISE_KPIS.map((kpi, i) => (
            <Box
              key={kpi.label}
              sx={{
                p: 1.75, textAlign: 'center',
                borderRight: i < ENTERPRISE_KPIS.length - 1 ? `1px solid ${BLOOM.border}` : 'none',
              }}
            >
              <Typography sx={{ fontSize: '1.375rem', fontWeight: 700, lineHeight: 1.1, color: BLOOM.blue }}>
                {kpi.value}
              </Typography>
              <Typography sx={{ ...LABEL, mt: 0.375 }}>{kpi.label}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

    </Box>
  );
}
