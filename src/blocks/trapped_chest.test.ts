import { describe, it, expect } from 'vitest';
import { closeChest, makeTrappedChest, openChest, signalStrength } from './trapped_chest';

describe('trapped chest', () => {
  it('no viewers → 0 signal', () => {
    expect(signalStrength(makeTrappedChest())).toBe(0);
  });

  it('1 viewer → 1 signal', () => {
    const t = makeTrappedChest();
    openChest(t, 'alice');
    expect(signalStrength(t)).toBe(1);
  });

  it('signal caps at 15', () => {
    const t = makeTrappedChest();
    for (let i = 0; i < 50; i++) openChest(t, `p${i.toString()}`);
    expect(signalStrength(t)).toBe(15);
  });

  it('closing drops signal', () => {
    const t = makeTrappedChest();
    openChest(t, 'alice');
    openChest(t, 'bob');
    closeChest(t, 'alice');
    expect(signalStrength(t)).toBe(1);
  });
});
