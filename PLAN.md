# OpenClaw CRM — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a local CRM dashboard for OpenClaw showing conversations, cron jobs, files, skills, config, calendar, and analytics.

**Architecture:** Astro SSR + React Islands frontend. API routes read workspace files via Node.js fs and proxy to OpenClaw gateway. 3-column layout (IconSidebar | Main | RightPanel). Design system: "Arctic Indigo".

**Tech Stack:** Astro 5, React 19, Tailwind CSS 3, Nanostores, Lucide React, recharts, react-markdown, remark-gfm

**Reference project:** `C:\Users\nj\projects\procurement-analyzer\frontend\` — copy architecture patterns (App.tsx shell, IconSidebar, store.ts createStore pattern, Layout.astro)

**Design doc:** `C:\Users\nj\.openclaw\workspace\docs\plans\2026-02-19-openclaw-crm-design.md`

**Workspace path for OpenClaw files:** `C:\Users\nj\.openclaw\workspace\`

---

## Phase 1: Project Scaffold + Design System (Tasks 1-4)

### Task 1: Initialize Astro project

**Step 1:** Create project directory and initialize

```bash
mkdir C:\Users\nj\projects\openclaw-crm
cd C:\Users\nj\projects\openclaw-crm
npm create astro@latest -- --template minimal --no-install -y .
```

**Step 2:** Install dependencies

```bash
npm install @astrojs/react @astrojs/tailwind react react-dom tailwindcss clsx lucide-react nanostores @nanostores/react react-markdown remark-gfm recharts
```

**Step 3:** Configure astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'server',
  server: { port: 3000 },
});
```

**Step 4:** Git init + commit

```bash
git init
git add -A
git commit -m "init: astro project scaffold"
```

### Task 2: Design System — Tailwind Config + Global CSS

**Files:**
- Create: `tailwind.config.cjs` — Arctic Indigo color tokens, fonts, animations
- Create: `src/styles/global.css` — base layer, scrollbar, glass effects, component classes

**Reference:** Copy structure from `C:\Users\nj\projects\procurement-analyzer\frontend\tailwind.config.cjs` but replace ALL colors with Arctic Indigo palette:

```
Brand: indigo (#6366f1 primary)
Accent: cyan (#06b6d4 primary)
Surface: midnight slate (#0f1117 bg, #0f172a cards, #1e293b elevated)
```

Background gradient: indigo + cyan radial gradients on #0f1117.

**Commit:** `feat: Arctic Indigo design system`

### Task 3: Layout + App Shell

