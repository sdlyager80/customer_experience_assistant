import { useState, useEffect, useRef } from 'react';
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

  ivrstp: {
    alert: { level: 'green', title: 'Assure STP Active — Monitoring Only',
      body: 'Linda Reyes is completing an address update via IVR. Assure is processing automatically. No CSR action required unless an exception is flagged.' },
    nba: [
      { label: 'Monitor for exception',  reason: 'Auto-escalation triggers if IVR confidence drops below 80%',    btn: 'Alert'    },
      { label: 'Ready to intervene',     reason: 'Click Join Call to enter the interaction at any point',          btn: 'Join Call' },
      { label: 'Send confirmation SMS',  reason: 'Optional — confirm new address to customer after STP completes', btn: 'Send SMS'  },
    ],
    points: [
      'This interaction is fully automated — Assure STP is handling it end-to-end.',
      'If the customer says "agent" or "representative" you will be auto-connected within 5 seconds.',
      'Confirmation email and policy document update will trigger automatically on completion.',
    ],
    signals: {
      sentiment: { pct: 80, label: 'Positive' },
      stress:    { pct: 8,  label: 'Very Low'  },
      intent:    'Address update — IVR STP',
      journey:   'IVR → Assure STP',
      topics: [
        { label: 'Auto-Processing', type: 'ok'      },
        { label: 'Address Change',  type: 'neutral' },
        { label: 'No Exception',    type: 'ok'      },
        { label: 'STP Active',      type: 'ok'      },
      ],
    },
  },

  escalation: {
    alert: { level: 'red', title: 'Escalation — Claim Denial + Cancel Threat',
      body: "Frank Harrison's $31,000 water damage claim was denied under flood exclusion. He has 3 policies ($5,200/yr) and is threatening to cancel all. Do NOT put on hold." },
    nba: [
      { label: 'Lead with genuine empathy',      reason: 'Scripted empathy will make him angrier — use your own words',          btn: 'Script'   },
      { label: 'Review for partial coverage',    reason: 'Adjuster notes show sudden water intrusion — may qualify separately',   btn: 'Review'   },
      { label: 'Escalate to Claims Supervisor',  reason: '$31K denial dispute requires supervisor authority for secondary review', btn: 'Escalate' },
    ],
    points: [
      'Never argue the flood exclusion — acknowledge it, then pivot to "what we can do."',
      'He has 3 policies worth $5,200/yr — flag the retention team if the call deteriorates.',
      'Key wedge: sudden water intrusion vs. gradual flooding may split the claim in his favor.',
    ],
    signals: {
      sentiment: { pct: 8,  label: 'Critical' },
      stress:    { pct: 95, label: 'Critical'  },
      intent:    'Claim denial dispute + cancellation',
      journey:   'Phone (inbound — direct)',
      topics: [
        { label: 'Claim denied',       type: 'alert' },
        { label: 'Cancel threat',      type: 'alert' },
        { label: '$31K exposure',      type: 'warn'  },
        { label: '3 policies at risk', type: 'warn'  },
      ],
    },
  },

  lifepolicy: {
    alert: { level: 'green', title: 'Dividend Optimization Opportunity',
      body: 'Catherine has $12,840 in accumulated dividends. Switching to paid-up additions adds ~$18,200 in coverage at zero additional premium.' },
    nba: [
      { label: 'Present PUA election',  reason: 'Accumulated dividends at 7-year high — optimal reallocation moment', btn: 'Illustrate' },
      { label: 'Explain all 4 options', reason: 'Customer researched dividend calculator on portal — ready to decide', btn: 'Script'     },
      { label: 'Confirm beneficiary',   reason: 'No update on file since 2018 — flag for review',                      btn: 'Review'     },
    ],
    points: [
      'She already ran the calculator on the portal — skip the basics and go straight to her numbers.',
      'PUA is the strongest option: $12,840 in dividends → ~$18,200 in permanent coverage, no extra cost.',
      'Her policy is 8 years in with a clean payment streak — acknowledge the discipline.',
    ],
    signals: {
      sentiment: { pct: 88, label: 'Positive' },
      stress:    { pct: 10, label: 'Very Low' },
      intent:    'Dividend election change',
      journey:   'Portal → Phone',
      topics: [
        { label: 'Dividend review',   type: 'ok'   },
        { label: 'PUA interest',      type: 'ok'   },
        { label: 'Bene out of date',  type: 'warn' },
        { label: 'High retention',    type: 'ok'   },
      ],
    },
  },
};

