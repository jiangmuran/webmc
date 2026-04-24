export interface ExportEntry {
  path: string;
  kind: 'manifest' | 'chunks' | 'players' | 'advancements' | 'stats' | 'screenshot' | 'README';
}

export function standardLayout(worldName: string): readonly ExportEntry[] {
  return [
    { path: `${worldName}/level.json`, kind: 'manifest' },
    { path: `${worldName}/chunks.bin`, kind: 'chunks' },
    { path: `${worldName}/players.json`, kind: 'players' },
    { path: `${worldName}/advancements.json`, kind: 'advancements' },
    { path: `${worldName}/stats.json`, kind: 'stats' },
    { path: `${worldName}/icon.png`, kind: 'screenshot' },
    { path: `${worldName}/README.md`, kind: 'README' },
  ];
}

export function isValidExportFilename(name: string): boolean {
  return /^[\w\-. ]+\.webmc$/.test(name);
}
