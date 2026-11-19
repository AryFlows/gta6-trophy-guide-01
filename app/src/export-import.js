// export-import.js — export progress to a file and import it back. Progress lives only
// in this browser's localStorage; export writes a JSON file you can keep or move to
// another browser, and import reads one back. Nothing leaves the machine except the
// file you choose to download.
export function exportProgress(state) {
  const payload = {
    app: 'frost-trophy-guide',
    version: 1,
    game: 'Grand Theft Auto VI',
    earned: [...state.earned].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'frost-trophy-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return payload.earned.length;
}

export function parseImportedProgress(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  const earned = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(earned)) throw new Error('That file holds no earned list.');
  const ids = earned.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55);
  if (ids.length === 0 && earned.length > 0) throw new Error('That file holds no trophy ids from 1 to 55.');
  return new Set(ids);
}
