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

// ─── Action modal system ──────────────────────────────────────────────────────
type ModalId = 'claim' | 'update' | 'escalate' | 'note' | 'callback' | null;

interface ModalScenarioData {
  updateSubject: string;
  updateDraft:   string;
  escalationPriority: 'Critical' | 'High' | 'Medium';
  escalationTo:   string;
  escalationReason: string;
  noteDraft: string;
  callbackReason: string;
  claimTimeline?: Array<{ date: string; event: string; done: boolean }>;
  claimDocs?:     Array<{ name: string; status: 'received' | 'pending' }>;
  adjuster?:      { name: string; email: string; ext: string };
}

const MODAL_DATA: Record<ScenarioId, ModalScenarioData> = {
  friction: {
    updateSubject: 'Update on Claim #CLM-2026-4491',
    updateDraft: "Dear Margaret,\n\nThank you for your continued patience regarding claim #CLM-2026-4491. I have personally escalated your case and am prioritizing its review.\n\nYou can expect a full status update within 24 hours.\n\nWarm regards,\nSarah Mitchell · CSR II · Bloom Insurance",
    escalationPriority: 'High',
    escalationTo: 'Claims Manager',
    escalationReason: 'Repeat contact — 3 calls in 5 days. SLA breach risk. Customer escalation language detected.',
    noteDraft: "Customer Margaret Torres — 3rd contact in 5 days re: CLM-2026-4491 (auto collision, pending docs). Sentiment negative, escalation language used. Acknowledged frustration, committed to 24hr resolution. Escalating to Claims Manager. Advised against further hold.",
    callbackReason: 'Claim status follow-up — CLM-2026-4491',
    claimTimeline: [
      { date: 'Feb 1',  event: 'Claim filed — multi-vehicle auto collision',      done: true  },
      { date: 'Feb 3',  event: 'Initial review complete',                          done: true  },
      { date: 'Feb 5',  event: 'Adjuster assigned — J. Rodriguez',                done: true  },
      { date: 'Feb 8',  event: 'Pending documentation — 2 items outstanding',     done: false },
      { date: 'TBD',    event: 'Final assessment & disbursement',                  done: false },
    ],
    claimDocs: [
      { name: 'Police report',         status: 'received' },
      { name: 'Damage estimate',       status: 'received' },
      { name: 'Medical release form',  status: 'pending'  },
      { name: 'Rental car receipt',    status: 'pending'  },
    ],
    adjuster: { name: 'James Rodriguez', email: 'j.rodriguez@bloomins.com', ext: '4821' },
  },
  adaptive: {
    updateSubject: 'Your Beneficiary Update & Coverage Review',
    updateDraft: "Dear David,\n\nCongratulations on your new arrival! As we discussed, I've initiated a beneficiary update for your policy. A coverage review specialist will be in touch this week.\n\nWarm regards,\nSarah Mitchell · CSR II · Bloom Insurance",
    escalationPriority: 'Medium',
    escalationTo: 'Life Events Specialist',
    escalationReason: 'Life event detected — new dependent, beneficiary update initiated. Coverage review recommended.',
    noteDraft: "Life event call — David Park added dependent (newborn). Initiated beneficiary change form — not yet on record. Strong cross-sell opportunity: coverage gap review queued. High engagement, positive sentiment. Referred to Life Events specialist.",
    callbackReason: 'Coverage review follow-up — life event',
  },
  omni: {
    updateSubject: 'Your Billing Question — Follow-Up',
    updateDraft: "Dear Sarah,\n\nThank you for your patience as we resolved the billing question from your earlier session. I've attached the detailed breakdown you requested.\n\nWarm regards,\nSarah Mitchell · CSR II · Bloom Insurance",
    escalationPriority: 'Medium',
    escalationTo: 'Billing Specialist',
    escalationReason: 'Billing clarification — chatbot transfer, one open item required specialist review.',
    noteDraft: "Omnichannel call — Sarah Johnson. Context loaded from portal + chatbot sessions. Resolved the one billing question the bot couldn't answer. Zero information repeated. Sent billing breakdown via email. Positive sentiment, efficient resolution.",
    callbackReason: 'Billing follow-up confirmation',
  },
  callback: {
    updateSubject: 'Apology & Account Credit — Today\'s Interaction',
    updateDraft: "Dear James,\n\nI sincerely apologize for the extended wait time today. Your billing inquiry has been fully resolved and a courtesy credit of $42.50 has been applied to your account.\n\nWarm regards,\nSarah Mitchell · CSR II · Bloom Insurance",
    escalationPriority: 'High',
    escalationTo: 'Team Lead',
    escalationReason: '47-minute queue wait — CSAT recovery required. Goodwill credit of $42.50 applied. Needs supervisor acknowledgement.',
    noteDraft: "Callback recovery — James Williams waited 47 min in queue. Opened with apology. Resolved billing dispute in single contact (FCR). Goodwill credit $42.50 applied per retention policy. Flagged for CSAT recovery survey. Do NOT schedule outbound phone — email only.",
    callbackReason: 'CSAT recovery follow-up — goodwill confirmation',
  },
  workforce: {
    updateSubject: 'Your Policy Loan — Confirmation',
    updateDraft: "Dear Robert,\n\nThank you for calling today. Your $75,000 Universal Life policy loan has been approved and disbursement is queued to your EFT account ending ****4821.\n\nWarm regards,\nSarah Mitchell · CSR II · Bloom Insurance",
    escalationPriority: 'Medium',
    escalationTo: 'UL Product Specialist',
    escalationReason: 'Complex loan interest calculation — variable rate question requires UL specialist confirmation.',
    noteDraft: "Robert Chen — UL policy loan inquiry. Provided fixed (5.25%) vs variable (4.75%) rate comparison. $75K approved via Assure STP — EFT queued. Mentioned pending beneficiary form (Emily, minor). Handle time 6:45 — within 8-min target. Strong portal engagement prior.",
    callbackReason: 'Policy loan disbursement confirmation',
    claimTimeline: [
      { date: '10:01', event: 'IVR path: Policy Loans → Agent (skills-routed)',   done: true  },
      { date: '10:02', event: 'Identity & PIN authenticated',                      done: true  },
      { date: '10:03', event: 'Loan eligibility confirmed — max $168,678',        done: true  },
      { date: '10:04', event: '$75K approved — Assure STP auto-processed',        done: true  },
      { date: '10:05', event: 'EFT disbursement queued — ****4821',               done: false },
    ],
  },
  lifeevent: {
    updateSubject: 'Your Policy Maturity — Options & Next Steps',
    updateDraft: "Dear Patricia,\n\nThank you for speaking with me today about your options as your term policy matures. I've queued the annuity illustrations we discussed — a specialist will follow up within 2 business days.\n\nWarm regards,\nSarah Mitchell · CSR II · Bloom Insurance",
    escalationPriority: 'Medium',
    escalationTo: 'Annuity Specialist',
    escalationReason: 'Policy maturity in 90 days — annuity conversion opportunity. Match score 87%. Specialist illustration requested.',
    noteDraft: "Outbound call — Patricia Martinez. 20-yr term matures in 90 days. Presented annuity conversion (87% match score) and permanent coverage alternatives. Customer receptive, requested illustrations. Scheduled annuity specialist follow-up. 20-year loyal customer — high retention priority.",
    callbackReason: 'Annuity illustration review — policy maturity',
  },
};

