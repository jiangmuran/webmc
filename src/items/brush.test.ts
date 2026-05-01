import { describe, it, expect } from 'vitest';
import { brushOnce, makeBrushState, rollBrushLoot } from './brush';

describe('brush', () => {
  it('reveals after 96 brushes (wiki: 4.8 sec)', () => {
    const s = makeBrushState();
    for (let i = 0; i < 95; i++) {
      const r = brushOnce(s, 'suspicious_sand');
      expect(r.revealed).toBe(false);
    }
    const final = brushOnce(s, 'suspicious_sand');
    expect(final.revealed).toBe(true);
    expect(final.baseBlock).toBe('webmc:sand');
  });

  it('gravel variant resolves to gravel', () => {
    const s = makeBrushState();
    for (let i = 0; i < 96; i++) brushOnce(s, 'suspicious_gravel');
    const again = brushOnce(s, 'suspicious_gravel');
    expect(again.revealed).toBe(false);
    expect(s.done).toBe(true);
  });

  it('loot rolls pick a pool entry', () => {
    const item = rollBrushLoot('desert_pyramid', 0.01);
    expect(item).toBe('webmc:archer_pottery_sherd');
  });

  it('high roll yields last entry', () => {
    const item = rollBrushLoot('trail_ruins_rare', 0.99);
    expect(item).toContain('music_disc');
  });
});
