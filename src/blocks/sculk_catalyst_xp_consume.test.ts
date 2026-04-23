import { describe, it, expect } from 'vitest';
import { chargeGenerated, emitsSoulParticleForXp, MAX_RADIUS } from './sculk_catalyst_xp_consume';

describe('sculk catalyst xp consume', () => {
  it('close mob contributes', () => {
    expect(chargeGenerated({ mobXp: 5, distanceToDeath: 3 })).toBe(5);
  });

  it('far mob nothing', () => {
    expect(chargeGenerated({ mobXp: 5, distanceToDeath: MAX_RADIUS + 1 })).toBe(0);
  });

  it('particle emits close', () => {
    expect(emitsSoulParticleForXp({ mobXp: 5, distanceToDeath: 3 })).toBe(true);
    expect(emitsSoulParticleForXp({ mobXp: 5, distanceToDeath: 100 })).toBe(false);
  });
});
