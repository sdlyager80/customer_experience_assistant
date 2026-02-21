import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Paper, Button, Chip, Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BoltIcon from '@mui/icons-material/Bolt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { BLOOM } from '../../theme';
import {
  briefData, nbaData, historyItems, chatMessages,
  type Persona, type HistoryItem,
} from './data';

// ─── Shared helpers ───────────────────────────────────────────────────────────
const CHANNEL_STYLE: Record<string, { bg: string; color: string; icon: string }> = {
  phone:   { bg: BLOOM.bluePale,    color: BLOOM.blue,   icon: '📞' },
  chat:    { bg: BLOOM.orangePale,  color: BLOOM.orange,  icon: '💬' },
  chatbot: { bg: BLOOM.orangePale,  color: BLOOM.orange,  icon: '🤖' },
  portal:  { bg: BLOOM.orangePale,  color: BLOOM.orange, icon: '🌐' },
  email:   { bg: BLOOM.greenPale,   color: BLOOM.green,  icon: '✉️' },
  mobile:  { bg: '#f3e8ff',         color: '#7c3aed',    icon: '📱' },
};
const SENTIMENT_STYLE = {
  pos: { bg: BLOOM.greenPale,  color: BLOOM.green,  label: 'Positive' },
  neu: { bg: '#f3f4f6',        color: BLOOM.textSecondary, label: 'Neutral' },
  neg: { bg: BLOOM.redPale,    color: BLOOM.red,    label: 'Negative' },
};

function DataRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.625, borderBottom: `1px solid ${BLOOM.canvas}`, '&:last-child': { border: 'none' } }}>
      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: valueColor || 'text.primary', textAlign: 'right', maxWidth: '55%' }}>{value}</Typography>
    </Box>
  );
}

function SectionCard({ title, icon, children, sx = {} }: { title: string; icon?: string; children: React.ReactNode; sx?: object }) {
  return (
    <Paper sx={{ p: 2.25, mb: 1.75, ...sx }}>
      <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'text.secondary', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        {icon && <span style={{ fontSize: 15 }}>{icon}</span>}{title}
      </Typography>
      {children}
    </Paper>
  );
}

