// missable-flags.js — the missable flags. This list has exactly ONE trophy that can
// be missed, and the flag is built from the launch guides, not guessed: PowerPyx and
// GTABase both name Positive Mental Attitude as the only potentially missable trophy,
// because Lucia's first meditation in Chapter 1 may not come back. Everything else is
// doable in free-roam after the story (there is no mission replay, but no other trophy
// is tied to a one-time moment).
export function missableTrophies(trophies) {
  return trophies.filter((t) => t.missable);
}

export function missableBadge(trophy) {
  if (!trophy.missable) return '';
  return '<span class="badge badge-missable">Missable</span>';
}

export function renderMissableBanner(bannerEl, trophies) {
  const missable = missableTrophies(trophies);
  const names = missable.map((t) => t.name).join(', ');
  bannerEl.innerHTML =
    '<article class="missable-card">' +
    '<h2>1 trophy can be missed — do this in Chapter 1</h2>' +
    `<p><span class="missable-name">${names}</span> — meditate at every spot across Leonida. ` +
    'The first meditation is Lucia on the balcony at Jason\u2019s house in Chapter 1: the morning after ' +
    '\u201cDown to Earth\u201d, talk to Lucia in the kitchen, follow her to the balcony and choose Accept. ' +
    'Do it before Chapter 1 ends — it is unconfirmed whether it counts toward the 18, so doing it is the safe choice.</p>' +
    '<p>Everything else is doable in free-roam after the story. There is no mission replay, so keep a manual ' +
    'save at the start of every chapter.</p>' +
    '<p class="sources-line">Sources: ' +
    '<a href="https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/">PowerPyx — GTA 6 Trophy Guide &amp; Roadmap</a> · ' +
    '<a href="https://cryptogames.gg/gta-6-100-completion-checklist/">CryptoGames — GTA 6 100% Completion Checklist</a></p>' +
    '</article>';
}
