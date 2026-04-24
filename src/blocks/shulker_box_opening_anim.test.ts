import { describe, it, expect } from 'vitest';
import {
  startOpen,
  startClose,
  tick,
  progress,
  collidesWithPlayer,
  OPEN_TICKS,
  type ShulkerBoxAnim,
} from './shulker_box_opening_anim';

const idle: ShulkerBoxAnim = { ticks: OPEN_TICKS, isOpening: false, isClosing: false };

describe('shulker box opening anim', () => {
  it('start open sets flag', () => {
    expect(startOpen(idle).isOpening).toBe(true);
  });

  it('start close sets flag', () => {
    expect(startClose(idle).isClosing).toBe(true);
  });

  it('tick advances', () => {
    expect(tick({ ticks: 5, isOpening: true, isClosing: false }).ticks).toBe(6);
  });

  it('tick at max idles', () => {
    expect(tick(idle).isOpening).toBe(false);
  });

  it('progress 0-1', () => {
    expect(progress({ ticks: OPEN_TICKS / 2, isOpening: true, isClosing: false })).toBeCloseTo(0.5);
  });

  it('opening pushes up/down', () => {
    expect(collidesWithPlayer({ ticks: 5, isOpening: true, isClosing: false }, 'up')).toBe(true);
    expect(collidesWithPlayer({ ticks: 5, isOpening: true, isClosing: false }, 'side')).toBe(false);
  });
});
