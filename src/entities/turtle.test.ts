import { describe, it, expect } from 'vitest';
import {
  impregnate,
  layEggs,
  makeEgg,
  makeTurtle,
  tickEgg,
  tickGrowth,
  TURTLE_MAX_HEALTH,
} from './turtle';

describe('turtle', () => {
  it('starts adult with full HP', () => {
    const t = makeTurtle(1, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(t.health).toBe(TURTLE_MAX_HEALTH);
    expect(t.adult).toBe(true);
  });

  it('baby grows into adult, dropping scute', () => {
    const t = makeTurtle(1, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, false);
    const r = tickGrowth(t, 24000);
    expect(r.justBecameAdult).toBe(true);
    expect(r.scuteDropped).toBe(true);
    expect(t.adult).toBe(true);
  });

  it('pregnant turtle lays eggs at home', () => {
    const t = makeTurtle(1, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    impregnate(t);
    const r = layEggs(t);
    expect(r).not.toBeNull();
    expect(t.pregnant).toBe(false);
  });

  it('non-pregnant turtle cannot lay', () => {
    const t = makeTurtle(1, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(layEggs(t)).toBeNull();
  });

  it('turtle too far from home cannot lay', () => {
    const t = makeTurtle(1, { x: 100, y: 0, z: 100 }, { x: 0, y: 0, z: 0 });
    impregnate(t);
    expect(layEggs(t)).toBeNull();
  });

  it('baby cannot be impregnated', () => {
    const t = makeTurtle(1, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, false);
    expect(impregnate(t)).toBe(false);
  });
});

describe('turtle eggs', () => {
  it('does not age during day', () => {
    const e = makeEgg({ x: 0, y: 0, z: 0 });
    tickEgg(e, false, 1000);
    expect(e.age).toBe(0);
  });

  it('cracks stage by stage at night', () => {
    const e = makeEgg({ x: 0, y: 0, z: 0 });
    tickEgg(e, true, 8000);
    expect(e.crackedStage).toBe(1);
    tickEgg(e, true, 8000);
    expect(e.crackedStage).toBe(2);
  });

  it('hatches at 24000 ticks', () => {
    const e = makeEgg({ x: 0, y: 0, z: 0 });
    const r = tickEgg(e, true, 24000);
    expect(r).toBe('hatched');
  });
});
