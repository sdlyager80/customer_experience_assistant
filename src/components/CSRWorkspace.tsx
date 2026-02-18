import { useState } from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PhoneCallbackOutlinedIcon from '@mui/icons-material/PhoneCallbackOutlined';
import { BLOOM } from '../theme';
import { SCENARIO_CSR, type ScenarioId, type ActivityItem } from '../data/scenarios';

const BADGE_STYLES: Record<string, { bgcolor: string; color: string }> = {
  positive: { bgcolor: BLOOM.greenPale, color: BLOOM.green },
  negative: { bgcolor: BLOOM.redPale, color: BLOOM.red },
  cautionary: { bgcolor: BLOOM.yellowPale, color: BLOOM.amber },
  info: { bgcolor: BLOOM.bluePale, color: BLOOM.blue },
  neutral: { bgcolor: BLOOM.canvas, color: BLOOM.textSecondary },
};

const STATUS_STYLES: Record<string, { bgcolor: string; color: string }> = {
  positive: { bgcolor: BLOOM.greenPale, color: BLOOM.green },
  negative: { bgcolor: BLOOM.redPale, color: BLOOM.red },
  cautionary: { bgcolor: BLOOM.yellowPale, color: BLOOM.amber },
  info: { bgcolor: BLOOM.bluePale, color: BLOOM.blue },
  neutral: { bgcolor: BLOOM.canvas, color: BLOOM.textSecondary },
};

function DataRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: `1px solid ${BLOOM.canvas}`, '&:last-child': { border: 'none' } }}>
      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontWeight: 500 }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: valueColor || 'text.primary' }}>{value}</Typography>
    </Box>
  );
}

function WidgetCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1.5 }}>{title}</Typography>
      {children}
    </Paper>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const badge = BADGE_STYLES[item.badgeColor] || BADGE_STYLES.neutral;
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
      <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: item.iconBg, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
        {item.icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.3 }}>{item.title}</Typography>
        <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', mt: 0.25 }}>{item.timestamp}</Typography>
      </Box>
      <Chip label={item.badge} size="small" sx={{ height: 20, fontSize: '0.625rem', ...badge, flexShrink: 0 }} />
    </Box>
  );
}

interface CSRWorkspaceProps {
  activeScenario: ScenarioId;
  callTime: string;
}

const CSR_TABS = ['Policy', 'Billing', 'Claims', 'Values', 'Notes', 'History'];

