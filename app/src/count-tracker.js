// count-tracker.js — count trackers for the trophies PlayStation counts: 250 stunts,
// 42 Shooting Range challenges, 18 meditations, 100 WAiNK scans and the rest. Each
// tracker is a −/+ counter the player taps as they go, saved in this browser next to
// the checklist progress. A counter is the player's own note — ticking the trophy off
// still happens in the checklist, and a finished counter says so.
import { displayName } from './spoiler-setting.js';

const COUNTS_KEY = 'frost-trophy-counts-v1';
const EARNED_KEY = 'frost-trophy-earned-v1';
const SPOILER_KEY = 'frost-trophy-spoiler-v1';
const DEMO_EARNED = new Set([2, 3, 4, 8, 9, 10, 15, 16, 19, 21, 28, 35]);

const demo = new URLSearchParams(location.search).get('demo') === '1';
const demoCounts = new Map();

function countState() {
  const params = new URLSearchParams(location.search);
  let earned;
  if (demo) {
    earned = new Set(DEMO_EARNED);
  } else {
    try {
      const raw = JSON.parse(localStorage.getItem(EARNED_KEY) || '[]');
      earned = Array.isArray(raw)
        ? new Set(raw.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55))
        : new Set();
    } catch {
      earned = new Set();
    }
  }
  const spoiler = params.get('shot') === 'spoiler' || localStorage.getItem(SPOILER_KEY) === '1';
  return { earned, spoiler };
}

function loadCounts() {
  if (demo) return demoCounts;
  try {
    const raw = JSON.parse(localStorage.getItem(COUNTS_KEY) || '{}');
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return new Map();
    return new Map(Object.entries(raw).map(([k, v]) => [Number(k), v]));
  } catch {
    return new Map();
  }
}

function saveCounts(counts) {
  if (demo) return; // Screenshot scenes keep their counts in memory only.
  localStorage.setItem(COUNTS_KEY, JSON.stringify(Object.fromEntries(counts)));
}

export function countedTrophies(trophies) {
  return trophies
    .filter((t) => t.count !== null && t.count !== undefined)
    .sort((a, b) => (a.stage - b.stage) || (a.id - b.id));
}

function seedDemoCounts(trophies) {
  // Screenshot scenes show a player part-way: the first few counters a third full.
  const counted = countedTrophies(trophies);
  for (const trophy of counted.slice(0, 6)) {
    demoCounts.set(trophy.id, Math.max(1, Math.ceil(trophy.count / 3)));
  }
  // The missable meditation counter is the one the cover shot proves: 6 of 18.
  const meditation = trophies.find((t) => t.missable && t.count !== null);
  if (meditation) demoCounts.set(meditation.id, Math.min(6, meditation.count));
}

function countRowHtml(trophy, state, counts) {
  const current = Math.max(0, Math.min(trophy.count, Number(counts.get(trophy.id)) || 0));
  const pct = trophy.count > 0 ? Math.round((current / trophy.count) * 100) : 0;
  const done = current >= trophy.count;
  return (
    `<li class="count-row${done ? ' count-done' : ''}" data-id="${trophy.id}">` +
    `<div class="count-name">${displayName(trophy, state)}</div>` +
    '<div class="count-controls">' +
    `<button type="button" class="count-btn" data-delta="-1" aria-label="One fewer for ${displayName(trophy, state)}">−</button>` +
    `<span class="count-value">${current.toLocaleString('en-US')} / ${Number(trophy.count).toLocaleString('en-US')}</span>` +
    `<button type="button" class="count-btn" data-delta="1" aria-label="One more for ${displayName(trophy, state)}">+</button>` +
    '</div>' +
    `<div class="count-bar"><div class="count-fill" style="width: ${pct}%"></div></div>` +
    (done ? '<div class="count-note">Target reached — tick it off in the checklist.</div>' : '') +
    '</li>'
  );
}

export function renderCountTrackers(boxEl, trophies, state, counts) {
  if (!boxEl) return;
  const counted = countedTrophies(trophies);
  boxEl.innerHTML =
    `<ul class="count-list">${counted.map((t) => countRowHtml(t, state, counts)).join('')}</ul>` +
    `<p class="count-foot">${counted.length} trophies have a PlayStation count — tap + as you go.</p>`;
}

async function bootCountTracker() {
  let data;
  try {
    data = await (await fetch('data/trophies.json')).json();
  } catch {
    return;
  }
  if (demo) seedDemoCounts(data.trophies);
  const counts = loadCounts();
  const boxEl = document.getElementById('countTrackers');
  const render = () => renderCountTrackers(boxEl, data.trophies, countState(), counts);
  render();
  boxEl.addEventListener('click', (event) => {
    const button = event.target.closest('.count-btn');
    if (!button) return;
    const row = button.closest('.count-row');
    const id = Number(row.dataset.id);
    const trophy = data.trophies.find((t) => t.id === id);
    if (!trophy) return;
    const next = Math.max(0, Math.min(trophy.count, (Number(counts.get(id)) || 0) + Number(button.dataset.delta)));
    counts.set(id, next);
    saveCounts(counts);
    render();
  });
  // Re-render if the spoiler setting flips, so hidden names stay hidden.
  document.addEventListener('change', (event) => {
    if (event.target.id === 'spoilerToggle') setTimeout(render, 60);
  });
}

bootCountTracker();
