import { describe, it, expect } from 'vitest';
import { makeBucket, pickupSource, placeFromBucket } from './bucket';

describe('bucket', () => {
  it('picks up water source', () => {
    const b = makeBucket();
    const r = pickupSource({ bucket: b, sourceBlockName: 'webmc:water' });
    expect(r.picked).toBe(true);
    expect(b.fill).toBe('water');
  });

  it('refuses pickup when already filled', () => {
    const b = makeBucket('water');
    const r = pickupSource({ bucket: b, sourceBlockName: 'webmc:lava' });
    expect(r.picked).toBe(false);
  });

  it('places water from a filled bucket', () => {
    const b = makeBucket('water');
    const r = placeFromBucket({ bucket: b, targetPassable: true });
    expect(r.placed).toBe(true);
    expect(r.placedBlock).toBe('webmc:water');
    expect(b.fill).toBe('empty');
  });

  it('refuses to place on solid block', () => {
    const b = makeBucket('lava');
    const r = placeFromBucket({ bucket: b, targetPassable: false });
    expect(r.placed).toBe(false);
  });

  it("milk bucket doesn't place a block", () => {
    const b = makeBucket('milk');
    const r = placeFromBucket({ bucket: b, targetPassable: true });
    expect(r.placed).toBe(false);
  });

  it('fish bucket places water source', () => {
    const b = makeBucket('axolotl');
    const r = placeFromBucket({ bucket: b, targetPassable: true });
    expect(r.placedBlock).toBe('webmc:water');
  });
});