export default function CSRWorkspace({ activeScenario, callTime }: CSRWorkspaceProps) {
  const [activeTab, setActiveTab] = useState(0);
  const data = SCENARIO_CSR[activeScenario];

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'background.default' }}>

      {/* Call banner */}
      <Box sx={{
        bgcolor: '#f9fafb', borderBottom: `1px solid ${BLOOM.border}`,
        px: 3, py: 1.375,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: '0.8125rem', flexWrap: 'wrap', gap: 1, flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
          {data.banner.fields.map((f) => (
            <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>{f.label}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{f.value}</Typography>
            </Box>
          ))}
          {data.banner.authBadge && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: BLOOM.greenPale, border: `1px solid ${BLOOM.greenBorder}`, px: 1.25, py: 0.375, borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 600, color: BLOOM.green }}>
              ✓ {data.banner.authBadge}
            </Box>
          )}
          {data.banner.channelBadge && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.375, borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 600, bgcolor: '#eef2f7', border: '1px solid #d5dce6', color: '#475569' }}>
              {data.banner.channelBadge}
            </Box>
          )}
        </Box>
        <Box sx={{
          fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '0.875rem',
          color: BLOOM.blue, bgcolor: BLOOM.bluePale, px: 1.5, py: 0.5, borderRadius: '6px',
          flexShrink: 0,
        }}>
          {callTime}
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Tabs */}
        <Box sx={{ display: 'flex', gap: 0.25, borderBottom: `2px solid ${BLOOM.border}`, px: 3, flexShrink: 0, overflowX: 'auto' }}>
          {CSR_TABS.map((t, i) => (
            <Box
              key={t}
              onClick={() => setActiveTab(i)}
              sx={{
                px: 2, py: 1.25, fontSize: '0.75rem', fontWeight: activeTab === i ? 600 : 500,
                color: activeTab === i ? BLOOM.blue : 'text.secondary',
                borderBottom: `2px solid ${activeTab === i ? BLOOM.blue : 'transparent'}`,
                mb: '-2px', cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                '&:hover': { color: 'text.primary' },
              }}
            >
              {t}
            </Box>
          ))}
        </Box>

        {/* Tab content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {activeTab === 0 && (
            <>
              {/* Top widget grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <WidgetCard title="Policy Details">
                  <DataRow label="Policy" value={data.policy.policyNumber} />
                  <DataRow label="Product" value={data.policy.product} />
                  <DataRow label="Status" value={data.policy.status} valueColor={data.policy.status === 'Active' ? BLOOM.green : undefined} />
                  <DataRow label="Issue Date" value={data.policy.issueDate} />
                  <DataRow label="State" value={data.policy.state} />
                </WidgetCard>

                <WidgetCard title="Billing">
                  <DataRow label="Paid To" value={data.billing.paidTo} />
                  <DataRow label="Method" value={data.billing.method} />
                  <DataRow label="Frequency" value={data.billing.frequency} />
                  <DataRow label="Premium" value={data.billing.premium} />
                </WidgetCard>

                {data.claim && (
                  <WidgetCard title="Current Claim / Issue">
                    <DataRow label="Reference" value={data.claim.reference} />
                    <DataRow label="Type" value={data.claim.type} />
                    <DataRow label="Filed" value={data.claim.filed} />
                    <DataRow label="Status" value={
                      <Chip label={data.claim.status} size="small" sx={{ height: 20, fontSize: '0.625rem', ...STATUS_STYLES[data.claim.statusColor] }} />
                    } />
                  </WidgetCard>
                )}

                <WidgetCard title="Contact Summary">
                  <DataRow label="Contacts (30d)" value={data.contact.contacts30d} />
                  <DataRow label="Last Contact" value={data.contact.lastContact} />
                  <DataRow label="Channel" value={data.contact.channel} />
                  <DataRow label="Sentiment" value={data.contact.sentiment} valueColor={data.contact.sentimentColor === 'negative' ? BLOOM.red : data.contact.sentimentColor === 'positive' ? BLOOM.green : undefined} />
                </WidgetCard>
              </Box>

              {/* Quick Actions */}
              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'text.secondary', mb: 1.5 }}>Quick Actions</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button variant="contained" size="small" startIcon={<DescriptionOutlinedIcon />} disableElevation>View Claim</Button>
                  <Button variant="outlined" size="small" startIcon={<EmailOutlinedIcon />}>Send Update</Button>
                  <Button variant="outlined" size="small" startIcon={<ReportProblemOutlinedIcon />}>Escalate</Button>
                  <Button variant="text" size="small" startIcon={<AddOutlinedIcon />} sx={{ color: 'text.secondary', border: `1px solid ${BLOOM.border}` }}>Add Note</Button>
                  <Button variant="text" size="small" startIcon={<PhoneCallbackOutlinedIcon />} sx={{ color: 'text.secondary', border: `1px solid ${BLOOM.border}` }}>Schedule Callback</Button>
                </Box>
              </Box>

              {/* Bottom grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <WidgetCard title="Recent Activity">
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {data.activity.map((item, i) => <ActivityRow key={i} item={item} />)}
                  </Box>
                </WidgetCard>

                {data.coverages.length > 0 && (
                  <WidgetCard title="Coverage Summary">
                    {data.coverages.map((c) => <DataRow key={c.label} label={c.label} value={c.value} />)}
                    {data.coverageNote && (
                      <Box sx={{ mt: 1.5, p: 1, bgcolor: BLOOM.yellowPale, borderRadius: '6px', fontSize: '0.75rem', color: BLOOM.amber }}>
                        <strong>Note:</strong> {data.coverageNote}
                      </Box>
                    )}
                  </WidgetCard>
                )}
              </Box>
            </>
          )}

          {activeTab !== 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
              <Typography sx={{ fontSize: '0.875rem' }}>{CSR_TABS[activeTab]} content — select Policy tab for active interaction data.</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 3, py: 1.25, textAlign: 'center', fontSize: '0.6875rem', color: BLOOM.textTertiary, borderTop: `1px solid ${BLOOM.border}`, bgcolor: 'background.paper', flexShrink: 0 }}>
        © 2026 Bloom Insurance · Customer Engagement Assistant · AI-Powered Smart App
      </Box>
    </Box>
  );
}
