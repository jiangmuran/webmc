import { describe, it, expect } from 'vitest';
import {
  preservesAirOnLoad,
  invisibleInGame,
  usedInStructureTemplates,
  dropsNothingIfBroken,
} from './structure_void_block';

describe('structure void block', () => {
  it('preserves air', () => {
    expect(preservesAirOnLoad()).toBe(true);
  });

  it('invisible in game', () => {
    expect(invisibleInGame()).toBe(true);
  });

  it('templates only', () => {
    expect(usedInStructureTemplates()).toBe(true);
  });

  it('no drop', () => {
    expect(dropsNothingIfBroken()).toBe(true);
  });
});
