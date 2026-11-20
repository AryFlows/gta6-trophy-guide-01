// next-up-planner.js — the Next up planner: the next trophies in roadmap order,
// missable first, so the player always knows what to do next. Built from the same
// roadmap stages as the roadmap below and the same earned set as the checklist, so it
// moves as progress is ticked. Unearned only; a hidden trophy stays hidden while the
// spoiler setting is on, exactly as in the checklist.
import { displayName } from './spoiler-setting.js';

const DEMO_EARNED = new Set([2, 3, 4, 8, 9, 10, 15, 16, 19, 21, 28, 35]);
const EARNED_KEY = 'frost-trophy-earned-v1';
const SPOILER_KEY = 'frost-trophy-spoiler-v1';
const NEXT_UP_LIMIT = 6;

function plannerState() {
  const params = new URLSearchParams(location.search);
  let earned;
  if (params.get('demo') === '1') {
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

export function nextUpTrophies(trophies, state, limit = NEXT_UP_LIMIT) {
  const rest = trophies.filter((t) => !state.earned.has(t.id));
  rest.sort((a, b) =>
    (Number(b.missable) - Number(a.missable)) || (a.stage - b.stage) || (a.id - b.id));
  return rest.slice(0, limit);
}

function nextUpItemHtml(trophy, state, rank) {
  const count = trophy.count === null || trophy.count === undefined
    ? ''
    : ` · ×${Number(trophy.count).toLocaleString('en-US')}`;
  const flag = trophy.missable ? ' <span class="badge badge-missable">Missable</span>' : '';
  return (
    `<li class="next-up-item" data-id="${trophy.id}" tabindex="0" role="button">` +
    `<span class="next-up-rank">${rank}</span>` +
    '<div>' +
    `<div class="next-up-name">${displayName(trophy, state)}</div>` +
    `<div class="next-up-meta">Stage ${trophy.stage} · ${trophy.kind}${count}</div>` +
    '</div>' + flag +
    '</li>'
  );
}

export function renderNextUp(boxEl, trophies, state) {
  if (!boxEl) return;
  const upcoming = nextUpTrophies(trophies, state);
  const left = trophies.length - state.earned.size;
  if (upcoming.length === 0) {
    boxEl.innerHTML = '<p class="next-up-done">Every trophy earned — the platinum is yours.</p>';
    return;
  }
  boxEl.innerHTML =
    `<ol class="next-up-list">${upcoming.map((t, i) => nextUpItemHtml(t, state, i + 1)).join('')}</ol>` +
    `<p class="next-up-foot">${left} to go · missable first, then roadmap order</p>`;
  for (const item of boxEl.querySelectorAll('.next-up-item')) {
    const open = () => {
      const row = document.querySelector(`.trophy-row[data-id="${item.dataset.id}"]`);
      if (row) row.click();
      document.getElementById('guideDetail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    item.addEventListener('click', open);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  }
}

async function bootNextUpPlanner() {
  let data;
  try {
    data = await (await fetch('data/trophies.json')).json();
  } catch {
    return;
  }
  const boxEl = document.getElementById('nextUp');
  const render = () => renderNextUp(boxEl, data.trophies, plannerState());
  render();
  // Re-plan after any tick of the checklist or flip of the spoiler setting.
  document.addEventListener('change', () => setTimeout(render, 60));
}

bootNextUpPlanner();
