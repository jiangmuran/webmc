import { describe, it, expect } from 'vitest';
import { LAMP_EMISSION_LIT, LAMP_EMISSION_UNLIT, makeLamp, tickLamp } from './redstone_lamp';

describe('redstone lamp', () => {
  it('starts unlit', () => {
    expect(makeLamp().lit).toBe(false);
  });

  it('lights instantly on power', () => {
    const l = makeLamp();
    const r = tickLamp(l, { powered: true });
    expect(l.lit).toBe(true);
    expect(r.emission).toBe(LAMP_EMISSION_LIT);
  });

  it('delays unlit by 2 ticks', () => {
    const l = makeLamp();
    tickLamp(l, { powered: true });
    tickLamp(l, { powered: false }); // start countdown
    expect(l.lit).toBe(true);
    tickLamp(l, { powered: false });
    tickLamp(l, { powered: false });
    expect(l.lit).toBe(false);
  });

  it('power restores before countdown ends', () => {
    const l = makeLamp();
    tickLamp(l, { powered: true });
    tickLamp(l, { powered: false });
    tickLamp(l, { powered: true });
    expect(l.lit).toBe(true);
    expect(l.unlitCountdownTicks).toBe(0);
  });

  it('unlit emission = 0', () => {
    expect(LAMP_EMISSION_UNLIT).toBe(0);
  });
});
