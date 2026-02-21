export type Persona = 'phone' | 'chat';

export interface BriefItem {
  text: string;
  color: string;
}
export interface BriefData {
  why: string;
  body: string;
  items: BriefItem[];
}
export const briefData: Record<Persona, BriefData> = {
  phone: {
    why: 'Policy loan finalization. Robert is ready to execute.',
    body: 'Robert navigated IVR selecting <strong>Existing Policy → Policy Loans → Speak to Agent</strong>. He has been active across 3 channels in the last 30 minutes (Portal → Chatbot → Agent Chat) researching a <strong>$75K policy loan</strong> against his Universal Life. Chat agent already reviewed fixed vs variable rates and death benefit impact. Robert requested phone to finalize. <strong>No information needs to be re-collected.</strong>',
    items: [
      { text: '<strong>Open item:</strong> Beneficiary change form (Emily R. Chen, minor — UTMA custodian needed) sent Feb 3, not yet returned.', color: '#F6921E' },
      { text: '<strong>Recent pattern:</strong> 4 contacts today across 4 channels. Sentiment: Positive. No friction detected.', color: '#37A526' },
      { text: '<strong>Customer profile:</strong> Digital-first, well-researched. Prefers phone for final transactions.', color: '#1B75BB' },
    ],
  },
  chat: {
    why: 'Policy loan inquiry — escalated from chatbot. Robert needs rate details and wants to proceed.',
    body: 'Robert asked the chatbot about borrowing against his Universal Life. Bot provided cash value (<strong>$187,420</strong>) and max loanable amount (<strong>$168,678</strong>). Robert asked about death benefit impact — chatbot escalated to live agent. <strong>Robert already knows his cash value and max loan amount. He needs: rate options, death benefit impact, and likely wants to proceed.</strong>',
    items: [
      { text: '<strong>Pre-chat activity:</strong> Portal session 5 min ago — downloaded loan request form PDF.', color: '#1B75BB' },
      { text: '<strong>Open item:</strong> Beneficiary change form (Emily R. Chen, minor) sent Feb 3, not yet returned.', color: '#F6921E' },
      { text: '<strong>Customer profile:</strong> Digital-first, well-researched. Positive sentiment history (82%).', color: '#37A526' },
    ],
  },
};

export interface NBAItem {
  title: string;
  reason: string;
  btn: string;
}
export const nbaData: Record<Persona, NBAItem[]> = {
  phone: [
    { title: 'Confirm $75K loan at 5.25% fixed', reason: 'Customer already reviewed terms across 3 channels. Ready to execute — avoid re-explaining.', btn: 'Process Loan' },
    { title: 'Collect beneficiary change form', reason: 'Form sent Feb 3 — not returned. Emily R. Chen (minor) needs UTMA custodian. Customer is on the line.', btn: 'Send Reminder' },
    { title: 'Mention free withdrawal option', reason: '10% annual free withdrawal ($18,742) available without loan interest. Could reduce loan amount needed.', btn: 'View Illustration' },
    { title: 'Schedule annual policy review', reason: 'Loan changes death benefit and cash value projections. Good trigger for a comprehensive review.', btn: 'Schedule' },
  ],
  chat: [
    { title: 'Walk through fixed vs variable rate', reason: 'Chatbot escalated on rate question. Customer needs this answered before proceeding.', btn: 'Send Comparison' },
    { title: 'Show death benefit impact', reason: 'Customer specifically asked. Provide $75K loan scenario: $500K → $425K net.', btn: 'Send Illustration' },
    { title: 'Offer to finalize on phone', reason: 'Loan execution may require voice verification. If ready, offer warm transfer.', btn: 'Transfer' },
    { title: 'Remind: bene change form outstanding', reason: 'Form sent Feb 3, not returned. Can attach to chat for convenience.', btn: 'Attach Form' },
  ],
};

export type HistoryChannel = 'phone' | 'chat' | 'chatbot' | 'portal' | 'email' | 'mobile';
export type SentimentTag = 'pos' | 'neu' | 'neg';

export interface HistoryItem {
  id: string;
  channel: HistoryChannel;
  title: string;
  time: string;
  date: string;
  desc: string;
  sentiment: SentimentTag;
  detail: {
    duration?: string;
    agent: string;
    resolution: string;
    resolutionColor: string;
    transcript?: { speaker: 'agent' | 'customer' | 'bot'; text: string }[];
    note?: string;
  };
}

