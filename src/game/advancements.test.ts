import { describe, it, expect } from 'vitest';
import { AdvancementTracker } from './advancements';

describe('AdvancementTracker', () => {
  it('ships 10+ default advancements', () => {
    const t = new AdvancementTracker();
    expect(t.total()).toBeGreaterThanOrEqual(10);
    expect(t.progress()).toBe(0);
  });

  it('unlocks getting_wood on a log break', () => {
    const t = new AdvancementTracker();
    const unlocked = t.notify({ kind: 'break_block', blockName: 'webmc:oak_log' });
    expect(unlocked.some((d) => d.id === 'getting_wood')).toBe(true);
    expect(t.has('getting_wood')).toBe(true);
  });

  it('does not unlock child without parent completion', () => {
    const t = new AdvancementTracker();
    // Try to craft pickaxe before crafting_table
    const unlocked = t.notify({ kind: 'craft', itemName: 'webmc:wood_pickaxe' });
    expect(unlocked.some((d) => d.id === 'time_to_mine')).toBe(false);
  });

  it('progresses through the crafting chain', () => {
    const t = new AdvancementTracker();
    t.notify({ kind: 'break_block', blockName: 'webmc:oak_log' });
    t.notify({ kind: 'craft', itemName: 'webmc:crafting_table' });
    const r = t.notify({ kind: 'craft', itemName: 'webmc:wood_pickaxe' });
    expect(r.some((d) => d.id === 'time_to_mine')).toBe(true);
  });

  it('monster_hunter unlocks on zombie kill', () => {
    const t = new AdvancementTracker();
    const r = t.notify({ kind: 'kill_mob', mobKind: 'zombie' });
    expect(r.some((d) => d.id === 'monster_hunter')).toBe(true);
  });

  it('serialize + hydrate round-trips completed ids', () => {
    const a = new AdvancementTracker();
    a.notify({ kind: 'break_block', blockName: 'webmc:oak_log' });
    const state = a.serialize();
    const b = new AdvancementTracker();
    b.hydrate(state);
    expect(b.has('getting_wood')).toBe(true);
  });

  it('experienced advancement fires at level 30', () => {
    const t = new AdvancementTracker();
    const r = t.notify({ kind: 'level_up', level: 30 });
    expect(r.some((d) => d.id === 'experienced')).toBe(true);
  });
});
