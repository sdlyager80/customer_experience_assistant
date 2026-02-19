import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Chip, LinearProgress } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { BLOOM } from '../theme';
import type { ScenarioId } from '../data/scenarios';

// ─── Shared micro-components ───────────────────────────────────────────────

function SectionLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: color || 'text.secondary', mb: 0.875 }}>
      {children}
    </Typography>
  );
}

function Card({ children, sx = {} }: { children: React.ReactNode; sx?: object }) {
  return (
    <Paper sx={{ p: 2, mb: 1, ...sx }}>
      {children}
    </Paper>
  );
}

function AlertCard({ variant, title, children }: { variant: 'red' | 'yellow' | 'blue' | 'amber'; title: string; children: React.ReactNode }) {
  const styles = {
    red:    { bg: '#fef2f2', border: BLOOM.redBorder,    titleColor: BLOOM.red },
    yellow: { bg: '#fefce8', border: BLOOM.yellowBorder, titleColor: BLOOM.amber },
    blue:   { bg: '#eff6ff', border: '#93bbfd',          titleColor: BLOOM.blue },
    amber:  { bg: '#fef7e6', border: BLOOM.orangeBorder, titleColor: BLOOM.review },
  };
  const s = styles[variant];
  return (
    <Paper sx={{ p: 2, mb: 1, background: `linear-gradient(135deg, ${s.bg}, #fff)`, border: `1px solid ${s.border}` }}>
      <SectionLabel color={s.titleColor}>{title}</SectionLabel>
      <Typography sx={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>{children}</Typography>
    </Paper>
  );
}

function StatGrid({ stats, cols = 3 }: { stats: { value: React.ReactNode; label: string; valueColor?: string }[]; cols?: number }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 0.75, mb: 1 }}>
      {stats.map((s, i) => (
        <Box key={i} sx={{ p: 1, textAlign: 'center', bgcolor: BLOOM.canvas, borderRadius: '6px' }}>
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.2, color: s.valueColor || 'text.primary' }}>{s.value}</Typography>
          <Typography sx={{ fontSize: '0.5625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'text.secondary', mt: 0.375 }}>{s.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function SentimentBar({ label, pct, color, value }: { label: string; pct: number; color: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
      <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, minWidth: 68, color: 'text.secondary' }}>{label}</Typography>
      <Box sx={{ flex: 1, height: 6, bgcolor: BLOOM.canvas, borderRadius: 10, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: color, borderRadius: 10 }} />
      </Box>
      <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, minWidth: 52, color }}>{value}</Typography>
    </Box>
  );
}

function ScoreBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
      <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, minWidth: 80, color: 'text.secondary' }}>{label}</Typography>
      <Box sx={{ flex: 1, height: 6, bgcolor: BLOOM.canvas, borderRadius: 10, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: color, borderRadius: 10 }} />
      </Box>
      <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, minWidth: 34, textAlign: 'right', color }}>{pct}%</Typography>
    </Box>
  );
}

function TimelineItem({ icon, iconBg, iconColor, title, detail, time, chip, chipColor }: {
  icon: string; iconBg: string; iconColor: string; title: string; detail: string; time?: string;
  chip?: string; chipColor?: string;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, py: 1.25, position: 'relative',
      '&:not(:last-child)::after': { content: '""', position: 'absolute', left: 13, top: 38, bottom: -4, width: 2, bgcolor: BLOOM.border }
    }}>
      <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, zIndex: 1, border: `2px solid ${BLOOM.white}` }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{title}</Typography>
          {chip && <Chip label={chip} size="small" sx={{ height: 18, fontSize: '0.625rem', bgcolor: chipColor, color: '#fff' }} />}
        </Box>
        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25, lineHeight: 1.5 }}>{detail}</Typography>
        {time && <Typography sx={{ fontSize: '0.625rem', color: BLOOM.textTertiary, mt: 0.25 }}>{time}</Typography>}
      </Box>
    </Box>
  );
}

function RecommendationCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Paper sx={{ p: 2, mb: 1, background: 'linear-gradient(135deg, #fefce8, #fefdf5)', border: `1px solid ${BLOOM.yellowBorder}` }}>
      <SectionLabel color={BLOOM.amber}>{title}</SectionLabel>
      {items.map((item, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.75, fontSize: '0.8125rem', lineHeight: 1.5 }}>
          <Typography sx={{ color: BLOOM.orange, fontSize: '0.875rem', lineHeight: 1.2, flexShrink: 0 }}>▶</Typography>
          <Typography sx={{ fontSize: '0.8125rem', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: item }} />
        </Box>
      ))}
    </Paper>
  );
}

// ─── Scenario panels ─────────────────────────────────────────────────────────

function FrictionDetection() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: `2px solid ${BLOOM.border}`, px: 3, flexShrink: 0 }}>
        <Tab label="🔥 Detection" />
        <Tab label="📊 360°" />
      </Tabs>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.75, pb: 2.5 }}>
        {tab === 0 && (
          <>
            <AlertCard variant="red" title="Friction Alert — High Priority">
              <strong>Margaret Torres</strong> has called <strong>3 times in 5 days</strong> about claim #CLM-2026-4491. Sentiment declined Neutral → Negative. Handle time increasing (6:20 → 11:45 → 18:02). Escalation language: <em>"no one is helping me," "this is unacceptable."</em>
            </AlertCard>
            <Card>
              <SectionLabel>Sentiment Trajectory</SectionLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ height: 8, bgcolor: BLOOM.canvas, borderRadius: 10, overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', width: '22%', background: 'linear-gradient(90deg, #ef4444, #fca5a5)', borderRadius: 10 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    {['Negative', 'Neutral', 'Positive'].map(l => (
                      <Typography key={l} sx={{ fontSize: '0.625rem', color: BLOOM.textTertiary }}>{l}</Typography>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'center', minWidth: 56 }}>
                  <Typography sx={{ fontSize: 22, lineHeight: 1 }}>😤</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: BLOOM.red, mt: 0.25 }}>Frustrated</Typography>
                </Box>
              </Box>
              <SentimentBar label="Call 1 (Feb 5)" pct={50} color={BLOOM.orange} value="Neutral" />
              <SentimentBar label="Call 2 (Feb 8)" pct={32} color="#f97316" value="Declining" />
              <SentimentBar label="Call 3 (Today)" pct={22} color="#ef4444" value="Negative" />
            </Card>
            <StatGrid cols={4} stats={[
              { value: '3', label: 'Calls/5d', valueColor: BLOOM.red },
              { value: '↓38%', label: 'Sent Drop', valueColor: BLOOM.red },
              { value: '18:02', label: 'Handle' },
              { value: '1', label: 'Open Case', valueColor: BLOOM.red },
            ]} />
            <Paper sx={{ p: 2.5, mb: 1.5, background: `linear-gradient(135deg, #fef2f2, #fff5f5)`, border: `1px solid ${BLOOM.redBorder}` }}>
              <SectionLabel>Correlated Unresolved Case</SectionLabel>
              <Box sx={{ p: 1.25, bgcolor: BLOOM.redPale, borderRadius: '6px', borderLeft: `3px solid #ef4444`, fontSize: '0.8125rem', lineHeight: 1.6 }}>
                <Typography sx={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                  <strong>Claim #CLM-2026-4491</strong> — Water damage, filed 01/29. Status: Under Review (14 days). Adjuster assigned, no inspection scheduled. Docs submitted 02/02 — no ack sent.{' '}
                  <Chip label="Overdue SLA" size="small" sx={{ bgcolor: BLOOM.redPale, color: BLOOM.red, border: `1px solid ${BLOOM.redBorder}`, height: 20, ml: 0.5 }} />
                </Typography>
              </Box>
            </Paper>
            <RecommendationCard title="Recommended Actions" items={[
              '<strong>Escalate immediately</strong> — senior adjuster, inspection within 48h.',
              'Send <strong>proactive status update</strong> acknowledging docs received.',
              '<strong>Supervisor follow-up</strong> within 24h to prevent churn.',
            ]} />
          </>
        )}
        {tab === 1 && (
          <>
            <Card>
              <SectionLabel>Caller Profile</SectionLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: BLOOM.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>MT</Box>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }}>Margaret Torres</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Owner · HO-2024-88312 · Homeowners · Since 2022</Typography>
                </Box>
              </Box>
              <Box sx={{ p: 1.25, bgcolor: BLOOM.canvas, borderRadius: '6px', borderLeft: `3px solid #ef4444` }}>
                <Typography sx={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                  <strong>Risk:</strong> High-friction. 3 contacts/5 days, increasing handle time. Unresolved claim 14 days, SLA breached. <strong>Churn probability: 72%.</strong>
                </Typography>
              </Box>
            </Card>
            <StatGrid stats={[
              { value: '5', label: 'Contacts/30d' },
              { value: '12:42', label: 'Avg Handle' },
              { value: '28%', label: 'Pos Sent', valueColor: BLOOM.red },
            ]} />
            <Card>
              <SectionLabel>Escalation Language</SectionLabel>
              {[
                { date: 'Feb 12', quote: '"No one is helping me"', bg: BLOOM.redPale },
                { date: 'Feb 8', quote: '"I already sent the documents"', bg: BLOOM.yellowPale },
                { date: 'Feb 5', quote: '"Just checking on status" (neutral)', bg: BLOOM.canvas },
              ].map((item, i) => (
                <Box key={i} sx={{ p: 0.875, bgcolor: item.bg, borderRadius: '6px', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.6 }}>
                    <strong>{item.date}:</strong> <em>{item.quote}</em>
                  </Typography>
                </Box>
              ))}
            </Card>
          </>
        )}
      </Box>
    </>
  );
}

