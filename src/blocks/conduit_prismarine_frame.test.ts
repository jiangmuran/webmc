import { describe, it, expect } from 'vitest';
import {
  blocksNeededForFullFrame,
  validFrameBlock,
  activationRadius,
  dolphinsGraceProvided,
} from './conduit_prismarine_frame';

describe('conduit prismarine frame', () => {
  it('full frame 42 blocks', () => {
    expect(blocksNeededForFullFrame()).toBe(42);
  });

  it('prismarine valid', () => {
    expect(validFrameBlock('prismarine')).toBe(true);
  });

  it('stone invalid', () => {
    expect(validFrameBlock('stone')).toBe(false);
  });

  it('dead without frame', () => {
    expect(activationRadius(0)).toBe(0);
  });

  it('radius caps', () => {
    expect(activationRadius(9999)).toBeLessThanOrEqual(96);
  });

  it('grace at activation', () => {
    expect(dolphinsGraceProvided(true, 16)).toBe(true);
    expect(dolphinsGraceProvided(false, 42)).toBe(false);
  });
});