**Files:**
- Create: `src/layouts/Layout.astro` — HTML shell, fonts, meta (copy PA pattern, change theme-color to #0f1117)
- Create: `src/pages/index.astro` — mounts `<App client:only="react" />`
- Create: `src/components/App.tsx` — root shell with 3-column layout, view routing
- Create: `src/lib/store.ts` — createStore + useStore pattern (copy from PA), AppView type with 8 views
- Create: `src/lib/types.ts` — TypeScript interfaces for all data models

**AppView type:** `'dashboard' | 'conversations' | 'cron' | 'files' | 'skills' | 'config' | 'calendar' | 'analytics'`

**Commit:** `feat: app shell with 3-column layout`

### Task 4: IconSidebar + TopBar

**Files:**
- Create: `src/components/IconSidebar.tsx` — collapsible sidebar (60px/240px), 8 nav items + help + collapse
- Create: `src/components/TopBar.tsx` — breadcrumb, search input, status indicator
- Create: `src/components/common/GlassCard.tsx` — reusable glass card component
- Create: `src/components/common/StatusBadge.tsx` — status pill (active/disabled/error)

**Nav items:**
```
🏠 Dashboard (LayoutDashboard icon)
💬 Conversations (MessageSquare)
📋 Cron Jobs (Clock)
📁 Files (FolderOpen)
🧠 Skills (Brain)
⚙️ Config (Settings)
📅 Calendar (Calendar)
📊 Analytics (BarChart3)
--- separator ---
❓ Help (HelpCircle)
⟪ Collapse (PanelLeftClose/PanelLeftOpen)
```

**Commit:** `feat: IconSidebar + TopBar components`

---

## Phase 2: API Layer (Tasks 5-8)

### Task 5: Files API

**Files:**
- Create: `src/pages/api/files/index.ts` — GET: list workspace files (MEMORY.md, SOUL.md, USER.md, IDENTITY.md, TOOLS.md, HEARTBEAT.md, AGENTS.md, memory/*.md)
- Create: `src/pages/api/files/[...path].ts` — GET: read file, PUT: write file

**Implementation:** Use Node.js `fs/promises` to read from `C:\Users\nj\.openclaw\workspace\`. Return JSON with `{ name, path, content, lastModified, size }`.

**Commit:** `feat: files API endpoints`

### Task 6: Skills API

**Files:**
- Create: `src/pages/api/skills/index.ts` — GET: scan skills directories, parse SKILL.md frontmatter
- Create: `src/pages/api/skills/[name].ts` — GET: full SKILL.md content

**Scan paths:**
- `C:\Users\nj\.openclaw\workspace\skills\*\SKILL.md`
- `C:\Users\nj\.agents\skills\*\SKILL.md`
- `C:\Users\nj\AppData\Roaming\npm\node_modules\openclaw\skills\*\SKILL.md`

**Return:** `{ name, description, location, category }` for each skill.

**Commit:** `feat: skills API endpoints`

### Task 7: Cron + Sessions API

**Files:**
- Create: `src/pages/api/cron/index.ts` — proxy to gateway cron API
- Create: `src/pages/api/sessions/index.ts` — proxy to gateway sessions API
- Create: `src/lib/gateway.ts` — helper to call OpenClaw gateway API (read config for port/token)

**Note:** Gateway runs locally. Read config from `C:\Users\nj\.openclaw\gateway.yaml` or use `openclaw gateway status` to find port.

**Commit:** `feat: cron + sessions API`

### Task 8: Config + Status API

**Files:**
- Create: `src/pages/api/config.ts` — GET: read gateway config (YAML parse)
- Create: `src/pages/api/status.ts` — GET: gateway health/status

**Commit:** `feat: config + status API`

---

## Phase 3: Views (Tasks 9-16)

### Task 9: Dashboard View

**Files:**
- Create: `src/components/DashboardView.tsx`

**Content:**
- 4 stat cards row (files, skills, crons, sessions) — GlassCard with icon + number + label
- Recent activity feed (last file changes from memory/*.md)
- Upcoming cron jobs (next 5)
- System status card (model, gateway version)

**Commit:** `feat: dashboard view`

### Task 10: Files View

**Files:**
- Create: `src/components/FilesView.tsx` — file tree + editor
- Create: `src/components/common/MarkdownRenderer.tsx` — react-markdown wrapper

**Features:**
- Left: file tree (grouped: Core Files, Memory, Config)
- Right: markdown preview with toggle to raw edit (textarea)
- Save button (PUT /api/files/:path)
- File info footer (last modified, size)

**Commit:** `feat: files view with editor`

### Task 11: Skills View

**Files:**
- Create: `src/components/SkillsView.tsx`

**Features:**
- Grid view: skill cards with name, description, category badge
- Categories from memory: Always (🔵), On-demand (🟡), Tech-specific (🟢), Design (🎨), Video (🎬)
- Click → right panel shows full SKILL.md rendered
- Search/filter

**Commit:** `feat: skills view`

### Task 12: Cron View

**Files:**
- Create: `src/components/CronView.tsx`

**Features:**
- Table: name, schedule (human readable), status badge, last run, next run
- Click → detail panel: payload, run history
- Toggle enable/disable button
- Trigger now button

**Commit:** `feat: cron jobs view`

### Task 13: Conversations View

**Files:**
- Create: `src/components/ConversationsView.tsx`

**Features:**
- Left list: Discord channels (from config)
- Main: session/message history (from sessions API)
- Message bubbles with sender, timestamp, markdown content
- Channel info in right panel

**Commit:** `feat: conversations view`

### Task 14: Config View

**Files:**
- Create: `src/components/ConfigView.tsx`

**Features:**
- JSON/YAML tree viewer with syntax highlighting
- Collapsible sections
- Read-only (safety note at top)
- Copy to clipboard button

**Commit:** `feat: config viewer`

### Task 15: Calendar View

**Files:**
- Create: `src/components/CalendarView.tsx`

**Features:**
- Month grid (CSS grid, custom — no heavy lib)
- Cron jobs plotted as colored dots/bars
- Click day → shows that day's cron runs
- Toggle month/week view

**Commit:** `feat: calendar view`

### Task 16: Analytics View

**Files:**
- Create: `src/components/AnalyticsView.tsx`

**Features:**
- Token usage chart (recharts AreaChart)
- Sessions per day (recharts BarChart)
- Model breakdown (recharts PieChart)
- Stats cards: total tokens, total cost, avg session duration

**Note:** If no analytics API available, show mock data with "Connect analytics" placeholder.

**Commit:** `feat: analytics view`

---

## Phase 4: Polish (Tasks 17-18)

### Task 17: Animations + Transitions

- Staggered fadeInUp on dashboard cards
- Slide transitions between views
- Hover effects on sidebar items
- Smooth sidebar collapse/expand
- Loading skeletons for API data

**Commit:** `feat: animations + polish`

### Task 18: Final build + test + push

```bash
npm run build
npm run preview
```

Fix any build errors. Test all 8 views. Push to GitHub.

```bash
git remote add origin https://github.com/marcobitx/openclaw-crm.git
git push -u origin main
```

**Commit:** `chore: production build verified`