function AdaptiveEngagement() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: `2px solid ${BLOOM.border}`, px: 3, flexShrink: 0 }}>
        <Tab label="🎯 Routing" />
        <Tab label="💡 Script" />
      </Tabs>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.75, pb: 2.5 }}>
        {tab === 0 && (
          <>
            <AlertCard variant="yellow" title="Adaptive Routing Activated">
              <strong>David Park</strong> — repeat caller (2nd today). IVR bypassed, voice slowed, routed to senior agent. Callback offered during 3:20 hold.
            </AlertCard>
            <Card>
              <SectionLabel>Routing Timeline</SectionLabel>
              <TimelineItem icon="📞" iconBg={BLOOM.yellowPale} iconColor={BLOOM.amber} title="Repeat Call Detected" detail="2nd today, 4th this week. Claim #CLM-2026-5102." time="2:14 PM" />
              <TimelineItem icon="🤖" iconBg={BLOOM.reviewPale} iconColor={BLOOM.review} title="IVR Adapted" detail="Menu skipped. Voice −15%." time="Automatic" />
              <TimelineItem icon="⏱" iconBg={BLOOM.bluePale} iconColor={BLOOM.blue} title="Callback Offered & Accepted" detail="Hold est: 3:20." time="2:15 PM" />
              <TimelineItem icon="👤" iconBg={BLOOM.greenPale} iconColor={BLOOM.green} title="Agent Connected" detail="Lisa Tran (Senior)." time="2:22 PM" chip="Active" chipColor={BLOOM.green} />
            </Card>
            <StatGrid cols={4} stats={[
              { value: '4', label: 'Calls/Wk' },
              { value: '✓', label: 'Callback', valueColor: BLOOM.green },
              { value: '0:00', label: 'Hold' },
              { value: '↑', label: 'Sentiment', valueColor: BLOOM.green },
            ]} />
          </>
        )}
        {tab === 1 && (
          <>
            <Card>
              <SectionLabel>Personalized Script</SectionLabel>
              <Box sx={{ p: 1.5, bgcolor: BLOOM.canvas, borderRadius: '6px', borderLeft: `3px solid ${BLOOM.blue}`, fontSize: '0.8125rem', lineHeight: 1.6 }}>
                <Typography sx={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                  <Box component="span" sx={{ bgcolor: BLOOM.bluePale, px: 0.5, borderRadius: '3px', fontWeight: 600 }}>Opening:</Box>{' '}
                  "Hi David, I see you called about your auto claim twice this week. Let me get this resolved today."
                  <br /><br />
                  <Box component="span" sx={{ bgcolor: BLOOM.bluePale, px: 0.5, borderRadius: '3px', fontWeight: 600 }}>Context:</Box>{' '}
                  "I have your full history — the estimate was submitted Feb 8 and reviewed."
                  <br /><br />
                  <Box component="span" sx={{ bgcolor: BLOOM.bluePale, px: 0.5, borderRadius: '3px', fontWeight: 600 }}>Close:</Box>{' '}
                  "I will follow up by Friday. You will get a text confirmation."
                </Typography>
              </Box>
            </Card>
            <RecommendationCard title="Adaptations Applied" items={[
              '<strong>IVR bypass</strong> — skipped 4-step menu.',
              '<strong>Voice rate −15%</strong> — reduces frustration.',
              '<strong>Callback</strong> — eliminated 3:20 hold.',
              '<strong>Senior agent</strong> — skill-matched for escalation.',
            ]} />
          </>
        )}
      </Box>
    </>
  );
}

