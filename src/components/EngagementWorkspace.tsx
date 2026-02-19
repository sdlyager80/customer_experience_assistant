import { useState } from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PhoneCallbackOutlinedIcon from '@mui/icons-material/PhoneCallbackOutlined';
import { BLOOM } from '../theme';
import { SCENARIO_CSR, type ScenarioId, type ActivityItem } from '../data/scenarios';

// ─── Scenario AI config ───────────────────────────────────────────────────────
type AlertLevel = 'red' | 'amber' | 'blue' | 'green';
type TopicType  = 'alert' | 'warn' | 'ok' | 'neutral';

interface ScenarioAI {
  alert: { level: AlertLevel; title: string; body: string };
  nba: Array<{ label: string; reason: string; btn: string }>;
  points: string[];
  signals: {
    sentiment: { pct: number; label: string };
    stress:    { pct: number; label: string };
    intent:    string;
    journey:   string;
    topics:    Array<{ label: string; type: TopicType }>;
  };
}

const SCENARIO_AI: Record<ScenarioId, ScenarioAI> = {
  friction: {
    alert: { level: 'red', title: 'Friction Alert — High Priority',
      body: '3 contacts in 5 days. Sentiment declining. Escalation language detected.' },
    nba: [
      { label: 'Acknowledge frustration', reason: 'Empathy framing reduces escalation risk 40%',           btn: 'Script'    },
      { label: 'Expedite claim review',   reason: 'CLM-2026-4491 pending 18 days — SLA breached',         btn: 'View Claim' },
      { label: 'Offer supervisor',        reason: 'Proactive offer outperforms a demanded transfer',       btn: 'Transfer'  },
    ],
    points: [
      "Don't repeat what she's already told two other agents — acknowledge the history.",
      '"I\'m going to personally make sure this is resolved today."',
      'Acknowledge the 18-day delay before explaining any process.',
    ],
    signals: {
      sentiment: { pct: 22, label: 'Negative' },
      stress:    { pct: 78, label: 'High' },
      intent:    'Claim status + escalation demand',
      journey:   'Phone (×3 in 5 days)',
      topics: [
        { label: 'Claim delay',   type: 'alert'   },
        { label: 'No callback',   type: 'alert'   },
        { label: 'Frustration',   type: 'warn'    },
        { label: 'Policy active', type: 'ok'      },
      ],
    },
  },

  adaptive: {
    alert: { level: 'blue', title: 'Life Transition Detected',
      body: 'David Park added a dependent. Beneficiary update and coverage review recommended.' },
    nba: [
      { label: 'Update beneficiaries',    reason: 'New dependent not yet listed on policy',              btn: 'Update' },
      { label: 'Present coverage review', reason: 'Life event triggers coverage gap analysis',           btn: 'Quote'  },
      { label: 'Congratulate',            reason: 'Emotional connection on milestones drives retention', btn: 'Script' },
    ],
    points: [
      'Lead with the congratulations — make it personal before business.',
      'Beneficiary update is urgent: new dependent is not on record.',
      "He's research-oriented — mention the coverage gap calculator on the portal.",
    ],
    signals: {
      sentiment: { pct: 82, label: 'Positive' },
      stress:    { pct: 12, label: 'Low' },
      intent:    'Life event + coverage review',
      journey:   'Phone → Portal (prior session)',
      topics: [
        { label: 'New dependent',      type: 'ok'      },
        { label: 'Bene update needed', type: 'warn'    },
        { label: 'Coverage review',    type: 'neutral' },
        { label: 'Milestone moment',   type: 'ok'      },
      ],
    },
  },

  omni: {
    alert: { level: 'blue', title: 'Seamless Handoff — Context Loaded',
      body: 'Portal + chatbot sessions merged. Zero repetition needed. One open billing question.' },
    nba: [
      { label: 'Reference prior research',  reason: '"I can see you\'ve already checked..." builds trust', btn: 'Script'   },
      { label: 'Resolve billing question',  reason: 'Chatbot flagged one unanswered item',                btn: 'View'     },
      { label: 'Offer digital follow-up',   reason: 'High portal engagement — she prefers digital',      btn: 'Send Link' },
    ],
    points: [
      '"I can see you already confirmed your deductible on the portal."',
      'Start with the one thing the chatbot couldn\'t answer — don\'t re-tread.',
      'Offer to email the billing breakdown after the call.',
    ],
    signals: {
      sentiment: { pct: 68, label: 'Neutral → Positive' },
      stress:    { pct: 15, label: 'Low' },
      intent:    'Billing clarification',
      journey:   'Portal → Chatbot → Phone',
      topics: [
        { label: 'Billing question',  type: 'neutral' },
        { label: 'Portal researched', type: 'ok'      },
        { label: 'Context loaded',    type: 'ok'      },
        { label: 'Quick resolve',     type: 'ok'      },
      ],
    },
  },

  callback: {
    alert: { level: 'amber', title: 'Callback Recovery — 47 min wait',
      body: 'James Williams waited 47 minutes. Frustration risk elevated. Recovery protocol active.' },
    nba: [
      { label: 'Lead with apology',      reason: 'Immediate empathy reduces churn risk 35%',             btn: 'Script' },
      { label: 'Resolve in one contact', reason: 'FCR is critical after extended wait — no follow-ups',  btn: 'Flag'   },
      { label: 'Apply goodwill credit',  reason: 'Premium credit eligible under retention policy',       btn: 'Apply'  },
    ],
    points: [
      '"I sincerely apologize for the wait — I\'ll make sure this is fully resolved right now."',
      'Do not place on hold again under any circumstance.',
      'Flag for CSAT recovery — trigger goodwill survey automatically.',
    ],
    signals: {
      sentiment: { pct: 35, label: 'At-risk' },
      stress:    { pct: 62, label: 'Medium-High' },
      intent:    'Billing inquiry + frustration',
      journey:   'Phone (47 min queue)',
      topics: [
        { label: 'Long wait',       type: 'alert'   },
        { label: 'Billing dispute', type: 'warn'    },
        { label: 'Churn risk',      type: 'warn'    },
        { label: 'Recoverable',     type: 'neutral' },
      ],
    },
  },

  workforce: {
    alert: { level: 'blue', title: 'Queue Intelligence Active',
      body: 'Peak period. Skills-based routing matched. Handle time target: under 8 min.' },
    nba: [
      { label: 'Confirm skills match',      reason: 'UL specialist — complex loan inquiry routing',     btn: 'Confirm' },
      { label: 'Target 8-min resolution',   reason: 'Queue depth at 94% — SLA window closing',         btn: 'Timer'   },
      { label: 'Suggest self-service next', reason: 'Routine inquiry — deflectable in future sessions', btn: 'Send'    },
    ],
    points: [
      'Handle time target is 8 minutes — stay focused on the primary request.',
      'Robert is analytically inclined — give exact numbers, skip the narrative.',
      'Flag for self-service coaching if inquiry was routine and deflectable.',
    ],
    signals: {
      sentiment: { pct: 62, label: 'Neutral' },
      stress:    { pct: 20, label: 'Low' },
      intent:    'Policy loan inquiry',
      journey:   'IVR → Phone (skills-routed)',
      topics: [
        { label: 'Queue peak',      type: 'warn'    },
        { label: 'Routine inquiry', type: 'ok'      },
        { label: 'Skills match',    type: 'ok'      },
        { label: 'SLA active',      type: 'neutral' },
      ],
    },
  },

  lifeevent: {
    alert: { level: 'green', title: 'Retention Opportunity — Policy Maturing',
      body: "Patricia Martinez's 20-year term matures in 90 days. Annuity match score 87%." },
    nba: [
      { label: 'Present annuity options',   reason: 'Match score 87% — high conversion probability',      btn: 'Quote'    },
      { label: 'Review permanent coverage', reason: 'Coverage gap risk if term expires without action',   btn: 'Present'  },
      { label: 'Schedule review call',      reason: 'Complex decision — allow research time',             btn: 'Schedule' },
    ],
    points: [
      '"I\'m reaching out because your policy is maturing — I want to make sure you have options."',
      'No current annuity on file — this is a natural, clean introduction.',
      'Reference her 20-year loyalty before any product discussion.',
    ],
    signals: {
      sentiment: { pct: 74, label: 'Positive' },
      stress:    { pct: 16, label: 'Low' },
      intent:    'Policy maturity + options review',
      journey:   'Outbound → Phone',
      topics: [
        { label: 'Term expiring',     type: 'warn' },
        { label: 'Annuity candidate', type: 'ok'   },
        { label: 'High assets',       type: 'ok'   },
        { label: '20-yr loyal',       type: 'ok'   },
      ],
    },
  },
};

