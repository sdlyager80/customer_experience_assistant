import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { BLOOM } from '../theme';
import type { ScenarioId } from '../data/scenarios';

// ─── Shared style token ────────────────────────────────────────────────────────
const SECTION_LABEL = {
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
  label,
}: {
  segments: { value: number; color: string }[];
  size?: number;
  label?: string;
}) {
  const r = size * 0.36;
  const cx = size / 2;
  const cy = size / 2;
  const strokeW = size * 0.19;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  let running = 0;

  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = `${pct * circ} ${circ}`;
          const offset = -(running * circ);
          running += pct;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeW}
              strokeDasharray={dash}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>
      {label && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography sx={{ fontSize: size * 0.135, fontWeight: 700, lineHeight: 1, color: 'text.primary' }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: size * 0.085, color: 'text.secondary', mt: 0.25 }}>
            active
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────
type Priority = 'urgent' | 'high' | 'medium' | 'low';

interface QueueItem {
  id: ScenarioId;
  customer: string;
  initials: string;
  policy: string;
  issue: string;
  detail: string;
  channel: 'phone' | 'chat';
  priority: Priority;
  wait: string;
  action?: string;
}

const PRIORITY_CFG: Record<Priority, { color: string; bg: string; label: string }> = {
  urgent: { color: BLOOM.red,           bg: BLOOM.redPale,   label: 'Urgent' },
  high:   { color: '#b45309',           bg: '#fffbeb',       label: 'High'   },
  medium: { color: BLOOM.blue,          bg: BLOOM.bluePale,  label: 'Medium' },
  low:    { color: BLOOM.textSecondary, bg: BLOOM.canvas,    label: 'Low'    },
};

const QUEUE: QueueItem[] = [
  {
    id: 'friction', customer: 'Margaret Torres', initials: 'MT',
    policy: 'FL-4421087AU', issue: 'Claim #CLM-2026-4491 — Status Update',
    detail: 'Friction · 3 contacts in 5 days · Escalation language', channel: 'phone',
    priority: 'urgent', wait: '0:42',
  },
  {
    id: 'callback', customer: 'James Williams', initials: 'JW',
    policy: 'TX-8820341HO', issue: 'Billing Inquiry — Callback Recovery',
    detail: '47 min hold · Frustration risk · CSAT recovery', channel: 'phone',
    priority: 'high', wait: '47:12',
  },
  {
    id: 'adaptive', customer: 'David Park', initials: 'DP',
    policy: 'CA-5591234UL', issue: 'Coverage Review — Life Event',
    detail: 'New dependent · Beneficiary update needed', channel: 'phone',
    priority: 'medium', wait: '1:23',
  },
  {
    id: 'omni', customer: 'Sarah Johnson', initials: 'SJ',
    policy: 'WA-3310987AU', issue: 'Billing Clarification',
    detail: 'Portal → Chatbot → Chat · Context loaded', channel: 'chat',
    priority: 'medium', wait: '0:58',
  },
  {
    id: 'workforce', customer: 'Robert Chen', initials: 'RC',
    policy: '440387261UL', issue: 'Policy Loan — $75,000',
    detail: 'Universal Life · IVR routed · Skills match', channel: 'phone',
    priority: 'low', wait: '2:14',
  },
  {
    id: 'lifeevent', customer: 'Patricia Martinez', initials: 'PM',
    policy: 'NV-7740123TL', issue: 'Policy Maturity — Outbound',
    detail: '20-yr term · 90 days remaining · Annuity candidate', channel: 'phone',
    priority: 'low', wait: '—',
  },
  {
    id: 'lifepolicy', customer: 'Catherine Brooks', initials: 'CB',
    policy: 'WL-2018-44219', issue: 'Whole Life Review — Dividend Election',
    detail: 'Paid-up additions inquiry · Cash value optimization', channel: 'phone',
    priority: 'medium', wait: '1:45',
  },
  {
    id: 'ivrstp', customer: 'Linda Reyes', initials: 'LR',
    policy: 'TX-AU-2024-8832', issue: 'Address Update — IVR STP Active',
    detail: '⚡ Assure Auto-Processing · No CSR Action Required', channel: 'phone',
    priority: 'low', wait: '0:34', action: 'Monitor',
  },
  {
    id: 'escalation', customer: 'Frank Harrison', initials: 'FH',
    policy: 'TX-HO-2023-65219', issue: 'Claim Denial — Escalation Required',
    detail: '$31K claim denied · Cancel threat · 3 policies at risk', channel: 'phone',
    priority: 'urgent', wait: '0:18',
  },
];