function OmnichannelContinuity() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: `2px solid ${BLOOM.border}`, px: 3, flexShrink: 0 }}>
        <Tab label="🔗 Journey" />
        <Tab label="💬 Chat" />
      </Tabs>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.75, pb: 2.5 }}>
        {tab === 0 && (
          <>
            <AlertCard variant="blue" title="Omnichannel — Unified Memory">
              <strong>Robert Chen</strong> — portal → chatbot → agent chat → phone. <strong>Zero info repeated.</strong>
            </AlertCard>
            <Card>
              <SectionLabel>Cross-Channel Timeline</SectionLabel>
              <TimelineItem icon="🌐" iconBg={BLOOM.bluePale} iconColor={BLOOM.blue} title="Self-Service Portal" detail="Browsed beneficiaries, downloaded change form." time="10:14 AM" />
              <TimelineItem icon="🤖" iconBg={BLOOM.reviewPale} iconColor={BLOOM.review} title="Chatbot" detail="Intent: BeneficiaryChange (88%). Escalated on minor question." time="10:19 AM" />
              <TimelineItem icon="👤" iconBg={BLOOM.greenPale} iconColor={BLOOM.green} title="Agent Chat" detail="Guided UTMA custodian requirements." time="10:24 AM" />
              <TimelineItem icon="📞" iconBg={BLOOM.yellowPale} iconColor={BLOOM.amber} title="Phone" detail="All context carried. No repeat info needed." time="10:31 AM" chip="Active" chipColor={BLOOM.blue} />
            </Card>
            <Card>
              <SectionLabel>Cross-Channel Sentiment</SectionLabel>
              <SentimentBar label="Portal" pct={50} color={BLOOM.orange} value="Neutral" />
              <SentimentBar label="Chatbot" pct={58} color="#f59e0b" value="Neutral+" />
              <SentimentBar label="Agent Chat" pct={72} color={BLOOM.green} value="Positive" />
              <SentimentBar label="Call (live)" pct={75} color={BLOOM.green} value="Positive" />
              <Box sx={{ mt: 0.75, p: 0.875, bgcolor: BLOOM.canvas, borderRadius: '6px' }}>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Sentiment <strong>improving</strong> across channels.</Typography>
              </Box>
            </Card>
          </>
        )}
        {tab === 1 && (
          <>
            <Paper sx={{ mb: 1.5, overflow: 'hidden' }}>
              <Box sx={{ px: 1.5, py: 1.25, bgcolor: BLOOM.canvas, borderBottom: `1px solid ${BLOOM.border}` }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary' }}>Chat Transcript — Bene Change</Typography>
              </Box>
              <Box sx={{ p: 1.5, maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { from: 'bot', init: 'AI', color: BLOOM.blue, msg: 'Hi Robert! I see you are viewing beneficiaries. How can I help?' },
                  { from: 'user', init: 'RC', color: BLOOM.orange, msg: 'I need to add my daughter as contingent beneficiary' },
                  { from: 'bot', init: 'AI', color: BLOOM.blue, msg: 'Current primary: Lisa M. Chen (Spouse, 100%). Daughter\'s name and DOB?' },
                  { from: 'user', init: 'RC', color: BLOOM.orange, msg: 'Emily Rose Chen, April 15, 2008' },
                  { from: 'bot', init: 'AI', color: BLOOM.blue, msg: 'Emily is a minor. UTMA custodian required. Connecting you with an agent.' },
                ].map((m, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 0.75, maxWidth: '88%', alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', flexDirection: m.from === 'user' ? 'row-reverse' : 'row' }}>
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: m.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5625rem', fontWeight: 700, flexShrink: 0 }}>{m.init}</Box>
                    <Box sx={{ p: '8px 12px', borderRadius: 2, fontSize: '0.75rem', lineHeight: 1.5, bgcolor: m.from === 'user' ? BLOOM.blue : BLOOM.canvas, color: m.from === 'user' ? '#fff' : 'text.primary', border: m.from === 'user' ? 'none' : `1px solid ${BLOOM.border}` }}>
                      {m.msg}
                    </Box>
                  </Box>
                ))}
                <Box sx={{ textAlign: 'center', fontSize: '0.625rem', color: BLOOM.textTertiary, py: 0.5, display: 'flex', alignItems: 'center', gap: 1, '&::before,&::after': { content: '""', flex: 1, height: '1px', bgcolor: BLOOM.border } }}>Agent Sarah Mitchell joined</Box>
                <Box sx={{ display: 'flex', gap: 0.75, maxWidth: '88%', alignSelf: 'flex-start' }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: BLOOM.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5625rem', fontWeight: 700, flexShrink: 0 }}>SM</Box>
                  <Box sx={{ p: '8px 12px', borderRadius: 2, fontSize: '0.75rem', lineHeight: 1.5, bgcolor: BLOOM.bluePale, border: `1px solid #93bbfd` }}>
                    Hi Robert — I have the details. Would Lisa serve as UTMA custodian?
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.75, maxWidth: '88%', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: BLOOM.orange, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5625rem', fontWeight: 700, flexShrink: 0 }}>RC</Box>
                  <Box sx={{ p: '8px 12px', borderRadius: 2, fontSize: '0.75rem', lineHeight: 1.5, bgcolor: BLOOM.blue, color: '#fff' }}>Yes, can we do a call to finalize?</Box>
                </Box>
                <Box sx={{ textAlign: 'center', fontSize: '0.625rem', color: BLOOM.textTertiary, py: 0.5, display: 'flex', alignItems: 'center', gap: 1, '&::before,&::after': { content: '""', flex: 1, height: '1px', bgcolor: BLOOM.border } }}>Escalated to phone — context transferred</Box>
              </Box>
            </Paper>
            <StatGrid cols={4} stats={[
              { value: '14', label: 'Messages' },
              { value: '88%', label: 'Intent', valueColor: BLOOM.blue },
              { value: '8:21', label: 'Duration' },
              { value: '0', label: 'Repeats', valueColor: BLOOM.green },
            ]} />
          </>
        )}
      </Box>
    </>
  );
}

