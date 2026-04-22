import { describe, it, expect } from 'vitest';
import {
  bruteShouldAggro,
  makeBruteZombifyState,
  makePiglinBrute,
  tickBruteZombify,
} from './piglin_brute';

describe('piglin brute', () => {
  it('starts at 50 HP + aggro', () => {
    const b = makePiglinBrute();
    expect(b.hp).toBe(50);
    expect(b.aggro).toBe(true);
  });

  it('gold armor does not calm brutes', () => {
    expect(bruteShouldAggro({ playerWearingGold: true, playerDroppedGold: true })).toBe(true);
  });

  it('zombifies in overworld after 300s', () => {
    const z = makeBruteZombifyState();
    let done = false;
    for (let i = 0; i < 4000; i++) {
      if (tickBruteZombify(z, { inNether: false, dtSec: 0.1 })) {
        done = true;
        break;
      }
    }
    expect(done).toBe(true);
  });

  it('nether pauses conversion', () => {
    const z = makeBruteZombifyState();
    for (let i = 0; i < 4000; i++) {
      tickBruteZombify(z, { inNether: true, dtSec: 0.1 });
    }
    expect(z.converted).toBe(false);
  });
});
