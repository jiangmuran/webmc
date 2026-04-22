import { describe, it, expect } from 'vitest';
import { type RedstoneBlock, keyOf } from './signal';
import { RedstoneWorld } from './RedstoneWorld';

function lookupFromGrid(
  grid: Map<string, RedstoneBlock>,
): (x: number, y: number, z: number) => RedstoneBlock {
  return (x, y, z) => grid.get(keyOf({ x, y, z })) ?? { kind: 'none', opaque: false };
}

describe('RedstoneWorld', () => {
  it('lever flip powers a directly adjacent door within one tick', () => {
    const grid = new Map<string, RedstoneBlock>();
    const leverPos = { x: 0, y: 0, z: 0 };
    const doorPos = { x: 1, y: 0, z: 0 };
    grid.set(keyOf(leverPos), { kind: 'lever', opaque: false });
    grid.set(keyOf(doorPos), { kind: 'door', opaque: false });
    const rw = new RedstoneWorld({ tickHz: 10 });
    rw.registerDoor(doorPos);
    rw.toggleLever(leverPos);
    rw.tick(0.2, lookupFromGrid(grid));
    expect(rw.isDoorOpen(doorPos)).toBe(true);
  });

  it('lever toggle off closes the door on next tick', () => {
    const grid = new Map<string, RedstoneBlock>();
    const leverPos = { x: 0, y: 0, z: 0 };
    const doorPos = { x: 1, y: 0, z: 0 };
    grid.set(keyOf(leverPos), { kind: 'lever', opaque: false });
    grid.set(keyOf(doorPos), { kind: 'door', opaque: false });
    const rw = new RedstoneWorld({ tickHz: 10 });
    rw.registerDoor(doorPos);
    rw.toggleLever(leverPos);
    rw.tick(0.2, lookupFromGrid(grid));
    rw.toggleLever(leverPos);
    rw.tick(0.2, lookupFromGrid(grid));
    expect(rw.isDoorOpen(doorPos)).toBe(false);
  });

  it('button press holds the door open for buttonHoldSec', () => {
    const grid = new Map<string, RedstoneBlock>();
    const buttonPos = { x: 0, y: 0, z: 0 };
    const doorPos = { x: 1, y: 0, z: 0 };
    grid.set(keyOf(buttonPos), { kind: 'button', opaque: false });
    grid.set(keyOf(doorPos), { kind: 'door', opaque: false });
    const rw = new RedstoneWorld({ tickHz: 10, buttonHoldSec: 1 });
    rw.registerDoor(doorPos);
    rw.pressButton(buttonPos);
    rw.tick(0.2, lookupFromGrid(grid));
    expect(rw.isDoorOpen(doorPos)).toBe(true);
    // Advance past the 1s hold.
    rw.tick(0.9, lookupFromGrid(grid));
    rw.tick(0.1, lookupFromGrid(grid));
    expect(rw.isDoorOpen(doorPos)).toBe(false);
  });

  it('pressure plate pulses the circuit while registered', () => {
    const grid = new Map<string, RedstoneBlock>();
    const platePos = { x: 0, y: 0, z: 0 };
    const doorPos = { x: 1, y: 0, z: 0 };
    grid.set(keyOf(platePos), { kind: 'pressure_plate', opaque: false });
    grid.set(keyOf(doorPos), { kind: 'door', opaque: false });
    const rw = new RedstoneWorld({ tickHz: 10 });
    rw.registerPlate(platePos);
    rw.registerDoor(doorPos);
    rw.tick(0.2, lookupFromGrid(grid));
    expect(rw.isDoorOpen(doorPos)).toBe(true);
  });

  it('breaking dust between source and door closes it on the next tick', () => {
    const grid = new Map<string, RedstoneBlock>();
    const leverPos = { x: 0, y: 0, z: 0 };
    grid.set(keyOf(leverPos), { kind: 'lever', opaque: false });
    grid.set(keyOf({ x: 1, y: 0, z: 0 }), { kind: 'dust', opaque: false });
    grid.set(keyOf({ x: 2, y: 0, z: 0 }), { kind: 'dust', opaque: false });
    const doorPos = { x: 3, y: 0, z: 0 };
    grid.set(keyOf(doorPos), { kind: 'door', opaque: false });
    const rw = new RedstoneWorld({ tickHz: 10 });
    rw.registerDoor(doorPos);
    rw.toggleLever(leverPos);
    rw.tick(0.2, lookupFromGrid(grid));
    expect(rw.isDoorOpen(doorPos)).toBe(true);
    // Break the middle dust.
    grid.delete(keyOf({ x: 2, y: 0, z: 0 }));
    rw.tick(0.2, lookupFromGrid(grid));
    expect(rw.isDoorOpen(doorPos)).toBe(false);
  });

  it('tickPeriodSec reflects configured tick rate', () => {
    expect(new RedstoneWorld({ tickHz: 10 }).tickPeriodSec).toBeCloseTo(0.1);
    expect(new RedstoneWorld({ tickHz: 20 }).tickPeriodSec).toBeCloseTo(0.05);
  });
});
