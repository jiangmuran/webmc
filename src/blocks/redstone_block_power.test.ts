import { describe, it, expect } from 'vitest';
import {
  emitsPower,
  poweredWhilePushedByPiston,
  noPowerLossToAdjacentBlocks,
} from './redstone_block_power';

describe('redstone block', () => {
  it('power 15', () => {
    expect(emitsPower()).toBe(15);
  });

  it('powered while moving', () => {
    expect(poweredWhilePushedByPiston()).toBe(true);
  });

  it('adjacent blocks untested as strong', () => {
    expect(noPowerLossToAdjacentBlocks()).toBe(false);
  });
});