// ─── Styling maps ─────────────────────────────────────────────────────────────
const ALERT_STYLES: Record<AlertLevel, { leftBorder: string; badgeBg: string; badgeColor: string }> = {
  red:   { leftBorder: '#ef4444',   badgeBg: '#fef2f2',       badgeColor: '#dc2626'   },
  amber: { leftBorder: '#f59e0b',   badgeBg: '#fffbeb',       badgeColor: '#b45309'   },
  blue:  { leftBorder: BLOOM.blue,  badgeBg: BLOOM.bluePale,  badgeColor: BLOOM.blue  },
  green: { leftBorder: BLOOM.green, badgeBg: BLOOM.greenPale, badgeColor: BLOOM.green },
};

const TOPIC_STYLES: Record<TopicType, { bg: string; color: string }> = {
  alert:   { bg: '#fef2f2',        color: '#dc2626'             },
  warn:    { bg: '#fffbeb',        color: '#b45309'             },
  ok:      { bg: BLOOM.greenPale,  color: BLOOM.green           },
  neutral: { bg: BLOOM.canvas,     color: BLOOM.textSecondary   },
};

const ALERT_LABEL: Record<AlertLevel, string> = {
  red:   '⚠ Alert',
  amber: '⚠ Caution',
  blue:  'ℹ Context',
  green: '✓ Opportunity',
};

