import { describe, it, expect } from 'vitest';
import { GoalSelector, type Goal } from './ai_goal_selector';

interface Ctx {
  flee: boolean;
  wander: boolean;
  ticked: string[];
}

function mkGoal(name: string, tag: string, priority: number, pred: (c: Ctx) => boolean): Goal<Ctx> {
  return {
    name,
    tag,
    priority,
    canStart: pred,
    continues: pred,
    tick: (c) => c.ticked.push(name),
  };
}

describe('ai goal selector', () => {
  it('picks the highest-priority goal per tag', () => {
    const s = new GoalSelector<Ctx>();
    s.add(mkGoal('wander', 'move', 10, (c) => c.wander));
    s.add(mkGoal('flee', 'move', 1, (c) => c.flee));
    const ctx: Ctx = { flee: true, wander: true, ticked: [] };
    s.tick(ctx, 0.1);
    expect(s.activeNames()).toEqual(['flee']);
  });

  it('falls back when higher-priority goal stops', () => {
    const s = new GoalSelector<Ctx>();
    s.add(mkGoal('wander', 'move', 10, (c) => c.wander));
    s.add(mkGoal('flee', 'move', 1, (c) => c.flee));
    const ctx: Ctx = { flee: true, wander: true, ticked: [] };
    s.tick(ctx, 0.1);
    ctx.flee = false;
    s.tick(ctx, 0.1);
    expect(s.activeNames()).toEqual(['wander']);
  });

  it('runs one goal per tag', () => {
    const s = new GoalSelector<Ctx>();
    s.add(mkGoal('a', 'move', 1, () => true));
    s.add(mkGoal('b', 'move', 2, () => true));
    const ctx: Ctx = { flee: false, wander: false, ticked: [] };
    s.tick(ctx, 0.1);
    expect(s.activeNames().length).toBe(1);
  });

  it('different tags run in parallel', () => {
    const s = new GoalSelector<Ctx>();
    s.add(mkGoal('look', 'look', 1, () => true));
    s.add(mkGoal('walk', 'move', 1, () => true));
    const ctx: Ctx = { flee: false, wander: false, ticked: [] };
    s.tick(ctx, 0.1);
    expect(ctx.ticked.sort()).toEqual(['look', 'walk']);
  });

  it('stopAll clears active goals', () => {
    const s = new GoalSelector<Ctx>();
    s.add(mkGoal('a', 'move', 1, () => true));
    const ctx: Ctx = { flee: false, wander: false, ticked: [] };
    s.tick(ctx, 0.1);
    s.stopAll();
    expect(s.activeNames()).toEqual([]);
  });
});
