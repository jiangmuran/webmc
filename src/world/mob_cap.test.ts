import { describe, it, expect } from 'vitest';
import { capForPlayers, canSpawnMore, despawnIfOverCap, BASE_CAPS } from './mob_cap';

describe('mob cap', () => {
  it('base monster 70', () => {
    expect(BASE_CAPS.monster).toBe(70);
  });

  it('scales with players', () => {
    expect(capForPlayers('monster', 2)).toBe(BASE_CAPS.monster * 2);
  });

  it('canSpawnMore when under cap', () => {
    expect(canSpawnMore('monster', 10, 1)).toBe(true);
  });

  it('no spawn at cap', () => {
    expect(canSpawnMore('monster', BASE_CAPS.monster, 1)).toBe(false);
  });

  it('despawn above 1.2×', () => {
    expect(despawnIfOverCap('monster', BASE_CAPS.monster * 2, 1)).toBe(true);
  });
});
