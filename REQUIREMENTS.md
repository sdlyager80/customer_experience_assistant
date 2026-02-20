# Customer Engagement Assistant — Requirements Document

**Project:** Bloom Insurance Customer Engagement Assistant
**Version:** 1.0
**Date:** February 2026
**Prepared by:** DXC Technology — Smart Apps Practice

---

## 1. Overview

The Customer Engagement Assistant is a React-based Smart App demonstration portal for Bloom Insurance, showcasing AI-powered customer engagement capabilities built on the Assure Orchestration platform. The portal is designed for use in sales demonstrations, internal training, and proof-of-concept presentations.

The application presents a multi-view insurance operations platform targeting three distinct user personas:

- **CSR (Customer Service Representative)** — Handles inbound calls, accepts queued contacts, and receives real-time AI guidance during customer interactions
- **Supervisor / Manager** — Monitors real-time engagement metrics, team performance, active conversations, and escalations across all channels
- **Lifecycle Outreach Analyst** — Manages proactive outreach campaigns, policy maturity signals, and life-event-driven retention workflows

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18 with TypeScript |
| Build Tool | Vite |
| UI Library | Material UI (MUI) v6 |
| Icons | @mui/icons-material |
| State Management | React `useState` / `useEffect` (local state) |
| Routing | View-state pattern (`useState<AppView>`) — no React Router |
| Deployment | Vercel (connected to GitHub) |
| Design System | Bloom Insurance brand tokens (custom `BLOOM` object) |

---

## 3. Design System

### 3.1 Bloom Brand Color Tokens (`BLOOM` object in `theme.ts`)

| Token | Hex | Usage |
|---|---|---|
| `blue` | `#1B75BB` | Primary brand color, CTAs, active states |
| `blueDark` | `#155A93` | Hover states, dark accents |
| `blueLight` | `#00ADEE` | Info channel, secondary actions |
| `bluePale` | `#e0f0fc` | Info backgrounds, selected states |
| `green` | `#37A526` | Success, positive sentiment, on-time |
| `lightGreen` | `#8BC53F` | Secondary success |
| `orange` | `#F6921E` | Warning, pending states, avatar |
| `yellow` | `#E8DE23` | Attention, CSAT stars |
| `red` / `redDark` | `#b91c1c` / `#D02E2E` | Errors, critical alerts, urgent |
| `canvas` | `#F2F7F6` | Page background, subtle fills |
| `border` | `#e0e5e4` | All dividers and borders |
| `textPrimary` | `#1a1a1a` | Body text |
| `textSecondary` | `#808285` | Secondary labels |
| `textTertiary` | `#a8aaad` | Timestamps, de-emphasized text |
| `amber` | `#946b0e` | In-review state, CSAT stars |

### 3.2 MUI Theme Configuration

- **Border radius:** 8px (global), 6px (buttons)
- **Typography:** Inter (primary), Roboto, Helvetica fallback
- **Paper:** elevation 0 by default; 1px `BLOOM.border` border on all Paper components
- **Buttons:** `textTransform: none`, `fontWeight: 600`
- **Tabs:** `textTransform: none`, `fontWeight: 500` (600 when selected)

---

## 4. Application Architecture

### 4.1 View Routing

The application uses a single-page view-state pattern. `AppView` is a TypeScript union type:

```typescript
type AppView = 'engagement' | 'agent-desktop' | 'lifecycle' | 'supervisor';
```

Views are managed via `useState<AppView>('engagement')` in `App.tsx`. Each view renders its own fixed-position header and content area.

### 4.2 Global App State (App.tsx)

| State Variable | Type | Purpose |
|---|---|---|
| `view` | `AppView` | Controls which view is rendered |
| `activeScenario` | `ScenarioId` | Currently selected demo scenario |
| `workspaceActive` | `boolean` | Whether the engagement workspace is active (vs. CSR landing page) |
| `seconds` | `number` | Live call timer counter (increments every second via `setInterval`) |

### 4.3 Header Architecture

Each view has its own header component:

