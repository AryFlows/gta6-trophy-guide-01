// trophy-tracker.js — the checklist tracker: renders the rows, ticks progress, filters
// by kind, and searches names and guides. Progress is saved in the browser (localStorage)
// by main.js; this module only reads state and reports clicks back.
import { displayName, displayDescription } from './spoiler-setting.js';
import { missableBadge } from './missable-flags.js';

export const FILTERS = [
  { key: 'all', label: 'All 55' },
  { key: 'story', label: 'Story' },
  { key: 'missable', label: 'Missable' },
  { key: 'collectibles', label: 'Collectibles' },
  { key: 'activities', label: 'Activities' },
  { key: 'online', label: 'Online' },
];

export function filteredTrophies(state) {
  const q = state.query.trim().toLowerCase();
  return state.trophies.filter((t) => {
    if (state.filter === 'story' && t.kind !== 'story') return false;
    if (state.filter === 'missable' && !t.missable) return false;
    if (state.filter === 'collectibles' && t.kind !== 'collectibles') return false;
    if (state.filter === 'activities' && t.kind !== 'activities') return false;
    if (state.filter === 'online') return false;
    if (q !== '' && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q))) return false;
    return true;
  });
}

export function progressCounts(trophies, earned) {
  const counts = { total: trophies.length, earned: 0, platinum: 0, gold: 0, silver: 0, bronze: 0 };
  const earnedByGrade = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) {
    counts[t.grade]++;
    if (earned.has(t.id)) {
      counts.earned++;
      earnedByGrade[t.grade]++;
    }
  }
  counts.earnedByGrade = earnedByGrade;
  return counts;
}

function stageLabel(trophy) {
  return `Roadmap stage ${trophy.stage}`;
}

function rowHtml(trophy, state) {
  const earned = state.earned.has(trophy.id);
  const selected = state.selectedId === trophy.id;
  const count = trophy.count === null ? '' : `<span class="badge badge-count">×${trophy.count}</span>`;
  const hidden = trophy.hidden ? '<span class="badge badge-hidden">Hidden</span>' : '';
  return (
    `<li class="trophy-row${earned ? ' earned' : ''}${selected ? ' selected' : ''}" data-id="${trophy.id}" tabindex="0" role="button" aria-pressed="${earned}">` +
    `<input type="checkbox" ${earned ? 'checked' : ''} aria-label="Mark ${displayName(trophy, state)} as earned">` +
    '<div>' +
    `<div class="trophy-name">${displayName(trophy, state)}</div>` +
    `<div class="trophy-desc">${displayDescription(trophy, state)}</div>` +
    '<div class="trophy-meta">' +
    `<span class="grade grade-${trophy.grade}">${trophy.grade}</span>` +
    `<span class="badge badge-kind">${trophy.kind}</span>` +
    count + hidden + missableBadge(trophy) +
    '</div></div>' +
    `<div class="trophy-grade-side"><div class="trophy-stage">${stageLabel(trophy)}</div></div>` +
    '</li>'
  );
}

export function renderTrophyList(listEl, noteEl, state, onToggle, onSelect) {
  const rows = filteredTrophies(state);
  if (state.filter === 'online') {
    listEl.innerHTML = '';
    noteEl.textContent = 'No online trophies — every trophy is single-player. Source: PowerPyx — GTA 6 Trophy Guide & Roadmap (0 online trophies).';
    return;
  }
  noteEl.textContent =
    rows.length === state.trophies.length
      ? `${rows.length} trophies — tick each one as you earn it; progress is saved in this browser.`
      : `Showing ${rows.length} of ${state.trophies.length} trophies.`;
  listEl.innerHTML = rows.map((t) => rowHtml(t, state)).join('');
  for (const row of listEl.querySelectorAll('.trophy-row')) {
    const id = Number(row.dataset.id);
    const box = row.querySelector('input[type="checkbox"]');
    box.addEventListener('change', (event) => {
      event.stopPropagation();
      onToggle(id);
    });
    row.addEventListener('click', (event) => {
      if (event.target === box) return;
      onSelect(id);
    });
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(id);
      }
    });
  }
}
