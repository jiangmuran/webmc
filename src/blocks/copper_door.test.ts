import { describe, it, expect } from 'vitest';
import {
  makeCopperDoor,
  oxidizeOneStage,
  rightClickOpen,
  updateCopperPower,
  waxCopperDoor,
} from './copper_door';

describe('copper door', () => {
  it('right-click toggles open state', () => {
    const d = makeCopperDoor();
    rightClickOpen(d);
    expect(d.open).toBe(true);
    rightClickOpen(d);
    expect(d.open).toBe(false);
  });

  it('power mirrors door state (wiki: activate→open, deactivate→close)', () => {
    const d = makeCopperDoor();
    updateCopperPower(d, 0);
    expect(d.open).toBe(false);
    updateCopperPower(d, 5); // activated → opens
    expect(d.open).toBe(true);
    updateCopperPower(d, 10); // sustained at different level, still open
    expect(d.open).toBe(true);
    updateCopperPower(d, 0); // deactivated → closes
    expect(d.open).toBe(false);
    updateCopperPower(d, 15); // re-activated → opens
    expect(d.open).toBe(true);
  });

  it('waxed door still responds to redstone (wiki: waxing only freezes oxidation)', () => {
    const d = makeCopperDoor();
    waxCopperDoor(d);
    expect(updateCopperPower(d, 15)).toBe(true);
    expect(d.open).toBe(true);
    // Manual right-click can still toggle even with active redstone:
    rightClickOpen(d);
    expect(d.open).toBe(false);
  });

  it('oxidation progresses until oxidized', () => {
    const d = makeCopperDoor();
    expect(oxidizeOneStage(d)).toBe(true);
    expect(d.oxidation).toBe('exposed');
    oxidizeOneStage(d);
    oxidizeOneStage(d);
    expect(d.oxidation).toBe('oxidized');
    expect(oxidizeOneStage(d)).toBe(false);
  });

  it('waxing freezes oxidation', () => {
    const d = makeCopperDoor();
    waxCopperDoor(d);
    expect(oxidizeOneStage(d)).toBe(false);
  });
});