export const historyItems: HistoryItem[] = [
  {
    id: 'd0', channel: 'phone', title: 'Inbound Call — Policy Loan Finalize', time: '10:31 AM',
    date: 'Today — Feb 12, 2026', desc: 'Finalizing $75K policy loan at 5.25% fixed. EFT disbursement. Death benefit impact confirmed.',
    sentiment: 'pos',
    detail: {
      duration: '12:04', agent: 'Sarah Mitchell (CSR II)', resolution: 'Resolved — FCR', resolutionColor: '#37A526',
      transcript: [
        { speaker: 'agent', text: "Hi Robert, I have all the context from your chat session. You'd like to proceed with a $75K policy loan at the 5.25% fixed rate?" },
        { speaker: 'customer', text: 'Yes, that\'s right. And I want to make sure my net death benefit stays above $400K.' },
        { speaker: 'agent', text: 'Absolutely. With a $75K loan, your net death benefit would be $425K. The loan accrues interest annually and you can repay anytime without penalty.' },
        { speaker: 'customer', text: "Perfect. Let's do EFT to my checking account on file." },
      ],
      note: 'Client very pleasant and well-informed. Seamless escalation from chat — no info repeated. — SM',
    },
  },
  {
    id: 'd1', channel: 'chat', title: 'Agent Chat — Loan Options', time: '10:24 AM',
    date: 'Today — Feb 12, 2026', desc: 'Guided through max loanable amount, fixed vs variable rate, death benefit reduction.',
    sentiment: 'pos',
    detail: {
      duration: '8:21', agent: 'Sarah Mitchell (CSR II)', resolution: 'Escalated to Phone (customer request)', resolutionColor: '#1B75BB',
      transcript: [
        { speaker: 'agent', text: "Hi Robert — I have the details from the chatbot. Your max loanable amount is $168,678 at 90% of cash value." },
        { speaker: 'customer', text: "What's the interest rate?" },
        { speaker: 'agent', text: '5.25% fixed or 4.75% variable (resets annually).' },
        { speaker: 'customer', text: 'And what happens to my death benefit?' },
        { speaker: 'agent', text: 'A $75K loan would reduce your net death benefit from $500K to $425K.' },
      ],
      note: 'Customer well-prepared from portal + chatbot. Smooth handoff to phone. — SM',
    },
  },
  {
    id: 'd2', channel: 'chatbot', title: 'Chatbot — Loan Inquiry', time: '10:19 AM',
    date: 'Today — Feb 12, 2026', desc: 'Provided cash value and max loanable. Escalated on interest rate question.',
    sentiment: 'neu',
    detail: {
      duration: '3:12', agent: 'AI Chatbot', resolution: 'Escalated to Agent Chat', resolutionColor: '#1B75BB',
      transcript: [
        { speaker: 'bot', text: "Hi Robert! I see you're viewing your policy loan forms. How can I help?" },
        { speaker: 'customer', text: "I need a policy loan against my UL. What's the max I can borrow?" },
        { speaker: 'bot', text: 'Your current cash value is $187,420. Max loanable: $168,678 (90%).' },
        { speaker: 'customer', text: 'What about the impact on my death benefit?' },
        { speaker: 'bot', text: 'Great question. Let me connect you with an agent.' },
      ],
    },
  },
  {
    id: 'd3', channel: 'phone', title: 'Inbound Call — Bene Change Inquiry', time: '2:15 PM',
    date: 'Feb 3, 2026', desc: 'Add daughter Emily (minor) as contingent bene. UTMA custodian form sent.',
    sentiment: 'pos',
    detail: {
      duration: '6:42', agent: 'Lisa Tran (Senior CSR)', resolution: 'Form Needed', resolutionColor: '#F6921E',
      transcript: [
        { speaker: 'customer', text: "I'd like to add my daughter as a contingent beneficiary." },
        { speaker: 'agent', text: "Since Emily is currently 17, she's a minor. We'll need a UTMA custodian designated." },
        { speaker: 'customer', text: 'Yes, Lisa would serve as custodian. Can you send me the form?' },
      ],
      note: 'Form sent. Follow-up set for Feb 10 — form not yet returned. — LT',
    },
  },
  {
    id: 'd4', channel: 'phone', title: 'Inbound Call — Billing Mode Change', time: '11:30 AM',
    date: 'Dec 12, 2025', desc: 'Changed billing from quarterly ($1,237.50) to monthly ($412.50). EFT updated.',
    sentiment: 'pos',
    detail: {
      duration: '4:55', agent: 'Lisa Tran (Senior CSR)', resolution: 'Resolved — FCR', resolutionColor: '#37A526',
      note: 'Simple billing change. Client prefers monthly for cash flow. — LT',
    },
  },
  {
    id: 'd5', channel: 'phone', title: 'Inbound Call — Address Change', time: '3:10 PM',
    date: 'Nov 20, 2025', desc: 'Updated address to 1842 Pacific Ave, San Francisco, CA 94115.',
    sentiment: 'pos',
    detail: {
      duration: '3:28', agent: 'James Rivera (CSR II)', resolution: 'Resolved — FCR', resolutionColor: '#37A526',
      note: 'Client relocated within San Francisco. Applied across all policies. — JR',
    },
  },
];

export const chatMessages = [
  { from: 'bot' as const, init: 'AI', text: 'Hi Robert! Your current cash value is $187,420. Max loanable: $168,678 (90%). Let me connect you with an agent for details on rates and death benefit impact.' },
  { from: 'agent' as const, init: 'SM', text: 'Hi Robert — I have the details from the chatbot. Your max loanable amount is $168,678. Would you like to discuss fixed vs variable rates?' },
  { from: 'customer' as const, init: 'RC', text: 'Yes, what are the rate options?' },
  { from: 'agent' as const, init: 'SM', text: '5.25% fixed or 4.75% variable (resets annually). Most clients prefer fixed for predictability.' },
  { from: 'customer' as const, init: 'RC', text: 'And what happens to my death benefit if I take $75K?' },
  { from: 'agent' as const, init: 'SM', text: 'Your net death benefit would reduce from $500K to $425K. The loan balance is deducted at claim time unless repaid.' },
  { from: 'customer' as const, init: 'RC', text: 'That works. How do I proceed?' },
];
