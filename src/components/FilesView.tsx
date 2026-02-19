// src/components/FilesView.tsx
// File tree + markdown editor with preview toggle

import { useEffect, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import {
  FileText, FolderOpen, Save, Eye, Edit3, ChevronRight,
  ChevronDown, Clock, HardDrive,
} from 'lucide-react';
import GlassCard from './common/GlassCard';
import MarkdownRenderer from './common/MarkdownRenderer';
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
    core: 'Core Files',
    memory: 'Memory',
    config: 'Config',
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-10rem)]">
      {/* File Tree */}
      <div className="w-64 flex-shrink-0 overflow-y-auto scrollbar-thin">
        <GlassCard padding="p-3" className="h-full">
          <h3 className="text-[12px] font-bold text-surface-400 uppercase tracking-wider px-2 mb-3">
            Workspace Files
          </h3>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-7 rounded" />)}
            </div>
          ) : (
            <div className="space-y-1">
              {Object.entries(grouped).map(([group, items]) => {
                if (items.length === 0) return null;
                const isExpanded = expandedGroups[group];
                return (
                  <div key={group}>
                    <button
                      onClick={() => toggleGroup(group)}
                      className="flex items-center gap-1.5 w-full px-2 py-1.5 text-[12px] font-semibold text-surface-400 hover:text-surface-200 transition-colors"
                    >
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      <FolderOpen className="w-3 h-3" />
                      {groupLabels[group]} ({items.length})
                    </button>
                    {isExpanded && (
                      <div className="ml-3 space-y-0.5">
                        {items.map(file => (
                          <button
                            key={file.path}
                            onClick={() => loadFile(file.path)}
                            className={clsx(
                              'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-left transition-colors',
                              selectedPath === file.path
                                ? 'bg-brand-500/10 text-brand-300'
                                : 'text-surface-300 hover:bg-surface-800/50 hover:text-surface-100',
                            )}
                          >
                            <FileText className="w-3 h-3 flex-shrink-0" />
                            <span className="text-[12px] truncate">{file.name}</span>
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
          <GlassCard padding="p-0" className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/20">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-400" />
                <span className="text-[14px] font-semibold text-surface-100">{selectedPath}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (editing) { setEditing(false); }
                    else { setEditContent(content); setEditing(true); }
                  }}
                  className={clsx('btn-ghost flex items-center gap-1.5', editing && 'text-brand-400')}
                >
                  {editing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                  {editing ? 'Preview' : 'Edit'}
                </button>
                {editing && (
                  <button onClick={saveFile} disabled={saving} className="btn-primary flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
              {editing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full min-h-[400px] bg-transparent text-[13px] font-mono text-surface-200 resize-none focus:outline-none"
                  spellCheck={false}
                />
              ) : (
                <MarkdownRenderer content={content} />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-surface-700/20 text-[11px] text-surface-500">
              {files.find(f => f.path === selectedPath) && (
                <>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(files.find(f => f.path === selectedPath)!.lastModified).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    {formatSize(files.find(f => f.path === selectedPath)!.size)}
                  </span>
                </>
              )}
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FolderOpen className="w-12 h-12 text-surface-700 mx-auto mb-3" />
              <p className="text-[14px] text-surface-400">Select a file to view</p>
              <p className="text-[12px] text-surface-500 mt-1">Choose from the file tree on the left</p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
