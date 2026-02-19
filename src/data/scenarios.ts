export type ScenarioId = 'friction' | 'adaptive' | 'omni' | 'callback' | 'workforce' | 'lifeevent' | 'lifepolicy' | 'ivrstp' | 'escalation';

export interface BannerField {
  label: string;
  value: string;
}

export interface BannerData {
  fields: BannerField[];
  authBadge?: string;
  channelBadge?: string;
}

export interface PolicyWidget {
  policyNumber: string;
  product: string;
  status: string;
  issueDate: string;
  state: string;
}

export interface BillingWidget {
  paidTo: string;
  method: string;
  frequency: string;
  premium: string;
}

export interface ClaimWidget {
  reference: string;
  type: string;
  filed: string;
  status: string;
  statusColor: 'positive' | 'negative' | 'cautionary' | 'info';
}

export interface ContactWidget {
  contacts30d: string | number;
  lastContact: string;
  channel: string;
  sentiment: string;
  sentimentColor: 'positive' | 'negative' | 'cautionary' | 'info' | 'neutral';
}

export interface CoverageItem {
  label: string;
  value: string;
}

export interface ActivityItem {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  timestamp: string;
  badge: string;
  badgeColor: 'positive' | 'negative' | 'cautionary' | 'info' | 'neutral';
}

export interface CSRData {
  banner: BannerData;
  policy: PolicyWidget;
  billing: BillingWidget;
  claim?: ClaimWidget;
  contact: ContactWidget;
  coverages: CoverageItem[];
  coverageNote?: string;
  activity: ActivityItem[];
  workspaceTitle?: string;
}

export interface ScenarioMeta {
  id: ScenarioId;
  label: string;
  icon: string;
  description: string;
}

export const SCENARIO_LIST: ScenarioMeta[] = [
  { id: 'friction',   label: 'Friction Detection',      icon: '🔥', description: 'Repeat caller, escalating sentiment' },
  { id: 'adaptive',   label: 'Adaptive Engagement',     icon: '🎯', description: 'Smart routing, callback offers' },
  { id: 'omni',       label: 'Omnichannel Continuity',  icon: '🔗', description: 'Cross-channel memory' },
  { id: 'callback',   label: 'Callback & Recovery',     icon: '📲', description: 'Sentiment drop, supervisor alerts' },
  { id: 'workforce',  label: 'Workforce Optimization',  icon: '👥', description: 'Skill matching, coaching' },
  { id: 'lifeevent',  label: 'Life-Event Detection',    icon: '📋', description: 'Marriage, retirement triggers' },
  { id: 'lifepolicy', label: 'Whole Life Review',       icon: '🌿', description: 'Dividend election, cash value optimization' },
  { id: 'ivrstp',     label: 'IVR STP — Monitoring',   icon: '⚡', description: 'Assure auto-handling, CSR on standby' },
  { id: 'escalation', label: 'Claim Denial Escalation', icon: '🔴', description: 'Denial dispute, cancellation threat' },
];

