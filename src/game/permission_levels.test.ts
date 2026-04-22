import { describe, it, expect } from 'vitest';
import { commandLevel, canRun, setOpLevel } from './permission_levels';

describe('permissions', () => {
  it('level lookup', () => {
    expect(commandLevel('help')).toBe(0);
    expect(commandLevel('stop')).toBe(4);
    expect(commandLevel('unknown')).toBeNull();
  });

  it('canRun by level', () => {
    const p = { name: 'Steve', level: 0 as const };
    expect(canRun(p, 'help')).toBe(true);
    expect(canRun(p, 'give')).toBe(false);
  });

  it('setOpLevel elevates', () => {
    const p = { name: 'Steve', level: 0 as 0 | 1 | 2 | 3 | 4 };
    setOpLevel(p, 3);
    expect(canRun(p, 'kick')).toBe(true);
  });

  it('unknown command denied', () => {
    const p = { name: 'Steve', level: 4 as const };
    expect(canRun(p, 'foo')).toBe(false);
  });
});