const CHANNEL_STATS = [
  { label: 'Portal Users',   value: '12,507', delta: '+342 today',  color: BLOOM.blue,       Icon: PersonOutlineIcon   },
  { label: 'Call Center',    value: '5,493',  delta: '4 in queue',  color: BLOOM.blueDark,   Icon: PhoneOutlinedIcon   },
  { label: 'Live Chats',     value: '3,720',  delta: '12 active',   color: BLOOM.green,      Icon: ChatBubbleOutlineIcon },
  { label: 'Email Inbound',  value: '1,720',  delta: '47 pending',  color: BLOOM.orange,     Icon: EmailOutlinedIcon   },
  { label: 'Email Outbound', value: '2,325',  delta: 'Sent today',  color: BLOOM.lightGreen, Icon: SendOutlinedIcon    },
];

const CHANNEL_SEGMENTS = [
  { label: 'Portal',   value: 42, color: BLOOM.blue      },
  { label: 'Chat',     value: 23, color: BLOOM.blueLight },
  { label: 'Call In',  value: 18, color: BLOOM.green     },
  { label: 'Call Out', value: 9,  color: BLOOM.orange    },
  { label: 'Email',    value: 8,  color: BLOOM.lightGreen},
];

const CONVERSATION_SEGMENTS = [
  { value: 23, color: BLOOM.blueLight },  // Automated
  { value: 21, color: BLOOM.orange    },  // Triage
  { value: 15, color: BLOOM.blue      },  // Specialist
];

const SENTIMENT = [
  { label: 'Positive', value: 68, color: BLOOM.green,         bg: BLOOM.greenPale  },
  { label: 'Neutral',  value: 21, color: BLOOM.textSecondary, bg: BLOOM.canvas     },
  { label: 'Negative', value: 11, color: BLOOM.red,           bg: BLOOM.redPale    },
];

const PERSONAL_STATS = [
  { value: '12',   label: 'Handled Today',  sub: '+3 vs yesterday',     color: undefined   },
  { value: '7:42', label: 'Avg Handle Time',sub: '↓ 0:18 below target', color: BLOOM.green },
  { value: '4.8',  label: 'CSAT Today',     sub: '↑ 0.2 this week',     color: BLOOM.green },
  { value: '6',    label: 'Queue Depth',    sub: '2 urgent waiting',     color: '#b45309'   },
];

const AI_INSIGHTS = [
  {
    icon: '📈',
    title: 'Spike in Support Requests',
    metric: '+12.6%',
    metricColor: '#b45309',
    detail: 'Support volume elevated vs. prior 7-day average. AI routing prioritising urgent contacts.',
  },
  {
    icon: '🕐',
    title: 'Longer Wait Times — Midwest',
    metric: '−2:04',
    metricColor: BLOOM.red,
    detail: 'Average wait in OH, MI, IN is 2:04 above target. 3 agents reassigned from overflow queue.',
  },
];

const RECENT = [
  { customer: 'Lori S.',      state: 'TX', issue: 'Billing Question',  status: 'Open',   sentiment: 'Positive', stars: 5, time: '10:14', claim: 'BL-4421' },
  { customer: 'Angela R.',    state: 'OH', issue: 'Claims Handling',   status: 'Closed', sentiment: 'Neutral',  stars: 4, time: '09:52', claim: 'CL-8841' },
  { customer: 'Priya F.',     state: 'FL', issue: 'Policy Questions',  status: 'Open',   sentiment: 'Positive', stars: 5, time: '09:31', claim: '—'       },
  { customer: 'Dr. David H.', state: 'IN', issue: 'Billing',           status: 'Closed', sentiment: 'Negative', stars: 3, time: '09:08', claim: 'BL-7723' },
];

// ─── Component ─────────────────────────────────────────────────────────────────
interface CSRLandingPageProps {
  onAccept: (id: ScenarioId) => void;
}