// ─── Screen 1: Incoming ───────────────────────────────────────────────────────
function IncomingScreen({ onAccept }: { onAccept: (p: Persona) => void }) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100%',
      background: 'linear-gradient(160deg, #f0f5f4 0%, #e4eff8 100%)',
    }}>
      <Box sx={{ textAlign: 'center', maxWidth: 480, p: 5 }}>
        {/* Pulsing ring */}
        <Box sx={{
          width: 96, height: 96, borderRadius: '50%',
          bgcolor: BLOOM.bluePale, border: `3px solid ${BLOOM.blue}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto', mb: 3, fontSize: 38,
          '@keyframes pulse': {
            '0%, 100%': { boxShadow: '0 0 0 0 rgba(27,117,187,0.3)' },
            '50%': { boxShadow: '0 0 0 18px rgba(27,117,187,0)' },
          },
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          📞
        </Box>

        <Typography sx={{ fontSize: '1.375rem', fontWeight: 700, mb: 0.5 }}>Incoming Interaction</Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 3 }}>
          Robert A. Chen · Policy 440387261UL · Universal Life
        </Typography>

        {/* Preview card */}
        <Paper sx={{ p: 2, mb: 3.5, textAlign: 'left' }}>
          {[
            { label: 'Customer',        value: 'Robert A. Chen' },
            { label: 'Policy',          value: '440387261UL — Universal Life $500K' },
            { label: 'Status',          value: 'Active · Authenticated', color: BLOOM.green },
            { label: 'IVR Path',        value: 'Existing Policy → Policy Loans → Agent' },
            { label: 'Recent Activity', value: '3 channel contacts in last 30 min' },
          ].map(r => (
            <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.625, borderBottom: `1px solid ${BLOOM.canvas}`, '&:last-child': { border: 'none' } }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>{r.label}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: (r as any).color || 'text.primary' }}>{r.value}</Typography>
            </Box>
          ))}
        </Paper>

        {/* Accept buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
          <Button
            variant="contained" disableElevation
            startIcon={<PhoneIcon />}
            onClick={() => onAccept('phone')}
            sx={{ px: 3.5, py: 1.5, fontSize: '0.875rem', fontWeight: 700,
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' },
              transition: 'all 0.15s',
            }}
          >
            Accept Call
          </Button>
          <Button
            variant="outlined"
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={() => onAccept('chat')}
            sx={{ px: 3.5, py: 1.5, fontSize: '0.875rem', fontWeight: 700, borderWidth: 2,
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', borderWidth: 2 },
              transition: 'all 0.15s',
            }}
          >
            Accept Chat
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Current Tab ─────────────────────────────────────────────────────────────
function CurrentTab({ persona }: { persona: Persona }) {
  const brief = briefData[persona];
  const nbas  = nbaData[persona];

  return (
    <Box>
      {/* AI Brief */}
      <Paper sx={{ p: 2.25, mb: 1.75, background: 'linear-gradient(135deg, #eff6ff, #f5f9ff)', border: '1px solid #93bbfd' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875, mb: 1 }}>
          <Box sx={{
            width: 7, height: 7, borderRadius: '50%', bgcolor: BLOOM.blue, flexShrink: 0,
            '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
            animation: 'blink 1.5s ease infinite',
          }} />
          <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: BLOOM.blue }}>
            AI Interaction Brief
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, mb: 1, lineHeight: 1.4 }}>{brief.why}</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: brief.body }} />
        <Box sx={{ mt: 1.25, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {brief.items.map((item, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: item.color, mt: '6px', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: item.text }} />
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Next Best Actions */}
      <Paper sx={{ p: 2.25, mb: 1.75, borderLeft: `4px solid ${BLOOM.blueLight}` }}>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'text.secondary', mb: 1.25, display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <BoltIcon sx={{ fontSize: 15 }} /> Next Best Actions
        </Typography>
        {nbas.map((nba, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.25, borderBottom: i < nbas.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none' }}>
            <Box sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: BLOOM.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, mb: 0.25 }}>{nba.title}</Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', lineHeight: 1.4 }}>{nba.reason}</Typography>
            </Box>
            <Button variant="outlined" size="small" sx={{ fontSize: '0.6875rem', px: 1.5, py: 0.5, flexShrink: 0, mt: 0.25, minWidth: 'auto' }}>{nba.btn}</Button>
          </Box>
        ))}
      </Paper>

      {/* STP Card — phone persona only */}
      {persona === 'phone' && (
        <Paper sx={{ p: 2.25, mb: 1.75, background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', border: '1px solid #86efac' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875, mb: 1 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: BLOOM.green, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: BLOOM.green }}>
              ✓ Straight-Through Processing
            </Typography>
            <Box sx={{ ml: 'auto', fontSize: '0.5625rem', fontWeight: 700, bgcolor: BLOOM.green, color: '#fff', px: 0.875, py: 0.25, borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Auto-Approved
            </Box>
          </Box>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, mb: 0.75, lineHeight: 1.4, color: '#065f46' }}>
            Policy Loan — $75,000 · Universal Life
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {[
              { label: 'Route',       value: 'Assure Orchestration → Policy Loan Engine' },
              { label: 'Auth Check',  value: 'IVR PIN + Identity Verified ✓' },
              { label: 'Eligibility', value: 'Max loanable $168,678 — within limit ✓' },
              { label: 'Rate',        value: '5.25% Fixed / 4.75% Variable — applied' },
              { label: 'Status',      value: 'Disbursement queued · EFT ****4821' },
            ].map(r => (
              <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.375, borderBottom: `1px solid #d1fae5`, '&:last-child': { border: 'none' } }}>
                <Typography sx={{ fontSize: '0.6875rem', color: '#065f46', fontWeight: 500 }}>{r.label}</Typography>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#047857', textAlign: 'right', maxWidth: '60%' }}>{r.value}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Conversation Points */}
      <Paper sx={{ p: 2.25, mb: 1.75, background: 'linear-gradient(135deg, #fefce8, #fefdf5)', border: '1px solid #f5cfa0' }}>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: BLOOM.orange, mb: 1.25, display: 'flex', alignItems: 'center', gap: 0.75 }}>
          💬 Conversation Points
        </Typography>
        {[
          'Robert is <strong>well-informed</strong> — he researched on portal and chatbot before contacting. Avoid repeating info he already has.',
          'Acknowledge his <strong>thorough preparation</strong> — "I can see you\'ve done your homework" builds rapport.',
          'Mention the <strong>outstanding bene change form</strong> naturally — "While I have you, we still need that beneficiary form back."',
          'If he asks about the <strong>coverage increase</strong> he explored in August, the $189/mo quote has expired — offer to re-quote.',
        ].map((point, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.875, fontSize: '0.75rem', lineHeight: 1.5 }}>
            <Typography sx={{ color: BLOOM.orange, fontSize: '0.875rem', lineHeight: 1.2, flexShrink: 0 }}>▶</Typography>
            <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: point }} />
          </Box>
        ))}
      </Paper>

      {/* Quick Actions */}
      <Box sx={{ mb: 1.75 }}>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'text.secondary', mb: 1 }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[
            { label: '📄 View Loan Request', primary: true },
            { label: '✉ Send Update' },
            { label: '📋 Add Note' },
            { label: '↑ Escalate' },
            { label: '📞 Schedule Callback' },
          ].map(a => (
            <Box
              key={a.label}
              component="button"
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.625,
                px: 1.5, py: 0.75, borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 600,
                border: `1px solid ${a.primary ? BLOOM.blue : BLOOM.border}`,
                bgcolor: a.primary ? BLOOM.blue : BLOOM.white,
                color: a.primary ? '#fff' : BLOOM.textPrimary,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s',
                '&:hover': {
                  borderColor: BLOOM.blue,
                  color: a.primary ? '#fff' : BLOOM.blue,
                  bgcolor: a.primary ? BLOOM.blueLight : BLOOM.white,
                },
              }}
            >
              {a.label}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Policy Tab ───────────────────────────────────────────────────────────────