| View | Header Component | Location |
|---|---|---|
| `engagement` | `Header` (full) | `src/components/Header.tsx` |
| `supervisor` | `SupervisorHeader` (minimal) | Inline in `App.tsx` |
| `lifecycle` | `LifecycleHeader` (minimal) | Inline in `App.tsx` |
| `agent-desktop` | `AgentDesktopHeader` (minimal) | Inline in `App.tsx` |

All headers are `position: fixed`, `height: 60px`, `zIndex: 300+`.

---

## 5. Views & Features

### 5.1 CSR Landing Page (Engagement Assistant Default View)

**Component:** `src/components/CSRLandingPage.tsx`
**Route:** `view === 'engagement'` + `workspaceActive === false`
**Persona:** Sarah Mitchell, CSR II · L&A Servicing

#### Features

**Welcome Banner**
- Personalized greeting with agent name, role, department, and current date

**Performance Stats Row (4 KPI tiles)**
- Handled Today
- Avg Handle Time (with target comparison)
- CSAT Score (with weekly trend)
- Queue Depth (with urgent count)

**Active Queue (main content)**
- Lists all queued contacts with priority color-coded left border
- Priority levels: `urgent`, `high`, `medium`, `low`
- Each queue row displays:
  - Customer initials avatar
  - Customer name + priority badge
  - Issue title and detail description
  - Channel indicator (📞 phone / 💬 chat)
  - Policy number
  - Wait time (colored red for urgent, amber for high)
  - Accept / Monitor button
- Clicking Accept or Monitor activates the Engagement Workspace for that scenario

**Right Sidebar**
- Team Update notice (blue left border callout)
- Assure Orchestration status widget (green dot = all systems operational)
- Recently Completed contacts (customer, issue type, duration, CSAT stars)

#### Queue Data (9 Scenarios)

| Scenario ID | Customer | Product | Issue | Priority |
|---|---|---|---|---|
| `friction` | Margaret Torres | Auto (FL) | Claim Status Update — Repeat Contact | Urgent |
| `callback` | James Williams | Homeowners (TX) | Billing Inquiry — Callback Recovery | High |
| `adaptive` | David Park | Auto (CA) | Coverage Review — Life Event | Medium |
| `omni` | Sarah Johnson | Auto (WA) | Billing Clarification — Omnichannel | Medium |
| `workforce` | Robert Chen | Universal Life | Policy Loan $75K | Low |
| `lifeevent` | Patricia Martinez | Term Life (NV) | Policy Maturity — Outbound | Low |
| `lifepolicy` | Catherine Brooks | Whole Life | Dividend Election Review | Medium |
| `ivrstp` | Linda Reyes | Auto (TX) | Address Update — IVR STP Active | Low |
| `escalation` | Frank Harrison | Homeowners (TX) | Claim Denial — Escalation | Urgent |

---

### 5.2 Engagement Workspace

**Component:** `src/components/EngagementWorkspace.tsx`
**Route:** `view === 'engagement'` + `workspaceActive === true`
**Persona:** Sarah Mitchell, CSR II

The workspace is the primary in-call interface. It is scenario-driven — the active scenario controls all displayed data, AI guidance, and context panels.

#### Layout

Three-column layout:
1. **Left Panel** — Customer context (CSRWorkspace component)
2. **Center Panel** — AI Engagement Engine
3. **Right Panel** — Conversation / Chat panel

#### Left Panel — Customer Context

- **Top Bar:** Live call timer, active scenario indicator, End Call button
- **Context Banner:** Policy number, owner name, product, status, authentication badge, channel badge
- **Policy Widget:** Policy number, product, status, issue/effective date, state
- **Billing Widget:** Paid-to date, payment method, frequency, annual premium
- **Claim Widget** (when applicable): Reference number, type, filed date, status with color coding
- **Contact History Widget:** 30-day contact count, last contact date/channel, sentiment with color coding
- **Coverages Widget:** Line-by-line coverage values; coverage note/alert where relevant
- **Activity Timeline:** Chronological activity log with icon, color-coded badge, title, and timestamp

#### Center Panel — AI Engagement Engine

