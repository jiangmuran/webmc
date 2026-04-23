import { describe, it, expect } from 'vitest';
import {
  pickKind,
  shouldBranch,
  railSegmentChance,
  cobwebDensity,
  MAX_DEPTH,
} from './mineshaft_corridor';

describe('mineshaft corridor', () => {
  it('corridor common', () => {
    expect(pickKind(() => 0.1)).toBe('corridor');
  });

  it('intersection mid', () => {
    expect(pickKind(() => 0.7)).toBe('intersection');
  });

  it('stairs rare', () => {
    expect(pickKind(() => 0.9)).toBe('stairs');
  });

  it('room rarest', () => {
    expect(pickKind(() => 0.99)).toBe('room');
  });

  it('branch within depth', () => {
    expect(shouldBranch(0, () => 0.1)).toBe(true);
  });

  it('max depth stops branching', () => {
    expect(shouldBranch(MAX_DEPTH, () => 0.1)).toBe(false);
  });

  it('rail chance positive', () => {
    expect(railSegmentChance()).toBeGreaterThan(0);
  });

  it('cobweb density set', () => {
    expect(cobwebDensity()).toBeGreaterThan(0);
  });
});
