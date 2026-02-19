# OpenClaw CRM — Design Document
**Date:** 2026-02-19
**Status:** Approved
**Stack:** Astro + React Islands + Tailwind CSS + Node.js API

---

## 1. Overview

Local web application for managing and monitoring OpenClaw — a personal AI assistant CRM.
Shows conversations, cron jobs, files, skills, config, calendar, and analytics in one dashboard.

## 2. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Astro Frontend                     │
│  (React Islands — client:only components)            │
│                                                       │
│  IconSidebar │ Main Content Area │ RightPanel/Detail  │
│   (60/240px) │    (flex-1)       │    (320px)         │
└──────────────┼───────────────────┼────────────────────┘
               │                   │
         ┌─────▼───────────────────▼─────┐
         │     API Routes (Astro SSR)     │
         │  /api/files, /api/cron,        │
         │  /api/sessions, /api/config    │
         └─────┬──────────┬──────────┬───┘
               │          │          │
       ┌───────▼──┐ ┌─────▼────┐ ┌──▼──────────┐
       │ Workspace │ │ Gateway  │ │ Discord     │
       │ Files     │ │ API      │ │ Message API │
       │ (fs read) │ │ (HTTP)   │ │ (HTTP)      │
       └──────────┘ └──────────┘ └─────────────┘
```

### Data Sources

| Source | Method | Data |
|--------|--------|------|
| Workspace files | `fs.readFile` | MEMORY.md, SOUL.md, USER.md, IDENTITY.md, TOOLS.md, HEARTBEAT.md, memory/*.md |
| Skills | `fs.readdir` + parse SKILL.md | Skill name, description, location |
| Gateway config | `openclaw` CLI or config file read | Full gateway config |
| Cron jobs | Gateway API (`/api/cron`) | Job list, schedules, run history |
| Sessions | Gateway API | Active sessions, history |
| Discord messages | Discord API / message tool | Channel list, message history |

## 3. Design System — "Arctic Indigo"

### Color Tokens

```
Brand (Indigo):
  50:  #eef2ff
  100: #e0e7ff
  200: #c7d2fe
  300: #a5b4fc
  400: #818cf8
  500: #6366f1  ← Primary
  600: #4f46e5
  700: #4338ca
  800: #3730a3
  900: #312e81
  950: #1e1b4b

Accent (Cyan):
  50:  #ecfeff
  100: #cffafe
  200: #a5f3fc
  300: #67e8f9
  400: #22d3ee
  500: #06b6d4  ← Primary Accent
  600: #0891b2
  700: #0e7490
  800: #155e75
  900: #164e63
  950: #083344

Surface (Midnight Slate):
  50:  #f8fafc
  100: #f1f5f9
  200: #e2e8f0
  300: #cbd5e1
  400: #94a3b8
  500: #64748b
  600: #475569
  700: #334155
  800: #1e293b
  900: #0f172a  ← Card background
  950: #0f1117  ← Page background

Semantic:
  success: #10b981 (emerald)
  warning: #f59e0b (amber)
  error:   #ef4444 (red)
  info:    #06b6d4 (cyan — same as accent)
```

### Typography
- **Display/Headings:** Plus Jakarta Sans (700, 800)
- **Body:** Plus Jakarta Sans (400, 500, 600)
- **Mono/Code:** JetBrains Mono

### Background
```css
background-color: #0f1117;
background-image:
  radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.06) 0, transparent 50%),
  radial-gradient(at 100% 80%, rgba(6, 182, 212, 0.04) 0, transparent 50%);
