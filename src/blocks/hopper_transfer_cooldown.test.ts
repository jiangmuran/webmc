import { describe, it, expect } from 'vitest';
import {
  makeHopper,
  setPowered,
  tickHopper,
  afterTransfer,
  COOLDOWN_TICKS,
} from './hopper_transfer_cooldown';

describe('hopper cooldown', () => {
  it('default can transfer', () => {
    const h = makeHopper();
    expect(tickHopper(h).canTransfer).toBe(true);
  });

  it('after transfer waits', () => {
    const h = makeHopper();
    afterTransfer(h);
    for (let i = 0; i < COOLDOWN_TICKS - 1; i++) expect(tickHopper(h).canTransfer).toBe(false);
    expect(tickHopper(h).canTransfer).toBe(true);
  });

  it('powered disables', () => {
    const h = makeHopper();
    setPowered(h, true);
    expect(tickHopper(h).canTransfer).toBe(false);
  });

  it('unpower restores', () => {
    const h = makeHopper();
    setPowered(h, true);
    setPowered(h, false);
    expect(tickHopper(h).canTransfer).toBe(true);
  });
});
