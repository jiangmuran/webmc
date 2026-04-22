import { describe, it, expect } from 'vitest';
import { fleesWarpedFungus, makePorcine, tickPorcineConversion } from './hoglin_zoglin';

describe('hoglin / zoglin', () => {
  it('hoglin converts in overworld after 300s', () => {
    const h = makePorcine('hoglin');
    let converted = false;
    for (let i = 0; i < 3100; i++) {
      if (tickPorcineConversion(h, { inNether: false, dtSec: 0.1 }).converted) {
        converted = true;
        break;
      }
    }
    expect(converted).toBe(true);
    expect(h.variant).toBe('zoglin');
  });

  it('nether pauses conversion', () => {
    const h = makePorcine('hoglin');
    for (let i = 0; i < 3100; i++) {
      tickPorcineConversion(h, { inNether: true, dtSec: 0.1 });
    }
    expect(h.variant).toBe('hoglin');
  });

  it('shaking during the last 15s', () => {
    const h = makePorcine('hoglin');
    h.conversionTimerSec = 290;
    const r = tickPorcineConversion(h, { inNether: false, dtSec: 0.1 });
    expect(r.shaking).toBe(true);
  });

  it("zoglins don't re-convert", () => {
    const z = makePorcine('zoglin');
    expect(tickPorcineConversion(z, { inNether: false, dtSec: 999 }).converted).toBe(false);
  });

  it('zoglins ignore warped fungus', () => {
    expect(fleesWarpedFungus(makePorcine('zoglin'))).toBe(false);
  });
});
