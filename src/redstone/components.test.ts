import { describe, it, expect } from 'vitest';
import {
  comparatorFromContainer,
  compareSignals,
  hopperStep,
  makeObserver,
  makeRepeater,
  observerOutput,
  tickObserver,
  tickRepeater,
  type ItemStackSlot,
} from './components';

describe('repeater', () => {
  it('propagates a high signal after exactly `delay` ticks', () => {
    let r = makeRepeater(3);
    expect(r.output).toBe(false);
    r = tickRepeater(r, true);
    expect(r.output).toBe(false);
    r = tickRepeater(r, false);
    expect(r.output).toBe(false);
    r = tickRepeater(r, false);
    expect(r.output).toBe(true);
  });

  it('locked repeater ignores input', () => {
    let r = { ...makeRepeater(1), locked: true };
    r = tickRepeater(r, true);
    expect(r.output).toBe(false);
  });
});

describe('comparator', () => {
  it('compare mode: passes back when back >= max(sides)', () => {
    expect(compareSignals(10, 5, 3, 'compare')).toBe(10);
    expect(compareSignals(4, 5, 0, 'compare')).toBe(0);
  });

  it('subtract mode: back - max(sides)', () => {
    expect(compareSignals(10, 3, 7, 'subtract')).toBe(3);
    expect(compareSignals(5, 10, 2, 'subtract')).toBe(0);
  });

  it('container signal scales with fill', () => {
    expect(comparatorFromContainer([])).toBe(0);
    expect(comparatorFromContainer([{ count: 0, maxStack: 64 }])).toBe(0);
    expect(comparatorFromContainer([{ count: 1, maxStack: 64 }])).toBe(1);
    expect(comparatorFromContainer([{ count: 64, maxStack: 64 }])).toBe(15);
  });
});

describe('observer', () => {
  it('pulses for one tick after observed hash changes', () => {
    let o = makeObserver();
    o = tickObserver(o, 10);
    expect(observerOutput(o)).toBe(true);
    o = tickObserver(o, 10);
    expect(observerOutput(o)).toBe(false);
  });

  it('repeats pulse each time the hash changes', () => {
    let o = makeObserver();
    o = tickObserver(o, 1);
    expect(observerOutput(o)).toBe(true);
    o = tickObserver(o, 1);
    expect(observerOutput(o)).toBe(false);
    o = tickObserver(o, 2);
    expect(observerOutput(o)).toBe(true);
  });
});

describe('hopper', () => {
  const maxStack = (): number => 64;

  it('moves one item from source to empty dest', () => {
    const src: (ItemStackSlot | null)[] = [{ itemId: 5, count: 3, damage: 0 }];
    const dest: (ItemStackSlot | null)[] = [null];
    const r = hopperStep(src, dest, maxStack);
    expect(r.transferred).toBe(true);
    expect(r.source[0]?.count).toBe(2);
    expect(r.dest[0]?.count).toBe(1);
  });

  it('merges into matching dest slot', () => {
    const src: (ItemStackSlot | null)[] = [{ itemId: 5, count: 3, damage: 0 }];
    const dest: (ItemStackSlot | null)[] = [{ itemId: 5, count: 10, damage: 0 }];
    const r = hopperStep(src, dest, maxStack);
    expect(r.dest[0]?.count).toBe(11);
  });

  it('refuses when dest is full', () => {
    const src: (ItemStackSlot | null)[] = [{ itemId: 5, count: 3, damage: 0 }];
    const dest: (ItemStackSlot | null)[] = [{ itemId: 5, count: 64, damage: 0 }];
    const r = hopperStep(src, dest, maxStack);
    expect(r.transferred).toBe(false);
  });

  it('refuses when source is empty', () => {
    const src: (ItemStackSlot | null)[] = [null];
    const dest: (ItemStackSlot | null)[] = [null];
    const r = hopperStep(src, dest, maxStack);
    expect(r.transferred).toBe(false);
  });

  it('empties source slot when last item moves', () => {
    const src: (ItemStackSlot | null)[] = [{ itemId: 5, count: 1, damage: 0 }];
    const dest: (ItemStackSlot | null)[] = [null];
    const r = hopperStep(src, dest, maxStack);
    expect(r.source[0]).toBeNull();
  });
});
