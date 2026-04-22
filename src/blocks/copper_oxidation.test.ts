import { describe, it, expect } from 'vitest';
import {
  asBlockId,
  lightningStrike,
  makeCopper,
  scrape,
  tickOxidation,
  wax,
} from './copper_oxidation';

describe('copper oxidation', () => {
  it('starts regular, unwaxed', () => {
    const c = makeCopper();
    expect(c.stage).toBe('regular');
    expect(c.waxed).toBe(false);
  });

  it('advances stage on low roll', () => {
    const c = makeCopper();
    expect(tickOxidation(c, 0.001)).toBe(true);
    expect(c.stage).toBe('exposed');
  });

  it('does not advance on high roll', () => {
    const c = makeCopper();
    expect(tickOxidation(c, 0.5)).toBe(false);
    expect(c.stage).toBe('regular');
  });

  it('waxed copper never advances', () => {
    const c = makeCopper();
    wax(c);
    expect(tickOxidation(c, 0.001)).toBe(false);
  });

  it('oxidized copper is terminal', () => {
    const c = makeCopper();
    c.stage = 'oxidized';
    expect(tickOxidation(c, 0.001)).toBe(false);
  });

  it('scrape reverses one stage', () => {
    const c = makeCopper();
    c.stage = 'weathered';
    expect(scrape(c)).toBe(true);
    expect(c.stage).toBe('exposed');
  });

  it('scrape on regular unwaxed is a no-op', () => {
    const c = makeCopper();
    expect(scrape(c)).toBe(false);
  });

  it('scrape unwaxes before reverting stage', () => {
    const c = makeCopper();
    wax(c);
    scrape(c);
    expect(c.waxed).toBe(false);
    expect(c.stage).toBe('regular');
  });

  it('lightning advances stage and strips wax', () => {
    const c = makeCopper();
    wax(c);
    lightningStrike(c);
    expect(c.waxed).toBe(false);
    expect(c.stage).toBe('exposed');
  });

  it('blockId composes prefix + stage', () => {
    expect(asBlockId('copper_block', { stage: 'regular', waxed: false })).toBe(
      'webmc:copper_block',
    );
    expect(asBlockId('copper_block', { stage: 'oxidized', waxed: true })).toBe(
      'webmc:waxed_oxidized_copper_block',
    );
  });
});
