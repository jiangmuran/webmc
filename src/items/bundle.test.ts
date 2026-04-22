import { describe, it, expect } from 'vitest';
import {
  bundleFullness,
  bundleWeight,
  insertIntoBundle,
  makeBundle,
  popFromBundle,
} from './bundle';

const stoneStack = (): number => 64;

describe('bundle', () => {
  it('starts empty and 0% full', () => {
    const b = makeBundle();
    expect(bundleFullness(b, stoneStack)).toBe(0);
  });

  it('holds up to 64 stones (weight = 64)', () => {
    const b = makeBundle();
    const left = insertIntoBundle(b, { itemId: 1, count: 64, damage: 0 }, stoneStack);
    expect(left).toBeNull();
    expect(bundleFullness(b, stoneStack)).toBeCloseTo(1, 3);
  });

  it('overflows past 64 returns leftover', () => {
    const b = makeBundle();
    insertIntoBundle(b, { itemId: 1, count: 64, damage: 0 }, stoneStack);
    const left = insertIntoBundle(b, { itemId: 1, count: 10, damage: 0 }, stoneStack);
    expect(left?.count).toBe(10);
  });

  it('16-stack item weighs more per-count', () => {
    const enderpearlMax = (): number => 16;
    const b = makeBundle();
    insertIntoBundle(b, { itemId: 2, count: 16, damage: 0 }, enderpearlMax);
    expect(bundleWeight(b, enderpearlMax)).toBe(64);
  });

  it('pop removes most recent', () => {
    const b = makeBundle();
    insertIntoBundle(b, { itemId: 1, count: 16, damage: 0 }, stoneStack);
    insertIntoBundle(b, { itemId: 2, count: 8, damage: 0 }, stoneStack);
    const out = popFromBundle(b);
    expect(out?.itemId).toBe(2);
    expect(b.contents.length).toBe(1);
  });

  it('merge into existing matching stack', () => {
    const b = makeBundle();
    insertIntoBundle(b, { itemId: 1, count: 10, damage: 0 }, stoneStack);
    insertIntoBundle(b, { itemId: 1, count: 5, damage: 0 }, stoneStack);
    expect(b.contents.length).toBe(1);
    expect(b.contents[0]?.count).toBe(15);
  });
});
