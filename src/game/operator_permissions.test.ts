import { describe, it, expect } from 'vitest';
import {
  canKick,
  canBan,
  canGamemode,
  canCheatCommands,
  canStopServer,
} from './operator_permissions';

describe('operator permissions', () => {
  it('level 0 has none', () => {
    const p = { level: 0 as const };
    expect(canKick(p)).toBe(false);
    expect(canBan(p)).toBe(false);
  });

  it('level 2 can cheat and gamemode', () => {
    expect(canCheatCommands({ level: 2 })).toBe(true);
    expect(canGamemode({ level: 2 })).toBe(true);
    expect(canKick({ level: 2 })).toBe(false);
  });

  it('level 3 can kick + ban', () => {
    expect(canKick({ level: 3 })).toBe(true);
    expect(canBan({ level: 3 })).toBe(true);
  });

  it('only 4 stops server', () => {
    expect(canStopServer({ level: 4 })).toBe(true);
    expect(canStopServer({ level: 3 })).toBe(false);
  });
});
