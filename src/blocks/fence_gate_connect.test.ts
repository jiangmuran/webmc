import { describe, it, expect } from 'vitest';
import {
  canPathThrough,
  connectsToFenceOn,
  interactGate,
  makeFenceGate,
  setInWall,
  setPower,
} from './fence_gate_connect';

describe('fence gate', () => {
  it('interact toggles open', () => {
    const g = makeFenceGate('north');
    interactGate({ state: g, playerFacing: 'north' });
    expect(g.open).toBe(true);
    interactGate({ state: g, playerFacing: 'north' });
    expect(g.open).toBe(false);
  });

  it('redstone opens gate', () => {
    const g = makeFenceGate('north');
    setPower(g, true);
    expect(g.open).toBe(true);
  });

  it('powered state is idempotent', () => {
    const g = makeFenceGate('north');
    setPower(g, true);
    expect(setPower(g, true)).toBe(false);
  });

  it('unpowering closes gate', () => {
    const g = makeFenceGate('north');
    setPower(g, true);
    setPower(g, false);
    expect(g.open).toBe(false);
  });

  it('in-wall flag settable', () => {
    const g = makeFenceGate('north');
    setInWall(g, true);
    expect(g.inWall).toBe(true);
  });

  it('path through open gate', () => {
    const g = makeFenceGate('north');
    g.open = true;
    expect(canPathThrough(g)).toBe(true);
  });

  it('N-S gate connects E-W fences', () => {
    const g = makeFenceGate('north');
    expect(connectsToFenceOn(g, 'east')).toBe(true);
    expect(connectsToFenceOn(g, 'north')).toBe(false);
  });
});
