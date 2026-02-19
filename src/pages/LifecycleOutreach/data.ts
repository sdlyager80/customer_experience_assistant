export type CasePriority = 'urgent' | 'high' | 'medium' | 'low';
export type CaseStatus = 'new' | 'in-progress' | 'actioned' | 'converted';
export type CampaignType = 'retention' | 'compliance' | 'growth' | 'lifeevent';

export interface OutreachCase {
  id: string;
  customer: string;
  initials: string;
  policy: string;
  product: string;
  campaign: string;
  campaignType: CampaignType;
  priority: CasePriority;
  status: CaseStatus;
  ageLabel: string;
  assigned: string;
  healthScore: number;
  churnScore: number;
  context: string;
  recommendation: string;
  channel: string;
  channelIcon: string;
  draft: string;
  autoActioned?: string;
}

export interface ActivityEvent {
  campaign: string;
  customer: string;
  detail: string;
  timeLabel: string;
  dotColor: string;
}

export interface CampaignBar {
  name: string;
  type: CampaignType;
  matched: number;
  cases: number;
  convRate: number;
  trend: 'up' | 'flat' | 'down';
}

export const CASES: OutreachCase[] = [
  // ── Urgent (4) ──────────────────────────────────────────────────────────────
  {
    id: 'CS-4401', customer: 'Helen Garcia', initials: 'HG',
    policy: 'FA-2019-44210', product: 'Fixed Annuity 7-Yr',
    campaign: 'Surrender Charge Expiry', campaignType: 'retention',
    priority: 'urgent', status: 'new', ageLabel: '2h', assigned: 'Unassigned',
    healthScore: 22, churnScore: 78,
    context: "Helen's 7-year surrender charge period expires Feb 28. Churn score 78 — she has been browsing competitor annuity rates on the portal. Last contact was a neutral billing inquiry 45 days ago. No recent positive engagement.",
    recommendation: "Call within 24 hours. Present new 5-year guarantee rate (4.10%) and loyalty bonus (0.25% rate bump). Emphasize no-penalty renewal. If she's considering a 1035 exchange, offer partial transfer option to retain the relationship.",
    channel: 'Phone', channelIcon: '📞',
    draft: "Hi Helen, this is [Agent] from Bloom Insurance. I'm reaching out because your Fixed Annuity is approaching a milestone — your surrender charge period ends this month, which means you now have full flexibility with your funds. I wanted to personally share some competitive renewal options we've prepared for you, including a preferred rate that's only available to existing clients. Do you have a few minutes to discuss?",
  },
  {
    id: 'CS-4398', customer: 'Karen Williams', initials: 'KW',
    policy: 'WL-2016-78320', product: 'Whole Life',
    campaign: 'Lapse Prevention', campaignType: 'retention',
    priority: 'urgent', status: 'in-progress', ageLabel: '1d', assigned: 'Sarah M.',
    healthScore: 18, churnScore: 82,
    context: "Karen's Whole Life premium is 35 days past due. No auto-pay on file. Auto-SMS sent day 31 — no response. Grace period ends in 10 days. She also holds an IRA Annuity (IA-2020-71034). Total household premium at risk: $6,840/yr.",
    recommendation: "Immediate outbound call. Acknowledge the past-due notice. Offer to set up EFT on the call. If financial hardship, present premium reduction options (reduce face amount, switch to paid-up, or use dividends to cover premium). Emphasize cash value preservation.",
    channel: 'Phone', channelIcon: '📞',
    draft: "Hi Karen, this is [Agent] from Bloom Insurance. I'm calling about your Whole Life policy — I want to make sure we keep your coverage in force. I know life gets busy, and I can help get this resolved quickly right now. We have a few flexible options I'd love to walk through with you.",
    autoActioned: 'Auto-SMS sent day 31 — no response',
  },
  {
    id: 'CS-4395', customer: 'Thomas Reed', initials: 'TR',
    policy: 'TL-2015-91002', product: 'Term Life 20-Yr',
    campaign: 'Lapse Prevention', campaignType: 'retention',
    priority: 'urgent', status: 'new', ageLabel: '1d', assigned: 'Unassigned',
    healthScore: 15, churnScore: 91,
    context: "Thomas's Term Life is 40 days past due. No auto-pay. Two auto-SMS reminders sent — no response. Grace period ends in 5 days. No other policies on file. Single policy relationship at risk.",
    recommendation: "Urgent outbound call + voicemail. Follow immediately with email. If unreachable by EOD, send physical letter via priority mail. Consider verifying intent — policy may have been intentionally abandoned.",
    channel: 'Phone + Email', channelIcon: '📞',
    draft: "Thomas, this is [Agent] from Bloom Insurance calling about your Term Life coverage. Your policy is approaching the end of the grace period and I want to make sure your coverage stays protected. Please call us back at your earliest convenience — I have some quick options to get this resolved.",
    autoActioned: '2 auto-SMS reminders sent — no response',
  },
  {
    id: 'CS-4392', customer: 'Linda Pham', initials: 'LP',
    policy: 'IA-2018-63100', product: 'IRA Annuity',
    campaign: 'RMD Compliance', campaignType: 'compliance',
    priority: 'urgent', status: 'in-progress', ageLabel: '2d', assigned: 'Lisa T.',
    healthScore: 48, churnScore: 55,
    context: "Linda's IRA Annuity requires a Required Minimum Distribution by April 1. Auto-email sent 90 days ago — no systematic distribution established. Penalty risk: 25% IRS excise tax on missed RMD amount (~$14,200). Owner age 74.",
    recommendation: "Establish systematic distribution immediately. Present options: lump-sum withdrawal, quarterly distributions, or annual election. Confirm Linda understands the IRS penalty timeline. Send confirmation email post-call.",
    channel: 'Phone', channelIcon: '📞',
    draft: "Hi Linda, this is [Agent] from Bloom Insurance. I'm calling about your IRA Annuity — your Required Minimum Distribution for 2026 is due by April 1st, and I want to make sure we get this set up to avoid any IRS penalties. This will only take a few minutes to get started. Do you have a moment?",
  },
  // ── High (7) ─────────────────────────────────────────────────────────────────
  {
    id: 'CS-4390', customer: 'David Park', initials: 'DP',
    policy: 'TL-2016-55190', product: 'Term Life 20-Yr',
    campaign: 'Term Conversion', campaignType: 'retention',
    priority: 'high', status: 'new', ageLabel: '2d', assigned: 'Lisa T.',
    healthScore: 55, churnScore: 42,
    context: "David's 20-year Term Life has a conversion privilege expiring May 15, 2026. No conversion inquiry on file. Age 48 — converting now locks in current health class without medical exam. Face amount: $500K. Estimated WL premium: $680/mo.",
    recommendation: "Proactive outreach. Position as a time-sensitive opportunity — the conversion privilege is a guaranteed benefit that permanently expires. Present Whole Life and Universal Life options with no-exam guarantee. Offer to send comparison illustration.",
    channel: 'Phone + Email', channelIcon: '📞',
    draft: "Hi David, this is [Agent] from Bloom Insurance. I'm reaching out about a valuable benefit on your Term Life policy that I want to make sure you know about. You have the option to convert your $500K term coverage to permanent life insurance — with no medical exam required — but this window closes on May 15th. I'd love to walk you through what that would look like. Do you have about 10 minutes?",
  },
  {
    id: 'CS-4387', customer: 'James Nguyen', initials: 'JN',
    policy: 'IA-2020-33847', product: 'IRA Annuity',
    campaign: 'RMD Compliance', campaignType: 'compliance',
    priority: 'high', status: 'actioned', ageLabel: '3d', assigned: 'Andrea L.',
    healthScore: 62, churnScore: 38,
    context: "James's RMD auto-email was sent 14 days ago. He logged into the portal after receiving it and downloaded the distribution election form. Positive engagement signal — he is ready to act.",
    recommendation: "Follow-up call to confirm the election form was received and assist with completion. Offer to process the distribution directly on the call for faster resolution.",
    channel: 'Phone', channelIcon: '📞',
    draft: "Hi James, this is [Agent] from Bloom Insurance following up on the RMD information we sent last week. I see you downloaded the election form — great! I can actually help you complete this on the call today if that would be easier. It only takes a few minutes.",
    autoActioned: 'RMD email sent — portal login & form download detected',
  },
  {
    id: 'CS-4385', customer: 'Sandra Olsen', initials: 'SO',
    policy: 'FA-2020-88710', product: 'Fixed Annuity 5-Yr',
    campaign: 'Surrender Charge Expiry', campaignType: 'retention',
    priority: 'high', status: 'in-progress', ageLabel: '3d', assigned: 'James R.',
    healthScore: 45, churnScore: 65,
    context: "Sandra's surrender charge period ends March 5. Churn score 65. No portal activity in 30 days. Last contact 6 months ago for a billing question. Moderate retention risk with no clear engagement signal.",
    recommendation: "Outreach call to present renewal options and current guaranteed rates. Emphasize the rate advantage available to existing clients versus initiating a new contract elsewhere.",
    channel: 'Phone', channelIcon: '📞',
    draft: "Hi Sandra, this is [Agent] from Bloom Insurance. I'm reaching out because your Fixed Annuity contract is reaching a key milestone — your guarantee period is concluding — and I wanted to personally share some options we have available as a valued client.",
  },
  {
    id: 'CS-4382', customer: 'Cheryl Banks', initials: 'CB',
    policy: 'UL-2017-22980', product: 'Universal Life',
    campaign: 'Cash Value Milestone', campaignType: 'growth',
    priority: 'high', status: 'new', ageLabel: '4d', assigned: 'Unassigned',
    healthScore: 70, churnScore: 28,
    context: "Cheryl's Universal Life cash value crossed $100K for the first time. Age 53, no prior policy loans. High satisfaction score (NPS 82). Excellent candidate for a financial planning conversation — policy loan or paid-up additions.",
    recommendation: "Growth opportunity call. Present the cash value milestone as a positive achievement. Discuss policy loan options for financial goals (home renovation, education, retirement bridge). Offer a complimentary financial planning review.",
    channel: 'Phone + Email', channelIcon: '📞',
    draft: "Hi Cheryl, congratulations are in order! Your Universal Life policy just reached a significant milestone — your cash value has crossed $100,000. I'd love to share some exciting options this opens up for you, including flexible access to your funds if you ever need them. Do you have a few minutes to talk?",
  },
  {
    id: 'CS-4380', customer: 'Robert Chen', initials: 'RC',
    policy: '440387261UL', product: 'Universal Life',
    campaign: 'Cash Value Milestone', campaignType: 'growth',
    priority: 'high', status: 'actioned', ageLabel: '4d', assigned: 'Sarah M.',
    healthScore: 78, churnScore: 22,
    context: "Robert's cash value crossed $175K. Case actioned — active $75K policy loan in progress via Agent Desktop. Beneficiary change form (Emily R. Chen, minor) outstanding from Feb 3.",
    recommendation: "Coordinate with Agent Desktop workflow. Remind the agent to collect the outstanding beneficiary change form before closing the loan call. Case closes when loan is finalized.",
    channel: 'Phone (Active)', channelIcon: '📞',
    draft: "Robert's case is actively in progress via Agent Desktop. Loan finalization in progress — ensure bene change form is collected before closing.",
    autoActioned: 'Active $75K loan via Agent Desktop — bene form outstanding',
  },
  {
    id: 'CS-4377', customer: 'Maria Santos', initials: 'MS',
    policy: 'WL-2019-45600', product: 'Whole Life',
    campaign: 'Beneficiary Review', campaignType: 'compliance',
    priority: 'high', status: 'in-progress', ageLabel: '5d', assigned: 'Lisa T.',
    healthScore: 64, churnScore: 32,
    context: "Maria's last beneficiary update was in 2020. Name change detected on recent correspondence — possible marriage. Primary beneficiary (father) may be deceased per cross-reference signals. Invalid beneficiary designation creates settlement risk.",
    recommendation: "Outreach call to update beneficiary designation. This is a compliance priority — deceased or invalid primary beneficiary creates legal and settlement risk. Send prefilled beneficiary change form post-call.",
    channel: 'Phone + Email', channelIcon: '📞',
    draft: "Hi Maria, this is [Agent] from Bloom Insurance. I'm reaching out about an important update to your Whole Life policy — we want to make sure your beneficiary information is current and accurate to protect your family. This is a brief but important conversation. Do you have a few minutes?",
  },
  {
    id: 'CS-4375', customer: 'William Tate', initials: 'WT',
    policy: 'FA-2018-91240', product: 'Fixed Annuity 7-Yr',
    campaign: 'Annuity Maturity', campaignType: 'lifeevent',
    priority: 'high', status: 'new', ageLabel: '5d', assigned: 'Unassigned',
    healthScore: 58, churnScore: 45,
    context: "William's Fixed Annuity matures March 15. Auto-email sent 60 days out — no election received. Age 71. Options: renewal at current rate, annuitization (guaranteed income), or rollover to IRA. No existing IRA with Bloom — rollover opportunity.",
    recommendation: "Outreach call to present maturity options. Rollover to IRA Annuity deepens relationship and may provide tax advantages. Offer to send a comparison illustration for all three options.",
    channel: 'Phone', channelIcon: '📞',
    draft: "Hi William, this is [Agent] from Bloom Insurance. I'm calling about your Fixed Annuity contract maturing on March 15th. I want to walk you through the options available — including some that could provide guaranteed income for retirement. Do you have about 15 minutes for a conversation?",
    autoActioned: 'Maturity email sent 60 days out — no election received',
  },
  // ── Medium (8) ───────────────────────────────────────────────────────────────
  {
    id: 'CS-4372', customer: 'Patricia Nguyen', initials: 'PN',
    policy: '—', product: 'Term Life',
    campaign: 'Spousal Coverage Gap', campaignType: 'growth',
    priority: 'medium', status: 'converted', ageLabel: '7d', assigned: 'Andrea L.',
    healthScore: 82, churnScore: 15,
    context: "Patricia enrolled in a $250K Term Life policy as part of the Spousal Coverage Gap campaign. Cross-sell conversion complete. 90-day follow-up should be scheduled.",
    recommendation: "Close case. Schedule a 90-day follow-up to ensure the policy is in good standing and present additional coverage options (disability, umbrella).",
    channel: 'Email', channelIcon: '📧',
    draft: "Hi Patricia, congratulations on your new Term Life coverage! I'm following up to ensure everything is in order with your policy. Please don't hesitate to reach out if you have any questions — we're here to help.",
    autoActioned: 'Converted — $250K Term Life enrolled',
  },
  {
    id: 'CS-4370', customer: 'Frank Morrison', initials: 'FM',
    policy: 'TL-2014-38900', product: 'Term Life 15-Yr',
    campaign: 'Term Conversion', campaignType: 'retention',
    priority: 'medium', status: 'in-progress', ageLabel: '7d', assigned: 'James R.',
    healthScore: 50, churnScore: 48,
    context: "Frank's conversion window closes April 2. Initial call made — he's interested but wants to review illustrations first. Comparison sent via email 2 days ago. No response yet.",
    recommendation: "Follow-up call to review the illustration and answer questions. Focus on the premium comparison: term renewal vs. WL vs. no coverage after expiry. April 2nd is the hard deadline.",
    channel: 'Phone', channelIcon: '📞',
    draft: "Hi Frank, this is [Agent] from Bloom Insurance following up on the conversion illustration we sent earlier this week. I wanted to see if you had a chance to review it and if you have any questions. Your conversion window closes April 2nd — I want to make sure you have time to make the best decision.",
  },
  {
    id: 'CS-4368', customer: 'Nancy Liu', initials: 'NL',
    policy: 'UL-2020-56410', product: 'Universal Life',
    campaign: 'Beneficiary Review', campaignType: 'compliance',
    priority: 'medium', status: 'new', ageLabel: '8d', assigned: 'Unassigned',
    healthScore: 66, churnScore: 25,
    context: "Nancy's beneficiary designation hasn't been updated since policy issue in 2020. Marriage signal detected from name and address change. Spouse likely not designated as beneficiary.",
    recommendation: "Outreach to review and update beneficiary designation. Send prefilled form post-call as follow-up documentation.",
    channel: 'Email + Phone', channelIcon: '📧',
    draft: "Hi Nancy, this is [Agent] from Bloom Insurance. I'm reaching out because it's been a few years since your beneficiary information was last reviewed on your Universal Life policy, and we want to make sure your wishes are up to date. This is a quick conversation — do you have a few minutes?",
  },
  {
    id: 'CS-4365', customer: 'George Kimura', initials: 'GK',
    policy: 'IA-2019-71200', product: 'IRA Annuity',
    campaign: 'RMD Compliance', campaignType: 'compliance',
    priority: 'medium', status: 'actioned', ageLabel: '9d', assigned: 'Lisa T.',
    healthScore: 72, churnScore: 20,
    context: "George's systematic RMD distribution was established on the call. Annual distribution of $18,400 set up starting March 1. Case can be reviewed for closure.",
    recommendation: "Close case after confirming first distribution processes correctly on March 1. Send written confirmation letter.",
    channel: 'Complete', channelIcon: '✓',
    draft: "Hi George, just following up to confirm your annual RMD distribution of $18,400 has been set up successfully. Your first distribution will process on March 1st. Please let us know if you have any questions!",
    autoActioned: 'Systematic RMD established — $18,400 annually from Mar 1',
  },
  {
    id: 'CS-4362', customer: 'Angela Cruz', initials: 'AC',
    policy: 'WL-2021-34560', product: 'Whole Life',
    campaign: 'Cash Value Milestone', campaignType: 'growth',
    priority: 'medium', status: 'new', ageLabel: '10d', assigned: 'Unassigned',
    healthScore: 74, churnScore: 18,
    context: "Angela's Whole Life cash value crossed $50K. Young policyholder (age 38). High growth potential over 20+ year horizon. No prior financial planning conversations on record.",
    recommendation: "Growth opportunity call. Introduce the paid-up additions rider if not already in place. Discuss cash value accumulation trajectory and long-term financial planning benefits.",
    channel: 'Email + Phone', channelIcon: '📧',
    draft: "Hi Angela, great news — your Whole Life policy has reached a significant milestone! Your cash value has crossed $50,000, and I'd love to share some options this opens up for your financial planning. Could we schedule a quick 15-minute call?",
  },
  {
    id: 'CS-4360', customer: 'Michael Dunn', initials: 'MD',
    policy: 'FA-2021-82310', product: 'Fixed Annuity 5-Yr',
    campaign: 'Annuity Maturity', campaignType: 'lifeevent',
    priority: 'medium', status: 'in-progress', ageLabel: '10d', assigned: 'Sarah M.',
    healthScore: 60, churnScore: 35,
    context: "Michael's 5-year Fixed Annuity matures April 1. Initial outreach made — he expressed interest in renewal but wants to compare external rates. Competitive rate comparison sent via email.",
    recommendation: "Follow-up call to present our guaranteed renewal rate (4.05% for 5-yr) vs. the competitor quotes. Emphasize the surrender-free transfer risk and rate lock advantages of staying with Bloom.",
    channel: 'Phone', channelIcon: '📞',
    draft: "Hi Michael, this is [Agent] from Bloom Insurance following up on your annuity maturity options. I wanted to make sure you have our renewal rate details and I'm happy to address any questions before your contract matures on April 1st.",
  },
  {
    id: 'CS-4358', customer: 'Rachel Stone', initials: 'RS',
    policy: 'TL-2018-90120', product: 'Term Life 20-Yr',
    campaign: 'Lapse Prevention', campaignType: 'retention',
    priority: 'medium', status: 'actioned', ageLabel: '11d', assigned: 'James R.',
    healthScore: 52, churnScore: 44,
    context: "Rachel's premium was 32 days past due. Auto-SMS sent — she called in and set up EFT on the call. First EFT payment processes Feb 25. Case can be closed after confirmation.",
    recommendation: "Close case after EFT confirmation on Feb 25. Flag for 30-day follow-up to ensure EFT is running smoothly.",
    channel: 'Complete', channelIcon: '✓',
    draft: "Hi Rachel, just confirming your automatic payment setup is in place. Your first EFT payment will process on Feb 25th. Thank you for taking care of this — your coverage is protected!",
    autoActioned: 'EFT established — premium lapse resolved',
  },
  {
    id: 'CS-4355', customer: 'Steven Cho', initials: 'SC',
    policy: 'UL-2019-42800', product: 'Universal Life',
    campaign: 'Beneficiary Review', campaignType: 'compliance',
    priority: 'medium', status: 'new', ageLabel: '12d', assigned: 'Unassigned',
    healthScore: 68, churnScore: 22,
    context: "Steven's beneficiary designation hasn't been updated in 4+ years. New dependent signal detected (address change + school district patterns suggest children in household). Primary bene is still listed as his parents.",
    recommendation: "Outreach to review beneficiary designation. High likelihood he will want to update to spouse and/or children. Send prefilled form as follow-up.",
    channel: 'Email + Phone', channelIcon: '📧',
    draft: "Hi Steven, this is [Agent] from Bloom Insurance. I'm reaching out because it's been a few years since your beneficiary information was last reviewed. Many of our clients find a quick review gives them peace of mind that their loved ones are protected. Could we take a few minutes to go through this together?",
  },
  // ── Low (4) ──────────────────────────────────────────────────────────────────
  {
    id: 'CS-4350', customer: 'Betty Owens', initials: 'BO',
    policy: '—', product: 'No coverage',
    campaign: 'Spousal Coverage Gap', campaignType: 'growth',
    priority: 'low', status: 'new', ageLabel: '14d', assigned: 'Unassigned',
    healthScore: 80, churnScore: 12,
    context: "Betty is the spouse of Carl Owens (WL policyholder). No coverage on file. Household income indicates coverage capacity. Low urgency — no time-sensitive trigger.",
    recommendation: "Email-first outreach with a term life quote. Offer household discount (8% multi-policy). Low pressure — informational approach with no deadline pressure.",
    channel: 'Email', channelIcon: '📧',
    draft: "Hi Betty, as a valued member of the Bloom Insurance family, we wanted to reach out with a complimentary coverage review. As Carl's existing policyholder, you may qualify for a household discount on a new policy. Could we share some information?",
  },
  {
    id: 'CS-4347', customer: 'Harold Jensen', initials: 'HJ',
    policy: 'TL-2017-62340', product: 'Term Life 20-Yr',
    campaign: 'Term Conversion', campaignType: 'retention',
    priority: 'low', status: 'in-progress', ageLabel: '15d', assigned: 'Andrea L.',
    healthScore: 58, churnScore: 30,
    context: "Harold's conversion window closes June 10 — still 4 months away. Low urgency for now. Initial information email sent, no response yet.",
    recommendation: "Low urgency. No immediate action needed. Schedule follow-up for April 10 (60 days before window closes).",
    channel: 'Email', channelIcon: '📧',
    draft: "Hi Harold, I wanted to follow up on the conversion options we sent regarding your Term Life policy. Your conversion window is open until June 10th — no rush, but we're here to answer any questions whenever you're ready.",
  },
  {
    id: 'CS-4344', customer: 'Diane Foster', initials: 'DF',
    policy: 'FA-2020-55890', product: 'Fixed Annuity 5-Yr',
    campaign: 'Annuity Maturity', campaignType: 'lifeevent',
    priority: 'low', status: 'actioned', ageLabel: '18d', assigned: 'Sarah M.',
    healthScore: 76, churnScore: 18,
    context: "Diane elected a 5-year renewal at the guaranteed renewal rate. Case resolved. Awaiting signed election form return. No further outreach needed.",
    recommendation: "Close case when signed form is received. All action complete.",
    channel: 'Complete', channelIcon: '✓',
    draft: "Hi Diane, thank you for electing to renew your Fixed Annuity! Your new 5-year term begins March 20, 2026 at 4.05%. Please return the signed election form at your earliest convenience to complete the process.",
    autoActioned: 'Renewal elected — 5-yr @ 4.05%',
  },
  {
    id: 'CS-4340', customer: 'Carl Weber', initials: 'CW',
    policy: 'IA-2021-81050', product: 'IRA Annuity',
    campaign: 'RMD Compliance', campaignType: 'compliance',
    priority: 'low', status: 'actioned', ageLabel: '20d', assigned: 'Lisa T.',
    healthScore: 80, churnScore: 15,
    context: "Carl's RMD was processed successfully. Annual distribution of $12,800 completed for 2026. No further action needed this year.",
    recommendation: "Close case. Set reminder for Q4 2026 for next year's RMD notification.",
    channel: 'Complete', channelIcon: '✓',
    draft: "Hi Carl, your Required Minimum Distribution of $12,800 has been processed successfully. Please review your account statement for confirmation. We'll be in touch next year about your 2027 RMD requirements.",
    autoActioned: 'RMD processed — $12,800',
  },
];