**AI Alert Bar**
- Color-coded by level: red (critical), amber (warning), blue (info), green (positive)
- Scenario-specific alert title and body text

**Signal Intelligence**
- Sentiment score (percentage + label)
- Stress indicator (percentage + label)
- Customer intent classification
- Journey path description
- Topic tags with color-coded status (alert/warn/ok/neutral)

**Next Best Actions (NBA)**
- 3 recommended actions per scenario
- Each action: label, AI reasoning text, action button (Script / View Claim / Transfer / Update / Quote / Send Link)

**Conversation Points**
- 3 scripted talking points tailored to the scenario

**STP Monitor** (ivrstp scenario)
- Assure auto-processing status display

**Quick Actions**
- Add Note
- Send Email
- Flag for Review
- Add Policy
- Request Callback

#### Right Panel — Chat / Transcript

- Real-time chat interface during digital channel interactions
- Conversation transcript view

---

### 5.3 Supervisor Console (Command Center)

**Component:** `src/components/SupervisorConsole.tsx`
**Route:** `view === 'supervisor'`
**Persona:** Andrea Lopez, Engagement Supervisor

The supervisor console provides a real-time management dashboard of all customer engagement activity across channels, agents, and AI automation.

#### Header

- Bloom Insurance logo + wordmark
- "Customer Engagement Console" title + "Smart App" badge (gradient pill)
- Navigation back to Engagement Assistant

#### Layout

**Top: Channel Stats Bar**
- 5 KPI cards displaying real-time channel volumes:
  - Total Active Engagements
  - Voice (with AI Assist %)
  - Chat (with AI Assist %)
  - IVR STP (with success rate)
  - Omnichannel (multi-channel sessions)

**Main: 3-Column Grid**

*Column 1 — Channel & Agent Status*
- Donut chart (pure SVG): channel breakdown by volume
- Legend with colored indicators and volume numbers
- Agent Status list: each agent with status badge (Active / Wrap-Up / Available / Break / Training), current task, duration

*Column 2 — Active Conversations & AI Insights*
- Aggregate conversation count display (large number, e.g. "59.2" active)
- Real-time AI processing indicators
- Escalation Monitoring feed: list of flagged interactions with severity and recommended action
- AI Insights panel: Assure Orchestration NLP pipeline status, active topics, sentiment summary

*Column 3 — Outbound, Sentiment & Performance*
- Outbound messaging queue status
- Real-time sentiment distribution
- Team performance metrics

**Recent Engagements Table**
- Columns: Customer, CSR, Scenario type, Channel, Duration, Sentiment, Outcome, Status
- "Review" action button per row — navigates to engagement workspace for that scenario

**MTD KPI Footer Strip**
- Month-to-date key performance indicators with gradient header bar

---

### 5.4 Lifecycle Outreach Manager

**Component:** `src/pages/LifecycleOutreach/LifecycleOutreach.tsx`
**Route:** `view === 'lifecycle'`
**Persona:** Andrea Lopez, Retention Analyst

Proactive outreach management interface for policy lifecycle events, campaign monitoring, and AI-driven retention signals.

#### KPI Bar (top strip)

| KPI | Value |
|---|---|
| Policies Monitored | 48,210 |
| Open Cases | 23 (4 Urgent) |
| Auto-Actioned (30d) | 142 |
| Premium Retained | $2.4M (this month) |

#### Left Panel — Work Queue (296px)

- Priority filter chips: All / Urgent / High / Medium / Low
- Cases grouped by priority with colored group headers
- Each case card: customer name, policy type, campaign type tag, priority pill, status badge, propensity scores (retention, growth)
- Campaign types: `retention`, `compliance`, `growth`, `lifeevent`
- Status values: `new`, `in-progress`, `actioned`, `converted`

#### Right Panel — Case Detail

When a case is selected from the work queue:

- Customer profile header with avatar, name, policy number, and propensity score bars
- AI-generated outreach recommendation
- Communication history
- Campaign context
- Action buttons (Send Email, Schedule Call, Dismiss)

#### Right Panel — Activity Feed

- Real-time feed of recent system events across all monitored policies
- Event types: life event signals, STP auto-actions, campaign matches, escalations

