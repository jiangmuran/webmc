import { describe, it, expect } from 'vitest';
import { AI_MEMORY_KEYS, MobMemory } from './mob_ai_memory';

describe('mob AI memory', () => {
  it('get returns set value', () => {
    const m = new MobMemory();
    m.set('x', 42, 10, 0);
    expect(m.get('x', 5)).toBe(42);
  });

  it('expires after TTL', () => {
    const m = new MobMemory();
    m.set('x', 42, 10, 0);
    expect(m.get('x', 20)).toBeNull();
  });

  it('has + delete', () => {
    const m = new MobMemory();
    m.set('x', 1, 10, 0);
    expect(m.has('x', 5)).toBe(true);
    m.delete('x');
    expect(m.has('x', 5)).toBe(false);
  });

  it('prune removes expired', () => {
    const m = new MobMemory();
    m.set('a', 1, 5, 0);
    m.set('b', 2, 20, 0);
    expect(m.prune(10)).toBe(1);
    expect(m.size).toBe(1);
  });

  it('key constants stable', () => {
    expect(AI_MEMORY_KEYS.LAST_HURT_BY).toBe('last_hurt_by');
    expect(AI_MEMORY_KEYS.HOME).toBe('home');
  });

  it('get auto-prunes stale entry', () => {
    const m = new MobMemory();
    m.set('x', 1, 5, 0);
    m.get('x', 100); // triggers auto-delete
    expect(m.size).toBe(0);
  });
});
