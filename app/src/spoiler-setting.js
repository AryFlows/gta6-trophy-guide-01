// spoiler-setting.js — the spoiler setting: it hides the names and descriptions of
// story (hidden) trophies until they are earned. An earned trophy always shows its
// real name; an unearned hidden one shows a placeholder instead.
export function isSpoilerHidden(trophy, state) {
  return state.spoiler && trophy.hidden && !state.earned.has(trophy.id);
}

export function displayName(trophy, state) {
  if (isSpoilerHidden(trophy, state)) return 'Hidden trophy';
  return trophy.name;
}

export function displayDescription(trophy, state) {
  if (isSpoilerHidden(trophy, state)) {
    return 'Hidden until earned — turn the spoiler setting off to reveal story trophies.';
  }
  return trophy.description;
}

export function spoilerSummary(trophies) {
  const hidden = trophies.filter((t) => t.hidden).length;
  return `${hidden} of ${trophies.length} trophies are hidden on PlayStation until earned.`;
}