const CALLBACK_SLOTS = [
  { date: 'Thu Feb 20', time: '10:00 AM' },
  { date: 'Thu Feb 20', time: '2:30 PM'  },
  { date: 'Fri Feb 21', time: '9:00 AM'  },
  { date: 'Fri Feb 21', time: '11:30 AM' },
  { date: 'Mon Feb 24', time: '3:00 PM'  },
];

// ── Modal shell ───────────────────────────────────────────────────────────────
function ModalShell({ title, width = 500, children, primaryLabel, onPrimary, onClose, submitted, successMsg }: {
  title: string; width?: number; children: React.ReactNode;
  primaryLabel: string; onPrimary: () => void; onClose: () => void;
  submitted: boolean; successMsg: string;
}) {
  return (
    <Box
      sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(15,23,42,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, p: 3 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <Paper sx={{ width, maxWidth: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', borderRadius: '10px', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${BLOOM.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700 }}>{title}</Typography>
          <Box component="button" onClick={onClose} sx={{ width: 26, height: 26, borderRadius: '50%', border: 'none', bgcolor: BLOOM.canvas, cursor: 'pointer', fontSize: '1rem', lineHeight: 1, color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', transition: 'all 0.12s', '&:hover': { bgcolor: BLOOM.border } }}>
            ×
          </Box>
        </Box>

        {submitted ? (
          /* Success state */
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, gap: 1.5, minHeight: 200 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: BLOOM.greenPale, border: `2px solid ${BLOOM.greenBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.375rem' }}>✓</Box>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: BLOOM.green, textAlign: 'center' }}>{successMsg}</Typography>
            <Button variant="outlined" size="small" onClick={onClose} sx={{ mt: 0.5 }}>Close</Button>
          </Box>
        ) : (
          <>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>{children}</Box>
            <Box sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${BLOOM.border}`, display: 'flex', gap: 1, justifyContent: 'flex-end', flexShrink: 0, bgcolor: BLOOM.canvas }}>
              <Button variant="text" size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
              <Button variant="contained" size="small" disableElevation onClick={onPrimary}>{primaryLabel}</Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}

// ── Reusable form primitives ──────────────────────────────────────────────────
function FormLabel({ children }: { children: React.ReactNode }) {
  return <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 0.625 }}>{children}</Typography>;
}
function FormGroup({ children, sx = {} }: { children: React.ReactNode; sx?: object }) {
  return <Box sx={{ mb: 1.75, ...sx }}>{children}</Box>;
}
function StaticValue({ value }: { value: string }) {
  return (
    <Box sx={{ px: 1.5, py: 0.875, border: `1px solid ${BLOOM.border}`, borderRadius: '6px', bgcolor: BLOOM.canvas, fontSize: '0.8125rem', color: 'text.primary' }}>
      {value}
    </Box>
  );
}
function PillSelector({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {options.map(o => (
        <Box
          key={o} component="button" onClick={() => onChange(o)}
          sx={{
            px: 1.5, py: 0.625, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
            border: `1px solid ${value === o ? BLOOM.blue : BLOOM.border}`,
            bgcolor: value === o ? BLOOM.bluePale : 'transparent',
            color: value === o ? BLOOM.blue : 'text.secondary',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.12s',
          }}
        >{o}</Box>
      ))}
    </Box>
  );
}

// ── ActionModal — renders the right modal based on type ───────────────────────
function ActionModal({ modal, onClose, scenario }: { modal: NonNullable<ModalId>; onClose: () => void; scenario: ScenarioId }) {
  const [submitted, setSubmitted]   = useState(false);
  const [cbSlot, setCbSlot]         = useState(0);
  const [noteType, setNoteType]     = useState('Call Note');
  const [priority, setPriority]     = useState('');
  const [channel, setChannel]       = useState('Email');

  const csr = SCENARIO_CSR[scenario];
  const md  = MODAL_DATA[scenario];
  const customer = csr.banner.fields[0]?.value ?? 'Customer';
  const policyNo = csr.policy.policyNumber;

  // Initialise priority from scenario data
  useState(() => { setPriority(md.escalationPriority); });

  if (modal === 'claim') {
    const hasClaim = !!csr.claim;
    const timeline = md.claimTimeline ?? [];
    return (
      <ModalShell
        title={hasClaim ? `Claim — ${csr.claim!.reference}` : 'Policy Activity'}
        width={520}
        primaryLabel={hasClaim ? 'Request Expedite' : 'View Full Policy'}
        onPrimary={() => setSubmitted(true)}
        onClose={onClose}
        submitted={submitted}
        successMsg={hasClaim ? 'Expedite request submitted — SLA override applied' : 'Opening full policy record…'}
      >
        {hasClaim && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{ fontSize: '0.6875rem', fontWeight: 700, px: 1.25, py: 0.375, borderRadius: '4px', bgcolor: BLOOM.redPale, color: BLOOM.red }}>{csr.claim!.type}</Box>
            <Box sx={{ fontSize: '0.6875rem', fontWeight: 700, px: 1.25, py: 0.375, borderRadius: '4px', bgcolor: BLOOM.yellowPale, color: BLOOM.amber }}>{csr.claim!.status}</Box>
            <Box sx={{ fontSize: '0.6875rem', color: 'text.secondary', px: 1.25, py: 0.375, borderRadius: '4px', bgcolor: BLOOM.canvas }}>Filed {csr.claim!.filed}</Box>
          </Box>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <FormGroup>
            <FormLabel>Timeline</FormLabel>
            {timeline.map((step, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.25, py: 0.875, borderBottom: i < timeline.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none', alignItems: 'flex-start' }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, mt: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5625rem', fontWeight: 700, bgcolor: step.done ? BLOOM.green : BLOOM.canvas, color: step.done ? '#fff' : BLOOM.textTertiary, border: step.done ? 'none' : `2px dashed ${BLOOM.border}` }}>
                  {step.done ? '✓' : ''}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: step.done ? 500 : 600, color: step.done ? 'text.secondary' : 'text.primary', lineHeight: 1.3 }}>{step.event}</Typography>
                  <Typography sx={{ fontSize: '0.5625rem', color: BLOOM.textTertiary }}>{step.date}</Typography>
                </Box>
              </Box>
            ))}
          </FormGroup>
        )}

        {/* Documents */}
        {md.claimDocs && (
          <FormGroup>
            <FormLabel>Required Documents</FormLabel>
            {md.claimDocs.map((doc, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75, borderBottom: i < md.claimDocs!.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none' }}>
                <Typography sx={{ fontSize: '0.75rem' }}>{doc.name}</Typography>
                <Box sx={{ fontSize: '0.5625rem', fontWeight: 700, px: 0.875, py: 0.25, borderRadius: '4px', bgcolor: doc.status === 'received' ? BLOOM.greenPale : BLOOM.yellowPale, color: doc.status === 'received' ? BLOOM.green : BLOOM.amber }}>
                  {doc.status === 'received' ? '✓ Received' : '⚠ Pending'}
                </Box>
              </Box>
            ))}
          </FormGroup>
        )}

        {/* Adjuster */}
        {md.adjuster && (
          <FormGroup sx={{ mb: 0 }}>
            <FormLabel>Assigned Adjuster</FormLabel>
            <Box sx={{ p: 1.5, border: `1px solid ${BLOOM.border}`, borderRadius: '6px' }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{md.adjuster.name}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{md.adjuster.email} · ext. {md.adjuster.ext}</Typography>
            </Box>
          </FormGroup>
        )}
      </ModalShell>
    );
  }

  if (modal === 'update') {
    return (
      <ModalShell
        title="Send Customer Update"
        primaryLabel="Send Message"
        onPrimary={() => setSubmitted(true)}
        onClose={onClose}
        submitted={submitted}
        successMsg="Message sent — delivery confirmation queued"
      >
        <FormGroup>
          <FormLabel>Channel</FormLabel>
          <PillSelector options={['Email', 'SMS', 'Portal Message']} value={channel} onChange={setChannel} />
        </FormGroup>
        <FormGroup>
          <FormLabel>To</FormLabel>
          <StaticValue value={`${customer} · ${policyNo}`} />
        </FormGroup>
        <FormGroup>
          <FormLabel>Subject</FormLabel>
          <StaticValue value={md.updateSubject} />
        </FormGroup>
        <FormGroup sx={{ mb: 0 }}>
          <FormLabel>Message</FormLabel>
          <Box
            component="textarea"
            defaultValue={md.updateDraft}
            sx={{ width: '100%', minHeight: 140, p: 1.5, border: `1px solid ${BLOOM.border}`, borderRadius: '6px', fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box', color: 'text.primary', '&:focus': { borderColor: BLOOM.blue, boxShadow: `0 0 0 3px ${BLOOM.bluePale}` } }}
          />
        </FormGroup>
      </ModalShell>
    );
  }

  if (modal === 'escalate') {
    return (
      <ModalShell
        title="Escalate Interaction"
        primaryLabel="Submit Escalation"
        onPrimary={() => setSubmitted(true)}
        onClose={onClose}
        submitted={submitted}
        successMsg={`Escalated to ${md.escalationTo} — ticket #ESC-${Math.floor(1000 + Math.random() * 9000)} created`}
      >
        <FormGroup>
          <FormLabel>Priority</FormLabel>
          <PillSelector options={['Critical', 'High', 'Medium']} value={priority || md.escalationPriority} onChange={setPriority} />
        </FormGroup>
        <FormGroup>
          <FormLabel>Escalate To</FormLabel>
          <StaticValue value={md.escalationTo} />
        </FormGroup>
        <FormGroup>
          <FormLabel>Reason</FormLabel>
          <Box sx={{ px: 1.5, py: 1, border: `1px solid ${BLOOM.border}`, borderRadius: '6px', bgcolor: BLOOM.canvas, fontSize: '0.8125rem', lineHeight: 1.5, color: 'text.secondary' }}>
            {md.escalationReason}
          </Box>
        </FormGroup>
        <FormGroup sx={{ mb: 0 }}>
          <FormLabel>Additional Notes</FormLabel>
          <Box
            component="textarea"
            placeholder="Add any additional context for the escalation recipient…"
            sx={{ width: '100%', minHeight: 80, p: 1.5, border: `1px solid ${BLOOM.border}`, borderRadius: '6px', fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box', '&:focus': { borderColor: BLOOM.blue, boxShadow: `0 0 0 3px ${BLOOM.bluePale}` } }}
          />
        </FormGroup>
      </ModalShell>
    );
  }

  if (modal === 'note') {
    return (
      <ModalShell
        title="Add Interaction Note"
        primaryLabel="Save Note"
        onPrimary={() => setSubmitted(true)}
        onClose={onClose}
        submitted={submitted}
        successMsg="Note saved to policy record — timestamped"
      >
        <FormGroup>
          <FormLabel>Note Type</FormLabel>
          <PillSelector options={['Call Note', 'Follow-up', 'Action Taken', 'Internal']} value={noteType} onChange={setNoteType} />
        </FormGroup>
        <FormGroup>
          <FormLabel>Attached To</FormLabel>
          <StaticValue value={`${policyNo} · ${customer}`} />
        </FormGroup>
        <FormGroup sx={{ mb: 0 }}>
          <FormLabel>Note</FormLabel>
          <Box
            component="textarea"
            defaultValue={md.noteDraft}
            sx={{ width: '100%', minHeight: 120, p: 1.5, border: `1px solid ${BLOOM.border}`, borderRadius: '6px', fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box', color: 'text.primary', '&:focus': { borderColor: BLOOM.blue, boxShadow: `0 0 0 3px ${BLOOM.bluePale}` } }}
          />
        </FormGroup>
      </ModalShell>
    );
  }

  // callback
  return (
    <ModalShell
      title="Schedule Callback"
      primaryLabel="Confirm Callback"
      onPrimary={() => setSubmitted(true)}
      onClose={onClose}
      submitted={submitted}
      successMsg={`Callback confirmed — ${CALLBACK_SLOTS[cbSlot].date} at ${CALLBACK_SLOTS[cbSlot].time}`}
    >
      <FormGroup>
        <FormLabel>Customer</FormLabel>
        <StaticValue value={`${customer} · ${policyNo}`} />
      </FormGroup>
      <FormGroup>
        <FormLabel>Select Date & Time</FormLabel>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.625 }}>
          {CALLBACK_SLOTS.map((slot, i) => (
            <Box
              key={i} component="button" onClick={() => setCbSlot(i)}
              sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                px: 1.5, py: 1, borderRadius: '6px', textAlign: 'left',
                border: `1px solid ${cbSlot === i ? BLOOM.blue : BLOOM.border}`,
                bgcolor: cbSlot === i ? BLOOM.bluePale : 'transparent',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.12s',
              }}
            >
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: cbSlot === i ? BLOOM.blue : 'text.primary' }}>{slot.date}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: cbSlot === i ? BLOOM.blue : 'text.secondary' }}>{slot.time}</Typography>
            </Box>
          ))}
        </Box>
      </FormGroup>
      <FormGroup sx={{ mb: 0 }}>
        <FormLabel>Reason</FormLabel>
        <StaticValue value={md.callbackReason} />
      </FormGroup>
    </ModalShell>
  );
}

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