---

### 5.5 Agent Desktop

**Component:** `src/pages/AgentDesktop/AgentDesktop.tsx`
**Route:** `view === 'agent-desktop'`
**Persona:** Sarah Mitchell, CSR II · L&A Servicing

A full-featured agent workstation demonstrating an advanced insurance servicing workspace.

#### Layout

Split view with tabbed main content and a persistent side panel.

#### Main Panel — Tabbed Workspace (5 tabs)

1. **Current** — Active call view with customer context, policy snapshot, and claim status
2. **Transcript** — Real-time call transcript with speaker labels
3. **Policy** — Full policy detail view
4. **History** — Complete interaction history across all channels
5. **Insights** — AI-generated customer intelligence and next best action recommendations

#### Side Panel

- **AI Brief** — Pre-call intelligence summary generated by Assure Orchestration
- **Next Best Actions** — Ranked recommended actions for the current interaction
- **STP Processing Card** — Status of any active straight-through processing
- **Conversation Points** — Scripted talking points for the current context
- **Quick Actions** toolbar — Common servicing actions (Note, Email, Flag, Policy, Callback)
- **Compliance Audit Trail** — Log of all agent actions with timestamps for regulatory compliance

---

## 6. Demo Scenarios

The application includes 9 pre-built demo scenarios, each representing a distinct customer engagement capability. Scenarios are selectable from the Header dropdown menu.

| ID | Label | Icon | Capability Demonstrated |
|---|---|---|---|
| `friction` | Friction Detection | 🔥 | Repeat contact pattern, escalation language detection, sentiment decline alert, proactive supervisor escalation |
| `adaptive` | Adaptive Engagement | 🎯 | Smart routing, callback offers, life event detection on inbound, coverage gap analysis |
| `omni` | Omnichannel Continuity | 🔗 | Cross-channel context preservation (portal → chatbot → phone), zero-repetition handoff |
| `callback` | Callback & Recovery | 📲 | Disconnect recovery, automated SMS, sentiment-aware callback prioritization |
| `workforce` | Workforce Optimization | 👥 | Skills-based routing, agent scoring, IVR bypass for complex claims |
| `lifeevent` | Life-Event Detection | 📋 | Marriage/dependent/home purchase signal detection, proactive coverage review trigger |
| `lifepolicy` | Whole Life Review | 🌿 | Dividend election optimization, cash value consultation, PUA analysis |
| `ivrstp` | IVR STP — Monitoring | ⚡ | Assure auto-processing for simple requests, CSR monitoring mode, no-touch servicing |
| `escalation` | Claim Denial Escalation | 🔴 | Claim denial dispute handling, retention risk (cancellation threat), multi-policy retention |

### 6.1 Scenario Data Structure

Each scenario contains:

```typescript
interface CSRData {
  banner: BannerData;        // Policy summary fields, auth badge, channel badge
  policy: PolicyWidget;      // Policy number, product, status, issue date, state
  billing: BillingWidget;    // Paid-to, payment method, frequency, premium
  claim?: ClaimWidget;       // Optional claim reference, type, status
  contact: ContactWidget;    // 30-day contact count, last contact, channel, sentiment
  coverages: CoverageItem[]; // Line-by-line coverage values
  coverageNote?: string;     // Alert/highlight note for coverage section
  activity: ActivityItem[];  // Chronological activity log items
  workspaceTitle?: string;   // Optional workspace title override
}
```

Each scenario also has AI configuration:

```typescript
interface ScenarioAI {
  alert: { level: 'red'|'amber'|'blue'|'green'; title: string; body: string };
  nba: Array<{ label: string; reason: string; btn: string }>;  // Next Best Actions
  points: string[];  // Conversation talking points
  signals: {
    sentiment: { pct: number; label: string };
    stress:    { pct: number; label: string };
    intent:    string;
    journey:   string;
    topics:    Array<{ label: string; type: 'alert'|'warn'|'ok'|'neutral' }>;
  };
}
```

---

## 7. Navigation Architecture

### 7.1 Global Navigation Header (Engagement View)

