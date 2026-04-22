import { describe, it, expect } from 'vitest';
import {
  boneMealBamboo,
  breakBamboo,
  makeBamboo,
  rollBambooHeight,
  tryGrowBamboo,
} from './bamboo_grow';

describe('bamboo', () => {
  it('top has leaves', () => {
    expect(makeBamboo(0, true).leafStage).toBe('large');
  });

  it('non-top is bare shoot', () => {
    expect(makeBamboo(0, false).leafStage).toBe('none');
  });

  it('grows on low roll + enough light', () => {
    expect(tryGrowBamboo({ age: 5, roll: 0.001, skyLightAtTop: 15, maxHeight: 16 })).toBe('grew');
  });

  it('blocks on low light', () => {
    expect(tryGrowBamboo({ age: 5, roll: 0.001, skyLightAtTop: 3, maxHeight: 16 })).toBe('none');
  });

  it('stops at max height', () => {
    expect(tryGrowBamboo({ age: 16, roll: 0.001, skyLightAtTop: 15, maxHeight: 16 })).toBe('none');
  });

  it('height roll varies tall vs short', () => {
    const tallSeq = [0.1, 0.5];
    let i = 0;
    const tallRng = (): number => tallSeq[i++] ?? 0;
    const tall = rollBambooHeight({ rng: tallRng });
    expect(tall.height).toBeGreaterThanOrEqual(12);

    const shortSeq = [0.9, 0.1];
    let j = 0;
    const shortRng = (): number => shortSeq[j++] ?? 0;
    const short = rollBambooHeight({ rng: shortRng });
    expect(short.height).toBeLessThan(10);
  });

  it('bone meal adds height', () => {
    expect(boneMealBamboo({ currentHeight: 5, rng: () => 0.5 })).toBeGreaterThan(5);
  });

  it('sword break is instant', () => {
    const r = breakBamboo(3, true);
    expect(r.instantBreak).toBe(true);
    expect(r.drops[0]?.count).toBe(3);
  });
});
