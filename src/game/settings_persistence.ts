// Settings persistence. Serialize player options to a JSON blob
// suitable for localStorage or IndexedDB. Version bump triggers
// migration (simple number increment).

export interface SettingsBlob {
  schemaVersion: number;
  options: Record<string, unknown>;
}

export const CURRENT_SCHEMA = 2;

export function serialize(opts: Record<string, unknown>): string {
  const blob: SettingsBlob = { schemaVersion: CURRENT_SCHEMA, options: opts };
  return JSON.stringify(blob);
}

export function deserialize(raw: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(raw) as SettingsBlob;
    if (parsed.schemaVersion === CURRENT_SCHEMA) return parsed.options;
    return migrate(parsed);
  } catch {
    return null;
  }
}

function migrate(blob: SettingsBlob): Record<string, unknown> {
  const out = { ...blob.options };
  let v = blob.schemaVersion;
  // v1 → v2: renamed "renderDistance" → "render_distance"
  if (v === 1) {
    if ('renderDistance' in out) {
      out['render_distance'] = out['renderDistance'];
      delete out['renderDistance'];
    }
    v = 2;
  }
  return out;
}

export function schemaNeedsMigration(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw) as SettingsBlob;
    return parsed.schemaVersion !== CURRENT_SCHEMA;
  } catch {
    return false;
  }
}
