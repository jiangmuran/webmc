import { describe, it, expect } from 'vitest';
import { findConflicts, crossCategoryConflict, type Binding } from './hotkey_conflict_check';

const clean: Binding[] = [
  { action: 'forward', key: 'KeyW', category: 'movement' },
  { action: 'attack', key: 'Mouse0', category: 'combat' },
];

const bad: Binding[] = [
  { action: 'forward', key: 'KeyW', category: 'movement' },
  { action: 'chat', key: 'KeyW', category: 'chat' },
];

describe('hotkey conflict check', () => {
  it('clean config no conflicts', () => {
    expect(findConflicts(clean)).toEqual([]);
  });

  it('duplicate key → conflict', () => {
    expect(findConflicts(bad)).toHaveLength(1);
  });

  it('conflict lists actions', () => {
    const c = findConflicts(bad);
    expect(c[0]?.actions).toContain('forward');
    expect(c[0]?.actions).toContain('chat');
  });

  it('cross-category detected', () => {
    expect(crossCategoryConflict(bad)).toBe(true);
  });

  it('clean no cross-category', () => {
    expect(crossCategoryConflict(clean)).toBe(false);
  });
});
