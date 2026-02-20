// src/components/SkillsView.tsx
// Skills catalog — grid view with category badges and detail panel

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import {
  CustomSkills,
  CustomSearch,
  CustomX
} from './common/CustomIcons';
import GlassCard from './common/GlassCard';
import MarkdownRenderer from './common/MarkdownRenderer';

interface SkillItem {
  name: string;
  description: string;
  location: string;
  category: string;
}

const CATEGORY_STYLES: Record<string, { label: string; badge: string; dot: string }> = {
  always: { label: 'Always', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
  'on-demand': { label: 'On-demand', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
  'tech-specific': { label: 'Tech', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  design: { label: 'Design', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20', dot: 'bg-pink-400' },
  video: { label: 'Video', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20', dot: 'bg-violet-400' },
  other: { label: 'Other', badge: 'bg-surface-500/10 text-surface-400 border-surface-500/20', dot: 'bg-surface-400' },
};

export default function SkillsView() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [skillContent, setSkillContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setSkills(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadSkillDetail = async (name: string) => {
    setSelectedSkill(name);
    setContentLoading(true);
    try {
      const res = await fetch(`/api/skills/${encodeURIComponent(name)}`);
      const data = await res.json();
      setSkillContent(data.content || 'No content available');
    } catch {
      setSkillContent('Failed to load skill content');
    } finally {
      setContentLoading(false);
    }
  };

  const filtered = skills.filter(s => {
    const matchesSearch = search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(skills.map(s => s.category))];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-36 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-10rem)]">
      {/* Main — Skills Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Search + Filter */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <CustomSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="input-field w-full pl-9 text-[13px]"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {categories.map(cat => {
              const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES.other;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={clsx(
                    'px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all',
                    filterCategory === cat
                      ? 'bg-brand-500/15 text-brand-300 border-brand-500/20'
                      : 'bg-surface-800/40 text-surface-400 border-surface-700/20 hover:text-surface-200',
                  )}
                >
                  {cat === 'all' ? 'All' : style.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[12px] text-surface-500 mb-3">{filtered.length} skills</p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(skill => {
            const catStyle = CATEGORY_STYLES[skill.category] || CATEGORY_STYLES.other;
            return (
              <GlassCard
                key={skill.name}
                hover
                padding="p-4"
                onClick={() => loadSkillDetail(skill.name)}
                className={selectedSkill === skill.name ? 'ring-1 ring-brand-500/30' : ''}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CustomSkills className="w-4 h-4 text-brand-400" />
                    <h4 className="text-[13px] font-bold text-surface-100 truncate">{skill.name}</h4>
                  </div>
                  <span className={clsx('px-2 py-0.5 rounded-md text-[10px] font-semibold border', catStyle.badge)}>
                    {catStyle.label}
                  </span>
                </div>
                <p className="text-[12px] text-surface-400 line-clamp-2 leading-relaxed">
                  {skill.description || 'No description'}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Right Panel — Skill Detail */}
      {selectedSkill && (
        <div className="w-80 flex-shrink-0 overflow-y-auto scrollbar-thin">
          <GlassCard padding="p-0" className="h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/20">
              <h3 className="text-[14px] font-bold text-surface-100">{selectedSkill}</h3>
              <button onClick={() => setSelectedSkill(null)} className="p-1 rounded-lg hover:bg-surface-800/50 text-surface-400 hover:text-surface-200">
                <CustomX className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              {contentLoading ? (
                <div className="space-y-2">
                  <div className="skeleton h-4 rounded w-3/4" />
                  <div className="skeleton h-4 rounded w-full" />
                  <div className="skeleton h-4 rounded w-2/3" />
                </div>
              ) : (
                <MarkdownRenderer content={skillContent} />
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
