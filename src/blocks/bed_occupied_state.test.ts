import { describe, it, expect } from 'vitest';
import { headOfBedFrom, canSleep, occupy, leave, type BedBlock } from './bed_occupied_state';

const bed: BedBlock = { part: 'foot', facing: 'south', occupied: false, color: 'red' };

describe('bed occupied state', () => {
  it('south head 1 south', () => {
    expect(headOfBedFrom(bed, 'south')).toEqual({ dx: 0, dz: 1 });
  });

  it('north head 1 north', () => {
    expect(headOfBedFrom(bed, 'north')).toEqual({ dx: 0, dz: -1 });
  });

  it('sleep at night no mobs', () => {
    expect(canSleep(bed, true, false)).toBe(true);
  });

  it('no sleep if occupied', () => {
    expect(canSleep({ ...bed, occupied: true }, true, false)).toBe(false);
  });

  it('no sleep mobs near', () => {
    expect(canSleep(bed, true, true)).toBe(false);
  });

  it('occupy flags bed', () => {
    expect(occupy(bed).occupied).toBe(true);
  });

  it('leave unflags', () => {
    expect(leave({ ...bed, occupied: true }).occupied).toBe(false);
  });
});