// ─── Styling maps ─────────────────────────────────────────────────────────────
const ALERT_STYLES: Record<AlertLevel, { leftBorder: string; badgeBg: string; badgeColor: string }> = {
  red:   { leftBorder: BLOOM.red,    badgeBg: BLOOM.redPale,    badgeColor: BLOOM.red    },
  amber: { leftBorder: BLOOM.orange, badgeBg: BLOOM.orangePale, badgeColor: BLOOM.orange },
  blue:  { leftBorder: BLOOM.blue,   badgeBg: BLOOM.bluePale,   badgeColor: BLOOM.blue   },
  green: { leftBorder: BLOOM.green,  badgeBg: BLOOM.greenPale,  badgeColor: BLOOM.green  },
};

const TOPIC_STYLES: Record<TopicType, { bg: string; color: string }> = {
  alert:   { bg: BLOOM.redPale,    color: BLOOM.red             },
  warn:    { bg: BLOOM.orangePale, color: BLOOM.orange          },
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
  ivrstp: {
    updateSubject: 'Your Address Update — Confirmation',
    updateDraft: "Dear Linda,\n\nThis confirms your address has been updated to 4821 Maple Creek Drive, Austin TX 78701, effective today.\n\nYour policy documents will reflect the new address at next renewal.\n\nWarm regards,\nBloom Insurance · Customer Service",
    escalationPriority: 'Medium',
    escalationTo: 'IVR Operations',
    escalationReason: 'STP exception flagged — IVR confidence below threshold. Manual review of address update required.',
    noteDraft: "Linda Reyes — TX-AU-2024-8832. Address change completed via Assure IVR STP. New address: 4821 Maple Creek Drive, Austin TX 78701. No CSR intervention required. Confirmation email auto-sent. STP completion time: 1:42 min.",
    callbackReason: 'STP confirmation — address update follow-up',
    claimTimeline: [
      { date: '1:42:01', event: 'IVR session started — authentication confirmed',    done: true  },
      { date: '1:42:23', event: 'Address change intent detected — NLP confidence 97%', done: true  },
      { date: '1:43:00', event: 'New address captured: 4821 Maple Creek, Austin TX',  done: true  },
      { date: '1:43:10', event: 'Customer confirmed — Assure processing update',       done: true  },
      { date: '1:43:12', event: 'Policy record updated · Confirmation email queued',  done: false },
    ],
  },
  escalation: {
    updateSubject: 'Regarding Claim #CLM-2026-8812 — Next Steps',
    updateDraft: "Dear Mr. Harrison,\n\nThank you for speaking with me today. I understand how frustrating this situation is and I want you to know your concern is being taken seriously.\n\nI have escalated CLM-2026-8812 to our Claims Supervisor for a secondary review of the water intrusion component. You will receive a decision within 48 hours.\n\nWarm regards,\nSarah Mitchell · CSR II · Bloom Insurance",
    escalationPriority: 'Critical',
    escalationTo: 'Claims Supervisor',
    escalationReason: 'Claim denial dispute — $31,000 water/flood damage. Flood exclusion applied but adjuster notes show sudden intrusion component that may qualify separately. Customer threatening to cancel 3 policies ($5,200/yr). Secondary review required within 48 hours.',
    noteDraft: "Frank Harrison — TX-HO-2023-65219. Inbound re: denied claim CLM-2026-8812 ($31K water/flood damage). Customer extremely angry, threatened to cancel all 3 policies. Led with empathy, did NOT argue the exclusion. Identified sudden water intrusion component in adjuster notes — may qualify separately. Escalated to Claims Supervisor for secondary review. Customer agreed to 48hr hold before final decision. Cancel request on hold pending review.",
    callbackReason: 'Claim denial review — 48-hour decision update',
    claimTimeline: [
      { date: 'Feb 10', event: 'Claim filed — water/flood damage, est. $31,000',             done: true  },
      { date: 'Feb 12', event: 'Initial review — flood exclusion flagged',                    done: true  },
      { date: 'Feb 14', event: 'Adjuster inspection complete',                                done: true  },
      { date: 'Feb 17', event: 'Claim denied — flood exclusion applied',                      done: true  },
      { date: 'Feb 19', event: 'Customer dispute filed — sudden intrusion review initiated',  done: true  },
      { date: 'TBD',    event: 'Secondary review decision — 48hr SLA',                       done: false },
    ],
    claimDocs: [
      { name: 'Adjuster inspection report',  status: 'received' },
      { name: 'Flood exclusion documentation', status: 'received' },
      { name: 'Denial letter (sent 02/17)',   status: 'received' },
      { name: 'Sudden intrusion supplement',  status: 'pending'  },
    ],
    adjuster: { name: 'Marcus Webb', email: 'm.webb@bloomins.com', ext: '5214' },
  },
  lifepolicy: {
    updateSubject: 'Your Dividend Election Change — Confirmation',
    updateDraft: "Dear Catherine,\n\nThank you for speaking with me today. Your dividend election has been updated from Accumulate to Paid-Up Additions, effective your next dividend date.\n\nThis change will add approximately $18,200 in permanent additional coverage to your policy at no extra cost.\n\nWarm regards,\nSarah Mitchell · CSR II · Bloom Insurance",
    escalationPriority: 'Medium',
    escalationTo: 'Whole Life Specialist',
    escalationReason: 'Complex dividend reallocation — PUA + partial cash option requested. Illustration team review needed.',
    noteDraft: "Catherine Brooks — WL-2018-44219. Called to review dividend election. Currently Accumulate ($12,840 balance). Explained all 4 options. Customer elected Paid-Up Additions — adds ~$18,200 coverage at no extra cost. Confirmed beneficiary (Marcus Brooks, unchanged since 2018). Sent confirmation email. 7-year payment streak intact. Highly engaged, positive sentiment.",
    callbackReason: 'Dividend election confirmation + PUA illustration follow-up',
    claimTimeline: [
      { date: 'Mar 2018', event: 'Policy issued — Whole Life 20-Pay, face $250,000',       done: true  },
      { date: 'Annual',   event: 'Dividend credited — Accumulate election in effect',       done: true  },
      { date: 'Jan 2026', event: 'Annual statement issued — $12,840 accumulated dividends', done: true  },
      { date: 'Today',    event: 'Election change: Accumulate → Paid-Up Additions',         done: true  },
      { date: 'Apr 2026', event: 'PUA effective — ~$18,200 in additional coverage added',  done: false },
    ],
  },
};

