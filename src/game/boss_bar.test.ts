import { describe, it, expect } from 'vitest';
import { BossBarRegistry, dragonBar, witherBar } from './boss_bar';

describe('boss bars', () => {
  it('create + visible list', () => {
    const r = new BossBarRegistry();
    r.create(witherBar());
    expect(r.visibleBars().length).toBe(1);
  });

  it('dragon creates fog', () => {
    expect(dragonBar(6).createWorldFog).toBe(true);
  });

  it('setProgress clamps 0..1', () => {
    const r = new BossBarRegistry();
    r.create(witherBar());
    r.setProgress('wither', 2);
    expect(r.get('wither')?.progress).toBe(1);
    r.setProgress('wither', -1);
    expect(r.get('wither')?.progress).toBe(0);
  });

  it('hide removes from visible list', () => {
    const r = new BossBarRegistry();
    r.create(witherBar());
    r.setVisibility('wither', false);
    expect(r.visibleBars()).toEqual([]);
  });

  it('remove deletes', () => {
    const r = new BossBarRegistry();
    r.create(witherBar());
    r.remove('wither');
    expect(r.get('wither')).toBeNull();
  });

  it('unknown id set returns false', () => {
    const r = new BossBarRegistry();
    expect(r.setProgress('x', 0.5)).toBe(false);
  });
});
