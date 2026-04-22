import { describe, it, expect } from 'vitest';
import { rollPeacefulDespawn, shouldDespawnOnPeaceful } from './peaceful_despawn';

describe('peaceful despawn', () => {
  it('hostiles despawn on peaceful', () => {
    expect(shouldDespawnOnPeaceful({ kind: 'zombie', persistent: false })).toBe(true);
  });

  it('persistent hostiles stay', () => {
    expect(shouldDespawnOnPeaceful({ kind: 'zombie', persistent: true })).toBe(false);
  });

  it('passives never despawn', () => {
    expect(shouldDespawnOnPeaceful({ kind: 'cow', persistent: false })).toBe(false);
  });

  it('rollPeacefulDespawn returns ids', () => {
    const out = rollPeacefulDespawn({
      difficulty: 'peaceful',
      mobs: [
        { id: 1, state: { kind: 'zombie', persistent: false } },
        { id: 2, state: { kind: 'cow', persistent: false } },
      ],
    });
    expect(out).toEqual([1]);
  });

  it('non-peaceful difficulty returns empty list', () => {
    const out = rollPeacefulDespawn({
      difficulty: 'hard',
      mobs: [{ id: 1, state: { kind: 'zombie', persistent: false } }],
    });
    expect(out.length).toBe(0);
  });
});
