import { describe, it, expect } from 'vitest';
import { jungleTempleLayout, makePuzzle, toggleLever } from './jungle_temple';

describe('jungle temple', () => {
  it('has 2 chests', () => {
    const l = jungleTempleLayout({ x: 0, y: 60, z: 0 });
    expect(l.chestPositions.length).toBe(2);
  });

  it('has 2 arrow dispensers', () => {
    expect(jungleTempleLayout({ x: 0, y: 0, z: 0 }).arrowDispensers).toBe(2);
  });

  it('puzzle starts unsolved', () => {
    expect(makePuzzle().progress).toBe(0);
  });

  it('correct order solves the puzzle', () => {
    const p = makePuzzle();
    expect(toggleLever(p, 'lever1_up').newProgress).toBe(1);
    expect(toggleLever(p, 'lever2_up').newProgress).toBe(2);
    const final = toggleLever(p, 'lever3_up');
    expect(final.solved).toBe(true);
  });

  it('wrong order resets progress', () => {
    const p = makePuzzle();
    toggleLever(p, 'lever1_up');
    const r = toggleLever(p, 'lever3_up');
    expect(r.reset).toBe(true);
    expect(p.progress).toBe(0);
  });
});
