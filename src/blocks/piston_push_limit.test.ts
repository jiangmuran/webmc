import { describe, it, expect } from 'vitest';
import { planLinearPush, PISTON_MAX } from './piston_push_limit';

function mkQuery(line: string[]) {
  return {
    headPos: { x: 0, y: 0, z: 0 },
    direction: { x: 1, y: 0, z: 0 },
    blockAt: (x: number) => {
      const id = line[x] ?? 'air';
      const movability =
        id === 'air'
          ? ('air' as const)
          : id === 'obsidian'
            ? ('immovable' as const)
            : id === 'torch'
              ? ('destroyed_on_push' as const)
              : ('normal' as const);
      return { id, movability };
    },
  };
}

describe('piston push', () => {
  it('pushes a single block', () => {
    const p = planLinearPush(mkQuery(['stone', 'air']));
    expect(p.success).toBe(true);
    expect(p.moved.length).toBe(1);
  });

  it('blocked by immovable', () => {
    const p = planLinearPush(mkQuery(['stone', 'obsidian', 'air']));
    expect(p.success).toBe(false);
  });

  it('destroys torch', () => {
    const p = planLinearPush(mkQuery(['torch', 'air']));
    expect(p.destroyed.length).toBe(1);
  });

  it('12-cap', () => {
    const row: string[] = Array.from({ length: PISTON_MAX + 1 }, () => 'stone');
    const p = planLinearPush(mkQuery([...row, 'air']));
    expect(p.success).toBe(false);
  });

  it('12 exactly pushes', () => {
    const row: string[] = Array.from({ length: PISTON_MAX }, () => 'stone');
    const p = planLinearPush(mkQuery([...row, 'air']));
    expect(p.success).toBe(true);
    expect(p.moved.length).toBe(PISTON_MAX);
  });
});
