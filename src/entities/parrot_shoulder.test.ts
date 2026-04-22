import { describe, it, expect } from 'vitest';
import { perch, canPerch, maybeDrop, dropAll } from './parrot_shoulder';

describe('parrot shoulder', () => {
  it('perches left then right', () => {
    const p = { shoulderEntries: [] };
    expect(perch(p, 1, 'left')).toBe(true);
    expect(perch(p, 2, 'right')).toBe(true);
    expect(perch(p, 0, 'left')).toBe(false);
  });

  it('damage drops both', () => {
    const p = { shoulderEntries: [] };
    perch(p, 0, 'left');
    perch(p, 1, 'right');
    const dropped = maybeDrop(p, 'damage');
    expect(dropped.length).toBe(2);
    expect(p.shoulderEntries.length).toBe(0);
  });

  it('sprint jump keeps perched', () => {
    const p = { shoulderEntries: [] };
    perch(p, 0, 'left');
    const dropped = maybeDrop(p, 'sprint_jump');
    expect(dropped.length).toBe(0);
    expect(p.shoulderEntries.length).toBe(1);
  });

  it('canPerch check', () => {
    const p = { shoulderEntries: [] };
    expect(canPerch(p, 'left')).toBe(true);
    perch(p, 0, 'left');
    expect(canPerch(p, 'left')).toBe(false);
  });

  it('dropAll empties', () => {
    const p = { shoulderEntries: [{ variant: 0, shoulder: 'left' as const }] };
    dropAll(p);
    expect(p.shoulderEntries.length).toBe(0);
  });
});
