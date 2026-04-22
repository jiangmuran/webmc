import { describe, it, expect } from 'vitest';
import { fishDrops, makeFish, pufferContactPoisonSeconds, tickFish } from './fish';

describe('fish', () => {
  it('cod starts at 3 HP', () => {
    expect(makeFish(1, 'cod', { x: 0, y: 0, z: 0 }).health).toBe(3);
  });

  it('dies on land after 15s', () => {
    const f = makeFish(1, 'salmon', { x: 0, y: 0, z: 0 });
    const r = tickFish(f, {
      inWater: false,
      nearestThreat: null,
      schoolMates: [],
      dtSec: 16,
    });
    expect(r.died).toBe(true);
  });

  it('cod picks a leader from schoolmates', () => {
    const a = makeFish(1, 'cod', { x: 0, y: 0, z: 0 });
    const b = makeFish(2, 'cod', { x: 1, y: 0, z: 0 });
    tickFish(a, { inWater: true, nearestThreat: null, schoolMates: [b], dtSec: 0.1 });
    expect(a.schoolLeaderId).toBe(2);
  });

  it('pufferfish puffs near threat', () => {
    const p = makeFish(1, 'pufferfish', { x: 0, y: 0, z: 0 });
    tickFish(p, {
      inWater: true,
      nearestThreat: { x: 1, y: 0, z: 0 },
      schoolMates: [],
      dtSec: 0.1,
    });
    expect(p.puffStage).toBe(2);
  });

  it('pufferfish deflates when threat leaves', () => {
    const p = makeFish(1, 'pufferfish', { x: 0, y: 0, z: 0 });
    p.puffStage = 2;
    tickFish(p, {
      inWater: true,
      nearestThreat: { x: 50, y: 0, z: 0 },
      schoolMates: [],
      dtSec: 0.1,
    });
    expect(p.puffStage).toBe(0);
  });

  it('puff-2 applies 5s poison', () => {
    expect(pufferContactPoisonSeconds(2)).toBe(5);
  });

  it('salmon drops salmon item', () => {
    expect(fishDrops('salmon')[0]?.item).toBe('webmc:salmon');
  });
});
