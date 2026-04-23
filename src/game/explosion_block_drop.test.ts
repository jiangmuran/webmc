import { describe, it, expect } from 'vitest';
import { destroyed, dropsAfterBlast, dropsMobHead } from './explosion_block_drop';

describe('explosion block drop', () => {
  it('low resistance destroyed', () => {
    expect(destroyed({ id: 'dirt', blastResistance: 0.5 }, 4)).toBe(true);
  });

  it('obsidian survives TNT', () => {
    expect(destroyed({ id: 'obsidian', blastResistance: 1200 }, 4)).toBe(false);
  });

  it('lucky drop', () => {
    expect(dropsAfterBlast({ id: 'dirt', blastResistance: 0.5 }, 4, () => 0)).toBe(true);
  });

  it('unlucky no drop', () => {
    expect(dropsAfterBlast({ id: 'dirt', blastResistance: 0.5 }, 4, () => 0.9)).toBe(false);
  });

  it('charged creeper head from skeleton', () => {
    expect(dropsMobHead('charged_creeper', 'skeleton')).toBe(true);
  });

  it('normal creeper no head', () => {
    expect(dropsMobHead('creeper', 'skeleton')).toBe(false);
  });
});