export const ACTIVITY_FEED: ActivityEvent[] = [
  { campaign: 'Lapse Prevention',      customer: 'Karen Williams', detail: 'Auto-SMS sent — grace period day 32',              timeLabel: '12 min', dotColor: '#ef4444' },
  { campaign: 'Cash Value Milestone',  customer: 'Robert Chen',    detail: 'Case updated — $75K loan in progress',             timeLabel: '28 min', dotColor: '#37A526' },
  { campaign: 'RMD Compliance',        customer: 'James Nguyen',   detail: 'Auto-email sent — portal login detected',          timeLabel: '1 hr',   dotColor: '#1B75BB' },
  { campaign: 'Term Conversion',       customer: 'David Park',     detail: 'Case assigned to Lisa Tran for outreach',          timeLabel: '2 hr',   dotColor: '#946b0e' },
  { campaign: 'Annuity Maturity',      customer: 'Margaret Torres',detail: 'Case closed — 5-yr renewal elected',               timeLabel: '3 hr',   dotColor: '#37A526' },
  { campaign: 'Spousal Coverage Gap',  customer: 'Patricia Nguyen',detail: 'Converted — $250K Term Life enrolled',             timeLabel: '5 hr',   dotColor: '#37A526' },
  { campaign: 'Surrender Charge Expiry',customer:'Helen Garcia',   detail: 'Urgent case created — churn score 78',             timeLabel: '6 hr',   dotColor: '#ef4444' },
];

export const CAMPAIGN_BARS: CampaignBar[] = [
  { name: 'Lapse Prevention',     type: 'retention',  matched: 412,   cases: 38, convRate: 37, trend: 'up'   },
  { name: 'RMD Compliance',       type: 'compliance', matched: 1840,  cases: 29, convRate: 92, trend: 'up'   },
  { name: 'Term Conversion',      type: 'retention',  matched: 680,   cases: 24, convRate: 33, trend: 'flat' },
  { name: 'Bene Review',          type: 'compliance', matched: 3210,  cases: 18, convRate: 78, trend: 'up'   },
  { name: 'Annuity Maturity',     type: 'lifeevent',  matched: 290,   cases: 14, convRate: 70, trend: 'up'   },
  { name: 'Cash Value Milestone', type: 'growth',     matched: 520,   cases: 17, convRate: 33, trend: 'down' },
  { name: 'Surrender Expiry',     type: 'retention',  matched: 185,   cases: 14, convRate: 37, trend: 'up'   },
  { name: 'Spousal Coverage',     type: 'growth',     matched: 1420,  cases: 9,  convRate: 33, trend: 'flat' },
];
