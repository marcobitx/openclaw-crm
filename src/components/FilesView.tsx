// src/components/FilesView.tsx
// File tree + markdown editor with preview toggle

import { useEffect, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import {
  CustomFiles,
  CustomSave,
  CustomEye,
  CustomEdit,
  CustomChevronRight,
  CustomChevronDown,
  CustomClock,
  CustomHardDrive,
  CustomSparkles,
} from './common/CustomIcons';
import GlassCard from './common/GlassCard';
import MarkdownRenderer from './common/MarkdownRenderer';
import { CRMIllustration, WarmGlow } from './common/VisualElements';
import { appStore, useStore } from '../lib/store';

interface FileItem {
  name: string;
  path: string;
  lastModified: string;
  size: number;
  group: 'core' | 'memory' | 'config';
}

export default function FilesView() {
  const state = useStore(appStore);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ core: true, memory: true, config: true });

  useEffect(() => {
    fetch('/api/files')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setFiles(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadFile = useCallback(async (path: string) => {
    setSelectedPath(path);
    setEditing(false);
    try {
      const res = await fetch(`/api/files/${encodeURIComponent(path)}`);
      const data = await res.json();
      setContent(data.content || '');
      setEditContent(data.content || '');
    } catch (err) {
      console.error('Failed to load file:', err);
      setContent('Error loading file');
    }
  }, []);

  const saveFile = useCallback(async () => {
    if (!selectedPath) return;
    setSaving(true);
    try {
      await fetch(`/api/files/${encodeURIComponent(selectedPath)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      setContent(editContent);
      setEditing(false);
    } catch (err) {
      console.error('Failed to save file:', err);
    } finally {
      setSaving(false);
    }
  }, [selectedPath, editContent]);

  const grouped = {
    core: files.filter(f => f.group === 'core'),
    memory: files.filter(f => f.group === 'memory'),
    config: files.filter(f => f.group === 'config'),
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const groupLabels: Record<string, string> = {
    core: 'Core Infrastructure',
    memory: 'Context Memory',
    config: 'Configurations',
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)] relative">
      <WarmGlow className="-bottom-20 -left-20 w-80 h-80 opacity-20" />

      {/* File Tree */}
      <div className="w-72 flex-shrink-0 overflow-y-auto scrollbar-thin">
        <GlassCard padding="p-4" className="h-full border-surface-700/10">
          <div className="flex items-center gap-2 mb-6 px-1">
            <CustomHardDrive className="w-4 h-4 text-brand-400" />
            <h3 className="text-[13px] font-bold text-surface-200 uppercase tracking-widest">
              Workspace
            </h3>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-8 rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(grouped).map(([group, items]) => {
                if (items.length === 0) return null;
                const isExpanded = expandedGroups[group];
                return (
                  <div key={group} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(group)}
                      className="flex items-center gap-2 w-full px-2 py-2 text-[12px] font-bold text-surface-400 hover:text-surface-200 transition-colors uppercase tracking-tight"
                    >
                      {isExpanded ? <CustomChevronDown className="w-3.5 h-3.5" /> : <CustomChevronRight className="w-3.5 h-3.5" />}
                      <span className={clsx(
                        'w-1.5 h-1.5 rounded-full',
                        group === 'core' ? 'bg-brand-500' : group === 'memory' ? 'bg-accent-500' : 'bg-emerald-500'
                      )} />
                      {groupLabels[group]}
                    </button>
                    {isExpanded && (
                      <div className="ml-2 space-y-px">
                        {items.map(file => (
                          <button
                            key={file.path}
                            onClick={() => loadFile(file.path)}
                            className={clsx(
                              'group flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-left transition-all',
                              selectedPath === file.path
                                ? 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/20 shadow-sm shadow-brand-500/5'
                                : 'text-surface-400 hover:bg-surface-800/40 hover:text-surface-200',
                            )}
                          >
                            <CustomFiles className={clsx(
                              'w-3.5 h-3.5 flex-shrink-0 transition-colors',
                              selectedPath === file.path ? 'text-brand-300' : 'text-surface-600 group-hover:text-surface-400'
                            )} />
                            <span className="text-[12.5px] truncate font-medium">{file.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Editor / Preview */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedPath ? (
          <GlassCard padding="p-0" className="flex-1 flex flex-col overflow-hidden border-surface-700/10 backdrop-blur-xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-700/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-800 flex items-center justify-center">
                  <CustomFiles className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <span className="text-[15px] font-bold text-surface-50 block leading-none">{selectedPath.split('/').pop()}</span>
                  <span className="text-[11px] text-surface-500 font-mono mt-1 block opacity-60 truncate">{selectedPath}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (editing) { setEditing(false); }
                    else { setEditContent(content); setEditing(true); }
                  }}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all',
                    editing
                      ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                      : 'bg-surface-800 text-surface-300 hover:text-white hover:bg-surface-700'
                  )}
                >
                  {editing ? <CustomEye className="w-4 h-4" /> : <CustomEdit className="w-4 h-4" />}
                  {editing ? 'View Preview' : 'Edit Document'}
                </button>
                {editing && (
                  <button onClick={saveFile} disabled={saving} className="btn-primary animate-fade-in group px-6">
                    <CustomSave className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {saving ? 'Synchronizing...' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-8">
              {editing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full min-h-[400px] bg-transparent text-[14px] font-mono text-surface-200 resize-none focus:outline-none leading-relaxed selection:bg-brand-500/30"
                  spellCheck={false}
                  placeholder="Enter content..."
                />
              ) : (
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer content={content} />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-6 px-6 py-3 border-t border-surface-700/20 text-[11px] text-surface-500 bg-surface-900/40">
              {files.find(f => f.path === selectedPath) && (
                <>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CustomClock className="w-3.5 h-3.5" />
                    Last indexed: {new Date(files.find(f => f.path === selectedPath)!.lastModified).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CustomHardDrive className="w-3.5 h-3.5" />
                    Storage footprint: {formatSize(files.find(f => f.path === selectedPath)!.size)}
                  </span>
                </>
              )}
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="flex-1 flex flex-col items-center justify-center relative overflow-hidden group">
            <WarmGlow className="w-full h-full opacity-10" />
            <div className="relative z-10 text-center max-w-sm">
              <CRMIllustration className="w-64 h-48 mx-auto mb-8 drop-shadow-2xl transition-transform duration-700 group-hover:scale-105" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-800/80 border border-surface-700 mb-4 scale-90">
                <CustomSparkles className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-[11px] font-bold text-surface-300 uppercase tracking-widest">Workspace Explorer</span>
              </div>
              <h4 className="text-xl font-bold text-surface-50 tracking-tight">Access your intelligence base</h4>
              <p className="text-[13px] text-surface-400 mt-2 leading-relaxed">
                Select a configuration or memory file from the tree to view and edit its metadata.
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