function CallbackRecovery() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: `2px solid ${BLOOM.border}`, px: 3, flexShrink: 0 }}>
        <Tab label="📲 Recovery" />
        <Tab label="⚡ Playbook" />
      </Tabs>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.75, pb: 2.5 }}>
        {tab === 0 && (
          <>
            <AlertCard variant="red" title="Recovery Alert">
              <strong>Karen Williams</strong> — sentiment drop (Positive → Negative). Hold 8:42, then disconnected. <strong>Automated recovery initiated.</strong>
            </AlertCard>
            <StatGrid cols={4} stats={[
              { value: '−54%', label: 'Sent Drop', valueColor: BLOOM.red },
              { value: '8:42', label: 'Hold' },
              { value: '3', label: 'Attempts', valueColor: BLOOM.red },
              { value: 'DC', label: 'Disconn', valueColor: BLOOM.red },
            ]} />
            <Card>
              <SectionLabel>Automated Recovery Actions</SectionLabel>
              <TimelineItem icon="⚠" iconBg={BLOOM.redPale} iconColor={BLOOM.red} title="Supervisor Alert" detail="Mike Rodriguez notified. Priority: High." time="2:48 PM" />
              <TimelineItem icon="📱" iconBg={BLOOM.bluePale} iconColor={BLOOM.blue} title="SMS Follow-Up" detail={`"Hi Karen, we apologize. A senior agent will call within 30 min."`} time="2:49 PM" />
              <TimelineItem icon="📞" iconBg={BLOOM.yellowPale} iconColor={BLOOM.amber} title="Priority Callback Queued" detail="Lisa Tran (Senior). Queue position: 1." time="2:50 PM" />
              <TimelineItem icon="📧" iconBg={BLOOM.reviewPale} iconColor={BLOOM.review} title="Email Drafted" detail="Personalized apology + claim status." time="Pending" />
            </Card>
          </>
        )}
        {tab === 1 && (
          <>
            <Card>
              <SectionLabel>Recovery Playbook</SectionLabel>
              <Box sx={{ p: 1.5, bgcolor: BLOOM.canvas, borderRadius: '6px', borderLeft: `3px solid #ef4444`, fontSize: '0.8125rem', lineHeight: 1.6 }}>
                <Typography sx={{ fontSize: '0.8125rem', lineHeight: 1.7 }}>
                  <Box component="span" sx={{ bgcolor: BLOOM.redPale, px: 0.5, borderRadius: '3px', fontWeight: 600 }}>Opening:</Box>{' '}
                  "Karen, I am sorry about the wait and disconnection."
                  <br /><br />
                  <Box component="span" sx={{ bgcolor: BLOOM.redPale, px: 0.5, borderRadius: '3px', fontWeight: 600 }}>Empathy:</Box>{' '}
                  Acknowledge all 3 attempts. Do NOT ask to repeat info.
                  <br /><br />
                  <Box component="span" sx={{ bgcolor: BLOOM.redPale, px: 0.5, borderRadius: '3px', fontWeight: 600 }}>Resolution:</Box>{' '}
                  Specific timeline + direct callback number.
                </Typography>
              </Box>
            </Card>
            <RecommendationCard title="Recovery KPIs" items={[
              'Restore sentiment to <strong>Neutral+</strong> this interaction.',
              '<strong>Specific dates</strong> for next steps — no vague promises.',
              '<strong>Proactive follow-up in 48h</strong> scheduled before call ends.',
            ]} />
          </>
        )}
      </Box>
    </>
  );
}