// ─── Live transcript data per scenario ────────────────────────────────────────
interface TranscriptLine {
  ts:        string;
  speaker:   'agent' | 'customer' | 'ivr';
  text:      string;
  sentiment: 'pos' | 'neu' | 'neg';
}

const TRANSCRIPT_DATA: Record<ScenarioId, TranscriptLine[]> = {
  friction: [
    { ts: '10:22:04', speaker: 'customer', text: "I've been calling about this claim for three weeks and nobody is helping me.",                                  sentiment: 'neg' },
    { ts: '10:22:19', speaker: 'agent',    text: "Margaret, I sincerely apologize. Let me pull up your claim right now — you have my full attention.",            sentiment: 'neu' },
    { ts: '10:22:33', speaker: 'customer', text: "The adjuster hasn't returned a single call. This is completely unacceptable.",                                  sentiment: 'neg' },
    { ts: '10:22:48', speaker: 'agent',    text: "You're right. CLM-2026-4491 has been pending 18 days — that's beyond our SLA and I'm escalating this immediately.", sentiment: 'neu' },
    { ts: '10:23:05', speaker: 'customer', text: "I just need my car fixed. That's all I've been asking since February 1st.",                                     sentiment: 'neg' },
    { ts: '10:23:21', speaker: 'agent',    text: "I understand completely. I'm contacting the claims manager now and committing to a status update within 24 hours.", sentiment: 'pos' },
    { ts: '10:23:38', speaker: 'customer', text: "Alright. That's what I needed to hear.",                                                                        sentiment: 'neu' },
    { ts: '10:23:51', speaker: 'agent',    text: "You have my word, Margaret. I'll personally follow this through to resolution.",                                 sentiment: 'pos' },
  ],
  adaptive: [
    { ts: '09:15:02', speaker: 'agent',    text: "Good morning, is this David Park? This is Sarah from Bloom Insurance.",                                          sentiment: 'pos' },
    { ts: '09:15:11', speaker: 'customer', text: "Yes, hi Sarah.",                                                                                                sentiment: 'neu' },
    { ts: '09:15:19', speaker: 'agent',    text: "Congratulations on the new baby, David! I saw the update on your account — that's wonderful news.",              sentiment: 'pos' },
    { ts: '09:15:30', speaker: 'customer', text: "Thank you! Yes, that's actually why I'm calling. I need to update my policy for our new daughter.",              sentiment: 'pos' },
    { ts: '09:15:44', speaker: 'agent',    text: "Absolutely. First thing — your new daughter isn't yet listed as a beneficiary. We should get that updated today.", sentiment: 'neu' },
    { ts: '09:15:58', speaker: 'customer', text: "Oh, I didn't realize that. Yes, definitely needs to be updated.",                                                sentiment: 'neu' },
    { ts: '09:16:12', speaker: 'agent',    text: "I'll start that form now. I'd also recommend a quick coverage review — a new dependent often changes your needs.", sentiment: 'pos' },
    { ts: '09:16:26', speaker: 'customer', text: "That makes sense. I was actually wondering if my current coverage is still enough.",                             sentiment: 'neu' },
  ],
  omni: [
    { ts: '11:04:15', speaker: 'customer', text: "Hi, I was just on the chatbot and it couldn't answer my billing question.",                                      sentiment: 'neu' },
    { ts: '11:04:25', speaker: 'agent',    text: "Hi Sarah, I have your full chatbot and portal session here — no need to repeat anything.",                       sentiment: 'pos' },
    { ts: '11:04:35', speaker: 'customer', text: "Oh good. My premium changed and I don't understand why.",                                                        sentiment: 'neu' },
    { ts: '11:04:49', speaker: 'agent',    text: "I see exactly what happened — your annual review applied in January. Your deductible stayed the same.",          sentiment: 'neu' },
    { ts: '11:05:03', speaker: 'customer', text: "OK, but why is the number different from what I see on the portal?",                                             sentiment: 'neu' },
    { ts: '11:05:17', speaker: 'agent',    text: "The portal shows the pre-adjustment rate until the next billing cycle — I'll send you a clear breakdown by email.", sentiment: 'pos' },
    { ts: '11:05:31', speaker: 'customer', text: "That would be really helpful, thank you.",                                                                       sentiment: 'pos' },
    { ts: '11:05:42', speaker: 'agent',    text: "Sent. Is there anything else from your session today I can help you with?",                                      sentiment: 'pos' },
  ],
  callback: [
    { ts: '14:32:07', speaker: 'agent',    text: "James, I am so sorry you waited 47 minutes. That is completely unacceptable and I take full responsibility.",    sentiment: 'neu' },
    { ts: '14:32:21', speaker: 'customer', text: "47 minutes. I almost just cancelled my policy.",                                                                 sentiment: 'neg' },
    { ts: '14:32:31', speaker: 'agent',    text: "You have every right to feel that way. I'm going to make this right for you right now — what can I help you with?", sentiment: 'pos' },
    { ts: '14:32:46', speaker: 'customer', text: "There's a charge on my bill I don't recognize. A $127 fee from last month.",                                     sentiment: 'neg' },
    { ts: '14:32:59', speaker: 'agent',    text: "I see it — that was a paper billing fee that shouldn't have applied to your account. I'm reversing it right now.", sentiment: 'pos' },
    { ts: '14:33:14', speaker: 'customer', text: "OK. That's literally all I needed.",                                                                             sentiment: 'neu' },
    { ts: '14:33:24', speaker: 'agent',    text: "Done — reversed. I've also applied a $25 courtesy credit for your wait time. I hope we've earned your trust back.", sentiment: 'pos' },
    { ts: '14:33:40', speaker: 'customer', text: "Alright. Thank you for actually fixing it.",                                                                     sentiment: 'neu' },
  ],
  workforce: [
    { ts: '10:02:14', speaker: 'customer', text: "Hi, I'm calling about taking out a loan against my life insurance policy.",                                      sentiment: 'neu' },
    { ts: '10:02:25', speaker: 'agent',    text: "Good morning Robert! I'd be happy to help you with a policy loan today.",                                        sentiment: 'pos' },
    { ts: '10:02:36', speaker: 'customer', text: "I've already been on the portal doing research. I'm looking at around $75,000.",                                 sentiment: 'neu' },
    { ts: '10:02:50', speaker: 'agent',    text: "I can see your research — great preparation. Your maximum loanable is $168,678, so $75K is well within range.",  sentiment: 'pos' },
    { ts: '10:03:04', speaker: 'customer', text: "I was comparing the fixed versus variable rate. Can you walk me through the difference?",                         sentiment: 'neu' },
    { ts: '10:03:19', speaker: 'agent',    text: "Fixed is 5.25% — $3,937 annually, predictable. Variable is 4.75% now but can move with the market.",             sentiment: 'neu' },
    { ts: '10:03:34', speaker: 'customer', text: "What happens to my death benefit and cash value if I take the full $75K?",                                        sentiment: 'neu' },
    { ts: '10:03:49', speaker: 'agent',    text: "Net cash value $112,420, net death benefit $425K. And Assure just confirmed you're approved — we can proceed.",   sentiment: 'pos' },
    { ts: '10:04:03', speaker: 'customer', text: "Perfect. Let's go with the fixed rate.",                                                                         sentiment: 'pos' },
  ],
  lifeevent: [
    { ts: '09:45:11', speaker: 'agent',    text: "Good morning Patricia, this is Sarah from Bloom. I'm calling because your policy matures in 90 days.",           sentiment: 'pos' },
    { ts: '09:45:24', speaker: 'customer', text: "Oh yes, I've been meaning to look into what my options are.",                                                    sentiment: 'neu' },
    { ts: '09:45:36', speaker: 'agent',    text: "As a 20-year customer you have some excellent options. Can I walk you through them?",                             sentiment: 'pos' },
    { ts: '09:45:47', speaker: 'customer', text: "Please. I'm not sure if I still need the same level of coverage.",                                               sentiment: 'neu' },
    { ts: '09:46:02', speaker: 'agent',    text: "Based on your profile, an annuity conversion is a strong fit — your policy value becomes guaranteed income for life.", sentiment: 'pos' },
    { ts: '09:46:17', speaker: 'customer', text: "I've heard of annuities but never really understood them. Can you explain a bit more?",                          sentiment: 'neu' },
    { ts: '09:46:32', speaker: 'agent',    text: "Instead of your coverage simply expiring, your accumulated value becomes a steady monthly payment — for as long as you live.", sentiment: 'pos' },
    { ts: '09:46:47', speaker: 'customer', text: "That actually sounds interesting. I'm retiring next year, so the timing could work perfectly.",                  sentiment: 'pos' },
    { ts: '09:47:02', speaker: 'agent',    text: "Perfect timing. I'll have a specialist prepare illustrations — no obligation, just options for you to review.",   sentiment: 'pos' },
  ],
  ivrstp: [
    { ts: '13:42:01', speaker: 'ivr',      text: "Welcome to Bloom Insurance. Please say or enter your policy number.",                                                   sentiment: 'neu' },
    { ts: '13:42:09', speaker: 'customer', text: "TX-AU-2024-8832.",                                                                                                      sentiment: 'neu' },
    { ts: '13:42:15', speaker: 'ivr',      text: "Thank you. I found your policy for Linda Reyes. How can I help you today?",                                             sentiment: 'neu' },
    { ts: '13:42:23', speaker: 'customer', text: "I need to update my mailing address.",                                                                                  sentiment: 'neu' },
    { ts: '13:42:28', speaker: 'ivr',      text: "I can help with that. Please say your new street address.",                                                             sentiment: 'neu' },
    { ts: '13:42:36', speaker: 'customer', text: "4821 Maple Creek Drive.",                                                                                               sentiment: 'neu' },
    { ts: '13:42:43', speaker: 'ivr',      text: "And your city, state, and zip code?",                                                                                   sentiment: 'neu' },
    { ts: '13:42:50', speaker: 'customer', text: "Austin, Texas. 7-8-7-0-1.",                                                                                            sentiment: 'neu' },
    { ts: '13:43:01', speaker: 'ivr',      text: "I have 4821 Maple Creek Drive, Austin TX 78701. Is that correct?",                                                     sentiment: 'neu' },
    { ts: '13:43:07', speaker: 'customer', text: "Yes, that's correct.",                                                                                                  sentiment: 'pos' },
    { ts: '13:43:12', speaker: 'ivr',      text: "Your address has been updated. A confirmation email will be sent to the address on file. Is there anything else?",      sentiment: 'neu' },
    { ts: '13:43:19', speaker: 'customer', text: "No, that's all. Thank you.",                                                                                            sentiment: 'pos' },
  ],
  escalation: [
    { ts: '10:18:02', speaker: 'customer', text: "I got a letter saying my claim is DENIED. Over thirty thousand dollars in damage and you people won't pay it?",         sentiment: 'neg' },
    { ts: '10:18:14', speaker: 'agent',    text: "Mr. Harrison, I hear you — that must be incredibly frustrating. I'm pulling up your file right now.",                   sentiment: 'neu' },
    { ts: '10:18:24', speaker: 'customer', text: "Eight years I've been paying my premium. Eight years. And the one time I need you, you deny my claim.",                 sentiment: 'neg' },
    { ts: '10:18:37', speaker: 'agent',    text: "You have every right to be upset. I want to understand exactly what happened and see what options you have.",            sentiment: 'neu' },
    { ts: '10:18:50', speaker: 'customer', text: "I want to cancel all three of my policies. Right now.",                                                                 sentiment: 'neg' },
    { ts: '10:19:03', speaker: 'agent',    text: "I can do that if that's what you decide. But I owe it to you to walk through the denial and every option first.",       sentiment: 'pos' },
    { ts: '10:19:17', speaker: 'customer', text: "Fine. You've got about two minutes.",                                                                                   sentiment: 'neg' },
    { ts: '10:19:28', speaker: 'agent',    text: "The denial is under the flood exclusion — but I'm seeing adjuster notes showing a sudden water intrusion component that may qualify separately.", sentiment: 'neu' },
    { ts: '10:19:44', speaker: 'customer', text: "So part of it might actually be covered?",                                                                              sentiment: 'neu' },
  ],
  lifepolicy: [
    { ts: '13:15:04', speaker: 'agent',    text: "Good afternoon, thank you for calling Bloom. This is Sarah — I can see you were just on our dividend calculator.",  sentiment: 'pos' },
    { ts: '13:15:16', speaker: 'customer', text: "Yes, I've had my whole life policy for eight years and I want to rethink how my dividends are being used.",        sentiment: 'pos' },
    { ts: '13:15:30', speaker: 'agent',    text: "Absolutely. You're currently set to Accumulate — you have $12,840 built up. What option caught your eye?",         sentiment: 'neu' },
    { ts: '13:15:44', speaker: 'customer', text: "Paid-up additions. The calculator showed something like eighteen thousand dollars in extra coverage?",              sentiment: 'pos' },
    { ts: '13:15:58', speaker: 'agent',    text: "Exactly right — $18,200 in permanent additional coverage, no extra premium, starting at your next dividend date.", sentiment: 'pos' },
    { ts: '13:16:13', speaker: 'customer', text: "That sounds much better than just letting it accumulate. Can I also confirm — is my beneficiary still Marcus?",    sentiment: 'pos' },
    { ts: '13:16:27', speaker: 'agent',    text: "Marcus Brooks is on file from 2018. We should confirm that's still correct — want to update anything there?",      sentiment: 'neu' },
    { ts: '13:16:41', speaker: 'customer', text: "He's still correct. OK, let's go ahead and switch to paid-up additions.",                                          sentiment: 'pos' },
    { ts: '13:16:55', speaker: 'agent',    text: "Done — election updated. I'll send a confirmation with your new projected death benefit. Congratulations, Catherine!", sentiment: 'pos' },
  ],
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
            <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: BLOOM.greenPale, border: '2px solid #c5e3bc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.375rem' }}>✓</Box>
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
            <Box sx={{ fontSize: '0.6875rem', fontWeight: 700, px: 1.25, py: 0.375, borderRadius: '4px', bgcolor: BLOOM.orangePale, color: BLOOM.orange }}>{csr.claim!.status}</Box>
            <Box sx={{ fontSize: '0.6875rem', color: 'text.secondary', px: 1.25, py: 0.375, borderRadius: '4px', bgcolor: BLOOM.canvas }}>Filed {csr.claim!.filed}</Box>
          </Box>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <FormGroup>
            <FormLabel>Timeline</FormLabel>
            {timeline.map((step, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.25, py: 0.875, borderBottom: i < timeline.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none', alignItems: 'flex-start' }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, mt: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5625rem', fontWeight: 700, bgcolor: step.done ? BLOOM.green : BLOOM.canvas, color: step.done ? '#fff' : BLOOM.textSecondary, border: step.done ? 'none' : `2px dashed ${BLOOM.border}` }}>
                  {step.done ? '✓' : ''}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: step.done ? 500 : 600, color: step.done ? 'text.secondary' : 'text.primary', lineHeight: 1.3 }}>{step.event}</Typography>
                  <Typography sx={{ fontSize: '0.5625rem', color: BLOOM.textSecondary }}>{step.date}</Typography>
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
                <Box sx={{ fontSize: '0.5625rem', fontWeight: 700, px: 0.875, py: 0.25, borderRadius: '4px', bgcolor: doc.status === 'received' ? BLOOM.greenPale : BLOOM.orangePale, color: doc.status === 'received' ? BLOOM.green : BLOOM.orange }}>
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
              <Typography sx={{ color: BLOOM.textSecondary, fontSize: '0.875rem', lineHeight: 1, mt: '1px', flexShrink: 0 }}>›</Typography>
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
    cautionary: { bg: BLOOM.orangePale, color: BLOOM.orange           },
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
            <Chip label={`✓ ${data.banner.authBadge}`} size="small" sx={{ height: 18, fontSize: '0.5625rem', bgcolor: BLOOM.greenPale, color: BLOOM.green, border: '1px solid #c5e3bc' }} />
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

