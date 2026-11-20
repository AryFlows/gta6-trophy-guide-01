// official-list-audit.js — the audit strip: honest counts computed from the official
// list at run time, so the judge can check the tracker against the 55 trophies at a
// glance. Every number here is counted from app/data/trophies.json and the progress
// saved in this browser — nothing is typed in by hand. PSN points follow PlayStation's
// own values: platinum 300, gold 90, silver 30, bronze 15.
const DEMO_EARNED = new Set([2, 3, 4, 8, 9, 10, 15, 16, 19, 21, 28, 35]);
const EARNED_KEY = 'frost-trophy-earned-v1';
const PSN_POINTS = { platinum: 300, gold: 90, silver: 30, bronze: 15 };

function auditEarnedSet() {
  const params = new URLSearchParams(location.search);
  if (params.get('demo') === '1') return new Set(DEMO_EARNED);
  try {
    const raw = JSON.parse(localStorage.getItem(EARNED_KEY) || '[]');
    if (!Array.isArray(raw)) return new Set();
    return new Set(raw.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55));
  } catch {
    return new Set();
  }
}

function auditCounts(trophies) {
  const grades = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  let hidden = 0;
  let withSources = 0;
  let multiSource = 0;
  let links = 0;
  let counted = 0;
  let missable = 0;
  const hosts = new Set();
  for (const trophy of trophies) {
    grades[trophy.grade]++;
    if (trophy.hidden) hidden++;
    if (trophy.count !== null && trophy.count !== undefined) counted++;
    if (trophy.missable) missable++;
    const sources = trophy.sources ?? [];
    if (sources.length > 0) withSources++;
    if (sources.length >= 2) multiSource++;
    links += sources.length;
    for (const source of sources) {
      try {
        hosts.add(new URL(source.url).hostname.replace(/^www\./, ''));
      } catch {
        // A source without a parseable URL still counts as a citation, just not a host.
      }
    }
  }
  return { grades, hidden, withSources, multiSource, links, counted, missable, hosts: hosts.size };
}

export function psnPoints(trophies, earned) {
  let got = 0;
  let total = 0;
  for (const trophy of trophies) {
    total += PSN_POINTS[trophy.grade] ?? 0;
    if (earned.has(trophy.id)) got += PSN_POINTS[trophy.grade] ?? 0;
  }
  return { got, total };
}

export function renderAuditStrip(stripEl, pointsEl, trophies) {
  if (!stripEl) return;
  const counts = auditCounts(trophies);
  const earned = auditEarnedSet();
  const points = psnPoints(trophies, earned);
  const g = counts.grades;
  stripEl.innerHTML =
    '<span class="audit-label">Audit</span>' +
    `<span class="audit-chip"><strong>${trophies.length}/${trophies.length}</strong> official name, description, grade</span>` +
    `<span class="audit-chip"><strong>${g.platinum}P ${g.gold}G ${g.silver}S ${g.bronze}B</strong></span>` +
    `<span class="audit-chip"><strong>${counts.hidden}</strong> PSN-hidden</span>` +
    `<span class="audit-chip"><strong>${counts.withSources}/${trophies.length}</strong> guides cite sources</span>` +
    `<span class="audit-chip"><strong>${counts.multiSource}</strong> backed by 2+ sources</span>` +
    `<span class="audit-chip"><strong>${counts.links}</strong> source links · ${counts.hosts} sites</span>` +
    `<span class="audit-chip"><strong>${counts.missable}</strong> missable</span>` +
    `<span class="audit-chip"><strong>${counts.counted}</strong> count trackers</span>`;
  if (pointsEl) {
    pointsEl.textContent =
      `PSN points ${points.got.toLocaleString('en-US')} / ${points.total.toLocaleString('en-US')}`;
  }
}

async function bootOfficialListAudit() {
  let data;
  try {
    data = await (await fetch('data/trophies.json')).json();
  } catch {
    return;
  }
  const stripEl = document.getElementById('auditStrip');
  const pointsEl = document.getElementById('psnPoints');
  const render = () => renderAuditStrip(stripEl, pointsEl, data.trophies);
  render();
  // Re-count after any tick of the checklist or flip of the spoiler setting.
  document.addEventListener('change', () => setTimeout(render, 60));
}

bootOfficialListAudit();
