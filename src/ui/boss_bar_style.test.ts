import { describe, it, expect } from 'vitest';
import { progressFraction, notchCount } from './boss_bar_style';

const b = {
  name: 'Wither',
  hp: 150,
  maxHp: 300,
  color: 'purple' as const,
  style: 'notched_6' as const,
  visible: true,
};

describe('boss bar style', () => {
  it('half progress', () => {
    expect(progressFraction(b)).toBe(0.5);
  });

  it('clamps at 0', () => {
    expect(progressFraction({ ...b, hp: -1 })).toBe(0);
  });

  it('clamps at 1', () => {
    expect(progressFraction({ ...b, hp: 1000 })).toBe(1);
  });

  it('notch counts', () => {
    expect(notchCount('progress')).toBe(0);
    expect(notchCount('notched_20')).toBe(20);
  });
});
