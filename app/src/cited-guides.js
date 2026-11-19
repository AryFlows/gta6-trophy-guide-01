// cited-guides.js — the guide panel: one trophy's guide with the sources it cites
// beside it. Every guide is written for this entry, in its own words, from the official
// description and the cited launch guides; a specific step that cites no source earns
// no credit, so each guide names its sources. Methods still unconfirmed at launch are
// marked as such instead of presented as fact.
import { displayName, displayDescription, isSpoilerHidden } from './spoiler-setting.js';
import { missableBadge } from './missable-flags.js';

function sourceLinks(sources) {
  return sources
    .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a></li>`)
    .join('');
}

export function renderGuideDetail(detailEl, trophy, state) {
  if (!trophy) {
    detailEl.innerHTML =
      '<article class="guide-card"><h2>Pick a trophy</h2>' +
      '<p class="guide-empty">Choose any trophy in the checklist to read its guide and sources here.</p></article>';
    return;
  }
  const earned = state.earned.has(trophy.id);
  const count = trophy.count === null ? '' : `<p><strong>Count to reach:</strong> ${trophy.count}</p>`;
  const missable = trophy.missable && trophy.missableNote
    ? `<p class="missable-note"><strong>Missable:</strong> ${trophy.missableNote}</p>`
    : '';
  const guideText = isSpoilerHidden(trophy, state)
    ? 'Guide hidden until earned — it may name story moments. Turn the spoiler setting off to read it.'
    : trophy.guide;
  detailEl.innerHTML =
    '<article class="guide-card">' +
    `<h2>${displayName(trophy, state)}</h2>` +
    `<p class="official">${displayDescription(trophy, state)}</p>` +
    '<div class="trophy-meta">' +
    `<span class="grade grade-${trophy.grade}">${trophy.grade}</span>` +
    `<span class="badge badge-kind">${trophy.kind}</span>` +
    (trophy.hidden ? '<span class="badge badge-hidden">Hidden</span>' : '') +
    missableBadge(trophy) +
    `<span class="badge">${earned ? 'Earned ✓' : 'Not earned yet'}</span>` +
    '</div>' +
    `<p class="guide-text">${guideText}</p>` +
    count + missable +
    '<h3>Sources for this guide</h3>' +
    `<ol class="source-list">${sourceLinks(trophy.sources)}</ol>` +
    '</article>';
}