function CenterPanel({ scenario, callTime, onEndCall }: { scenario: ScenarioId; callTime: string; onEndCall: () => void }) {
  const [tab, setTab]     = useState(0);
  const [modal, setModal] = useState<ModalId>(null);
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: BLOOM.blue, bgcolor: BLOOM.bluePale, px: 1.25, py: 0.375, borderRadius: '5px' }}>
            {callTime}
          </Typography>
          <Box
            component="button"
            onClick={onEndCall}
            sx={{
              fontSize: '0.6875rem', fontWeight: 600, px: 1.5, py: 0.5, borderRadius: '5px',
              border: `1px solid ${BLOOM.border}`, bgcolor: 'transparent', cursor: 'pointer',
              color: 'text.secondary', fontFamily: 'Inter, sans-serif', transition: 'all 0.12s',
              '&:hover': { borderColor: BLOOM.red, color: BLOOM.red, bgcolor: BLOOM.redPale },
            }}
          >
            ← Queue
          </Box>
        </Box>
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
              <Button variant="contained" size="small" startIcon={<DescriptionOutlinedIcon />} disableElevation sx={{ fontSize: '0.6875rem' }} onClick={() => setModal('claim')}>View Claim</Button>
              <Button variant="outlined"  size="small" startIcon={<EmailOutlinedIcon />}         sx={{ fontSize: '0.6875rem' }} onClick={() => setModal('update')}>Send Update</Button>
              <Button variant="outlined"  size="small" startIcon={<ReportProblemOutlinedIcon />} sx={{ fontSize: '0.6875rem' }} onClick={() => setModal('escalate')}>Escalate</Button>
              <Button variant="text"      size="small" startIcon={<AddOutlinedIcon />}           sx={{ fontSize: '0.6875rem', color: 'text.secondary', border: `1px solid ${BLOOM.border}` }} onClick={() => setModal('note')}>Add Note</Button>
              <Button variant="text"      size="small" startIcon={<PhoneCallbackOutlinedIcon />} sx={{ fontSize: '0.6875rem', color: 'text.secondary', border: `1px solid ${BLOOM.border}` }} onClick={() => setModal('callback')}>Schedule Callback</Button>
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

      {/* Action modals */}
      {modal && <ActionModal key={modal} modal={modal} onClose={() => setModal(null)} scenario={scenario} />}
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
  onEndCall: () => void;
}

export default function EngagementWorkspace({ activeScenario, callTime, onEndCall }: EngagementWorkspaceProps) {
  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left — Engagement Analyzer */}
      <Box sx={{ width: 272, borderRight: `1px solid ${BLOOM.border}`, flexShrink: 0, bgcolor: 'background.paper', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <LeftPanel scenario={activeScenario} />
      </Box>

      {/* Center — Policy Workspace */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <CenterPanel scenario={activeScenario} callTime={callTime} onEndCall={onEndCall} />
      </Box>

      {/* Right — Live Analysis */}
      <Box sx={{ width: 284, borderLeft: `1px solid ${BLOOM.border}`, flexShrink: 0, bgcolor: 'background.paper', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <RightPanel scenario={activeScenario} />
      </Box>
    </Box>
  );
}
