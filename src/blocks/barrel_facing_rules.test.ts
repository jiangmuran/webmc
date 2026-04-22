import { describe, it, expect } from 'vitest';
import {
  makeBarrel,
  canOpen,
  toggleOpen,
  canHopperInsert,
  BARREL_SIZE,
} from './barrel_facing_rules';

describe('barrel facing rules', () => {
  it('default facing up', () => {
    const b = makeBarrel();
    expect(b.facing).toBe('up');
  });

  it('slots default null', () => {
    const b = makeBarrel();
    expect(b.contents.length).toBe(BARREL_SIZE);
    expect(b.contents.every((s) => s === null)).toBe(true);
  });

  it('open even with block in front', () => {
    expect(canOpen('webmc:stone')).toBe(true);
  });

  it('toggle pulses on change', () => {
    const b = makeBarrel();
    expect(toggleOpen(b, true).pulsedRedstone).toBe(true);
    expect(toggleOpen(b, true).pulsedRedstone).toBe(false);
  });

  it('hopper insert any side', () => {
    expect(canHopperInsert()).toBe(true);
  });
});
