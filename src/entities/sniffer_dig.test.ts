import { describe, it, expect } from 'vitest';
import { makeSniffer, tickSniffer, SNIFF_TICKS, DIG_TICKS } from './sniffer_dig';

describe('sniffer', () => {
  it('begins sniff on low roll', () => {
    const s = makeSniffer();
    const r = tickSniffer(s, { nowTick: 0, onValidSoil: true, rand: () => 0 });
    expect(r.startedSniff).toBe(true);
    expect(s.phase).toBe('sniffing');
  });

  it('needs valid soil', () => {
    const s = makeSniffer();
    tickSniffer(s, { nowTick: 0, onValidSoil: false, rand: () => 0 });
    expect(s.phase).toBe('idle');
  });

  it('full cycle yields seed', () => {
    const s = makeSniffer();
    tickSniffer(s, { nowTick: 0, onValidSoil: true, rand: () => 0 });
    tickSniffer(s, { nowTick: SNIFF_TICKS, onValidSoil: true, rand: () => 0 });
    expect(s.phase).toBe('digging');
    const r = tickSniffer(s, {
      nowTick: SNIFF_TICKS + DIG_TICKS,
      onValidSoil: true,
      rand: () => 0.7,
    });
    expect(r.dugSeed).toBe('webmc:pitcher_pod');
    expect(s.phase).toBe('idle');
  });

  it('high roll = torchflower', () => {
    const s = makeSniffer();
    tickSniffer(s, { nowTick: 0, onValidSoil: true, rand: () => 0 });
    tickSniffer(s, { nowTick: SNIFF_TICKS, onValidSoil: true, rand: () => 0 });
    const r = tickSniffer(s, {
      nowTick: SNIFF_TICKS + DIG_TICKS,
      onValidSoil: true,
      rand: () => 0.1,
    });
    expect(r.dugSeed).toBe('webmc:torchflower_seeds');
  });
});