// ─── Shared micro-components ──────────────────────────────────────────────────
function FieldRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: `1px solid ${BLOOM.canvas}`, '&:last-child': { border: 'none' } }}>
      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: valueColor || 'text.primary', textAlign: 'right', maxWidth: '58%' }}>{value}</Typography>
    </Box>
  );
}

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'text.secondary', mb: 0.875, pb: 0.625, borderBottom: `1px solid ${BLOOM.border}` }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function SignalBar({ label, pct, color, valueLabel }: { label: string; pct: number; color: string; valueLabel: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.875 }}>
      <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: 'text.secondary', minWidth: 68 }}>{label}</Typography>
      <Box sx={{ flex: 1, height: 4, bgcolor: BLOOM.canvas, borderRadius: 10, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: color, borderRadius: 10, transition: 'width 0.4s ease' }} />
      </Box>
      <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, color, minWidth: 80, textAlign: 'right' }}>{valueLabel}</Typography>
    </Box>
  );
}

// ─── Left Panel — Engagement Analyzer ────────────────────────────────────────
function LeftPanel({ scenario }: { scenario: ScenarioId }) {
  const ai = SCENARIO_AI[scenario];
  const as = ALERT_STYLES[ai.alert.level];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${BLOOM.border}`, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.375 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }}>Engagement Analyzer</Typography>
          <Box sx={{ fontSize: '0.4375rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', bgcolor: BLOOM.blue, color: '#fff', px: 0.75, py: 0.25, borderRadius: '3px' }}>
            Smart App
          </Box>
        </Box>
        <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary' }}>
          Powered by <strong style={{ color: '#475569' }}>Assure Orchestration</strong>
        </Typography>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2 }}>
        {/* Alert / context card */}
        <Box sx={{ mb: 2, p: 1.5, borderRadius: '6px', border: `1px solid ${BLOOM.border}`, borderLeft: `3px solid ${as.leftBorder}` }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: as.badgeBg, color: as.badgeColor, fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', px: 0.75, py: 0.25, borderRadius: '3px', mb: 0.75 }}>
            {ALERT_LABEL[ai.alert.level]}
          </Box>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.3, mb: 0.5 }}>
            {ai.alert.title}
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', lineHeight: 1.5 }}>
            {ai.alert.body}
          </Typography>
        </Box>

        {/* Next Best Actions */}
        <PanelSection title="Next Best Actions">
          {ai.nba.map((nba, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.25, py: 1, borderBottom: i < ai.nba.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none' }}>
              <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: BLOOM.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5625rem', fontWeight: 800, flexShrink: 0, mt: '1px' }}>
                {i + 1}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.3, mb: 0.25 }}>{nba.label}</Typography>
                <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', lineHeight: 1.4 }}>{nba.reason}</Typography>
              </Box>
              <Box
                component="button"
                sx={{
                  fontSize: '0.5625rem', fontWeight: 600, px: 0.875, py: 0.375, borderRadius: '4px',
                  border: `1px solid ${BLOOM.border}`, bgcolor: 'transparent', cursor: 'pointer',
                  color: 'text.secondary', fontFamily: 'Inter, sans-serif', flexShrink: 0,
                  alignSelf: 'flex-start', mt: '1px', whiteSpace: 'nowrap', transition: 'all 0.12s',
                  '&:hover': { borderColor: BLOOM.blue, color: BLOOM.blue },
                }}
              >
                {nba.btn}
              </Box>
            </Box>
          ))}
        </PanelSection>

        {/* Talking Points */}
        <PanelSection title="Talking Points">
          {ai.points.map((pt, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 0.875, mb: 0.75, '&:last-child': { mb: 0 } }}>
              <Typography sx={{ color: BLOOM.textTertiary, fontSize: '0.875rem', lineHeight: 1, mt: '1px', flexShrink: 0 }}>›</Typography>
              <Typography sx={{ fontSize: '0.6875rem', lineHeight: 1.5, color: 'text.secondary' }}>{pt}</Typography>
            </Box>
          ))}
        </PanelSection>
      </Box>
    </Box>
  );
}

// ─── Center Panel — Policy Workspace ─────────────────────────────────────────
const CENTER_TABS = ['Overview', 'Policy', 'Billing', 'Claims', 'History'];

function WidgetCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper sx={{ p: 1.75 }}>
      <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const BADGE: Record<string, { bg: string; color: string }> = {
    positive:   { bg: BLOOM.greenPale,  color: BLOOM.green           },
    negative:   { bg: BLOOM.redPale,    color: BLOOM.red             },
    cautionary: { bg: BLOOM.yellowPale, color: BLOOM.amber           },
    info:       { bg: BLOOM.bluePale,   color: BLOOM.blue            },
    neutral:    { bg: BLOOM.canvas,     color: BLOOM.textSecondary   },
  };
  const badge = BADGE[item.badgeColor] || BADGE.neutral;
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
      <Box sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: item.iconBg, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', flexShrink: 0 }}>
        {item.icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.3 }}>{item.title}</Typography>
        <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', mt: 0.125 }}>{item.timestamp}</Typography>
      </Box>
      <Chip label={item.badge} size="small" sx={{ height: 18, fontSize: '0.5625rem', ...badge, flexShrink: 0 }} />
    </Box>
  );
}

function CenterPanel({ scenario, callTime }: { scenario: ScenarioId; callTime: string }) {
  const [tab, setTab] = useState(0);
  const data = SCENARIO_CSR[scenario];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Customer banner */}
      <Box sx={{
        px: 3, py: 1.25, borderBottom: `1px solid ${BLOOM.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 1, flexShrink: 0, bgcolor: 'background.paper',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {data.banner.fields.map(f => (
            <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: 'text.secondary' }}>{f.label}</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{f.value}</Typography>
            </Box>
          ))}
          {data.banner.authBadge && (
            <Chip label={`✓ ${data.banner.authBadge}`} size="small" sx={{ height: 18, fontSize: '0.5625rem', bgcolor: BLOOM.greenPale, color: BLOOM.green, border: `1px solid ${BLOOM.greenBorder}` }} />
          )}
          {data.banner.channelBadge && (
            <Chip label={data.banner.channelBadge} size="small" sx={{ height: 18, fontSize: '0.5625rem', bgcolor: BLOOM.canvas, color: BLOOM.textSecondary, border: `1px solid ${BLOOM.border}` }} />
          )}
        </Box>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: BLOOM.blue, bgcolor: BLOOM.bluePale, px: 1.25, py: 0.375, borderRadius: '5px' }}>
          {callTime}
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ display: 'flex', borderBottom: `1px solid ${BLOOM.border}`, px: 2.5, bgcolor: 'background.paper', flexShrink: 0 }}>
        {CENTER_TABS.map((t, i) => (
          <Box
            key={t}
            onClick={() => setTab(i)}
            sx={{
              px: 1.75, py: 1, fontSize: '0.75rem',
              fontWeight: tab === i ? 600 : 500,
              color: tab === i ? BLOOM.blue : 'text.secondary',
              borderBottom: `2px solid ${tab === i ? BLOOM.blue : 'transparent'}`,
              mb: '-1px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.12s',
              '&:hover': { color: 'text.primary' },
            }}
          >
            {t}
          </Box>
        ))}
      </Box>

      {/* Tab content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
        {tab === 0 && (
          <>
            {/* Summary grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25, mb: 1.5 }}>
              <WidgetCard title="Policy">
                <FieldRow label="Number"   value={data.policy.policyNumber} />
                <FieldRow label="Product"  value={data.policy.product} />
                <FieldRow label="Status"   value={data.policy.status} valueColor={data.policy.status === 'Active' ? BLOOM.green : undefined} />
                <FieldRow label="State"    value={data.policy.state} />
              </WidgetCard>

              <WidgetCard title="Billing">
                <FieldRow label="Paid To"   value={data.billing.paidTo} />
                <FieldRow label="Method"    value={data.billing.method} />
                <FieldRow label="Premium"   value={data.billing.premium} />
                <FieldRow label="Frequency" value={data.billing.frequency} />
              </WidgetCard>

              {data.claim && (
                <WidgetCard title="Current Claim">
                  <FieldRow label="Reference" value={data.claim.reference} />
                  <FieldRow label="Type"      value={data.claim.type} />
                  <FieldRow label="Filed"     value={data.claim.filed} />
                  <FieldRow label="Status"    value={data.claim.status} valueColor={data.claim.statusColor === 'negative' ? BLOOM.red : data.claim.statusColor === 'positive' ? BLOOM.green : undefined} />
                </WidgetCard>
              )}

              <WidgetCard title="Contact Summary">
                <FieldRow label="Contacts (30d)" value={data.contact.contacts30d} />
                <FieldRow label="Last Contact"   value={data.contact.lastContact} />
                <FieldRow label="Channel"        value={data.contact.channel} />
                <FieldRow label="Sentiment"      value={data.contact.sentiment} valueColor={data.contact.sentimentColor === 'negative' ? BLOOM.red : data.contact.sentimentColor === 'positive' ? BLOOM.green : undefined} />
              </WidgetCard>
            </Box>

            {/* Quick actions */}
            <Box sx={{ display: 'flex', gap: 0.875, flexWrap: 'wrap', mb: 1.5 }}>
              <Button variant="contained" size="small" startIcon={<DescriptionOutlinedIcon />} disableElevation sx={{ fontSize: '0.6875rem' }}>View Claim</Button>
              <Button variant="outlined"  size="small" startIcon={<EmailOutlinedIcon />}             sx={{ fontSize: '0.6875rem' }}>Send Update</Button>
              <Button variant="outlined"  size="small" startIcon={<ReportProblemOutlinedIcon />}     sx={{ fontSize: '0.6875rem' }}>Escalate</Button>
              <Button variant="text"      size="small" startIcon={<AddOutlinedIcon />}               sx={{ fontSize: '0.6875rem', color: 'text.secondary', border: `1px solid ${BLOOM.border}` }}>Add Note</Button>
              <Button variant="text"      size="small" startIcon={<PhoneCallbackOutlinedIcon />}     sx={{ fontSize: '0.6875rem', color: 'text.secondary', border: `1px solid ${BLOOM.border}` }}>Schedule Callback</Button>
            </Box>

            {/* Recent activity */}
            {data.activity.length > 0 && (
              <WidgetCard title="Recent Activity">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  {data.activity.map((item, i) => <ActivityRow key={i} item={item} />)}
                </Box>
              </WidgetCard>
            )}
          </>
        )}

        {tab !== 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
            <Typography sx={{ fontSize: '0.875rem' }}>{CENTER_TABS[tab]} — select Overview for active interaction data.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── Right Panel — Live Analysis ──────────────────────────────────────────────
function RightPanel({ scenario }: { scenario: ScenarioId }) {
  const { signals } = SCENARIO_AI[scenario];
  const sentimentColor = signals.sentiment.pct > 65 ? BLOOM.green : signals.sentiment.pct > 40 ? BLOOM.amber : BLOOM.red;
  const stressColor    = signals.stress.pct    > 60 ? BLOOM.red   : signals.stress.pct    > 35 ? BLOOM.amber : BLOOM.green;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${BLOOM.border}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }}>Live Analysis</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625 }}>
          <Box sx={{
            width: 6, height: 6, borderRadius: '50%', bgcolor: BLOOM.red,
            '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
            animation: 'blink 1.2s ease infinite',
          }} />
          <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: BLOOM.red, textTransform: 'uppercase', letterSpacing: '1px' }}>Live</Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2 }}>
        {/* Signal bars */}
        <PanelSection title="Interaction Signals">
          <SignalBar label="Sentiment"  pct={signals.sentiment.pct} color={sentimentColor} valueLabel={signals.sentiment.label} />
          <SignalBar label="Stress"     pct={signals.stress.pct}    color={stressColor}    valueLabel={signals.stress.label} />
          <SignalBar label="Engagement" pct={84}                    color={BLOOM.blue}     valueLabel="Active" />
        </PanelSection>

        {/* Intent */}
        <PanelSection title="Intent Detected">
          <Box sx={{ p: 1.25, bgcolor: BLOOM.canvas, borderRadius: '6px', borderLeft: `3px solid ${BLOOM.blue}` }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.4 }}>{signals.intent}</Typography>
          </Box>
        </PanelSection>

        {/* Channel journey */}
        <PanelSection title="Channel Journey">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            {signals.journey.split(' → ').map((step, i, arr) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ fontSize: '0.6875rem', fontWeight: 600, px: 0.875, py: 0.375, borderRadius: '4px', bgcolor: BLOOM.canvas, color: 'text.primary' }}>
                  {step}
                </Box>
                {i < arr.length - 1 && (
                  <Typography sx={{ fontSize: '0.5625rem', color: BLOOM.textTertiary }}>→</Typography>
                )}
              </Box>
            ))}
          </Box>
        </PanelSection>

        {/* Key topics */}
        <PanelSection title="Key Topics">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.625 }}>
            {signals.topics.map(t => {
              const style = TOPIC_STYLES[t.type];
              return (
                <Box key={t.label} sx={{ fontSize: '0.5625rem', fontWeight: 600, px: 0.875, py: 0.375, borderRadius: '4px', bgcolor: style.bg, color: style.color }}>
                  {t.label}
                </Box>
              );
            })}
          </Box>
        </PanelSection>

        {/* Assure status */}
        <Box sx={{ p: 1.25, borderRadius: '6px', border: `1px solid ${BLOOM.border}`, borderLeft: `3px solid #c4b5fd` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: BLOOM.green }} />
            <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assure Orchestration</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', lineHeight: 1.4 }}>
            NLP pipeline active · Context assembled · Recommendations synced
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
interface EngagementWorkspaceProps {
  activeScenario: ScenarioId;
  callTime: string;
}

export default function EngagementWorkspace({ activeScenario, callTime }: EngagementWorkspaceProps) {
  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left — Engagement Analyzer */}
      <Box sx={{ width: 272, borderRight: `1px solid ${BLOOM.border}`, flexShrink: 0, bgcolor: 'background.paper', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <LeftPanel scenario={activeScenario} />
      </Box>

      {/* Center — Policy Workspace */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <CenterPanel scenario={activeScenario} callTime={callTime} />
      </Box>

      {/* Right — Live Analysis */}
      <Box sx={{ width: 284, borderLeft: `1px solid ${BLOOM.border}`, flexShrink: 0, bgcolor: 'background.paper', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <RightPanel scenario={activeScenario} />
      </Box>
    </Box>
  );
}