function WorkforceOptimization() {
  const [tab, setTab] = useState(0);
  const agents = [
    { init: 'LT', name: 'Lisa Tran', role: 'Senior CSR · Claims · 4.8 rating · Available', score: 96, bg: BLOOM.blue, highlight: true },
    { init: 'JR', name: 'James Rivera', role: 'CSR II · General Claims · 4.5 · 3 min', score: 78, bg: BLOOM.blueLight, highlight: false },
    { init: 'SM', name: 'Sarah Mitchell', role: 'CSR II · Life & Annuity · 4.6 · Available', score: 61, bg: BLOOM.orange, highlight: false },
  ];
  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: `2px solid ${BLOOM.border}`, px: 3, flexShrink: 0 }}>
        <Tab label="👥 Matching" />
        <Tab label="📈 Coaching" />
      </Tabs>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.75, pb: 2.5 }}>
        {tab === 0 && (
          <>
            <AlertCard variant="amber" title="Skill-Based Routing">
              Incoming: <strong>Complex Claims Escalation</strong> (High). Matching caller history, complexity, and expertise to agents.
            </AlertCard>
            <Card>
              <SectionLabel>Agent Match Scores</SectionLabel>
              {agents.map((a) => (
                <Box key={a.init} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25, bgcolor: BLOOM.canvas, borderRadius: '6px', mb: 1, border: a.highlight ? `2px solid ${BLOOM.blue}` : 'none' }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: a.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0 }}>{a.init}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{a.name}</Typography>
                      {a.highlight && <Chip label="Best Match" size="small" sx={{ height: 18, fontSize: '0.5625rem', bgcolor: BLOOM.greenPale, color: BLOOM.green }} />}
                    </Box>
                    <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>{a.role}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: a.highlight ? BLOOM.blue : BLOOM.textTertiary }}>{a.score}</Typography>
                </Box>
              ))}
            </Card>
            <Card>
              <SectionLabel>Match Criteria</SectionLabel>
              <ScoreBar label="Claims Exp" pct={95} color={BLOOM.blue} />
              <ScoreBar label="Escalation" pct={88} color={BLOOM.blue} />
              <ScoreBar label="Empathy" pct={92} color={BLOOM.green} />
              <ScoreBar label="Resolution" pct={91} color={BLOOM.green} />
            </Card>
          </>
        )}
        {tab === 1 && (
          <>
            <Card>
              <SectionLabel>Coaching Opportunities</SectionLabel>
              {[
                { init: 'JR', name: 'James Rivera', note: 'Handle time ↑22%. Empathy phrases ↓ in escalated calls.', color: '#f97316' },
                { init: 'KP', name: 'Kim Patel', note: 'FCR ↓15%. Frequent billing transfers.', color: BLOOM.orange },
              ].map((a) => (
                <Box key={a.init} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25, bgcolor: BLOOM.canvas, borderRadius: '6px', mb: 1, borderLeft: `3px solid ${a.color}` }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: a.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0 }}>{a.init}</Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{a.name}</Typography>
                    <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>{a.note}</Typography>
                  </Box>
                </Box>
              ))}
            </Card>
            <RecommendationCard title="Script Improvements" items={[
              'Escalation calls: <strong>empathy within 30s</strong> → +18% sentiment.',
              'Billing: <strong>proactive due-date</strong> → −23% repeat calls.',
              'Holds: replace "please hold" with <strong>est. wait + reason</strong> → −31% neg sentiment.',
            ]} />
          </>
        )}
      </Box>
    </>
  );
}

