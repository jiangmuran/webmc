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

  it('power toggles on rising edge only', () => {
    const d = makeCopperDoor();
    updateCopperPower(d, 0);
    expect(d.open).toBe(false);
    updateCopperPower(d, 5);
    expect(d.open).toBe(true);
    updateCopperPower(d, 5); // sustained
    expect(d.open).toBe(true);
    updateCopperPower(d, 0);
    updateCopperPower(d, 10);
    expect(d.open).toBe(false);
  });

  it('waxed door still right-clicks but ignores power', () => {
    const d = makeCopperDoor();
    waxCopperDoor(d);
    expect(updateCopperPower(d, 15)).toBe(false);
    rightClickOpen(d);
    expect(d.open).toBe(true);
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
