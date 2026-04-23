export interface ZipEntry {
  name: string;
}

export function isVanillaAnvilSave(entries: ZipEntry[]): boolean {
  const names = entries.map((e) => e.name.toLowerCase());
  if (!names.some((n) => n.endsWith('level.dat'))) return false;
  return names.some((n) => n.includes('region/') && n.endsWith('.mca'));
}

export function isWebmcSave(entries: ZipEntry[]): boolean {
  return entries.some((e) => e.name === 'manifest.json');
}

export function detectFormat(entries: ZipEntry[]): 'anvil' | 'webmc' | 'unknown' {
  if (isWebmcSave(entries)) return 'webmc';
  if (isVanillaAnvilSave(entries)) return 'anvil';
  return 'unknown';
}