function LifeEventDetection() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: `2px solid ${BLOOM.border}`, px: 3, flexShrink: 0 }}>
        <Tab label="📋 Detection" />
        <Tab label="🎯 Offers" />
      </Tabs>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.75, pb: 2.5 }}>
        {tab === 0 && (
          <>
            <AlertCard variant="amber" title="Life-Event Signals Detected">
              Analysis of <strong>James & Patricia Nguyen</strong> interactions identified life events requiring coverage review.
            </AlertCard>
            <Card>
              <SectionLabel>Detected Events</SectionLabel>
              <Box sx={{ mb: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {[
                  { label: '💍 Marriage', bg: BLOOM.reviewPale, color: BLOOM.review },
                  { label: '🏡 New Home', bg: BLOOM.bluePale, color: BLOOM.blue },
                  { label: '👶 New Dependent', bg: BLOOM.greenPale, color: BLOOM.green },
                ].map(e => (
                  <Box key={e.label} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.5, borderRadius: '6px', bgcolor: e.bg, color: e.color, fontSize: '0.75rem', fontWeight: 600 }}>{e.label}</Box>
                ))}
              </Box>
              {[
                { signal: '1', text: 'Name change (Williams → Nguyen) + joint residence.', confidence: '94% confidence.' },
                { signal: '2', text: 'Homeowners inquiry Feb 3 + new property.', confidence: '91%.' },
                { signal: '3', text: 'Called to add dependent, mentioned "new baby."', confidence: '97%.' },
              ].map(s => (
                <Box key={s.signal} sx={{ p: 1, bgcolor: BLOOM.canvas, borderRadius: '6px', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.6, color: 'text.secondary' }}>
                    <strong>Signal {s.signal}:</strong> {s.text} <em>{s.confidence}</em>
                  </Typography>
                </Box>
              ))}
            </Card>
            <StatGrid stats={[
              { value: '3', label: 'Events' },
              { value: '94%', label: 'Confidence', valueColor: BLOOM.blue },
              { value: 'High', label: 'Opportunity', valueColor: BLOOM.green },
            ]} />
          </>
        )}
        {tab === 1 && (
          <>
            <Card>
              <SectionLabel>Coverage Triggers</SectionLabel>
              <TimelineItem icon="💍" iconBg={BLOOM.reviewPale} iconColor={BLOOM.review} title="Marriage — Bene Update" detail="Add spouse Patricia as primary." />
              <TimelineItem icon="🏡" iconBg={BLOOM.bluePale} iconColor={BLOOM.blue} title="New Home — Coverage Gap" detail="No homeowners policy. Bundle with auto for 12% discount." />
              <TimelineItem icon="👶" iconBg={BLOOM.greenPale} iconColor={BLOOM.green} title="New Dependent — Life Coverage" detail="$350K term may be low. Offer child rider ($15K, ~$4/mo)." />
            </Card>
            <RecommendationCard title="Conversation Points" items={[
              '<strong>Congratulations</strong> approach — acknowledge events before coverage.',
              'Offer <strong>prefilled bene update form</strong> with spouse name.',
              '<strong>Bundled homeowners quote</strong> — est. savings $340/yr.',
              '<strong>Child rider + coverage increase</strong> — "Most new parents go to 10× income."',
            ]} />
          </>
        )}
      </Box>
    </>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

