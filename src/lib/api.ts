// src/lib/api.ts
// API client for all CRM endpoints

const BASE = '';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// Files
export const getFiles = () => fetchJSON<any[]>('/api/files');
export const getFile = (path: string) => fetchJSON<any>(`/api/files/${encodeURIComponent(path)}`);
export const saveFile = (path: string, content: string) =>
  fetchJSON<any>(`/api/files/${encodeURIComponent(path)}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });

// Skills
export const getSkills = () => fetchJSON<any[]>('/api/skills');
export const getSkill = (name: string) => fetchJSON<any>(`/api/skills/${encodeURIComponent(name)}`);

// Cron
export const getCronJobs = () => fetchJSON<any[]>('/api/cron');
export const toggleCronJob = (id: string) =>
  fetchJSON<any>(`/api/cron`, { method: 'POST', body: JSON.stringify({ action: 'toggle', id }) });
export const triggerCronJob = (id: string) =>
  fetchJSON<any>(`/api/cron`, { method: 'POST', body: JSON.stringify({ action: 'trigger', id }) });

// Sessions
export const getSessions = () => fetchJSON<any[]>('/api/sessions');

// Config
export const getConfig = () => fetchJSON<any>('/api/config');

// Status
export const getStatus = () => fetchJSON<any>('/api/status');
