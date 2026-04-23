import { describe, it, expect } from 'vitest';
import { isCompatible, humanReadable, newerThan } from './handshake_version_compat';

describe('handshake version compat', () => {
  const v1 = { major: 0, minor: 1, patch: 0, protocolVersion: 1 };
  const v2 = { major: 0, minor: 1, patch: 1, protocolVersion: 1 };
  const v3 = { major: 1, minor: 0, patch: 0, protocolVersion: 2 };

  it('same protocol ok', () => {
    expect(isCompatible(v1, v2)).toBe(true);
  });

  it('different protocol not', () => {
    expect(isCompatible(v1, v3)).toBe(false);
  });

  it('version string', () => {
    expect(humanReadable(v1)).toBe('0.1.0');
  });

  it('newerThan compares', () => {
    expect(newerThan(v3, v1)).toBe(true);
    expect(newerThan(v1, v3)).toBe(false);
  });
});