```

### Glass Effect
```css
.glass-card {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 102, 241, 0.08);
  border-radius: 12px;
}
```

## 4. Views

### 4.1 Dashboard (Home)
- **Quick stats row:** Total conversations, active crons, files count, skills count
- **Recent activity feed:** Last 10 events (messages, cron runs, file changes)
- **Upcoming cron jobs:** Next 5 scheduled runs
- **System health:** Gateway status, model info, uptime
- **Quick actions:** New cron, open file, skill search

### 4.2 Conversations
- **Left list:** Discord channels with unread counts, last message preview
- **Main area:** Message thread (markdown rendered)
- **Filters:** Channel, date range, search text
- **Right panel:** Channel info, participants

### 4.3 Cron Jobs
- **Table view:** All crons with status (enabled/disabled), schedule, last run, next run
- **Detail panel:** Run history, logs, payload preview
- **Actions:** Enable/disable, trigger now, edit schedule
- **Status indicators:** Green (active), gray (disabled), red (failed last run)

### 4.4 Files (Memory Center)
- **Tree view:** All workspace files organized by type
  - Core: SOUL.md, USER.md, IDENTITY.md, MEMORY.md, TOOLS.md, HEARTBEAT.md
  - Memory: memory/*.md (daily notes)
  - Config: gateway config, AGENTS.md
- **Editor:** Markdown preview + raw edit mode (CodeMirror or textarea)
- **File info:** Last modified, size, git status

### 4.5 Skills
- **Grid/list view:** All installed skills with icon, name, description
- **Categories:** Always, On-demand, Tech-specific, Design, Video
- **Detail panel:** Full SKILL.md content rendered
- **Badge:** "Active in toolkit" for the 23 coding skills

### 4.6 Config
- **JSON tree viewer:** Full gateway config with syntax highlighting
- **Sections:** General, Agents, Channels, Discord, Bindings
- **Read-only** (safety — edits via gateway tool only)

### 4.7 Calendar
- **Month/week/day view:** Cron schedules visualized
- **Color coding:** By cron type (system events, agent turns, reminders)
- **Click to detail:** Opens cron job detail

### 4.8 Analytics
- **Token usage chart:** Daily/weekly/monthly
- **Cost breakdown:** By model, by session
- **Session stats:** Count, avg duration, model distribution
- **Top channels:** Most active Discord channels

## 5. Layout

```
┌──────────────────────────────────────────────────────────┐
│ IconSidebar │        TopBar (breadcrumb + search)        │
│             │────────────────────────────────────────────│
│  🏠 Home    │                                            │
│  💬 Chat    │         Main Content Area                  │
│  📋 Cron    │         (view-specific)                    │
│  📁 Files   │                                            │
│  🧠 Skills  │                                            │
│  ⚙️ Config  │                                            │
│  📅 Cal     │                                            │
│  📊 Stats   │                                            │
│             │                                            │
│  ─────────  │                                            │
│  ? Help     │                                            │
│  ⟪ Collapse │                                            │
└─────────────┴────────────────────────────────────────────┘
```

## 6. API Endpoints

```
GET  /api/files                    → List workspace files
GET  /api/files/:path              → Read file content
PUT  /api/files/:path              → Update file content
GET  /api/skills                   → List all skills
GET  /api/skills/:name             → Skill detail (SKILL.md parsed)
GET  /api/cron/jobs                → List cron jobs
GET  /api/cron/jobs/:id/runs       → Job run history
POST /api/cron/jobs/:id/toggle     → Enable/disable
POST /api/cron/jobs/:id/run        → Trigger now
GET  /api/sessions                 → List sessions
GET  /api/sessions/:key/history    → Session message history
GET  /api/config                   → Gateway config (read-only)
GET  /api/status                   → Gateway status + health
GET  /api/discord/channels         → Discord channel list
GET  /api/discord/channels/:id     → Channel message history
GET  /api/analytics/usage          → Token usage stats
```

## 7. Project Structure

```
openclaw-crm/
├── astro.config.mjs
├── package.json
├── tailwind.config.cjs
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── App.tsx                 # Root shell (3-col layout)
│   │   ├── IconSidebar.tsx         # Collapsible nav
│   │   ├── TopBar.tsx              # Breadcrumb + search + status
│   │   ├── DashboardView.tsx       # Home overview
│   │   ├── ConversationsView.tsx   # Discord message browser
│   │   ├── CronView.tsx            # Cron management
│   │   ├── FilesView.tsx           # File browser + editor
│   │   ├── SkillsView.tsx          # Skills catalog
│   │   ├── ConfigView.tsx          # Config viewer
│   │   ├── CalendarView.tsx        # Calendar visualization
│   │   ├── AnalyticsView.tsx       # Usage stats + charts
│   │   └── common/                 # Shared components
│   │       ├── GlassCard.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── SearchInput.tsx
│   │       └── MarkdownRenderer.tsx
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── store.ts               # Nanostores state
│   │   ├── api.ts                  # API client
│   │   └── types.ts               # TypeScript types
│   ├── pages/
│   │   ├── index.astro
│   │   └── api/                    # SSR API routes
│   │       ├── files/[...path].ts
│   │       ├── skills/[...name].ts
│   │       ├── cron/[...action].ts
│   │       ├── sessions/[...key].ts
│   │       ├── config.ts
│   │       ├── discord/[...id].ts
│   │       ├── analytics/usage.ts
│   │       └── status.ts
│   └── styles/
│       └── global.css
└── README.md
```

## 8. Tech Decisions

- **State management:** Nanostores (same as PA)
- **Icons:** Lucide React
- **Markdown rendering:** react-markdown + remark-gfm
- **Charts:** recharts (lightweight, React-native)
- **Calendar:** Custom (CSS grid based, no heavy lib)
- **Code highlighting:** Shiki (for config/code views)
- **File operations:** Node.js fs (Astro SSR)
