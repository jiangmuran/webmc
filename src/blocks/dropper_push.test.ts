import { describe, it, expect } from 'vitest';
import { pickRandomNonEmpty, dispense } from './dropper_push';

describe('dropper push', () => {
  it('no slots → -1', () => {
    expect(pickRandomNonEmpty([], () => 0)).toBe(-1);
  });

  it('picks non-empty', () => {
    const idx = pickRandomNonEmpty(
      [
        { id: null, count: 0 },
        { id: 'dirt', count: 3 },
      ],
      () => 0,
    );
    expect(idx).toBe(1);
  });

  it('inserts into container', () => {
    const r = dispense([{ id: 'stone', count: 2 }], true, () => 0);
    expect(r.kind).toBe('inserted');
  });

  it('spawns item when no space', () => {
    const r = dispense([{ id: 'stone', count: 2 }], false, () => 0);
    expect(r.kind).toBe('spawned_item');
  });

  it('no-op when empty', () => {
    expect(dispense([{ id: null, count: 0 }], true, () => 0).kind).toBe('no_op');
  });
});
