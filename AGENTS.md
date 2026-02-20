# AGENTS.md - OpenClaw CRM Development Guide

## Project Overview
OpenClaw CRM is an Astro + React SSR application with Node.js adapter. Provides web interface for managing Discord gateway sessions, cron jobs, skills, and workspace files.

**Tech Stack:** Astro 5.x, React 19, TypeScript (strict), Tailwind CSS 3.x, Nanostores, Better-sqlite3, Recharts

---

## Build & Development Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Build production bundle to ./dist/
npm run preview     # Preview production build locally
npm run astro <cmd> # Run Astro CLI commands
npm run astro check # Type-check without building
```

**Running a Single Test:** No test framework configured. To add tests:
```bash
npm install -D vitest @testing-library/react @testing-library/dom jsdom
```
Add to package.json: `"test": "vitest", "test:run": "vitest run"`

---

## Code Style Guidelines

### General Principles
- Use TypeScript for all files (`.ts` utilities, `.tsx` components)
- Prefer functional components with hooks over class components
- Keep components focused with single responsibility
- Use early returns for conditionals

### Imports (order matters)
```typescript
import { useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import { appStore, useStore } from '../lib/store';
import type { AppView } from '../lib/types';
import IconSidebar from './IconSidebar';
```

### Naming Conventions
- **Files**: PascalCase (`DashboardView.tsx`), camelCase (`api.ts`)
- **Components**: PascalCase
- **Hooks**: camelCase with `use` prefix (`useStore`)
- **Types/Interfaces**: PascalCase (`interface WorkspaceFile`)
- **Constants**: SCREAMING_SNAKE_CASE for config, PascalCase for labels

### TypeScript Guidelines
- Use explicit types for function parameters and return types
- Use `any` sparingly; prefer explicit types or `unknown`
- Define shared types in `src/lib/types.ts`
- Use union types for exhaustive checks
```typescript
export interface WorkspaceFile {
  name: string;
  path: string;
  content: string;
  lastModified: string;
  size: number;
  group: 'core' | 'memory' | 'config';
}
```

### Error Handling
- API routes: Use try/catch with meaningful error messages
- Return appropriate HTTP status codes
- Frontend: Use appStore for global error state

### React Patterns
- Use `useCallback` for memoized callbacks passed to children
- Use `useEffect` for side effects (data fetching, subscriptions)
- Use nanostores for cross-component state
- SSR-safe store pattern:
```typescript
export function useStore<T>(store: ReturnType<typeof createStore<T>>): T {
  const [snapshot, setSnapshot] = useState(() => store.getState());
  useEffect(() => {
    setSnapshot(store.getState());
    return store.subscribe(() => setSnapshot(store.getState()));
  }, [store]);
  return snapshot;
}
```

### Tailwind CSS
- Use design tokens from `tailwind.config.cjs` (brand, accent, surface colors)
- Apply animations via custom utilities (fade-in, slide-in, etc.)
- Keep classes organized: layout → sizing → spacing → visual → state

### Astro API Routes
- Use `APIRoute` type from `astro`
- Place in `src/pages/api/[endpoint].ts`
- Return `Response` objects with proper headers

---

## Project Structure
```
src/
├── components/       # React components (views, UI)
│   └── *.tsx        # View components
├── lib/             # Utilities
│   ├── api.ts       # API client functions
│   ├── gateway.ts   # Gateway communication
│   ├── store.ts     # Nanostores state management
│   └── types.ts     # TypeScript interfaces
└── pages/           # Astro pages + API routes
    └── api/         # Server-side API endpoints
```

---

## Common Patterns

### Fetching Data
```typescript
useEffect(() => {
  fetch('/api/endpoint')
    .then(r => r.json())
    .then(data => appStore.setState({ /* update */ }))
    .catch(err => appStore.setState({ error: err.message }));
}, []);
```

### Navigation
```typescript
const navigate = useCallback((view: AppView) => {
  appStore.setState({ view, error: null });
}, []);
```

### Conditional Classes
```typescript
<div className={clsx('base-classes', condition && 'conditional-class')} />
```

---

## Keyboard Shortcuts
- `Alt+1-8`: Navigate between views
- `Escape`: Clear selection/close panels

---

## External Resources
- [Astro Docs](https://docs.astro.build)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Nanostores](https://github.com/nanostores/nanostores)
