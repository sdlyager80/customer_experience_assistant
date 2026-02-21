import { useState } from 'react';
import { Box, Typography, Paper, Button, Avatar, InputBase } from '@mui/material';
import { BLOOM } from '../../theme';
import {
  CASES, ACTIVITY_FEED, CAMPAIGN_BARS,
  type OutreachCase, type CasePriority, type CampaignType,
} from './data';

// ── Config maps ───────────────────────────────────────────────────────────────

// Priority uses a single clear signal per level — no rainbow of equal-weight colours.
// Urgent = Red (style guide secondary), High = Blue (brand primary),
// Medium = Light Green (brand primary), Low = Grey (neutral).
const PRIORITY_CFG: Record<CasePriority, {
  label: string; groupBg: string; groupBorder: string; dot: string;
  pillBg: string; pillColor: string;
}> = {
  urgent: { label: 'Urgent', groupBg: BLOOM.redPale,   groupBorder: '#f5c6c6', dot: BLOOM.red,       pillBg: BLOOM.red,       pillColor: '#fff'          },
  high:   { label: 'High',   groupBg: BLOOM.bluePale,  groupBorder: '#b8d9f0', dot: BLOOM.blue,      pillBg: BLOOM.blue,      pillColor: '#fff'          },
  medium: { label: 'Medium', groupBg: BLOOM.greenPale, groupBorder: '#c5e3bc', dot: BLOOM.lightGreen, pillBg: BLOOM.lightGreen, pillColor: '#fff'         },
  low:    { label: 'Low',    groupBg: BLOOM.canvas,    groupBorder: BLOOM.border, dot: BLOOM.grey,   pillBg: BLOOM.canvas,    pillColor: BLOOM.textSecondary },
};

// Campaign type colours — all use official brand palette; lifeevent uses Orange not amber.
const CAMPAIGN_TYPE_COLOR: Record<CampaignType, { bg: string; color: string }> = {
  retention:  { bg: BLOOM.redPale,    color: BLOOM.red       },
  compliance: { bg: BLOOM.bluePale,   color: BLOOM.blue      },
  growth:     { bg: BLOOM.greenPale,  color: BLOOM.green     },
  lifeevent:  { bg: BLOOM.orangePale, color: BLOOM.orange    },
};

// Status — in-progress uses Blue (active/interactive) rather than amber.
const STATUS_CFG: Record<string, { bg: string; color: string; label: string }> = {
  'new':         { bg: BLOOM.bluePale,  color: BLOOM.blue,  label: 'New'         },
  'in-progress': { bg: BLOOM.bluePale,  color: BLOOM.blue,  label: 'In Progress' },
  'actioned':    { bg: BLOOM.greenPale, color: BLOOM.green, label: 'Actioned'    },
  'converted':   { bg: BLOOM.greenPale, color: BLOOM.green, label: 'Converted'   },
};

const PRIORITY_ORDER: CasePriority[] = ['urgent', 'high', 'medium', 'low'];

// ── Shared micro-components ───────────────────────────────────────────────────

function Pill({ bgcolor, color, children }: { bgcolor: string; color: string; children: React.ReactNode }) {
  return (
    <Box component="span" sx={{
      display: 'inline-flex', px: 0.875, py: 0.25, borderRadius: '999px',
      fontSize: '0.5625rem', fontWeight: 700, bgcolor, color, lineHeight: 1.6,
    }}>
      {children}
    </Box>
  );
}

