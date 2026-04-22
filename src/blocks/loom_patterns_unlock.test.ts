import { describe, it, expect } from 'vitest';
import {
  makeKnown,
  learn,
  canUseInLoom,
  requiredSource,
  DEFAULT_UNLOCKED,
} from './loom_patterns_unlock';

describe('loom unlock', () => {
  it('default set', () => {
    const k = makeKnown();
    for (const p of DEFAULT_UNLOCKED) expect(canUseInLoom(k, p)).toBe(true);
  });

  it('creeper needs learn', () => {
    const k = makeKnown();
    expect(canUseInLoom(k, 'creeper')).toBe(false);
    expect(learn(k, 'creeper')).toBe(true);
    expect(canUseInLoom(k, 'creeper')).toBe(true);
  });

  it('learn idempotent', () => {
    const k = makeKnown();
    learn(k, 'skull');
    expect(learn(k, 'skull')).toBe(false);
  });

  it('source mapping', () => {
    expect(requiredSource('skull')).toBe('wither_skeleton_skull');
    expect(requiredSource('base')).toBeNull();
  });
});
