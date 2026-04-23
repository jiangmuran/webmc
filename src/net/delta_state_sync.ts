// Delta state sync. Server keeps per-field version numbers; clients
// ack their last-seen version. Sender packs only fields modified since.

export interface VersionedFields {
  versions: Map<string, number>;
  values: Map<string, unknown>;
  globalVersion: number;
}

export function makeState(): VersionedFields {
  return { versions: new Map(), values: new Map(), globalVersion: 0 };
}

export function setField(s: VersionedFields, key: string, value: unknown): void {
  s.globalVersion++;
  s.versions.set(key, s.globalVersion);
  s.values.set(key, value);
}

export function buildDelta(s: VersionedFields, clientSeenVersion: number): Map<string, unknown> {
  const delta = new Map<string, unknown>();
  for (const [k, v] of s.versions) {
    if (v > clientSeenVersion) {
      const val = s.values.get(k);
      delta.set(k, val);
    }
  }
  return delta;
}

export function fieldCount(s: VersionedFields): number {
  return s.versions.size;
}

export function latestVersion(s: VersionedFields): number {
  return s.globalVersion;
}
