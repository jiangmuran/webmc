import { describe, it, expect } from 'vitest';
import { summonedByDamage, hostBlock } from './silverfish_summon';

describe('silverfish summon', () => {
  it('within range included', () => {
    const r = summonedByDamage({
      damagePos: { x: 0, y: 64, z: 0 },
      infestedBlocksInRange: [
        { x: 5, y: 64, z: 5 },
        { x: 100, y: 64, z: 100 },
      ],
    });
    expect(r.length).toBe(1);
  });

  it('vertical range applies', () => {
    const r = summonedByDamage({
      damagePos: { x: 0, y: 64, z: 0 },
      infestedBlocksInRange: [{ x: 0, y: 80, z: 0 }],
    });
    expect(r.length).toBe(0);
  });

  it('host block mapping', () => {
    expect(hostBlock('infested_stone')).toBe('webmc:stone');
    expect(hostBlock('infested_deepslate')).toBe('webmc:deepslate');
  });
});
