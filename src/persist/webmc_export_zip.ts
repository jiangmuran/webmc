// .webmc export/import manifest. A world is zipped into a single
// download; includes world data + player data + manifest.

export interface WebmcManifest {
  schemaVersion: number;
  worldName: string;
  seed: string;
  createdMs: number;
  lastPlayedMs: number;
  chunkCount: number;
  playerCount: number;
}

export const MANIFEST_SCHEMA_VERSION = 1;

export function createManifest(p: Omit<WebmcManifest, 'schemaVersion'>): WebmcManifest {
  return { schemaVersion: MANIFEST_SCHEMA_VERSION, ...p };
}

export function validateImport(m: WebmcManifest): { ok: boolean; reason?: string } {
  if (m.schemaVersion !== MANIFEST_SCHEMA_VERSION) {
    return { ok: false, reason: 'incompatible schema' };
  }
  if (!m.worldName) return { ok: false, reason: 'missing worldName' };
  if (m.chunkCount < 0) return { ok: false, reason: 'invalid chunkCount' };
  return { ok: true };
}

export function exportFilename(m: WebmcManifest): string {
  const safe = m.worldName.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${safe}.webmc`;
}
