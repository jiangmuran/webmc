import { describe, it, expect } from 'vitest';
import {
  flip,
  onBlockUpdate,
  outputPower,
  TORCH_BURNOUT_THRESHOLD,
  type TorchState,
} from './redstone_torch_burnout';

describe('redstone torch burnout', () => {
  it('flips normally under threshold', () => {
    let s: TorchState = { on: true, recentFlipTicks: [], burnedOut: false };
    s = flip(s, 0);
    expect(s.burnedOut).toBe(false);
    expect(s.on).toBe(false);
  });

  it('burns out after threshold flips', () => {
    let s: TorchState = { on: true, recentFlipTicks: [], burnedOut: false };
    for (let i = 0; i < TORCH_BURNOUT_THRESHOLD; i++) s = flip(s, i);
    expect(s.burnedOut).toBe(true);
    expect(s.on).toBe(false);
  });

  it('output 0 when off', () => {
    expect(outputPower({ on: false, recentFlipTicks: [], burnedOut: false })).toBe(0);
  });

  it('output 15 when on', () => {
    expect(outputPower({ on: true, recentFlipTicks: [], burnedOut: false })).toBe(15);
  });

  it('block update re-ignites', () => {
    const s: TorchState = { on: false, recentFlipTicks: [1, 2, 3, 4], burnedOut: true };
    expect(onBlockUpdate(s).on).toBe(true);
    expect(onBlockUpdate(s).burnedOut).toBe(false);
  });
});