function CampaignTag({ type, label }: { type: CampaignType; label: string }) {
  const { bg, color } = CAMPAIGN_TYPE_COLOR[type];
  return (
    <Box component="span" sx={{
      display: 'inline-flex', px: 0.75, py: 0.125, borderRadius: '4px',
      fontSize: '0.5625rem', fontWeight: 700, bgcolor: bg, color,
    }}>
      {label}
    </Box>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.375 }}>
        <Typography sx={{ fontSize: '0.5625rem', fontWeight: 600, color: 'text.secondary' }}>{label}</Typography>
        <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, color }}>{score}</Typography>
      </Box>
      <Box sx={{ height: 4, bgcolor: BLOOM.canvas, borderRadius: 10, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${score}%`, bgcolor: color, borderRadius: 10 }} />
      </Box>
    </Box>
  );
}

// ── KPI Bar ───────────────────────────────────────────────────────────────────

function KPIBar() {
  const stats = [
    { value: '48,210', label: 'Policies Monitored', sub: undefined,       color: BLOOM.blue   },
    { value: '23',     label: 'Open Cases',          sub: '4 Urgent',      color: BLOOM.red    },
    { value: '142',    label: 'Auto-Actioned (30d)', sub: undefined,       color: BLOOM.orange },
    { value: '$2.4M',  label: 'Premium Retained',    sub: 'This month',    color: BLOOM.green  },
  ];
  return (
    <Box sx={{
      px: 3, py: 1.25, bgcolor: 'background.paper',
      borderBottom: `1px solid ${BLOOM.border}`,
      display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
    }}>
      {stats.map((s) => (
        <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, color: 'text.primary' }}>
            {s.value}
          </Typography>
          <Box>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'text.secondary', lineHeight: 1.3 }}>
              {s.label}
            </Typography>
            {s.sub && (
              <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, color: BLOOM.red, lineHeight: 1.3 }}>
                {s.sub}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
      <Box sx={{ flex: 1 }} />
      <Button variant="outlined" size="small" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
        + Manual Case
      </Button>
    </Box>
  );
}

// ── Work Queue (left panel) ───────────────────────────────────────────────────

type QueueFilter = CasePriority | 'all';

const QUEUE_FILTERS: { key: QueueFilter; label: string }[] = [
  { key: 'all',    label: 'All (23)'     },
  { key: 'urgent', label: '🔴 Urgent (4)' },
  { key: 'high',   label: '🔵 High (7)'   },
  { key: 'medium', label: '🟢 Med (8)'    },
  { key: 'low',    label: '⚪ Low (4)'    },
];

function WorkQueue({
  selectedId, onSelect, filter, onFilterChange,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  filter: QueueFilter;
  onFilterChange: (f: QueueFilter) => void;
}) {
  const visible = filter === 'all' ? CASES : CASES.filter(c => c.priority === filter);
  const grouped = PRIORITY_ORDER.reduce<Partial<Record<CasePriority, OutreachCase[]>>>((acc, p) => {
    const items = visible.filter(c => c.priority === p);
    if (items.length) acc[p] = items;
    return acc;
  }, {});

  return (
    <Box sx={{
      width: 296, flexShrink: 0,
      bgcolor: 'background.paper',
      borderRight: `1px solid ${BLOOM.border}`,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Filter chips */}
      <Box sx={{
        px: 1.5, py: 1.125,
        borderBottom: `1px solid ${BLOOM.border}`,
        display: 'flex', gap: 0.5, flexWrap: 'wrap', flexShrink: 0,
      }}>
        {QUEUE_FILTERS.map(f => (
          <Box
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            sx={{
              px: 0.875, py: 0.375, borderRadius: '999px',
              fontSize: '0.5625rem', fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${filter === f.key ? BLOOM.blue : BLOOM.border}`,
              bgcolor: filter === f.key ? BLOOM.blue : 'transparent',
              color: filter === f.key ? '#fff' : 'text.secondary',
              transition: 'all 0.12s',
              '&:hover': filter !== f.key ? { borderColor: BLOOM.blue, color: BLOOM.blue } : {},
            }}
          >
            {f.label}
          </Box>
        ))}
      </Box>

      {/* Grouped case list */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {PRIORITY_ORDER.map(p => {
          const items = grouped[p];
          if (!items) return null;
          const cfg = PRIORITY_CFG[p];
          return (
            <Box key={p}>
              {/* Group header */}
              <Box sx={{
                px: 1.5, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.875,
                bgcolor: cfg.groupBg, borderBottom: `1px solid ${cfg.groupBorder}`,
                position: 'sticky', top: 0, zIndex: 1,
              }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: cfg.dot, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: cfg.dot }}>
                  {cfg.label} — {items.length}
                </Typography>
              </Box>

              {/* Case rows */}
              {items.map(c => {
                const isSelected = selectedId === c.id;
                return (
                  <Box
                    key={c.id}
                    onClick={() => onSelect(c.id)}
                    sx={{
                      px: 1.5, py: 1.125, cursor: 'pointer',
                      borderBottom: `1px solid ${BLOOM.canvas}`,
                      borderLeft: `3px solid ${isSelected ? BLOOM.blue : 'transparent'}`,
                      bgcolor: isSelected ? BLOOM.bluePale : 'transparent',
                      transition: 'all 0.12s',
                      '&:hover': !isSelected ? { bgcolor: BLOOM.canvas, borderLeftColor: BLOOM.border } : {},
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Avatar sx={{
                        width: 26, height: 26, flexShrink: 0,
                        bgcolor: isSelected ? BLOOM.blue : BLOOM.canvas,
                        color: isSelected ? '#fff' : BLOOM.textSecondary,
                        fontSize: '0.5rem', fontWeight: 700,
                      }}>
                        {c.initials}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.customer}
                          </Typography>
                          <Typography sx={{ fontSize: '0.5rem', color: 'text.secondary', flexShrink: 0, ml: 0.5 }}>{c.ageLabel}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary', mb: 0.5 }}>
                          {c.id} · {c.policy}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.375, flexWrap: 'wrap', alignItems: 'center' }}>
                          <CampaignTag type={c.campaignType} label={c.campaign} />
                          <Pill bgcolor={STATUS_CFG[c.status].bg} color={STATUS_CFG[c.status].color}>
                            {STATUS_CFG[c.status].label}
                          </Pill>
                          {c.churnScore >= 70 && (
                            <Pill bgcolor={BLOOM.redPale} color={BLOOM.red}>
                              🔥 {c.churnScore}
                            </Pill>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// ── Case Action Panel (center) ────────────────────────────────────────────────

type CenterTab = 'brief' | 'compose' | 'profile';

const SERVICE_CASE_REF = 'SVC-2025-001234';

function CaseActionPanel({ activeCase }: { activeCase: OutreachCase | null }) {
  const [tab, setTab] = useState<CenterTab>('brief');
  const [caseCreated, setCaseCreated] = useState(false);

  if (!activeCase) {
    return (
      <Box sx={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 1.5, color: 'text.secondary', bgcolor: BLOOM.canvas,
      }}>
        <Typography sx={{ fontSize: '2.5rem', lineHeight: 1 }}>📋</Typography>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600 }}>Select a case to begin</Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', textAlign: 'center', maxWidth: 320 }}>
          Choose a case from the work queue to see AI context, recommended actions, and a pre-drafted communication.
        </Typography>
      </Box>
    );
  }

  const c = activeCase;
  // Three-state scoring: good = green, watch = orange, critical = red.
  // Avoids the multi-colour "traffic light + amber + yellow" rainbow.
  const healthColor = c.healthScore > 50 ? BLOOM.green : c.healthScore > 25 ? BLOOM.orange : BLOOM.red;
  const churnColor  = c.churnScore  > 65 ? BLOOM.red   : c.churnScore  > 35 ? BLOOM.orange : BLOOM.green;
  const priCfg = PRIORITY_CFG[c.priority];
  const statusCfg = STATUS_CFG[c.status];

  const TABS: { key: CenterTab; label: string }[] = [
    { key: 'brief',   label: '🧠 AI Brief'  },
    { key: 'compose', label: '📨 Compose'   },
    { key: 'profile', label: '👤 Profile'   },
  ];

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: BLOOM.canvas }}>

      {/* Case header */}
      <Box sx={{ px: 3, pt: 2, pb: 0, bgcolor: 'background.paper', borderBottom: `1px solid ${BLOOM.border}`, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 38, height: 38, bgcolor: BLOOM.blue, fontWeight: 700, fontSize: '0.8125rem' }}>
              {c.initials}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.25 }}>{c.customer}</Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>
                {c.id} · {c.product} · {c.policy}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0, pt: 0.25 }}>
            <Pill bgcolor={priCfg.pillBg} color={priCfg.pillColor}>{priCfg.label}</Pill>
            <Pill bgcolor={statusCfg.bg} color={statusCfg.color}>{statusCfg.label}</Pill>
            <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>
              {c.assigned !== 'Unassigned' ? c.assigned : 'Unassigned'}
            </Typography>
          </Box>
        </Box>

        {/* Score bars + campaign */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.25 }}>
          <ScoreBar label="Health" score={c.healthScore} color={healthColor} />
          <ScoreBar label="Churn Risk" score={c.churnScore} color={churnColor} />
          <CampaignTag type={c.campaignType} label={c.campaign} />
        </Box>

        {/* Auto-actioned banner */}
        {c.autoActioned && (
          <Box sx={{
            mb: 1.25, px: 1.25, py: 0.625, borderRadius: '6px',
            bgcolor: BLOOM.greenPale, border: '1px solid #c5e3bc',
            display: 'flex', alignItems: 'center', gap: 0.75,
          }}>
            <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: BLOOM.green }}>Auto</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: BLOOM.green }}>{c.autoActioned}</Typography>
          </Box>
        )}

        {/* Case created success banner */}
        {caseCreated && (
          <Box sx={{
            mb: 1.25, px: 1.5, py: 1, borderRadius: '8px',
            bgcolor: BLOOM.greenPale, border: '1px solid #c5e3bc',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.375 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: BLOOM.green }}>
                  ✓ Service Case Created
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: BLOOM.green }}>{SERVICE_CASE_REF}</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary' }}>Just now</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.6875rem', color: '#334155', lineHeight: 1.5 }}>
              Customer profile, policy details &amp; AI context transferred to ServiceNow portal · Assigned to Retention Queue
            </Typography>
            <Box sx={{ mt: 0.75, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {[
                { label: `Policy: ${c.policy}`, color: BLOOM.blue, bg: BLOOM.bluePale },
                { label: `Campaign: ${c.campaign}`, color: BLOOM.orange, bg: BLOOM.orangePale },
                { label: `Churn: ${c.churnScore}`, color: BLOOM.red, bg: BLOOM.redPale },
                { label: `Channel: ${c.channel}`, color: BLOOM.textSecondary, bg: BLOOM.canvas },
              ].map(tag => (
                <Box key={tag.label} component="span" sx={{
                  px: 0.875, py: 0.25, borderRadius: '4px', fontSize: '0.5625rem',
                  fontWeight: 600, bgcolor: tag.bg, color: tag.color,
                }}>{tag.label}</Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 0.875, mb: 1.5, flexWrap: 'wrap' }}>
          <Button variant="contained" size="small" disableElevation sx={{ fontWeight: 600 }}>📞 Schedule Call</Button>
          <Button variant="outlined" size="small" sx={{ fontWeight: 600 }}>📧 Send Email</Button>
          <Button variant="outlined" size="small" sx={{ fontWeight: 600 }}>📱 Send SMS</Button>
          <Button variant="outlined" size="small" sx={{ fontWeight: 600 }}>📎 Attach Form</Button>
          <Box sx={{ flex: 1 }} />
          {!caseCreated ? (
            <Button
              size="small"
              onClick={() => setCaseCreated(true)}
              sx={{
                fontWeight: 600, color: BLOOM.blue,
                border: `1px solid ${BLOOM.blue}`,
                '&:hover': { bgcolor: BLOOM.bluePale },
              }}
            >
              📋 Create Service Case
            </Button>
          ) : (
            <Button
              size="small"
              disabled
              sx={{ fontWeight: 600, color: `${BLOOM.green} !important`, border: '1px solid #c5e3bc' }}
            >
              ✓ {SERVICE_CASE_REF}
            </Button>
          )}
          <Button size="small" sx={{ fontWeight: 600, color: BLOOM.green, border: '1px solid #c5e3bc' }}>
            ✓ Close Case
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ display: 'flex', gap: 0, mt: 0.5, mb: '-1px' }}>
          {TABS.map(t => (
            <Box
              key={t.key}
              onClick={() => setTab(t.key)}
              sx={{
                px: 2, py: 1, fontSize: '0.75rem',
                fontWeight: tab === t.key ? 600 : 500,
                color: tab === t.key ? BLOOM.blue : 'text.secondary',
                borderBottom: `2px solid ${tab === t.key ? BLOOM.blue : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.12s',
                '&:hover': tab !== t.key ? { color: 'text.primary' } : {},
              }}
            >
              {t.label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Tab content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>

        {tab === 'brief' && (
          <>
            {/* AI Context — Blue tinted, consistent with primary brand */}
            <Paper sx={{
              p: 2, mb: 1.5,
              background: `linear-gradient(135deg, ${BLOOM.bluePale}, #fff)`,
              border: `1px solid #b8d9f0`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875, mb: 0.875 }}>
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%', bgcolor: BLOOM.blue,
                  boxShadow: `0 0 0 3px ${BLOOM.bluePale}`,
                  '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
                  animation: 'blink 2s ease-in-out infinite',
                }} />
                <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: BLOOM.blue }}>
                  AI Context
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.8125rem', lineHeight: 1.7, color: BLOOM.textPrimary }}>{c.context}</Typography>
            </Paper>

            {/* Recommended Action — Orange accent (style guide: single warm emphasis) */}
            <Paper sx={{
              p: 2, mb: 1.5,
              background: `linear-gradient(135deg, ${BLOOM.orangePale}, #fff)`,
              border: `1px solid #f5cfa0`,
            }}>
              <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: BLOOM.orange, mb: 0.875 }}>
                🎯 Recommended Action
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', lineHeight: 1.7 }}>{c.recommendation}</Typography>
              <Box sx={{
                mt: 1.25, display: 'inline-flex', alignItems: 'center', gap: 0.75,
                px: 1.25, py: 0.5, bgcolor: BLOOM.bluePale, borderRadius: '6px',
              }}>
                <Typography sx={{ fontSize: '0.875rem', lineHeight: 1 }}>{c.channelIcon}</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: BLOOM.blue }}>
                  Recommended: {c.channel}
                </Typography>
              </Box>
            </Paper>
          </>
        )}

        {tab === 'compose' && (
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            {/* Composer header */}
            <Box sx={{ px: 2, py: 1.375, bgcolor: BLOOM.canvas, borderBottom: `1px solid ${BLOOM.border}` }}>
              <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'text.secondary', mb: 1 }}>
                Draft Communication
              </Typography>
              {[
                { label: 'From', value: 'Sarah Mitchell · Bloom Insurance' },
                { label: 'To',   value: c.customer                         },
                { label: 'Via',  value: c.channel                          },
              ].map(row => (
                <Box key={row.label} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', minWidth: 30 }}>{row.label}:</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.value}</Typography>
                </Box>
              ))}
            </Box>

            {/* Editable message body */}
            <Box sx={{ p: 2 }}>
              <InputBase
                multiline
                minRows={7}
                defaultValue={c.draft}
                sx={{ width: '100%', fontSize: '0.8125rem', lineHeight: 1.7, alignItems: 'flex-start' }}
              />
            </Box>

            {/* Composer footer */}
            <Box sx={{
              px: 2, py: 1.25, borderTop: `1px solid ${BLOOM.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontStyle: 'italic' }}>
                AI-generated · Review before sending
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" size="small" sx={{ fontWeight: 600 }}>Save Draft</Button>
                <Button variant="contained" size="small" disableElevation sx={{ fontWeight: 600 }}>Send</Button>
              </Box>
            </Box>
          </Paper>
        )}

        {tab === 'profile' && (
          <>
            <Paper sx={{ p: 2, mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'text.secondary', mb: 1 }}>
                Case Details
              </Typography>
              {[
                { label: 'Customer',  value: c.customer  },
                { label: 'Policy',    value: c.policy    },
                { label: 'Product',   value: c.product   },
                { label: 'Campaign',  value: c.campaign  },
                { label: 'Assigned',  value: c.assigned  },
                { label: 'Age',       value: c.ageLabel  },
              ].map(row => (
                <Box key={row.label} sx={{
                  display: 'flex', justifyContent: 'space-between', py: 0.5,
                  borderBottom: `1px solid ${BLOOM.canvas}`, '&:last-child': { border: 'none' },
                }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontWeight: 500 }}>{row.label}</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{row.value}</Typography>
                </Box>
              ))}
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'text.secondary', mb: 1.5 }}>
                Risk Scores
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                <ScoreBar label="Customer Health" score={c.healthScore} color={healthColor} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 1.25 }}>
                <ScoreBar label="Churn Risk" score={c.churnScore} color={churnColor} />
              </Box>
              <Box sx={{ p: 1.25, bgcolor: BLOOM.canvas, borderRadius: '6px' }}>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.6 }}>
                  {c.churnScore > 70
                    ? '⚠ High churn risk — immediate personal outreach recommended.'
                    : c.churnScore > 50
                    ? '⚡ Moderate risk — timely outreach advised within 48 hours.'
                    : '✓ Low churn risk — routine case management applies.'}
                </Typography>
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
}

// ── Activity Panel (right) ────────────────────────────────────────────────────

const CAMP_TYPE_COLOR_LINE: Record<CampaignType, string> = {
  retention:  BLOOM.red,
  compliance: BLOOM.blue,
  growth:     BLOOM.green,
  lifeevent:  BLOOM.orange,
};

function ActivityPanel() {
  return (
    <Box sx={{
      width: 288, flexShrink: 0,
      bgcolor: 'background.paper',
      borderLeft: `1px solid ${BLOOM.border}`,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Auto-actions feed */}
      <Box sx={{ px: 2, pt: 1.75, pb: 1.5, borderBottom: `1px solid ${BLOOM.border}`, flexShrink: 0 }}>
        <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'text.secondary', mb: 1.125 }}>
          ⚡ Recent Auto-Actions
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {ACTIVITY_FEED.map((ev, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: ev.dotColor, mt: 0.5, flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                  <Box component="span" sx={{ fontWeight: 600 }}>{ev.campaign}</Box>
                  {' — '}{ev.customer}
                </Typography>
                <Typography sx={{ fontSize: '0.5625rem', color: 'text.secondary', mt: 0.125, lineHeight: 1.4 }}>
                  {ev.detail} · {ev.timeLabel} ago
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Campaign performance */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 1.75, pb: 2 }}>
        <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'text.secondary', mb: 1.25 }}>
          📊 Campaign Performance
        </Typography>
        {CAMPAIGN_BARS.map(cb => (
          <Box key={cb.name} sx={{ mb: 1.25 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.375 }}>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, mr: 0.5 }}>
                {cb.name}
              </Typography>
              <Typography sx={{
                fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
                color: cb.convRate > 70 ? BLOOM.green : cb.convRate > 40 ? BLOOM.orange : BLOOM.red,
              }}>
                {cb.convRate}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', height: 4, borderRadius: '3px', overflow: 'hidden' }}>
              <Box sx={{ width: `${cb.convRate}%`, bgcolor: CAMP_TYPE_COLOR_LINE[cb.type] }} />
              <Box sx={{ flex: 1, bgcolor: BLOOM.canvas }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.375 }}>
              <Typography sx={{ fontSize: '0.5rem', color: 'text.secondary' }}>{cb.matched.toLocaleString()} matched</Typography>
              <Typography sx={{ fontSize: '0.5rem', color: 'text.secondary' }}>{cb.cases} cases</Typography>
            </Box>
          </Box>
        ))}

        {/* Portfolio health bar */}
        <Box sx={{ mt: 0.75, p: 1.5, bgcolor: BLOOM.canvas, borderRadius: '8px' }}>
          <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'text.secondary', mb: 1 }}>
            Portfolio Health
          </Typography>
          <Box sx={{ height: 8, borderRadius: '4px', overflow: 'hidden', display: 'flex', gap: '1px', mb: 1 }}>
            <Box sx={{ width: '62%', bgcolor: BLOOM.green }} />
            <Box sx={{ width: '21%', bgcolor: BLOOM.yellow }} />
            <Box sx={{ width: '12%', bgcolor: BLOOM.orange }} />
            <Box sx={{ width: '5%',  bgcolor: BLOOM.red }} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.375 }}>
            {[
              { dot: BLOOM.green,  label: 'Healthy',  count: '29,890' },
              { dot: BLOOM.yellow, label: 'Watch',    count: '10,124' },
              { dot: BLOOM.orange, label: 'At-Risk',  count: '5,785'  },
              { dot: BLOOM.red,    label: 'Critical', count: '2,411'  },
            ].map(s => (
              <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: s.dot, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.5rem', color: 'text.secondary' }}>
                  <strong>{s.count}</strong> {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function LifecycleOutreach() {
  const [selectedId, setSelectedId] = useState<string | null>('CS-4401');
  const [filter, setFilter] = useState<QueueFilter>('all');

  const activeCase = selectedId ? (CASES.find(c => c.id === selectedId) ?? null) : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <KPIBar />
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <WorkQueue
          selectedId={selectedId}
          onSelect={setSelectedId}
          filter={filter}
          onFilterChange={setFilter}
        />
        <CaseActionPanel key={selectedId} activeCase={activeCase} />
        <ActivityPanel />
      </Box>
    </Box>
  );
}