const PANEL_WIDTH = 410;

interface EngagementPanelProps {
  activeScenario: ScenarioId;
  open: boolean;
  onToggle: () => void;
}

export default function EngagementPanel({ activeScenario, open, onToggle }: EngagementPanelProps) {
  return (
    <Box
      sx={{
        width: PANEL_WIDTH,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRight: `1px solid ${BLOOM.border}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10,
        transition: 'margin-left 0.3s ease',
        ml: open ? 0 : `${-(PANEL_WIDTH - 40)}px`,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Toggle button */}
      <Box
        onClick={onToggle}
        title="Toggle Panel"
        sx={{
          position: 'absolute', top: 14, right: -14, width: 28, height: 28,
          bgcolor: BLOOM.blue, border: `3px solid ${BLOOM.canvas}`,
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 20, color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          transition: 'transform 0.3s',
          transform: open ? 'none' : 'rotate(180deg)',
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: 16 }} />
      </Box>

      {/* Panel header */}
      <Box sx={{ px: 3, pt: 2, pb: 0, flexShrink: 0, mb: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.375 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>Engagement Analyzer</Typography>
          <Box sx={{
            fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
            background: `linear-gradient(135deg, ${BLOOM.blue}, ${BLOOM.blueLight})`,
            color: '#fff', px: 0.875, py: 0.25, borderRadius: '4px',
          }}>Smart App</Box>
        </Box>
        <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', lineHeight: 1.3 }}>
          Powered by <strong style={{ color: '#475569' }}>Assure Orchestration</strong>
        </Typography>
      </Box>

      {/* Scenario content */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeScenario === 'friction'   && <FrictionDetection />}
        {activeScenario === 'adaptive'   && <AdaptiveEngagement />}
        {activeScenario === 'omni'       && <OmnichannelContinuity />}
        {activeScenario === 'callback'   && <CallbackRecovery />}
        {activeScenario === 'workforce'  && <WorkforceOptimization />}
        {activeScenario === 'lifeevent'  && <LifeEventDetection />}
      </Box>
    </Box>
  );
}