function PolicyTab() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.75, '@media(max-width:900px)': { gridTemplateColumns: '1fr' } }}>
      <SectionCard title="Policy Details" icon="📄">
        <DataRow label="Policy"       value="440387261UL" />
        <DataRow label="Product"      value="Universal Life" />
        <DataRow label="Face Amount"  value="$500,000" />
        <DataRow label="Status"       value="Active" valueColor={BLOOM.green} />
        <DataRow label="Issue Date"   value="06/12/2018" />
        <DataRow label="State"        value="CA" />
        <DataRow label="Owner"        value="Robert A. Chen" />
        <DataRow label="Insured"      value="Robert A. Chen (Age 47)" />
      </SectionCard>

      <SectionCard title="Billing & Premium" icon="💰">
        <DataRow label="Premium Mode"    value="Monthly — EFT" />
        <DataRow label="Monthly Premium" value="$412.50" />
        <DataRow label="Payment Method"  value="EFT ****4821" />
        <DataRow label="Next Due"        value="03/01/2026" />
        <DataRow label="Paid Through"    value="03/01/2026" />
        <DataRow label="YTD Premium"     value="$4,950.00" />
      </SectionCard>

      <SectionCard title="Contract Values" icon="📈">
        <DataRow label="Cash Value"          value="$187,420.00" />
        <DataRow label="Death Benefit"       value="$500,000.00" />
        <DataRow label="Max Loanable (90%)"  value="$168,678.00" />
        <DataRow label="Loan Rate (Fixed)"   value="5.25%" />
        <DataRow label="Loan Rate (Variable)" value="4.75%" />
        <DataRow label="Existing Loans"      value="None" />
        <Box sx={{ mt: 1.25, p: 1, bgcolor: BLOOM.bluePale, borderRadius: '6px', fontSize: '0.6875rem', color: BLOOM.blue }}>
          <strong>If $75K loan:</strong> Net cash value $112,420. Net death benefit $425K. Annual interest $3,937.50.
        </Box>
      </SectionCard>

      <SectionCard title="Beneficiaries" icon="👥">
        <DataRow label="Primary"    value="Lisa M. Chen (Spouse) — 100%" />
        <DataRow label="Contingent" value="Pending — Emily R. Chen" valueColor={BLOOM.orange} />
        <Box sx={{ mt: 1.25, p: 1, bgcolor: BLOOM.orangePale, borderRadius: '6px', fontSize: '0.6875rem', color: BLOOM.orange }}>
          <strong>Note:</strong> Bene change form sent Feb 3. Emily is a minor (17) — UTMA custodian: Lisa M. Chen. Form not yet returned.
        </Box>
      </SectionCard>
    </Box>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────
function HistoryTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggleItem = (id: string) => setExpanded(prev => prev === id ? null : id);

  const dateGroups = historyItems.reduce<{ date: string; items: HistoryItem[] }[]>((acc, item) => {
    const last = acc[acc.length - 1];
    if (last && last.date === item.date) { last.items.push(item); }
    else { acc.push({ date: item.date, items: [item] }); }
    return acc;
  }, []);

  return (
    <Box>
      {dateGroups.map(group => (
        <Box key={group.date}>
          {/* Date separator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: BLOOM.textSecondary, my: 1.75 }}>
            {group.date}
            <Box sx={{ flex: 1, height: '1px', bgcolor: BLOOM.border }} />
          </Box>

          {group.items.map(item => {
            const ch = CHANNEL_STYLE[item.channel];
            const sent = SENTIMENT_STYLE[item.sentiment];
            const isOpen = expanded === item.id;

            return (
              <Box key={item.id}>
                {/* Timeline row */}
                <Box
                  onClick={() => toggleItem(item.id)}
                  sx={{
                    display: 'flex', gap: 1.5, p: 1.5, borderRadius: '8px', mb: 0.5,
                    cursor: 'pointer', transition: 'background 0.12s',
                    bgcolor: isOpen ? BLOOM.bluePale : 'transparent',
                    border: isOpen ? `1px solid #93bbfd` : '1px solid transparent',
                    '&:hover': { bgcolor: isOpen ? BLOOM.bluePale : BLOOM.white },
                  }}
                >
                  <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: ch.bg, color: ch.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                    {ch.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</Typography>
                      <Typography sx={{ fontSize: '0.625rem', color: BLOOM.textSecondary, flexShrink: 0 }}>{item.time}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', mt: 0.25, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.desc}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.625 }}>
                      <Chip label={sent.label} size="small" sx={{ height: 16, fontSize: '0.5625rem', bgcolor: sent.bg, color: sent.color, fontWeight: 600 }} />
                      <Chip label={item.channel.charAt(0).toUpperCase() + item.channel.slice(1)} size="small" sx={{ height: 16, fontSize: '0.5625rem', bgcolor: ch.bg, color: ch.color, fontWeight: 600 }} />
                    </Box>
                  </Box>
                </Box>

                {/* Expandable detail */}
                {isOpen && (
                  <Paper sx={{ p: 2, mb: 1.5, fontSize: '0.75rem' }}>
                    <DataRow label="Duration" value={item.detail.duration || '—'} />
                    <DataRow label="Agent" value={item.detail.agent} />
                    <DataRow label="Resolution" value={item.detail.resolution} valueColor={item.detail.resolutionColor} />

                    {item.detail.transcript && (
                      <Box sx={{ mt: 1.25, p: 1.25, bgcolor: BLOOM.canvas, borderRadius: '6px', borderLeft: `3px solid ${BLOOM.blue}`, lineHeight: 1.6, maxHeight: 180, overflowY: 'auto' }}>
                        {item.detail.transcript.map((line, i) => (
                          <Typography key={i} sx={{ fontSize: '0.75rem', mb: 0.75, lineHeight: 1.5 }}>
                            <Box component="span" sx={{ fontWeight: 700, color: line.speaker === 'customer' ? BLOOM.orange : BLOOM.blue }}>
                              {line.speaker === 'agent' ? 'Agent: ' : line.speaker === 'customer' ? 'Robert: ' : 'Bot: '}
                            </Box>
                            {line.text}
                          </Typography>
                        ))}
                      </Box>
                    )}

                    {item.detail.note && (
                      <Box sx={{ mt: 1, p: 1.25, bgcolor: '#fefce8', border: '1px solid #f5cfa0', borderRadius: '6px', fontSize: '0.75rem', lineHeight: 1.5 }}>
                        {item.detail.note}
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

// ─── Insights Tab ─────────────────────────────────────────────────────────────
function InsightsTab() {
  const channelData = [
    { label: 'Phone',  pct: 43, count: 6, color: BLOOM.blue },
    { label: 'Portal', pct: 21, count: 3, color: BLOOM.orange },
    { label: 'Email',  pct: 21, count: 3, color: BLOOM.green },
    { label: 'Chat',   pct: 14, count: 2, color: BLOOM.orange },
    { label: 'Mobile', pct:  7, count: 1, color: '#7c3aed' },
  ];

  return (
    <Box>
      {/* Outcome KPI row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 1.75 }}>
        {[
          { value: '↓18%', label: 'Handle Time',  color: BLOOM.green,  sub: 'vs. baseline' },
          { value: '43%',  label: 'STP Rate',      color: BLOOM.blue,   sub: 'auto-processed' },
          { value: '4.7',  label: 'CSAT Score',    color: BLOOM.green,  sub: 'out of 5.0' },
          { value: '92%',  label: 'FCR',           color: BLOOM.blue,   sub: '1st contact resolve' },
        ].map(s => (
          <Paper key={s.label} sx={{ p: 1.25, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '1.1875rem', fontWeight: 700, lineHeight: 1.1, color: s.color }}>{s.value}</Typography>
            <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'text.secondary', mt: 0.25 }}>{s.label}</Typography>
            <Typography sx={{ fontSize: '0.5rem', color: BLOOM.textSecondary, mt: 0.125 }}>{s.sub}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Alert cards */}
      {[
        { variant: 'good' as const, label: '✓ No Friction Detected',        text: 'Robert Chen has had <strong>zero repeat contacts</strong> for unresolved issues. Sentiment is consistently positive across all channels. No SLA breaches.' },
        { variant: 'info' as const, label: '🔗 Omnichannel Continuity',      text: "Today's interaction spanned <strong>4 channels</strong> (Portal → Chatbot → Agent Chat → Phone) with <strong>zero information repeated</strong>. Full context transferred at each handoff." },
        { variant: 'warn' as const, label: '⏱ Pending Follow-Up',           text: '<strong>Beneficiary change form</strong> sent Feb 3. UTMA custodian designation for minor Emily R. Chen. Not yet returned.' },
      ].map(a => {
        const styles = {
          good: { bg: 'linear-gradient(135deg,#ecfdf5,#f0fdf4)', border: '#86efac', labelColor: BLOOM.green },
          info: { bg: 'linear-gradient(135deg,#eff6ff,#f5f9ff)', border: '#93bbfd', labelColor: BLOOM.blue },
          warn: { bg: 'linear-gradient(135deg,#fefce8,#fffef5)', border: '#f5cfa0', labelColor: BLOOM.orange },
        }[a.variant];
        return (
          <Paper key={a.label} sx={{ p: 1.75, mb: 1.25, background: styles.bg, border: `1px solid ${styles.border}` }}>
            <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: styles.labelColor, mb: 0.5 }}>{a.label}</Typography>
            <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: a.text }} />
          </Paper>
        );
      })}

      {/* Context enrichment */}
      <SectionCard title="Context Enrichment" icon="📚">
        {[
          { color: BLOOM.blue,    text: '<strong>Cash Value:</strong> $187,420. After $75K loan: $112,420 net.' },
          { color: BLOOM.green,   text: '<strong>Death Benefit:</strong> $500K. Net after loan: $425K.' },
          { color: BLOOM.orange,  text: '<strong>Premium:</strong> $412.50/mo via EFT. Current through 03/01/2026.' },
          { color: BLOOM.orange,   text: '<strong>Beneficiaries:</strong> Primary: Lisa M. Chen (Spouse, 100%). Contingent: <em>Pending — Emily R. Chen.</em>' },
          { color: BLOOM.orange,  text: '<strong>Loan History:</strong> No prior loans. First policy loan processed today.' },
          { color: '#7c3aed',     text: '<strong>Cross-Sell:</strong> No annuity on file. Previously inquired about face amount increase (Aug 2025).' },
        ].map((item, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 0.75, borderBottom: i < 5 ? `1px solid ${BLOOM.canvas}` : 'none' }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.color, mt: '5px', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.4, color: 'text.secondary', flex: 1, '& strong': { color: 'text.primary' } }} dangerouslySetInnerHTML={{ __html: item.text }} />
          </Box>
        ))}
      </SectionCard>

      {/* Channel breakdown */}
      <SectionCard title="Channel Breakdown (12 mo)" icon="📊">
        {channelData.map(ch => (
          <Box key={ch.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.875 }}>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, minWidth: 44, color: 'text.secondary' }}>{ch.label}</Typography>
            <Box sx={{ flex: 1, height: 6, bgcolor: BLOOM.canvas, borderRadius: 10, overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${ch.pct}%`, bgcolor: ch.color, borderRadius: 10 }} />
            </Box>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, minWidth: 16, textAlign: 'right' }}>{ch.count}</Typography>
          </Box>
        ))}
      </SectionCard>

      {/* Compliance & Audit Trail */}
      <SectionCard title="Compliance & Audit Trail" icon="🔐">
        {[
          { ts: '10:01:44', event: 'IVR Authentication',          detail: 'PIN verified · Identity confirmed',           color: BLOOM.green },
          { ts: '10:02:08', event: 'Assure Orchestration Init',   detail: 'Context assembled — 4 prior sessions merged',  color: BLOOM.blue },
          { ts: '10:02:31', event: 'Session Transfer',            detail: 'Chatbot → Live Agent · Full context passed',   color: BLOOM.blue },
          { ts: '10:03:19', event: 'Policy Loan Eligibility',     detail: 'Auto-checked · Max $168,678 · Approved',       color: BLOOM.green },
          { ts: '10:04:05', event: 'STP Loan Processing',         detail: '$75,000 auto-approved · EFT disbursement queued', color: BLOOM.green },
          { ts: '10:04:28', event: 'Beneficiary Alert Surfaced',  detail: 'Form pending · Disclosed to agent',            color: BLOOM.orange },
          { ts: '10:04:55', event: 'CSAT Survey Scheduled',       detail: 'Post-call survey queued · SMS to Robert Chen', color: BLOOM.textSecondary },
          { ts: '10:05:02', event: 'Interaction Recorded',        detail: 'Stored · 7-year retention · Reg. compliant',   color: BLOOM.textSecondary },
        ].map((row, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.25, py: 0.625, borderBottom: i < 7 ? `1px solid ${BLOOM.canvas}` : 'none' }}>
            <Typography sx={{ fontSize: '0.5625rem', color: BLOOM.textSecondary, fontVariantNumeric: 'tabular-nums', minWidth: 44, mt: '1px' }}>{row.ts}</Typography>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: row.color, mt: '4px', flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, lineHeight: 1.3 }}>{row.event}</Typography>
              <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', lineHeight: 1.3 }}>{row.detail}</Typography>
            </Box>
          </Box>
        ))}
      </SectionCard>
    </Box>
  );
}

// ─── Transcript Tab ───────────────────────────────────────────────────────────
const TRANSCRIPT_LINES = [
  { ts: '10:02:14', speaker: 'customer' as const, text: "Hi, I'm calling about taking out a policy loan on my universal life policy.", sentiment: 'neu' as const },
  { ts: '10:02:28', speaker: 'agent'    as const, text: "Good morning, Robert! I'd be happy to help you with that today.", sentiment: 'pos' as const },
  { ts: '10:02:41', speaker: 'customer' as const, text: "I was on the portal and chatbot already — I need about $75,000. I've been researching the rates.", sentiment: 'neu' as const },
  { ts: '10:03:05', speaker: 'agent'    as const, text: "I can see you've done your homework. Let me pull up the loan details for your policy right now.", sentiment: 'pos' as const },
  { ts: '10:03:22', speaker: 'customer' as const, text: "The variable rate option looked more interesting. Can you walk me through both?", sentiment: 'neu' as const },
  { ts: '10:03:40', speaker: 'agent'    as const, text: "Absolutely. At 5.25% fixed you'd owe $3,937 annually. At 4.75% variable it's lower now but can fluctuate.", sentiment: 'pos' as const },
  { ts: '10:04:11', speaker: 'customer' as const, text: "And my death benefit and cash value after the loan?", sentiment: 'neu' as const },
  { ts: '10:04:28', speaker: 'agent'    as const, text: "After a $75K loan: net cash value would be $112,420, net death benefit $425,000. Assure processed eligibility — you're approved.", sentiment: 'pos' as const },
];

const SENTIMENT_CHIP: Record<string, { label: string; bg: string; color: string }> = {
  pos: { label: 'Positive', bg: BLOOM.greenPale, color: BLOOM.green },
  neu: { label: 'Neutral',  bg: '#f3f4f6',       color: BLOOM.textSecondary },
  neg: { label: 'Negative', bg: BLOOM.redPale,   color: BLOOM.red },
};

function TranscriptTab() {
  return (
    <Box>
      {/* LIVE header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.75 }}>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'text.secondary' }}>
          Live Transcript · Robert A. Chen
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.625 }}>
          <Box sx={{
            width: 7, height: 7, borderRadius: '50%', bgcolor: BLOOM.red,
            '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.25 } },
            animation: 'blink 1s ease infinite',
          }} />
          <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, color: BLOOM.red, textTransform: 'uppercase', letterSpacing: '1px' }}>LIVE</Typography>
        </Box>
      </Box>

      {/* Transcript lines */}
      <Paper sx={{ mb: 1.75 }}>
        {TRANSCRIPT_LINES.map((line, i) => {
          const isAgent = line.speaker === 'agent';
          const chip = SENTIMENT_CHIP[line.sentiment];
          return (
            <Box key={i} sx={{
              display: 'flex', gap: 1.25, px: 2, py: 1.125,
              borderBottom: i < TRANSCRIPT_LINES.length - 1 ? `1px solid ${BLOOM.canvas}` : 'none',
              bgcolor: i === TRANSCRIPT_LINES.length - 1 ? BLOOM.bluePale : 'transparent',
            }}>
              <Typography sx={{ fontSize: '0.5625rem', color: BLOOM.textSecondary, mt: '2px', minWidth: 48, fontVariantNumeric: 'tabular-nums' }}>{line.ts}</Typography>
              <Box sx={{ width: 32, height: 18, borderRadius: '3px', bgcolor: isAgent ? BLOOM.blue : BLOOM.orange, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 700, flexShrink: 0, mt: '1px' }}>
                {isAgent ? 'AGENT' : 'CUST'}
              </Box>
              <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.5, flex: 1 }}>{line.text}</Typography>
              <Chip label={chip.label} size="small" sx={{ height: 16, fontSize: '0.5rem', bgcolor: chip.bg, color: chip.color, fontWeight: 600, alignSelf: 'flex-start', mt: '2px', flexShrink: 0 }} />
            </Box>
          );
        })}
      </Paper>

      {/* AI Signal Detection */}
      <SectionCard title="AI Signal Detection" icon="🧠">
        {[
          { signal: 'Intent',              value: 'Policy Loan — New Request',  color: BLOOM.blue },
          { signal: 'Sentiment Trend',     value: 'Neutral → Positive',         color: BLOOM.green },
          { signal: 'Stress Indicators',   value: 'None detected',              color: BLOOM.textSecondary },
          { signal: 'Escalation Risk',     value: 'Low',                        color: BLOOM.green },
          { signal: 'STP Trigger',         value: 'Policy Loan auto-approved',  color: '#047857' },
          { signal: 'Cross-sell Signal',   value: 'Annuity — prior inquiry Aug 2025', color: BLOOM.orange },
        ].map(r => (
          <Box key={r.signal} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: `1px solid ${BLOOM.canvas}`, '&:last-child': { border: 'none' } }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>{r.signal}</Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: r.color }}>{r.value}</Typography>
          </Box>
        ))}
      </SectionCard>
    </Box>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel() {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, []);

  return (
    <Box sx={{ width: 360, borderLeft: `1px solid ${BLOOM.border}`, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${BLOOM.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'text.secondary' }}>
          💬 Live Chat — Robert Chen
        </Typography>
        <Box sx={{
          width: 7, height: 7, borderRadius: '50%', bgcolor: BLOOM.green,
          '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
          animation: 'blink 1.5s ease infinite',
        }} />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.75, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ textAlign: 'center', fontSize: '0.625rem', color: BLOOM.textSecondary, py: 0.5, display: 'flex', alignItems: 'center', gap: 1, '&::before,&::after': { content: '""', flex: 1, height: '1px', bgcolor: BLOOM.border } }}>
          Chatbot session transferred
        </Box>

        {chatMessages.map((msg, i) => {
          const isAgent    = msg.from === 'agent';
          const isCustomer = msg.from === 'customer';
          const isBot      = msg.from === 'bot';
          const avatarBg   = isAgent ? BLOOM.blue : isCustomer ? BLOOM.orange : BLOOM.textSecondary;
          const bubbleBg   = isAgent ? BLOOM.blue : isBot ? BLOOM.bluePale : BLOOM.canvas;
          const bubbleBorder = isBot ? `1px solid #93bbfd` : isCustomer ? `1px solid ${BLOOM.border}` : 'none';
          const bubbleColor  = isAgent ? '#fff' : 'text.primary';

          return (
            <Box key={i} sx={{ display: 'flex', gap: 0.75, maxWidth: '88%', alignSelf: isAgent ? 'flex-end' : 'flex-start', flexDirection: isAgent ? 'row-reverse' : 'row' }}>
              <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 700, flexShrink: 0 }}>
                {msg.init}
              </Box>
              <Box sx={{ p: '8px 12px', borderRadius: '8px', bgcolor: bubbleBg, border: bubbleBorder, fontSize: '0.75rem', lineHeight: 1.5, color: bubbleColor }}>
                {msg.text}
              </Box>
            </Box>
          );
        })}
        <div ref={endRef} />
      </Box>

      <Box sx={{ p: 1.5, borderTop: `1px solid ${BLOOM.border}`, display: 'flex', gap: 1 }}>
        <Box
          component="input"
          placeholder="Type a message..."
          sx={{ flex: 1, border: `1px solid ${BLOOM.border}`, borderRadius: '6px', p: '8px 12px', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', outline: 'none', '&:focus': { borderColor: BLOOM.blue } }}
        />
        <Button variant="contained" size="small" disableElevation sx={{ px: 2 }}>Send</Button>
      </Box>
    </Box>
  );
}

// ─── Workspace ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'current',    label: '🧠 Current'    },
  { id: 'transcript', label: '🎙 Transcript' },
  { id: 'policy',     label: '📄 Policy'     },
  { id: 'history',    label: '🕐 History'    },
  { id: 'insights',   label: '📊 Insights'   },
] as const;
type TabId = typeof TABS[number]['id'];

