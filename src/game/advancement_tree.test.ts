import { describe, it, expect } from 'vitest';
import {
  AdvancementTree,
  fireCriterion,
  makePlayerAdvancements,
  type Advancement,
} from './advancement_tree';

function mk(id: string, parent: string | null, criteria: string[]): Advancement {
  return {
    id,
    tab: 'root',
    parent,
    title: id,
    description: id,
    icon: 'webmc:apple',
    xpReward: 0,
    hidden: false,
    criteria,
  };
}

describe('advancement tree', () => {
  it('register + get', () => {
    const t = new AdvancementTree();
    t.register(mk('a', null, ['x']));
    expect(t.get('a')?.id).toBe('a');
  });

  it('duplicate throws', () => {
    const t = new AdvancementTree();
    t.register(mk('a', null, ['x']));
    expect(() => {
      t.register(mk('a', null, ['x']));
    }).toThrow();
  });

  it('missing parent throws', () => {
    const t = new AdvancementTree();
    expect(() => {
      t.register(mk('b', 'missing', []));
    }).toThrow();
  });

  it('rootsOf returns parentless', () => {
    const t = new AdvancementTree();
    t.register(mk('a', null, []));
    t.register(mk('b', 'a', []));
    expect(t.rootsOf('root').map((r) => r.id)).toEqual(['a']);
  });

  it('childrenOf', () => {
    const t = new AdvancementTree();
    t.register(mk('a', null, []));
    t.register(mk('b', 'a', []));
    expect(t.childrenOf('a').map((c) => c.id)).toEqual(['b']);
  });

  it('depthOf', () => {
    const t = new AdvancementTree();
    t.register(mk('a', null, []));
    t.register(mk('b', 'a', []));
    t.register(mk('c', 'b', []));
    expect(t.depthOf('c')).toBe(2);
  });

  it('fires criteria and completes', () => {
    const t = new AdvancementTree();
    t.register(mk('a', null, ['x', 'y']));
    const p = makePlayerAdvancements();
    expect(fireCriterion(p, t, 'a', 'x').advancementCompleted).toBe(false);
    expect(fireCriterion(p, t, 'a', 'y').advancementCompleted).toBe(true);
    expect(p.completed.has('a')).toBe(true);
  });

  it('already-complete criterion = no-op', () => {
    const t = new AdvancementTree();
    t.register(mk('a', null, ['x']));
    const p = makePlayerAdvancements();
    fireCriterion(p, t, 'a', 'x');
    const r = fireCriterion(p, t, 'a', 'x');
    expect(r.advancementCompleted).toBe(false);
  });
});
