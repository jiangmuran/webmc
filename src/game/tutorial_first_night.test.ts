import { describe, it, expect } from 'vitest';
import { TutorialState } from './tutorial_first_night';

describe('tutorial', () => {
  it('welcome on load', () => {
    const t = new TutorialState();
    expect(t.fire('world_loaded')).toContain('welcome');
  });

  it('hints fire once', () => {
    const t = new TutorialState();
    t.fire('world_loaded');
    expect(t.fire('world_loaded')).toEqual([]);
  });

  it('done when all fired', () => {
    const t = new TutorialState();
    t.fire('world_loaded');
    t.fire('spawn_finished');
    t.fire('collected_log');
    t.fire('collected_planks');
    t.fire('placed_crafting_table');
    t.fire('made_wooden_pickaxe');
    t.fire('collected_cobblestone');
    t.fire('sunset');
    expect(t.done()).toBe(true);
  });

  it('not done mid-tutorial', () => {
    const t = new TutorialState();
    t.fire('world_loaded');
    expect(t.done()).toBe(false);
  });
});
