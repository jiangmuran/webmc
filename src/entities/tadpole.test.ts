import { describe, it, expect } from 'vitest';
import { bucketTadpole, makeTadpole, tickTadpole } from './tadpole';

describe('tadpole', () => {
  it('starts alive in water', () => {
    const t = makeTadpole(1, { x: 0, y: 0, z: 0 });
    expect(t.health).toBe(6);
  });

  it('dies out of water after 5s', () => {
    const t = makeTadpole(1, { x: 0, y: 0, z: 0 });
    const r = tickTadpole(t, {
      inWater: false,
      currentBiome: 'plains',
      dtSec: 6,
      dtTicks: 120,
    });
    expect(r.died).toBe(true);
  });

  it('does not die with brief surface exposure', () => {
    const t = makeTadpole(1, { x: 0, y: 0, z: 0 });
    tickTadpole(t, { inWater: false, currentBiome: 'plains', dtSec: 2, dtTicks: 40 });
    const r = tickTadpole(t, { inWater: true, currentBiome: 'plains', dtSec: 0, dtTicks: 0 });
    expect(r.died).toBe(false);
    expect(t.secondsOutOfWater).toBe(0);
  });

  it('matures into biome-appropriate frog', () => {
    const t = makeTadpole(1, { x: 0, y: 0, z: 0 });
    const r = tickTadpole(t, {
      inWater: true,
      currentBiome: 'mangrove_swamp',
      dtSec: 0,
      dtTicks: 24000,
    });
    expect(r.matured).toBe(true);
    expect(r.variantOnMaturation).toBe('warm');
  });

  it('bucketing captures current age', () => {
    const t = makeTadpole(1, { x: 0, y: 0, z: 0 });
    t.growTicks = 1234;
    expect(bucketTadpole(t).ageWhenBucketed).toBe(1234);
  });
});
