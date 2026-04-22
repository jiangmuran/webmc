import { describe, it, expect } from 'vitest';
import {
  addTicks,
  isInsomniac,
  makeInsomnia,
  onSleep,
  phantomSpawnChance,
} from './phantom_insomnia';

describe('phantom insomnia', () => {
  it('fresh state is not insomniac', () => {
    const s = makeInsomnia();
    expect(isInsomniac(s)).toBe(false);
  });

  it('3+ days without sleep → insomniac', () => {
    const s = makeInsomnia();
    addTicks(s, 24000 * 3);
    expect(isInsomniac(s)).toBe(true);
  });

  it('sleeping resets the counter', () => {
    const s = makeInsomnia();
    addTicks(s, 24000 * 5);
    onSleep(s);
    expect(isInsomniac(s)).toBe(false);
  });

  it('no phantoms during the day even if insomniac', () => {
    const s = makeInsomnia();
    addTicks(s, 24000 * 5);
    expect(phantomSpawnChance(s, false)).toBe(0);
  });

  it('spawn chance caps at 15%', () => {
    const s = makeInsomnia();
    addTicks(s, 24000 * 100);
    expect(phantomSpawnChance(s, true)).toBe(0.15);
  });
});
