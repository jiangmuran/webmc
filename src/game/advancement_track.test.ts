import { describe, it, expect } from 'vitest';
import { makeProgress, fireCriterion, isVisible, type AdvancementDef } from './advancement_track';

describe('advancement', () => {
  const defs = new Map<string, AdvancementDef>([
    ['root', { id: 'root', parent: null, criteria: ['open_inventory'] }],
    ['wood', { id: 'wood', parent: 'root', criteria: ['chop_log'] }],
    ['stone_tools', { id: 'stone_tools', parent: 'wood', criteria: ['pickaxe', 'axe', 'shovel'] }],
  ]);

  it('grants on all criteria', () => {
    const p = makeProgress();
    expect(fireCriterion(defs, p, 'wood', 'chop_log')).toBe(true);
    expect(p.granted.has('wood')).toBe(true);
  });

  it('partial progress', () => {
    const p = makeProgress();
    expect(fireCriterion(defs, p, 'stone_tools', 'pickaxe')).toBe(false);
    expect(fireCriterion(defs, p, 'stone_tools', 'axe')).toBe(false);
    expect(p.granted.has('stone_tools')).toBe(false);
    expect(fireCriterion(defs, p, 'stone_tools', 'shovel')).toBe(true);
    expect(p.granted.has('stone_tools')).toBe(true);
  });

  it('unknown criterion ignored', () => {
    const p = makeProgress();
    expect(fireCriterion(defs, p, 'wood', 'something_else')).toBe(false);
  });

  it('visibility by parent', () => {
    const p = makeProgress();
    expect(isVisible(defs, p, 'root')).toBe(true);
    expect(isVisible(defs, p, 'wood')).toBe(false);
    fireCriterion(defs, p, 'root', 'open_inventory');
    expect(isVisible(defs, p, 'wood')).toBe(true);
  });
});