The main `Header` component provides:
- **Bloom Logo + Wordmark** (left)
- **Global Search Bar** (center) — placeholder search across policies, claims, customers
- **Scenario Selector** (blue dropdown) — switches active demo scenario
- **Notification Bell** — badge dot indicator
- **App Switchers** (right):
  - 📊 Supervisor Console → `view = 'supervisor'`
  - 🖥 Agent Desktop → `view = 'agent-desktop'`
  - 📋 Lifecycle → `view = 'lifecycle'`
- **User Avatar** — Sarah Mitchell, CSR

### 7.2 Minimal Headers (Secondary Views)

Supervisor Console, Agent Desktop, and Lifecycle Outreach each have minimal fixed headers containing:
- Bloom Logo + Wordmark
- View title + "Smart App" gradient badge
- "← Engagement Assistant" back navigation button
- Current user avatar and role

---

## 8. Assure Orchestration Integration (Conceptual)

The portal demonstrates the following Assure Orchestration AI platform capabilities:

| Capability | Description | Demo Scenario |
|---|---|---|
| **Friction Detection** | NLP analysis of call history, sentiment trends, repeat contact patterns | `friction` |
| **Sentiment Analysis** | Real-time call sentiment scoring (0–100% scale) with directional label | All scenarios |
| **Life-Event Detection** | Signal matching from name changes, address changes, new dependents, inquiries | `lifeevent`, `adaptive` |
| **Next Best Action Engine** | Context-aware recommendation of top 3 agent actions with AI rationale | All scenarios |
| **Omnichannel Context** | Cross-channel session memory (portal, chatbot, IVR, agent) merged into single context | `omni` |
| **IVR Straight-Through Processing** | Fully automated handling of simple requests without CSR involvement | `ivrstp` |
| **Callback & Recovery** | Automated disconnect recovery, SMS notification, priority re-queuing | `callback` |
| **Skills-Based Routing** | Agent scoring and matching based on call complexity and agent skills | `workforce` |
| **Escalation Intelligence** | Multi-policy risk assessment, cancellation threat detection, supervisor routing | `escalation` |

---

## 9. Key Component Files

| File | Purpose |
|---|---|
| `src/App.tsx` | Root component; view routing; global state; minimal secondary headers |
| `src/theme.ts` | Bloom brand tokens (`BLOOM`) and MUI theme configuration |
| `src/data/scenarios.ts` | All scenario type definitions, `SCENARIO_LIST` metadata, `SCENARIO_CSR` data, `ScenarioAI` configuration |
| `src/components/Header.tsx` | Global navigation header for engagement view |
| `src/components/CSRLandingPage.tsx` | CSR queue dashboard (default engagement view) |
| `src/components/EngagementWorkspace.tsx` | In-call AI engagement workspace |
| `src/components/CSRWorkspace.tsx` | Left panel customer context sub-component |
| `src/components/EngagementPanel.tsx` | Center panel AI guidance sub-component |
| `src/components/SupervisorConsole.tsx` | Supervisor command center view |
| `src/components/BloomLogo.tsx` | SVG Bloom brand logo component |
| `src/pages/AgentDesktop/AgentDesktop.tsx` | Full agent desktop workspace |
| `src/pages/LifecycleOutreach/LifecycleOutreach.tsx` | Lifecycle outreach manager |

---

## 10. Non-Functional Requirements (Demo Context)

- **No backend integration required** — all data is static/mock within component files
- **No authentication** — open access for demo use
- **Responsive at standard laptop resolutions** — primary target: 1440px width
- **No charting library dependency** — charts implemented as pure inline SVG
- **Build target:** Vite production build, deployed to Vercel
- **Repository:** GitHub (`sdlyager80/customer_experience_assistant`)

---

## 11. Personas Reference

| Name | Role | Initials | Avatar Color | Views Used |
|---|---|---|---|---|
| Sarah Mitchell | CSR II · L&A Servicing | SM | Orange | Engagement, Agent Desktop |
| Andrea Lopez | Engagement Supervisor / Retention Analyst | AL | Blue | Supervisor Console, Lifecycle Outreach |
