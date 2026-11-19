// roadmap-platinum.js — the roadmap to the platinum: five stages built from the
// official descriptions, in the order to earn them. Story first (with the one missable
// meditation done in Chapter 1), then character finales, activities, collectibles, and
// finally money, mayhem and the 100% checklist. Times are PowerPyx's estimates.
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Story first',
    time: '60–80 hours · Chapters 1–5',
    blurb: 'Play the main missions in order. Do Lucia\u2019s balcony meditation in Chapter 1 before the chapter ends (the one missable trophy), and keep a manual save at the start of every chapter — there is no mission replay.',
  },
  {
    stage: 2,
    title: 'Stage 2 — Character finales & strangers',
    time: 'about 10 hours',
    blurb: 'Finish the mission strands for Andy, Kenton, Billy, Randy and Tyrone, and complete 8 stranger strands across Leonida. There are more strands than needed, so pick the short ones first.',
  },
  {
    stage: 3,
    title: 'Stage 3 — Activities & skills',
    time: 'about 40 hours',
    blurb: 'Gold all 42 Shooting Range challenges, land 250 stunts, win 20 races and 14 drone races, fish with Cal, bowl, meditate at the remaining spots, and finish 50 challenges.',
  },
  {
    stage: 4,
    title: 'Stage 4 — Collectibles & the map',
    time: 'about 30 hours',
    blurb: 'WAiNK-scan 100 locations, discover 100 vehicles, explore all 52 areas, complete 3 card sets, buy all 8 garages, register 10 vehicles, hunt Bret\u2019s unique animal, and rob one illegal operation per gang.',
  },
  {
    stage: 5,
    title: 'Stage 5 — Money, mayhem & the platinum',
    time: 'about 30 hours · then the 100% checklist',
    blurb: 'Launder $250,000 of Marked Bills, spend $100,000, rob 5 bank vaults, and mop up the one-off trophies. Then finish the 100% checklist (Progress, then Stats) for A Long Road — and the platinum pops with it. Around 200 hours all in, per PowerPyx.',
  },
];

export function renderRoadmap(boxEl, trophies, state) {
  const byStage = new Map();
  for (const t of trophies) {
    if (!byStage.has(t.stage)) byStage.set(t.stage, []);
    byStage.get(t.stage).push(t);
  }
  const cards = ROADMAP_STAGES.map((s) => {
    const items = (byStage.get(s.stage) ?? [])
      .map((t) => {
        const earned = state.earned.has(t.id);
        return `<li class="${earned ? 'earned-item' : ''}">${earned ? '✓' : '☐'} ${t.name}</li>`;
      })
      .join('');
    return (
      `<article class="stage"><h3>${s.title}</h3>` +
      `<div class="stage-time">${s.time}</div><p>${s.blurb}</p><ul>${items}</ul></article>`
    );
  }).join('');
  boxEl.innerHTML =
    '<h2>Roadmap to the platinum</h2>' +
    '<p class="roadmap-intro">Five stages, in order. The story takes 60–80 hours; the whole platinum about 200 hours (PowerPyx). ' +
    'Nothing except the Chapter 1 meditation is missable — everything else waits for you in free-roam after the credits.</p>' +
    `<div class="stage-grid">${cards}</div>`;
}