function Workspace({ persona, onPersonaSwitch }: { persona: Persona; onPersonaSwitch: (p: Persona) => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('current');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const channelBadge = persona === 'phone' ? 'IVR → Agent' : 'Chatbot → Agent Chat';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Banner */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${BLOOM.border}`, px: 3, py: 1.375, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {[
            { label: 'Policy',  value: '440387261UL' },
            { label: 'Owner',   value: 'Robert A. Chen' },
            { label: 'Product', value: 'Universal Life — $500K' },
          ].map(f => (
            <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>{f.label}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{f.value}</Typography>
            </Box>
          ))}
          <Chip label="Active" size="small" sx={{ height: 20, fontSize: '0.6875rem', bgcolor: BLOOM.greenPale, color: BLOOM.green, border: '1px solid #c5e3bc' }} />
          <Chip label="✓ Authenticated" size="small" sx={{ height: 20, fontSize: '0.6875rem', bgcolor: BLOOM.greenPale, color: BLOOM.green, border: '1px solid #c5e3bc' }} />
          <Chip label={channelBadge} size="small" sx={{ height: 20, fontSize: '0.6875rem', bgcolor: '#eef2f7', color: '#475569', border: '1px solid #d5dce6' }} />
          <Chip label="Conversation Manager" size="small" sx={{ height: 20, fontSize: '0.5625rem', bgcolor: BLOOM.bluePale, color: BLOOM.blue, border: '1px solid #93bbfd', fontWeight: 700 }} />
          <Chip label="⚡ Assure Orchestration" size="small" sx={{ height: 20, fontSize: '0.5625rem', bgcolor: '#f5f3ff', color: '#6d28d9', border: '1px solid #c4b5fd', fontWeight: 700 }} />

          {/* Persona toggle */}
          <Box sx={{ display: 'flex', gap: 0.25, bgcolor: BLOOM.canvas, borderRadius: '6px', p: '2px', ml: 0.5 }}>
            {(['phone', 'chat'] as Persona[]).map(p => (
              <Box
                key={p}
                component="button"
                onClick={() => onPersonaSwitch(p)}
                sx={{
                  px: 1.75, py: 0.5, borderRadius: '4px', fontSize: '0.6875rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                  bgcolor: persona === p ? BLOOM.blue : 'transparent',
                  color: persona === p ? '#fff' : 'text.secondary',
                }}
              >
                {p === 'phone' ? '📞 Phone' : '💬 Chat'}
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '0.875rem', color: BLOOM.blue, bgcolor: BLOOM.bluePale, px: 1.5, py: 0.5, borderRadius: '6px', flexShrink: 0 }}>
          {formatTime(seconds)}
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ display: 'flex', borderBottom: `2px solid ${BLOOM.border}`, px: 3, bgcolor: 'background.paper', flexShrink: 0 }}>
        {TABS.map(t => (
          <Box
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            sx={{
              px: 2.25, py: 1.25, fontSize: '0.75rem',
              fontWeight: activeTab === t.id ? 600 : 500,
              color: activeTab === t.id ? BLOOM.blue : 'text.secondary',
              borderBottom: `2px solid ${activeTab === t.id ? BLOOM.blue : 'transparent'}`,
              mb: '-2px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
              '&:hover': { color: 'text.primary' },
            }}
          >
            {t.label}
          </Box>
        ))}
      </Box>

      {/* Content + Chat panel */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5, pb: 5 }}>
          {activeTab === 'current'    && <CurrentTab key={persona} persona={persona} />}
          {activeTab === 'transcript' && <TranscriptTab />}
          {activeTab === 'policy'     && <PolicyTab />}
          {activeTab === 'history'    && <HistoryTab />}
          {activeTab === 'insights'   && <InsightsTab />}
        </Box>

        {persona === 'chat' && <ChatPanel />}
      </Box>

      <Box sx={{ px: 3, py: 1.125, textAlign: 'center', fontSize: '0.625rem', color: BLOOM.textSecondary, borderTop: `1px solid ${BLOOM.border}`, bgcolor: 'background.paper', flexShrink: 0 }}>
        © 2026 Bloom Insurance · Conversation Manager · Powered by Assure Orchestration
      </Box>
    </Box>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function AgentDesktop() {
  const [screen, setScreen] = useState<'incoming' | 'workspace'>('incoming');
  const [persona, setPersona] = useState<Persona>('phone');

  const handleAccept = (p: Persona) => {
    setPersona(p);
    setScreen('workspace');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {screen === 'incoming' && <IncomingScreen onAccept={handleAccept} />}
      {screen === 'workspace' && <Workspace persona={persona} onPersonaSwitch={setPersona} />}
    </Box>
  );
}
