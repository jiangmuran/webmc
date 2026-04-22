import { describe, it, expect } from 'vitest';
import { World } from './World';
import { DimensionRegistry } from './dimension';

describe('DimensionRegistry', () => {
  it('registers and returns dimensions', () => {
    const r = new DimensionRegistry();
    r.register({ id: 'overworld', world: new World(), scale: 1, portalY: 64 });
    r.register({ id: 'nether', world: new World(), scale: 8, portalY: 64 });
    expect(r.has('overworld')).toBe(true);
    expect(r.get('nether').scale).toBe(8);
  });

  it('rejects duplicate registration', () => {
    const r = new DimensionRegistry();
    r.register({ id: 'overworld', world: new World(), scale: 1, portalY: 64 });
    expect(() => {
      r.register({ id: 'overworld', world: new World(), scale: 1, portalY: 64 });
    }).toThrow();
  });

  it('translates overworld → nether (/8) and back (*8)', () => {
    const r = new DimensionRegistry();
    r.register({ id: 'overworld', world: new World(), scale: 1, portalY: 64 });
    r.register({ id: 'nether', world: new World(), scale: 8, portalY: 64 });
    expect(r.translate('overworld', 'nether', 800, -800)).toEqual({ x: 100, z: -100 });
    expect(r.translate('nether', 'overworld', 100, -100)).toEqual({ x: 800, z: -800 });
  });
});
