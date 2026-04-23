import { describe, it, expect } from 'vitest';
import { healthFraction, renderSegments, activeStackIds, type BossBar } from './boss_bar_state';

const dragon: BossBar = {
  id: 'dragon',
  title: 'Ender Dragon',
  color: 'purple',
  divisions: 0,
  health: 200,
  maxHealth: 200,
  darkenSky: true,
  playBossMusic: true,
  fog: true,
};

describe('boss bar state', () => {
  it('full at max', () => {
    expect(healthFraction(dragon)).toBe(1);
  });

  it('empty at 0', () => {
    expect(healthFraction({ ...dragon, health: 0 })).toBe(0);
  });

  it('clamp on negative', () => {
    expect(healthFraction({ ...dragon, health: -10 })).toBe(0);
  });

  it('no divisions → 1 segment', () => {
    expect(renderSegments(dragon)).toBe(1);
  });

  it('segments when divisions set', () => {
    expect(renderSegments({ ...dragon, divisions: 10 })).toBe(10);
  });

  it('active stack excludes dead', () => {
    expect(activeStackIds([dragon, { ...dragon, id: 'wither', health: 0 }])).toEqual(['dragon']);
  });
});
