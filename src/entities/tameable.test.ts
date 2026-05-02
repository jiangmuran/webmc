import { describe, it, expect } from 'vitest';
import { dyeCollar, makeTameable, toggleSit, tryTame } from './tameable';

describe('tameable', () => {
  it('bone sometimes tames wolf', () => {
    let tamed = 0;
    for (let i = 0; i < 500; i++) {
      const w = makeTameable('wolf');
      if (tryTame(w, 1, 'webmc:bone', Math.random).tamed) tamed++;
    }
    expect(tamed).toBeGreaterThan(100);
    expect(tamed).toBeLessThan(400);
  });

  it('non-tame item never tames', () => {
    const w = makeTameable('wolf');
    const r = tryTame(w, 1, 'webmc:stone', () => 0);
    expect(r.tamed).toBe(false);
    expect(r.consumed).toBe(false);
  });

  it('sit toggles only for owner', () => {
    const w = makeTameable('wolf');
    tryTame(w, 1, 'webmc:bone', () => 0.01);
    expect(toggleSit(w, 1)).toBe(true);
    expect(w.sitting).toBe(true);
    expect(toggleSit(w, 99)).toBe(false);
  });

  it('dye collar requires tamed wolf', () => {
    const w = makeTameable('wolf');
    expect(dyeCollar(w, '#ff00ff')).toBe(false);
    tryTame(w, 1, 'webmc:bone', () => 0.01);
    dyeCollar(w, '#00ff00');
    expect(w.collarColor).toBe('#00ff00');
  });

  it('cat needs raw fish', () => {
    // 1.13+ name. raw_fish was renamed to cod (and not registered in
    // this project), so the cat tame food list now references cod.
    const c = makeTameable('cat');
    expect(tryTame(c, 1, 'webmc:cod', () => 0.01).tamed).toBe(true);
  });
});