// ─── Right Panel — Live Analysis + Transcript ─────────────────────────────────
const SENT_DOT: Record<string, string> = { pos: BLOOM.green, neu: BLOOM.textSecondary, neg: BLOOM.red };

function RightPanel({ scenario }: { scenario: ScenarioId }) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'transcript'>('analysis');
  const [visibleCount, setVisibleCount] = useState(2);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const { signals }      = SCENARIO_AI[scenario];
  const transcriptLines  = TRANSCRIPT_DATA[scenario];
  const sentimentColor   = signals.sentiment.pct > 65 ? BLOOM.green : signals.sentiment.pct > 40 ? BLOOM.orange : BLOOM.red;
  const stressColor      = signals.stress.pct    > 60 ? BLOOM.red   : signals.stress.pct    > 35 ? BLOOM.orange : BLOOM.green;
  const isComplete       = visibleCount >= transcriptLines.length;
  const isIVRScenario    = transcriptLines.some(l => l.speaker === 'ivr');

  // Reset when scenario changes
  useEffect(() => { setVisibleCount(2); }, [scenario]);

  // Progressive line reveal — one line every ~4 seconds while transcript tab is open
  useEffect(() => {
    if (isComplete) return;
    const t = setTimeout(() => setVisibleCount(v => v + 1), 4000);
    return () => clearTimeout(t);
  }, [visibleCount, isComplete]);

  // Auto-scroll to latest line
  useEffect(() => {
    if (activeTab === 'transcript') {
      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleCount, activeTab]);

  const visibleLines = transcriptLines.slice(0, visibleCount);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header with tab switcher */}
      <Box sx={{ px: 2, py: 1.25, borderBottom: `1px solid ${BLOOM.border}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.25, bgcolor: BLOOM.canvas, borderRadius: '6px', p: '2px' }}>
          {(['analysis', 'transcript'] as const).map(tab => (
            <Box
              key={tab}
              component="button"
              onClick={() => setActiveTab(tab)}
              sx={{
                px: 1.25, py: 0.5, borderRadius: '4px', fontSize: '0.625rem', fontWeight: 600,
                border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                bgcolor: activeTab === tab ? 'background.paper' : 'transparent',
                color: activeTab === tab ? 'text.primary' : 'text.secondary',
                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {tab === 'analysis' ? '📊 Analysis' : '🎙 Transcript'}
            </Box>
          ))}
        </Box>
        {/* Live indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{
            width: 6, height: 6, borderRadius: '50%',
            bgcolor: activeTab === 'transcript' && isComplete ? BLOOM.textSecondary : BLOOM.red,
            '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
            animation: isComplete ? 'none' : 'blink 1.2s ease infinite',
          }} />
          <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: activeTab === 'transcript' && isComplete ? BLOOM.textSecondary : BLOOM.red, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {activeTab === 'transcript' && isComplete ? 'Paused' : 'Live'}
          </Typography>
        </Box>
      </Box>

      {/* ── Analysis tab ── */}
      {activeTab === 'analysis' && (
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2 }}>
          <PanelSection title="Interaction Signals">
            <SignalBar label="Sentiment"  pct={signals.sentiment.pct} color={sentimentColor} valueLabel={signals.sentiment.label} />
            <SignalBar label="Stress"     pct={signals.stress.pct}    color={stressColor}    valueLabel={signals.stress.label} />
            <SignalBar label="Engagement" pct={84}                    color={BLOOM.blue}     valueLabel="Active" />
          </PanelSection>

          <PanelSection title="Intent Detected">
            <Box sx={{ p: 1.25, bgcolor: BLOOM.canvas, borderRadius: '6px', borderLeft: `3px solid ${BLOOM.blue}` }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.4 }}>{signals.intent}</Typography>
            </Box>
          </PanelSection>

          <PanelSection title="Channel Journey">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
              {signals.journey.split(' → ').map((step, i, arr) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ fontSize: '0.6875rem', fontWeight: 600, px: 0.875, py: 0.375, borderRadius: '4px', bgcolor: BLOOM.canvas, color: 'text.primary' }}>
                    {step}
                  </Box>
                  {i < arr.length - 1 && <Typography sx={{ fontSize: '0.5625rem', color: BLOOM.textSecondary }}>→</Typography>}
                </Box>
              ))}
            </Box>
          </PanelSection>

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
      )}

      {/* ── Transcript tab ── */}
      {activeTab === 'transcript' && (
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5 }}>
          {visibleLines.map((line, i) => {
            const isAgent    = line.speaker === 'agent';
            const isIVR      = line.speaker === 'ivr';
            const isLatest   = i === visibleLines.length - 1 && !isComplete;
            const sentColor  = SENT_DOT[line.sentiment];
            const tagBg    = isAgent ? BLOOM.bluePale : isIVR ? '#ede9fe' : '#fff7ed';
            const tagColor = isAgent ? BLOOM.blue     : isIVR ? '#6d28d9' : '#c2410c';
            const tagLabel = isAgent ? 'Agent'        : isIVR ? 'IVR'     : 'Customer';
            const activeBorder = isIVR ? '#6d28d9' : BLOOM.blue;
            return (
              <Box
                key={i}
                sx={{
                  py: 1, px: isLatest ? 1 : 0,
                  borderBottom: i < visibleLines.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none',
                  borderLeft: isLatest ? `3px solid ${activeBorder}` : '3px solid transparent',
                  borderRadius: isLatest ? '0 4px 4px 0' : 0,
                  bgcolor: isLatest ? (isIVR ? '#faf5ff' : '#f8faff') : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Meta row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                  <Box sx={{
                    fontSize: '0.4375rem', fontWeight: 800, px: 0.75, py: 0.25, borderRadius: '3px',
                    textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0,
                    bgcolor: tagBg, color: tagColor,
                  }}>
                    {tagLabel}
                  </Box>
                  <Typography sx={{ fontSize: '0.5rem', color: BLOOM.textSecondary, fontVariantNumeric: 'tabular-nums' }}>
                    {line.ts}
                  </Typography>
                  <Box sx={{ ml: 'auto', width: 6, height: 6, borderRadius: '50%', bgcolor: sentColor, flexShrink: 0 }} />
                </Box>
                {/* Text */}
                <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.55, color: 'text.primary' }}>
                  {line.text}
                </Typography>
              </Box>
            );
          })}

          {/* Typing indicator — shown while more lines are pending */}
          {!isComplete && (
            <Box sx={{ display: 'flex', gap: 0.5, py: 1.25, px: 0.5, alignItems: 'center' }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 5, height: 5, borderRadius: '50%', bgcolor: BLOOM.textSecondary,
                    '@keyframes typing': {
                      '0%,60%,100%': { transform: 'translateY(0)',    opacity: 0.35 },
                      '30%':         { transform: 'translateY(-4px)', opacity: 1    },
                    },
                    animation: `typing 1.2s ease ${delay}s infinite`,
                  }}
                />
              ))}
            </Box>
          )}

          {/* End-of-transcript marker */}
          {isComplete && (
            <Box sx={{ mt: 1, py: 0.75, textAlign: 'center', fontSize: '0.5625rem', color: isIVRScenario ? '#6d28d9' : BLOOM.textSecondary }}>
              {isIVRScenario ? '— STP Complete · No CSR Action Required —' : '— Call in progress —'}
            </Box>
          )}

          <div ref={transcriptEndRef} />
        </Box>
      )}
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