export default function CSRLandingPage({ onAccept }: CSRLandingPageProps) {
  const urgentCount = QUEUE.filter(q => q.priority === 'urgent').length;

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default', p: 2.5, pb: 6 }}>

      {/* ── Welcome + Personal Stats ── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.25 }}>
        <Box>
          <Typography sx={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.4px', mb: 0.25 }}>
            Welcome to Your Engagement Hub
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
            Good morning, Sarah Mitchell · CSR II · L&A Servicing · Thursday, February 19, 2026
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, flexShrink: 0 }}>
          {PERSONAL_STATS.map(s => (
            <Paper key={s.label} sx={{ p: 1.5, textAlign: 'center', minWidth: 88 }}>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.1, color: s.color ?? 'text.primary' }}>
                {s.value}
              </Typography>
              <Typography sx={{ ...SECTION_LABEL, mt: 0.25 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '0.5rem', color: BLOOM.textTertiary, mt: 0.25 }}>{s.sub}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* ── Channel Stats Strip ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1.25, mb: 2.25 }}>
        {CHANNEL_STATS.map(ch => (
          <Paper
            key={ch.label}
            sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, borderLeft: `3px solid ${ch.color}` }}
          >
            <Box sx={{
              width: 34, height: 34, borderRadius: '8px', flexShrink: 0,
              bgcolor: ch.color + '1A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ch.Icon sx={{ fontSize: 18, color: ch.color }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.1, color: ch.color }}>
                {ch.value}
              </Typography>
              <Typography sx={{ ...SECTION_LABEL, mt: 0.125 }}>{ch.label}</Typography>
              <Typography sx={{ fontSize: '0.5rem', color: BLOOM.textTertiary, mt: 0.125 }}>{ch.delta}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Main 3-column grid ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '220px 1fr 252px', gap: 2, mb: 2.25, alignItems: 'start' }}>

        {/* Col 1 — Channels Breakdown + System Status */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Channels Breakdown */}
          <Paper sx={{ p: 2 }}>
            <Typography sx={{ ...SECTION_LABEL, mb: 1.5 }}>Channels Breakdown</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.75 }}>
              <DonutChart segments={CHANNEL_SEGMENTS} size={112} />
            </Box>
            {CHANNEL_SEGMENTS.map(seg => (
              <Box key={seg.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.875 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: seg.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>{seg.label}</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700 }}>{seg.value}%</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1.25 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary' }}>Filters & Quick Stats</Typography>
              <Typography sx={{ fontSize: '0.5625rem', fontWeight: 600, color: BLOOM.blue, cursor: 'pointer' }}>
                View All
              </Typography>
            </Box>
          </Paper>

          {/* Assure Orchestration */}
          <Paper sx={{ p: 1.75, borderLeft: `3px solid ${BLOOM.blueLight}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.625 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: BLOOM.green }} />
              <Typography sx={{ ...SECTION_LABEL, color: BLOOM.blue }}>
                Assure Orchestration
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', lineHeight: 1.55 }}>
              All systems operational · NLP pipeline active · Context engine ready
            </Typography>
          </Paper>
        </Box>

        {/* Col 2 — Active Conversations + Queue */}
        <Box>
          {/* Conversation summary bar */}
          <Paper sx={{ p: 2, mb: 1.5, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <DonutChart segments={CONVERSATION_SEGMENTS} size={72} label="59" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1, mb: 0.25 }}>
                59.2 Active Conversations
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 0.875 }}>
                {[
                  { label: 'Automated', value: 23, color: BLOOM.blueLight },
                  { label: 'Triage',    value: 21, color: BLOOM.orange    },
                  { label: 'Specialist',value: 15, color: BLOOM.blue      },
                ].map(seg => (
                  <Box key={seg.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.625 }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: seg.color }} />
                    <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>
                      {seg.label} <strong style={{ color: seg.color }}>{seg.value}</strong>
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Typography sx={{ ...SECTION_LABEL, mb: 0.5 }}>Avg Handling Time</Typography>
              <Typography sx={{ fontSize: '1.375rem', fontWeight: 700, lineHeight: 1, color: BLOOM.green }}>
                6<Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>m </Typography>
                14<Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>s</Typography>
              </Typography>
            </Box>
          </Paper>

          {/* Live Queue */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Typography sx={{ ...SECTION_LABEL }}>Active Queue</Typography>
              <Box sx={{ px: 1.25, py: 0.25, borderRadius: '10px', bgcolor: BLOOM.blue, color: '#fff', fontSize: '0.625rem', fontWeight: 700 }}>
                {QUEUE.length}
              </Box>
              {urgentCount > 0 && (
                <Box sx={{ px: 1.25, py: 0.25, borderRadius: '10px', bgcolor: BLOOM.redPale, color: BLOOM.red, fontSize: '0.625rem', fontWeight: 700 }}>
                  {urgentCount} urgent
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625 }}>
              <Box sx={{
                width: 6, height: 6, borderRadius: '50%', bgcolor: BLOOM.red,
                '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
                animation: 'blink 1.2s ease infinite',
              }} />
              <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: BLOOM.red, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Live
              </Typography>
            </Box>
          </Box>

          <Paper>
            {QUEUE.map((item, i) => {
              const p = PRIORITY_CFG[item.priority];
              return (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.75,
                    px: 2, py: 1.375,
                    borderBottom: i < QUEUE.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none',
                    borderLeft: `3px solid ${p.color}`,
                    transition: 'background 0.12s',
                    '&:hover': { bgcolor: BLOOM.canvas },
                  }}
                >
                  {/* Avatar */}
                  <Box sx={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    bgcolor: BLOOM.canvas, border: `1px solid ${BLOOM.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.5625rem', fontWeight: 700, color: 'text.secondary',
                  }}>
                    {item.initials}
                  </Box>

                  {/* Customer + issue */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625, mb: 0.25, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.customer}</Typography>
                      <Box sx={{ fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', px: 0.625, py: 0.25, borderRadius: '3px', bgcolor: p.bg, color: p.color, flexShrink: 0 }}>
                        {p.label}
                      </Box>
                      {item.channel === 'chat' && (
                        <Box sx={{ fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', px: 0.625, py: 0.25, borderRadius: '3px', bgcolor: BLOOM.greenPale, color: BLOOM.greenDark, flexShrink: 0 }}>
                          Chat
                        </Box>
                      )}
                    </Box>
                    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'text.primary', mb: 0.125 }}>
                      {item.issue}
                    </Typography>
                    <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.channel === 'phone' ? '📞' : '💬'} {item.detail} · {item.policy}
                    </Typography>
                  </Box>

                  {/* Wait */}
                  <Box sx={{ textAlign: 'right', flexShrink: 0, minWidth: 46 }}>
                    <Typography sx={{
                      fontSize: '0.8125rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                      color: item.priority === 'urgent' ? BLOOM.red : item.priority === 'high' ? '#b45309' : BLOOM.textSecondary,
                    }}>
                      {item.wait}
                    </Typography>
                    <Typography sx={{ fontSize: '0.4375rem', color: BLOOM.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>wait</Typography>
                  </Box>

                  {/* Action */}
                  <Button
                    variant={item.action === 'Monitor' ? 'outlined' : 'contained'}
                    size="small"
                    disableElevation
                    onClick={() => onAccept(item.id)}
                    sx={{
                      fontSize: '0.6875rem', fontWeight: 700, px: 2, flexShrink: 0,
                      ...(item.action === 'Monitor' && {
                        borderColor: BLOOM.blueLight,
                        color: BLOOM.blueLight,
                        '&:hover': { borderColor: BLOOM.blue, color: BLOOM.blue, bgcolor: BLOOM.bluePale },
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

        {/* Col 3 — Outbound + Sentiment + Team Update */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Outbound Messaging */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
              <SendOutlinedIcon sx={{ fontSize: 14, color: BLOOM.blue }} />
              <Typography sx={{ ...SECTION_LABEL, color: BLOOM.blue }}>Outbound Messaging</Typography>
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
            <Button
              variant="contained"
              size="small"
              fullWidth
              disableElevation
              startIcon={<SendOutlinedIcon sx={{ fontSize: 13 }} />}
              sx={{ fontSize: '0.75rem', fontWeight: 600 }}
            >
              Send Message
            </Button>
          </Paper>

          {/* Sentiment Trends */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
              <SentimentSatisfiedOutlinedIcon sx={{ fontSize: 14, color: BLOOM.green }} />
              <Typography sx={{ ...SECTION_LABEL }}>Sentiment Trends</Typography>
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
              ↑ 1.4M+ trend events · Positive feedback on new digital portal · Customers responding well to proactive outreach
            </Typography>
          </Paper>

          {/* Team Announcement */}
          <Paper sx={{ p: 1.75, borderLeft: `3px solid ${BLOOM.blue}` }}>
            <Typography sx={{ ...SECTION_LABEL, color: BLOOM.blue, mb: 0.625 }}>
              Team Update
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', lineHeight: 1.6, color: 'text.secondary' }}>
              CSAT target hit —{' '}
              <strong style={{ color: '#1e293b' }}>4.8 avg this week</strong> 🎉
              <br />
              New UL loan guidelines effective{' '}
              <strong style={{ color: '#1e293b' }}>Feb 21</strong>. Review before processing loans.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* ── AI Customer Insights ── */}
      <Box sx={{ mb: 2.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875, mb: 1.25 }}>
          <AutoAwesomeIcon sx={{ fontSize: 14, color: BLOOM.blue }} />
          <Typography sx={{ ...SECTION_LABEL }}>AI Customer Insights</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
          {AI_INSIGHTS.map(ins => (
            <Paper
              key={ins.title}
              sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5, borderLeft: `3px solid ${ins.metricColor}` }}
            >
              <Typography sx={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{ins.icon}</Typography>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.375, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>{ins.title}</Typography>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: ins.metricColor, fontVariantNumeric: 'tabular-nums' }}>
                    {ins.metric}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', lineHeight: 1.55 }}>{ins.detail}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* ── Recent Engagements ── */}
      <Box>
        <Typography sx={{ ...SECTION_LABEL, mb: 1.25 }}>Recent Engagements</Typography>
        <Paper>
          {/* Header row */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '52px 130px 44px 1fr 80px 64px 80px 72px',
            px: 2, py: 1,
            bgcolor: BLOOM.canvas,
            borderBottom: `1px solid ${BLOOM.border}`,
          }}>
            {['Time', 'Customer', 'State', 'Issue Category', 'Claim #', 'Status', 'Sentiment', 'CSR Rating'].map(h => (
              <Typography key={h} sx={{ ...SECTION_LABEL }}>{h}</Typography>
            ))}
          </Box>

          {/* Data rows */}
          {RECENT.map((r, i) => {
            const sentimentColor = r.sentiment === 'Positive' ? BLOOM.green : r.sentiment === 'Negative' ? BLOOM.red : BLOOM.textSecondary;
            const sentimentBg    = r.sentiment === 'Positive' ? BLOOM.greenPale : r.sentiment === 'Negative' ? BLOOM.redPale : BLOOM.canvas;
            return (
              <Box
                key={i}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '52px 130px 44px 1fr 80px 64px 80px 72px',
                  px: 2, py: 1.375,
                  borderBottom: i < RECENT.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none',
                  alignItems: 'center',
                  '&:hover': { bgcolor: BLOOM.canvas },
                  transition: 'background 0.1s',
                }}
              >
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                  {r.time}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{r.customer}</Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>{r.state}</Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.primary' }}>{r.issue}</Typography>
                <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', fontFamily: 'monospace' }}>{r.claim}</Typography>
                <Box>
                  <Box sx={{ display: 'inline-flex', px: 0.75, py: 0.375, borderRadius: '4px', bgcolor: r.status === 'Open' ? BLOOM.bluePale : BLOOM.canvas, color: r.status === 'Open' ? BLOOM.blue : BLOOM.textSecondary }}>
                    <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700 }}>{r.status}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'inline-flex', px: 0.75, py: 0.375, borderRadius: '4px', bgcolor: sentimentBg, color: sentimentColor }}>
                    <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700 }}>{r.sentiment}</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '0.6875rem', color: BLOOM.amber, letterSpacing: '1px' }}>
                  {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                </Typography>
              </Box>
            );
          })}
        </Paper>
      </Box>

    </Box>
  );
}
