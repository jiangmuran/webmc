import { describe, it, expect } from 'vitest';
import {
  addSnowflake,
  makeSnowLayer,
  maxSnowAccumulation,
  snowBreakDrops,
  tickMelt,
} from './snow_layer_stack';

describe('snow layer', () => {
  it('starts at 1', () => {
    expect(makeSnowLayer().height).toBe(1);
  });

  it('stacks up to 8', () => {
    const s = makeSnowLayer();
    for (let i = 0; i < 10; i++) addSnowflake(s);
    expect(s.height).toBe(8);
  });

  it('shovel drops n snowballs', () => {
    const s = makeSnowLayer(5);
    expect(snowBreakDrops(s, 'shovel')[0]?.count).toBe(5);
  });

  it('hand drops nothing', () => {
    expect(snowBreakDrops(makeSnowLayer(3), 'hand').length).toBe(0);
  });

  it('melts under high light', () => {
    const s = makeSnowLayer(3);
    tickMelt(s, { blockLightLevel: 15, skyLightLevel: 0, randomRoll: 0.01 });
    expect(s.height).toBe(2);
  });

  it('dark = no melt', () => {
    const s = makeSnowLayer(3);
    tickMelt(s, { blockLightLevel: 0, skyLightLevel: 0, randomRoll: 0.01 });
    expect(s.height).toBe(3);
  });

  it('high roll = no melt', () => {
    const s = makeSnowLayer(3);
    tickMelt(s, { blockLightLevel: 15, skyLightLevel: 0, randomRoll: 0.5 });
    expect(s.height).toBe(3);
  });

  it('fully melts last layer', () => {
    const s = makeSnowLayer(1);
    const done = tickMelt(s, { blockLightLevel: 15, skyLightLevel: 0, randomRoll: 0.01 });
    expect(done).toBe(true);
  });

  it('accumulation gamerule clamps', () => {
    expect(maxSnowAccumulation(0)).toBe(1);
    expect(maxSnowAccumulation(15)).toBe(8);
    expect(maxSnowAccumulation(4)).toBe(4);
  });
});
