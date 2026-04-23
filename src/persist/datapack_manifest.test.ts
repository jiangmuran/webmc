import { describe, it, expect } from 'vitest';
import { validateManifest, isCompatibleVersion } from './datapack_manifest';

describe('datapack manifest', () => {
  it('valid manifest', () => {
    expect(
      validateManifest({
        schemaVersion: 1,
        name: 'Test',
        description: 'Hi',
        pack_format: 1,
        webmc_min_version: '0.18.0',
      }).valid,
    ).toBe(true);
  });

  it('wrong schema', () => {
    const r = validateManifest({ schemaVersion: 2 as 1, name: 'x', pack_format: 1 });
    expect(r.valid).toBe(false);
  });

  it('unsupported pack_format', () => {
    expect(validateManifest({ schemaVersion: 1, name: 'x', pack_format: 999 }).valid).toBe(false);
  });

  it('version compat current', () => {
    expect(isCompatibleVersion('0.18.0')).toBe(true);
    expect(isCompatibleVersion('0.10.0')).toBe(true);
  });

  it('future version incompat', () => {
    expect(isCompatibleVersion('99.0.0')).toBe(false);
  });
});
