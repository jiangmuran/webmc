import { describe, it, expect } from 'vitest';
import {
  WATER_BREATHING_BONUS_SEC,
  equipTurtleShell,
  extendBreath,
  makeTurtleShell,
  turtleMasterEffects,
} from './turtle_shell';

describe('turtle shell', () => {
  it('extends breath when equipped', () => {
    const s = makeTurtleShell();
    equipTurtleShell(s);
    const out = extendBreath(s, 5, 15);
    expect(out).toBeGreaterThan(5);
  });

  it('no extension when unequipped', () => {
    const s = makeTurtleShell();
    expect(extendBreath(s, 5, 15)).toBe(5);
  });

  it('bonus constant is 10s', () => {
    expect(WATER_BREATHING_BONUS_SEC).toBe(10);
  });

  it('turtle master gives slowness + resistance', () => {
    const effs = turtleMasterEffects();
    const ids = effs.map((e) => e.id);
    expect(ids).toContain('slowness');
    expect(ids).toContain('resistance');
  });
});
