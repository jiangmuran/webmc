import { describe, it, expect } from 'vitest';
import {
  directionOf,
  verticalVelocity,
  cancelsFallDamage,
  boatBehavior,
  UP_SPEED,
  DOWN_SPEED,
} from './bubble_column_type';

describe('bubble column', () => {
  it('direction', () => {
    expect(directionOf('soul_sand')).toBe('up');
    expect(directionOf('magma_block')).toBe('down');
    expect(directionOf(null)).toBeNull();
  });

  it('velocity', () => {
    expect(verticalVelocity({ source: 'soul_sand', swimming: false })).toBe(UP_SPEED);
    expect(verticalVelocity({ source: 'magma_block', swimming: false })).toBe(DOWN_SPEED);
  });

  it('fall damage', () => {
    expect(cancelsFallDamage({ source: 'soul_sand', swimming: true })).toBe(true);
    expect(cancelsFallDamage({ source: 'magma_block', swimming: true })).toBe(false);
  });

  it('boat behavior', () => {
    expect(boatBehavior('soul_sand')).toBe('pop');
    expect(boatBehavior('magma_block')).toBe('sink');
    expect(boatBehavior(null)).toBe('normal');
  });
});
