import { describe, it, expect } from 'vitest';
import { isSlimeChunk } from './slime_chunk_check';

describe('slime chunk check', () => {
  it('deterministic', () => {
    expect(isSlimeChunk(12345, 4, 9)).toBe(isSlimeChunk(12345, 4, 9));
  });

  it('some chunks slime', () => {
    let found = 0;
    for (let x = 0; x < 20; x++) {
      for (let z = 0; z < 20; z++) {
        if (isSlimeChunk(1, x, z)) found++;
      }
    }
    expect(found).toBeGreaterThan(0);
  });

  it('roughly 1 in 10', () => {
    let total = 0;
    let slime = 0;
    for (let x = -50; x < 50; x++) {
      for (let z = -50; z < 50; z++) {
        total++;
        if (isSlimeChunk(777, x, z)) slime++;
      }
    }
    const ratio = slime / total;
    expect(ratio).toBeGreaterThan(0.03);
    expect(ratio).toBeLessThan(0.2);
  });
});