export const SCENARIO_CSR: Record<ScenarioId, CSRData> = {
  friction: {
    banner: {
      fields: [
        { label: 'Policy', value: 'HO-2024-88312' },
        { label: 'Owner', value: 'Margaret Torres' },
        { label: 'Product', value: 'Homeowners' },
        { label: 'Status', value: 'Active' },
      ],
      authBadge: 'Authenticated',
      channelBadge: 'IVR → Agent (3rd call)',
    },
    policy: { policyNumber: 'HO-2024-88312', product: 'Homeowners', status: 'Active', issueDate: '04/10/2022', state: 'FL' },
    billing: { paidTo: '01/10/2026', method: 'Direct Bill', frequency: 'Annual', premium: '$2,840.00' },
    claim: { reference: 'CLM-2026-4491', type: 'Water Damage', filed: '01/29/2026', status: 'Under Review', statusColor: 'cautionary' },
    contact: { contacts30d: 5, lastContact: 'Feb 12, 2026', channel: 'Phone', sentiment: 'Declining', sentimentColor: 'negative' },
    coverages: [
      { label: 'Dwelling (A)', value: '$385,000' },
      { label: 'Other Structures (B)', value: '$38,500' },
      { label: 'Personal Property (C)', value: '$192,500' },
      { label: 'Loss of Use (D)', value: '$77,000' },
      { label: 'Personal Liability (E)', value: '$300,000' },
      { label: 'Deductible', value: '$2,500' },
      { label: 'Wind/Hail Deductible', value: '2% Dwelling' },
    ],
    coverageNote: 'Water damage claim filed 01/29. Pending adjuster inspection. Est: $18,400.',
    activity: [
      { icon: '📞', iconColor: '#b91c1c', iconBg: '#fee2e2', title: 'Inbound Call — Claim Status', timestamp: 'Today, 2:48 PM · 18:02 duration', badge: 'Negative', badgeColor: 'negative' },
      { icon: '📞', iconColor: '#946b0e', iconBg: '#fef9c3', title: 'Inbound Call — Document Follow-Up', timestamp: 'Feb 8, 2026 · 11:45 duration', badge: 'Declining', badgeColor: 'cautionary' },
      { icon: '📄', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'Documents Submitted', timestamp: 'Feb 2, 2026 · Photos, estimate, police report', badge: 'Received', badgeColor: 'info' },
      { icon: '📞', iconColor: '#37A526', iconBg: '#e6f5e0', title: 'Inbound Call — Initial Inquiry', timestamp: 'Feb 5, 2026 · 6:20 duration', badge: 'Neutral', badgeColor: 'positive' },
    ],
  },
  adaptive: {
    banner: {
      fields: [
        { label: 'Policy', value: 'AU-2023-55190' },
        { label: 'Owner', value: 'David Park' },
        { label: 'Product', value: 'Auto' },
      ],
      authBadge: 'IVR Auth',
      channelBadge: 'Callback (Adaptive)',
    },
    policy: { policyNumber: 'AU-2023-55190', product: 'Auto Insurance', status: 'Active', issueDate: '03/15/2023', state: 'CA' },
    billing: { paidTo: '03/15/2026', method: 'Auto-Pay', frequency: 'Monthly', premium: '$1,240.00' },
    claim: { reference: 'CLM-2026-5102', type: 'Auto Collision', filed: '02/08/2026', status: 'Under Review', statusColor: 'cautionary' },
    contact: { contacts30d: 4, lastContact: 'Today, 2:14 PM', channel: 'Callback', sentiment: 'Improving', sentimentColor: 'positive' },
    coverages: [
      { label: 'Bodily Injury', value: '$100K/300K' },
      { label: 'Property Damage', value: '$100,000' },
      { label: 'Collision', value: '$500 deductible' },
      { label: 'Comprehensive', value: '$250 deductible' },
      { label: 'Uninsured Motorist', value: '$100K/300K' },
      { label: 'Medical Payments', value: '$5,000' },
    ],
    coverageNote: 'Collision claim filed 02/08. Estimate submitted and under review.',
    activity: [
      { icon: '📞', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'Callback — Adaptive Routing', timestamp: 'Today, 2:22 PM · Active', badge: 'Active', badgeColor: 'positive' },
      { icon: '📞', iconColor: '#946b0e', iconBg: '#fef9c3', title: 'Inbound Call — Claim Update', timestamp: 'Today, 10:41 AM · 7:18 duration', badge: 'Neutral', badgeColor: 'cautionary' },
      { icon: '📄', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'Estimate Submitted', timestamp: 'Feb 8, 2026 · Body shop estimate $6,240', badge: 'Received', badgeColor: 'info' },
      { icon: '📞', iconColor: '#37A526', iconBg: '#e6f5e0', title: 'Inbound Call — FNOL', timestamp: 'Feb 5, 2026 · 8:42 duration', badge: 'Positive', badgeColor: 'positive' },
    ],
  },
  omni: {
    banner: {
      fields: [
        { label: 'Policy', value: '440387261UL' },
        { label: 'Owner', value: 'Robert A. Chen' },
        { label: 'Product', value: 'Universal Life' },
      ],
      authBadge: 'Portal SSO',
      channelBadge: 'Portal → Chat → Call',
    },
    policy: { policyNumber: '440387261UL', product: 'Universal Life', status: 'Active', issueDate: '07/01/2019', state: 'WA' },
    billing: { paidTo: '07/01/2026', method: 'EFT', frequency: 'Monthly', premium: '$342.00' },
    contact: { contacts30d: 4, lastContact: 'Today, 10:31 AM', channel: 'Phone (from chat)', sentiment: 'Positive', sentimentColor: 'positive' },
    coverages: [
      { label: 'Face Amount', value: '$500,000' },
      { label: 'Death Benefit', value: '$527,341' },
      { label: 'Cash Value', value: '$42,815' },
      { label: 'Loan Balance', value: '$0' },
      { label: 'Primary Bene', value: 'Lisa M. Chen' },
      { label: 'Contingent Bene', value: 'Pending Update' },
    ],
    coverageNote: 'Beneficiary update in progress. Minor dependent (Emily Rose Chen, DOB 04/15/2008) — UTMA custodian required.',
    activity: [
      { icon: '📞', iconColor: '#37A526', iconBg: '#e6f5e0', title: 'Phone — Beneficiary Update', timestamp: 'Today, 10:31 AM · Active', badge: 'Active', badgeColor: 'positive' },
      { icon: '💬', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'Agent Chat — UTMA Guidance', timestamp: 'Today, 10:24 AM · 7 min', badge: 'Positive', badgeColor: 'positive' },
      { icon: '🤖', iconColor: '#7c5500', iconBg: '#fef3d6', title: 'AI Chatbot — Beneficiary Intent', timestamp: 'Today, 10:19 AM · 88% confidence', badge: 'Escalated', badgeColor: 'cautionary' },
      { icon: '🌐', iconColor: '#808285', iconBg: '#F2F7F6', title: 'Self-Service Portal', timestamp: 'Today, 10:14 AM · Viewed beneficiaries', badge: 'Neutral', badgeColor: 'neutral' },
    ],
  },
  callback: {
    banner: {
      fields: [
        { label: 'Policy', value: 'HO-2025-71034' },
        { label: 'Owner', value: 'Karen Williams' },
        { label: 'Product', value: 'Homeowners' },
      ],
      authBadge: 'Verified',
      channelBadge: 'Recovery Callback',
    },
    policy: { policyNumber: 'HO-2025-71034', product: 'Homeowners', status: 'Active', issueDate: '01/15/2025', state: 'TX' },
    billing: { paidTo: '01/15/2026', method: 'Mortgage Escrow', frequency: 'Annual', premium: '$3,120.00' },
    claim: { reference: 'CLM-2026-7831', type: 'Wind/Hail Damage', filed: '02/10/2026', status: 'Pending Review', statusColor: 'cautionary' },
    contact: { contacts30d: 3, lastContact: 'Today, 2:48 PM', channel: 'Disconnected → SMS Recovery', sentiment: 'Negative', sentimentColor: 'negative' },
    coverages: [
      { label: 'Dwelling (A)', value: '$425,000' },
      { label: 'Other Structures (B)', value: '$42,500' },
      { label: 'Personal Property (C)', value: '$212,500' },
      { label: 'Loss of Use (D)', value: '$85,000' },
      { label: 'Personal Liability (E)', value: '$300,000' },
      { label: 'Deductible', value: '$2,500' },
    ],
    coverageNote: 'Wind/hail claim filed 02/10. Customer disconnected after 8:42 hold. Recovery callback queued — priority 1.',
    activity: [
      { icon: '⚠️', iconColor: '#b91c1c', iconBg: '#fee2e2', title: 'Disconnected — Recovery Initiated', timestamp: 'Today, 2:48 PM · Hold: 8:42', badge: 'Critical', badgeColor: 'negative' },
      { icon: '💬', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'SMS Sent — Apology + Callback ETA', timestamp: 'Today, 2:49 PM · Delivered', badge: 'Sent', badgeColor: 'info' },
      { icon: '📞', iconColor: '#946b0e', iconBg: '#fef9c3', title: 'Inbound Call — Claim Inquiry', timestamp: 'Feb 11, 2026 · 9:15 duration', badge: 'Negative', badgeColor: 'cautionary' },
      { icon: '📄', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'Claim Filed — Wind/Hail', timestamp: 'Feb 10, 2026', badge: 'Filed', badgeColor: 'info' },
    ],
  },
  workforce: {
    banner: {
      fields: [
        { label: 'Queue', value: 'Claims Escalation' },
        { label: 'Complexity', value: 'High' },
        { label: 'Agents', value: '3 Available' },
      ],
      channelBadge: 'Skill Routing',
    },
    policy: { policyNumber: 'Queue View', product: 'Claims Escalation', status: 'Routing', issueDate: '—', state: 'Multi' },
    billing: { paidTo: '—', method: '—', frequency: '—', premium: '—' },
    contact: { contacts30d: 0, lastContact: '—', channel: 'Inbound Queue', sentiment: 'Pending', sentimentColor: 'neutral' },
    coverages: [],
    activity: [
      { icon: '📞', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'Complex Claim — Routed to Lisa Tran', timestamp: 'Today, 2:22 PM · Score: 96', badge: 'Routed', badgeColor: 'positive' },
      { icon: '🎯', iconColor: '#37A526', iconBg: '#e6f5e0', title: 'IVR Bypass Activated', timestamp: 'Today, 2:14 PM', badge: 'Auto', badgeColor: 'info' },
      { icon: '👥', iconColor: '#7c5500', iconBg: '#fef3d6', title: 'Skill Match Completed', timestamp: 'Today, 2:14 PM · 3 agents evaluated', badge: 'Complete', badgeColor: 'cautionary' },
    ],
  },
  lifeevent: {
    banner: {
      fields: [
        { label: 'Policy', value: 'TL-2021-33847' },
        { label: 'Owner', value: 'James Nguyen' },
        { label: 'Product', value: 'Term Life' },
      ],
      authBadge: 'Authenticated',
      channelBadge: 'Life-Event Detected',
    },
    policy: { policyNumber: 'TL-2021-33847', product: 'Term Life (20yr)', status: 'Active', issueDate: '06/01/2021', state: 'IL' },
    billing: { paidTo: '06/01/2026', method: 'Auto-Pay', frequency: 'Monthly', premium: '$58.00' },
    contact: { contacts30d: 2, lastContact: 'Today, 11:22 AM', channel: 'Phone', sentiment: 'Positive', sentimentColor: 'positive' },
    coverages: [
      { label: 'Face Amount', value: '$350,000' },
      { label: 'Term Length', value: '20 Years' },
      { label: 'Expiration', value: '06/01/2041' },
      { label: 'Primary Bene', value: 'Patricia Nguyen' },
      { label: 'Child Rider', value: 'Not enrolled' },
      { label: 'Premium', value: '$58/mo' },
    ],
    coverageNote: '3 life events detected: Marriage, New Home, New Dependent. Coverage review recommended.',
    activity: [
      { icon: '📞', iconColor: '#37A526', iconBg: '#e6f5e0', title: 'Inbound Call — Add Dependent', timestamp: 'Today, 11:22 AM · Active', badge: 'Active', badgeColor: 'positive' },
      { icon: '🏡', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'Homeowners Inquiry — Portal', timestamp: 'Feb 3, 2026', badge: 'Signal', badgeColor: 'info' },
      { icon: '💍', iconColor: '#7c5500', iconBg: '#fef3d6', title: 'Name Change Detected', timestamp: 'Jan 28, 2026 · Williams → Nguyen', badge: 'Event', badgeColor: 'cautionary' },
      { icon: '📄', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'Beneficiary Updated', timestamp: 'Jan 28, 2026 · Patricia Nguyen added', badge: 'Updated', badgeColor: 'info' },
    ],
  },
  lifepolicy: {
    banner: {
      fields: [
        { label: 'Policy', value: 'WL-2018-44219' },
        { label: 'Owner', value: 'Catherine Brooks' },
        { label: 'Product', value: 'Whole Life 20-Pay' },
        { label: 'Dividend', value: 'Accumulate (current)' },
      ],
      authBadge: 'Authenticated',
      channelBadge: 'Portal → Phone',
    },
    policy: { policyNumber: 'WL-2018-44219', product: 'Whole Life 20-Pay', status: 'Active', issueDate: '03/15/2018', state: 'GA' },
    billing: { paidTo: '03/15/2026', method: 'EFT', frequency: 'Monthly', premium: '$287.00' },
    contact: { contacts30d: 1, lastContact: 'Today, 1:15 PM', channel: 'Phone', sentiment: 'Positive', sentimentColor: 'positive' },
    coverages: [
      { label: 'Face Amount', value: '$250,000' },
      { label: 'Death Benefit', value: '$268,420' },
      { label: 'Cash Value', value: '$48,320' },
      { label: 'Dividend (Accum.)', value: '$12,840' },
      { label: 'Loan Balance', value: '$0' },
      { label: 'Premium', value: '$287/mo' },
      { label: 'Primary Bene', value: 'Marcus Brooks' },
    ],
    coverageNote: 'Dividend election: Accumulate. $12,840 accumulated — PUA election could add ~$18,200 in coverage at no additional cost.',
    activity: [
      { icon: '📞', iconColor: '#37A526', iconBg: '#e6f5e0', title: 'Inbound Call — Dividend Review', timestamp: 'Today, 1:15 PM · Active', badge: 'Active', badgeColor: 'positive' },
      { icon: '🌐', iconColor: '#808285', iconBg: '#F2F7F6', title: 'Portal — Dividend Calculator', timestamp: 'Today, 1:08 PM · Research session', badge: 'Research', badgeColor: 'neutral' },
      { icon: '📄', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'Annual Statement Issued', timestamp: 'Jan 15, 2026 · Dividend: $1,820', badge: 'Issued', badgeColor: 'info' },
      { icon: '✅', iconColor: '#37A526', iconBg: '#e6f5e0', title: 'Premium Payment — On-Time Streak', timestamp: 'Mar 15, 2025 · 7-year streak intact', badge: 'On Time', badgeColor: 'positive' },
    ],
  },
  ivrstp: {
    banner: {
      fields: [
        { label: 'Policy', value: 'TX-AU-2024-8832' },
        { label: 'Owner', value: 'Linda Reyes' },
        { label: 'Product', value: 'Auto Insurance' },
        { label: 'Request', value: 'Address Update' },
      ],
      authBadge: 'IVR Auth',
      channelBadge: 'IVR → STP Active',
    },
    policy: { policyNumber: 'TX-AU-2024-8832', product: 'Auto Insurance', status: 'Active', issueDate: '07/22/2024', state: 'TX' },
    billing: { paidTo: '07/22/2026', method: 'Auto-Pay', frequency: 'Monthly', premium: '$148.00' },
    contact: { contacts30d: 0, lastContact: 'Today, 1:42 PM', channel: 'IVR (STP)', sentiment: 'Positive', sentimentColor: 'positive' },
    coverages: [
      { label: 'Bodily Injury', value: '$50K/100K' },
      { label: 'Property Damage', value: '$50,000' },
      { label: 'Collision', value: '$1,000 deductible' },
      { label: 'Comprehensive', value: '$500 deductible' },
      { label: 'Uninsured Motorist', value: '$50K/100K' },
    ],
    activity: [
      { icon: '⚡', iconColor: '#6d28d9', iconBg: '#ede9fe', title: 'IVR STP — Address Update In Progress', timestamp: 'Today, 1:42 PM · Assure Processing', badge: 'STP Active', badgeColor: 'info' },
      { icon: '✅', iconColor: '#37A526', iconBg: '#e6f5e0', title: 'Premium Payment — Auto-Pay', timestamp: 'Feb 1, 2026 · $148.00 on time', badge: 'Paid', badgeColor: 'positive' },
      { icon: '📄', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'Policy Issued', timestamp: 'Jul 22, 2024', badge: 'Issued', badgeColor: 'info' },
    ],
  },
  escalation: {
    banner: {
      fields: [
        { label: 'Policy', value: 'TX-HO-2023-65219' },
        { label: 'Owner', value: 'Frank Harrison' },
        { label: 'Product', value: 'Homeowners' },
        { label: 'Claim', value: 'CLM-2026-8812 — DENIED' },
      ],
      authBadge: 'Authenticated',
      channelBadge: 'Inbound — Direct',
    },
    policy: { policyNumber: 'TX-HO-2023-65219', product: 'Homeowners', status: 'Active', issueDate: '04/12/2023', state: 'TX' },
    billing: { paidTo: '04/12/2026', method: 'Direct Bill', frequency: 'Annual', premium: '$2,440.00' },
    claim: { reference: 'CLM-2026-8812', type: 'Water / Flood Damage', filed: '02/10/2026', status: 'DENIED', statusColor: 'negative' },
    contact: { contacts30d: 2, lastContact: 'Today, 10:18 AM', channel: 'Phone', sentiment: 'Angry', sentimentColor: 'negative' },
    coverages: [
      { label: 'Dwelling (A)', value: '$380,000' },
      { label: 'Other Structures (B)', value: '$38,000' },
      { label: 'Personal Property (C)', value: '$190,000' },
      { label: 'Loss of Use (D)', value: '$76,000' },
      { label: 'Personal Liability (E)', value: '$300,000' },
      { label: 'Flood Coverage', value: 'EXCLUDED' },
      { label: 'Deductible', value: '$2,500' },
    ],
    coverageNote: 'CLM-2026-8812 denied 02/17 under flood exclusion. Sudden water intrusion component under secondary review. 3 active policies ($5,200/yr). Cancellation threat logged.',
    activity: [
      { icon: '🚨', iconColor: '#b91c1c', iconBg: '#fee2e2', title: 'Inbound — Claim Denial Dispute', timestamp: 'Today, 10:18 AM · Cancellation threat', badge: 'Critical', badgeColor: 'negative' },
      { icon: '📬', iconColor: '#b91c1c', iconBg: '#fee2e2', title: 'Denial Letter Sent', timestamp: 'Today, 9:00 AM · CLM-2026-8812', badge: 'Denied', badgeColor: 'negative' },
      { icon: '🔍', iconColor: '#946b0e', iconBg: '#fef9c3', title: 'Adjuster Inspection', timestamp: 'Feb 14, 2026 · Flood/water damage confirmed', badge: 'Complete', badgeColor: 'cautionary' },
      { icon: '📄', iconColor: '#1B75BB', iconBg: '#e0f0fc', title: 'Claim Filed — Water/Flood Damage', timestamp: 'Feb 10, 2026 · Est. $31,000', badge: 'Filed', badgeColor: 'info' },
    ],
  },
};
