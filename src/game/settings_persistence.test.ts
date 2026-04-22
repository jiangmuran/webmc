import { describe, it, expect } from 'vitest';
import {
  serialize,
  deserialize,
  schemaNeedsMigration,
  CURRENT_SCHEMA,
} from './settings_persistence';

describe('settings persistence', () => {
  it('round-trip current', () => {
    const s = serialize({ fov: 70 });
    expect(deserialize(s)).toEqual({ fov: 70 });
  });

  it('invalid JSON = null', () => {
    expect(deserialize('not json')).toBeNull();
  });

  it('schema migration v1 → v2', () => {
    const raw = JSON.stringify({ schemaVersion: 1, options: { renderDistance: 12 } });
    const out = deserialize(raw);
    expect(out).toEqual({ render_distance: 12 });
  });

  it('migration flag', () => {
    const raw = JSON.stringify({ schemaVersion: 1, options: {} });
    expect(schemaNeedsMigration(raw)).toBe(true);
    const current = JSON.stringify({ schemaVersion: CURRENT_SCHEMA, options: {} });
    expect(schemaNeedsMigration(current)).toBe(false);
  });
});
